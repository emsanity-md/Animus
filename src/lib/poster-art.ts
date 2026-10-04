/**
 * Real cover art, sourced from AniList's public media CDN.
 *
 * Why hotlinked rather than committed: this repository is public, and
 * copying eight pieces of copyrighted key art into it is the one option
 * that creates a durable licensing problem. Hotlinking leaves the artwork
 * with its owner.
 *
 * Why the URLs are literals rather than fetched at build time: the build
 * stays hermetic. `npm run build` never calls a third-party API, so it
 * cannot be broken by a rate limit or an outage. The AniList media IDs
 * below are stable; resolve them again only if a cover 404s.
 *
 * Why `large` and not `medium`: measured on the actual files, AniList's
 * `medium` variant is only 100x139 — the `coverImage.medium` field points
 * at the `small` path. The hero wall tile is 132x198 CSS px, which needs
 * 264x396 device px at 2x DPR, so `medium` was being upscaled nearly 3x
 * and read as visibly soft. `large` is 460x640 and is the ceiling: their
 * CDN ignores `?width=`, returning the same 460x640 at every parameter.
 *
 * `large` costs ~478KB per file at the origin, but that is not what the
 * browser downloads: next/image resizes, re-encodes to WebP, and caches on
 * disk, so the shipped payload stays small and the origin cost is paid once.
 * Optimising the source down for bytes and letting the browser upscale was
 * the wrong trade — next/image was already handling the weight.
 */

export const POSTER_HOST = "s4.anilist.co";

export const POSTER_ART: Record<string, string> = {
  "Cowboy Bebop":
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1-GCsPm7waJ4kS.png",
  "Fullmetal Alchemist: Brotherhood":
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-nSWCgQlmOMtj.jpg",
  "Neon Genesis Evangelion":
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx30-AI1zr74Dh4ye.jpg",
  "Spirited Away":
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx199-sWefXJvXkDOb.jpg",
  "Death Note":
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535-kUgkcrfOrkUM.jpg",
  "Mob Psycho 100":
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21507-6YUSbh2m0N1p.jpg",
  "Jujutsu Kaisen":
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-LHBAeoZDIsnF.jpg",
  "Steins;Gate":
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx9253-tIUXF2gfU8Sg.jpg",
};

/**
 * AniList's largest cover is 460x640. Anything rendered wider than that is
 * upscaled no matter what, so this is a hard ceiling worth stating rather
 * than rediscovering: the library shelf runs ~270px per card, which needs
 * 540px at 2x DPR, so the widest cards are very slightly soft by about 1.2x.
 */
export const POSTER_MAX_WIDTH = 460;

export function posterFor(title: string): string | undefined {
  return POSTER_ART[title];
}