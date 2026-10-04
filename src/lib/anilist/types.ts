/**
 * The slice of AniList's Media type this site actually uses.
 *
 * Deliberately not a mirror of the upstream schema. AniList exposes far more
 * than the catalogue shows, and adopting its shape wholesale would mean every
 * component depends on fields nothing renders. This is the contract between
 * the API and the UI, and it is allowed to be smaller than either.
 */

export type AniListFormat = "TV" | "MOVIE" | "OVA" | "ONA" | "SPECIAL" | "UNKNOWN";

export type AniListStatus =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELLED"
  | "HIATUS"
  | "UNKNOWN";

export interface MediaCard {
  id: number;
  /** English title where one exists, romaji otherwise. Never empty. */
  title: string;
  romaji: string;
  format: AniListFormat;
  status: AniListStatus;
  /** null for series with no announced episode count (often films). */
  episodes: number | null;
  /** 0-100, or null when nobody has scored it. */
  score: number | null;
  /** null when AniList has no cover — the UI must cope, not crash. */
  cover: string | null;
  /**
   * The wide key art, for anything that fills a banner-shaped box. Null for
   * titles AniList has no banner for — common on announced-but-unaired series.
   *
   * Note these are not one shape: measured banners came back 1900x400 (4.75:1)
   * for most titles and 1900x1188 (1.6:1) for others. Anything using this has
   * to tolerate both, which is why it is a backdrop under a scrim rather than
   * an element sized to fit.
   */
  banner: string | null;
  genres: string[];
  seasonYear: number | null;
  /** Present only while the series is actively releasing. */
  nextEpisode: { episode: number; airsAt: number } | null;
  /** Plain text, tags stripped, already truncated for a card. */
  summary: string | null;
}

export interface MediaPage {
  items: MediaCard[];
  hasNextPage: boolean;
}

/** Why a request failed, in terms the UI can act on. */
export type FetchFailure =
  | { kind: "network"; detail: string }
  | { kind: "http"; status: number }
  | { kind: "malformed"; detail: string };
