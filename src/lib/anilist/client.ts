/**
 * AniList GraphQL client — runtime, in the browser.
 *
 * This runs when the page is opened, never during `npm run build`. That is the
 * whole reason it is not a server-side fetch: the build has to stay hermetic.
 * The fonts taught us what a build-time third-party call costs — a blocked or
 * throttled request surfaces as a module-resolution error pointing at
 * unrelated source — and the poster art set the precedent by hardcoding CDN
 * URLs instead of resolving them at build time. This follows that precedent
 * rather than reintroducing the dependency one layer up.
 *
 * The trade is explicit: /home needs the network to show a catalogue, and
 * every caller therefore has to handle a real loading state and a real
 * failure state. See `use-anilist.ts`.
 */

import type { AniListFormat, AniListStatus, MediaCard, MediaPage, FetchFailure } from "./types";

export const ANILIST_ENDPOINT = "https://graphql.anilist.co";

const REQUEST_TIMEOUT_MS = 12_000;

/**
 * `extraLarge`, not `large` — AniList's cover fields are shifted by one
 * against the path they point at. Measured on Cowboy Bebop:
 *
 *   coverImage { extraLarge } -> /cover/large/  -> 460x640
 *   coverImage { large }      -> /cover/medium/ -> 230x320
 *   coverImage { medium }     -> /cover/small/  -> 100x139
 *
 * Asking for `large` gets the medium file, which is half the resolution and
 * the reason the spotlight poster looked soft. 460x640 is the ceiling —
 * AniList's CDN ignores `?width=` and returns the same bytes at every
 * parameter (verified). src/lib/poster-art.ts hardcodes the /cover/large/ URLs
 * directly, which is why it never met this.
 */
const CARD_FRAGMENT = /* GraphQL */ `
  fragment Card on Media {
    id
    title { romaji english }
    coverImage { extraLarge }
    bannerImage
    format
    status
    episodes
    averageScore
    genres
    seasonYear
    nextAiringEpisode { episode airingAt }
    description(asHtml: false)
  }
`;

export const CARD_SELECTION = CARD_FRAGMENT;

/* -- mapping ---------------------------------------------------------------- */

/**
 * AniList returns nulls where a site has no natural equivalent, and "" where
 * it has an empty one. Both collapse to null here so the UI has exactly one
 * "absent" case to handle.
 */
function text(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * `description(asHtml: false)` still comes back with the handful of tags
 * AniList stores inline, and with HTML entities. Rendering that with
 * dangerouslySetInnerHTML would be an injection vector for no benefit — the
 * copy is a one-line synopsis, so it is flattened to text here and nowhere
 * else has to think about it.
 */
function plainText(value: string | null | undefined, max = 260): string | null {
  const raw = text(value);
  if (!raw) return null;
  const stripped = raw
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  if (stripped.length <= max) return stripped;
  const cut = stripped.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max).trimEnd()}…`;
}

function mapCard(node: Record<string, unknown>): MediaCard {
  const title = (node.title ?? {}) as Record<string, string>;
  const cover = node.coverImage as Record<string, string> | null;  const next = node.nextAiringEpisode as Record<string, number> | null;
  const romaji = text(title.romaji) ?? "";
  return {
    id: Number(node.id),
    title: text(title.english) ?? romaji,
    romaji,
    format: (node.format as AniListFormat) ?? "UNKNOWN",
    status: (node.status as AniListStatus) ?? "UNKNOWN",
    episodes: typeof node.episodes === "number" ? node.episodes : null,
    score: typeof node.averageScore === "number" ? node.averageScore : null,
    cover: text(cover?.extraLarge) ?? null,
    banner: text(node.bannerImage as string | null),
    genres: Array.isArray(node.genres) ? (node.genres as string[]) : [],
    seasonYear: typeof node.seasonYear === "number" ? node.seasonYear : null,
    nextEpisode:
      next && typeof next.episode === "number" && typeof next.airingAt === "number"
        ? { episode: next.episode, airsAt: next.airingAt * 1000 }
        : null,
    summary: plainText(node.description as string | null),
  };
}

/**
 * Thrown when a response parses as JSON but does not have the shape the query
 * asked for. Kept distinct from a transport failure because the handling is
 * different: a network error is worth retrying, whereas a shape mismatch means
 * the mapper and the query have drifted apart and retrying will not help.
 *
 * Without this, an upstream rename would render as a calm, entirely empty
 * catalogue — indistinguishable from "nothing is airing this week", and far
 * more misleading than an honest error.
 */
export class ShapeError extends Error {}

export function mapPage(data: unknown): MediaPage {
  /* `data` here is the *contents* of the GraphQL "data" envelope, so a paged
     query arrives one level deeper than it looks: { Page: { media, … } }.
     Reading data.media directly yields undefined, which a lenient mapper turns
     into an empty row and a reader into "the catalogue is broken". */
  const root = (data ?? {}) as Record<string, unknown>;
  const page = root.Page;
  if (!page || typeof page !== "object") {
    throw new ShapeError(`expected a Page object, got ${JSON.stringify(root).slice(0, 120)}`);
  }
  const { media, pageInfo } = page as Record<string, unknown>;
  if (!Array.isArray(media)) {
    throw new ShapeError(`expected Page.media to be an array, got ${typeof media}`);
  }
  const info = (pageInfo ?? {}) as Record<string, unknown>;
  return {
    items: (media as Record<string, unknown>[]).map(mapCard),
    hasNextPage: info.hasNextPage === true,
  };
}

export function mapSingle(data: unknown): MediaCard | null {
  /* A Media query resolving to null means AniList has no such id, which is a
     legitimate empty answer rather than a broken shape. Kept because it is the
     mapper for single-title queries, which the spotlight set may become if it
     ever needs one title fetched on its own. */
  const root = (data ?? {}) as Record<string, unknown>;
  const media = root.Media;
  if (!media || typeof media !== "object") return null;
  return mapCard(media as Record<string, unknown>);
}

/* -- transport -------------------------------------------------------------- */

type Result<T> = { ok: true; value: T } | { ok: false; failure: FetchFailure };

/**
 * Response cache, keyed on the serialised query.
 *
 * Not an optimisation for its own sake: several sections ask for overlapping
 * pages (trending and most-popular return some of the same titles), and
 * without this a page load fires the same query two or three times and
 * AniList's rate limit — 90 requests per minute, which a refresh loop can
 * reach — starts returning errors that look like the network is down.
 *
 * Short TTL on purpose. This is a catalogue that changes on a schedule of
 * days, so a stale entry for a minute is worth far less than the request it
 * saves.
 */
const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { at: number; value: unknown }>();

function cacheKey(query: string, variables: Record<string, unknown>): string {
  return `${query}::${JSON.stringify(variables)}`;
}

export async function anilistFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<Result<T>> {
  const key = cacheKey(query, variables);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return { ok: true, value: hit.value as T };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(ANILIST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return { ok: false, failure: { kind: "http", status: response.status } };
    }

    const payload = (await response.json()) as {
      data?: unknown;
      errors?: { message: string }[];
    };

    // GraphQL reports failures in the body with a 200, so a missing `errors`
    // check here would silently render an empty grid and look like a bug.
    if (payload.errors?.length) {
      return {
        ok: false,
        failure: { kind: "malformed", detail: payload.errors[0].message ?? "GraphQL error" },
      };
    }
    if (payload.data === undefined || payload.data === null) {
      return { ok: false, failure: { kind: "malformed", detail: "empty response body" } };
    }

    cache.set(key, { at: Date.now(), value: payload.data });
    return { ok: true, value: payload.data as T };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { ok: false, failure: { kind: "network", detail: "timed out" } };
    }
    return {
      ok: false,
      failure: { kind: "network", detail: error instanceof Error ? error.message : "unknown" },
    };
  } finally {
    clearTimeout(timer);
  }
}
