import type { AniListFormat, MediaCard } from "@/lib/anilist/types";

/**
 * Presentation helpers for catalogue metadata.
 *
 * All of these take an absent value seriously. AniList returns null for
 * episode counts on films, for scores nobody has given, and for covers it does
 * not have — so every formatter here returns null rather than a placeholder
 * string, and the components decide what to omit. Rendering "Unknown" in a
 * grid is worse than rendering nothing.
 */

const FORMAT_LABELS: Record<AniListFormat, string> = {
  TV: "TV",
  MOVIE: "Film",
  OVA: "OVA",
  ONA: "ONA",
  SPECIAL: "Special",
  UNKNOWN: "Format TBC",
};

export function formatLabel(format: AniListFormat): string {
  return FORMAT_LABELS[format] ?? "Format TBC";
}

export function episodeLabel(card: MediaCard): string | null {
  if (card.episodes === null) return null;
  return card.episodes === 1 ? "1 ep" : `${card.episodes} eps`;
}

/**
 * A short badge for episode position. A series part-way through is more
 * useful labelled with where it is than with its full run length, so the
 * "next episode" state is preferred when AniList has it.
 */
export function progressLabel(card: MediaCard): string | null {
  if (card.nextEpisode) return `Ep ${card.nextEpisode.episode}`;
  return episodeLabel(card);
}

/** 0-100 from AniList, rendered as a score out of ten. */
export function scoreLabel(card: MediaCard): string | null {
  if (card.score === null) return null;
  return (card.score / 10).toFixed(1);
}

export function yearLabel(card: MediaCard): string | null {
  return card.seasonYear === null ? null : String(card.seasonYear);
}

/**
 * "in 3 h" / "in 2 d" against a real timestamp.
 *
 * Deliberately coarse. A release countdown has a second-by-second mode that
 * makes the whole page twitch, and a timetable wants "tomorrow 23:30", not a
 * millisecond countdown — the exact time is rendered separately and does not
 * need to move.
 */
export function untilLabel(airsAt: number, now: number = Date.now()): string {
  const delta = airsAt - now;
  if (delta <= 0) return "airing now";
  const minutes = Math.round(delta / 60_000);
  if (minutes < 60) return `in ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `in ${hours} h`;
  const days = Math.round(hours / 24);
  return days === 1 ? "tomorrow" : `in ${days} d`;
}

export function clockLabel(airsAt: number, timezone?: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  }).format(new Date(airsAt));
}

/** The visitor's own zone, named rather than numeric — "Europe/London". */
export function localTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}
