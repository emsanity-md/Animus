"use client";

import { cn } from "cn";
import { PosterImage } from "@/components/poster-image";
import { Skeleton } from "@/components/ui/skeleton";
import type { MediaCard } from "@/lib/anilist/types";
import { formatLabel, progressLabel, scoreLabel, yearLabel } from "@/lib/format";

/**
 * One catalogue title, as it appears in a grid.
 *
 * The card is built from what AniList can substantiate and nothing else:
 * title, format, episode position, year and score. There is no quality badge,
 * because Media has no resolution field, and no sub/dub flag, because track
 * availability belongs to a site's own catalogue rather than to a title.
 *
 * Every value that can be absent is omitted rather than filled in, so the
 * cards in a row can legitimately differ in height of information while
 * holding the same shape — the title block reserves two lines so a one-word
 * title does not make its neighbours jump.
 */

const CARD_SIZES = "(min-width: 1280px) 170px, (min-width: 768px) 22vw, 45vw";

export function MediaCardView({
  card,
  priority = false,
  sizes = CARD_SIZES,
  className,
}: {
  card: MediaCard;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const meta = [formatLabel(card.format), yearLabel(card)].filter(Boolean).join(" · ");
  const position = progressLabel(card);
  const score = scoreLabel(card);

  return (
    <article className={cn("group/card relative flex flex-col gap-2", className)}>
      {card.cover ? (
        <PosterImage
          src={card.cover}
          alt=""
          sizes={sizes}
          priority={priority}
          imageClassName="transition-transform duration-500 ease-out group-hover/card:scale-[1.04]"
        />
      ) : (
        /* AniList has no cover for a handful of titles. An empty frame is the
           honest rendering — the alternative, a grey box with the title in it,
           pretends to be artwork. The ring keeps the grid's rhythm, and the
           ratio matches COVER_RATIO so the row stays even. */
        <div className="relative aspect-[0.707] w-full overflow-hidden rounded-md bg-sand ring-1 ring-hairline">
          <span className="absolute inset-0 grid place-items-center px-3 text-center font-mono text-[0.6875rem] text-ink-faint">
            no cover art
          </span>
        </div>
      )}

      {/* The score sits on the artwork rather than under it, so the text block
          stays a fixed two lines whatever the title length. */}
      {score ? (
        <span className="absolute top-2 right-2 rounded-sm bg-background/85 px-1.5 py-0.5 font-mono text-[0.6875rem] text-ink backdrop-blur-sm">
          {score}
        </span>
      ) : null}

      <div className="flex flex-col gap-1">
        {/*
          Clamped to three lines with the block sized to hold exactly three.
          AniList titles run long — "Magic Re n: Dumped by My Par t, I'll Cash
          In…" is a real entry — and unclamped they pushed their card's meta
          line down, so the meta row in a grid stopped lining up across the row.
          The min-height is what keeps the alignment once the clamp is in place.
        */}
        <h3 className="line-clamp-3 min-h-[3.6rem] text-sm leading-snug font-semibold">
          {card.title}
        </h3>
        <p className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-ink-faint">
          {position ? <span className="text-brand">{position}</span> : null}
          {position && meta ? <span aria-hidden="true">·</span> : null}
          <span className="truncate">{meta}</span>
        </p>
      </div>
    </article>
  );
}

/** Same dimensions, no content — so the swap cannot move anything. */
export function MediaCardSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      <Skeleton className="aspect-[0.707] w-full rounded-md" />
      {/* Three lines and a meta bar, matching the clamped title above. */}
      <Skeleton className="min-h-[3.6rem] w-full" />
      <Skeleton className="h-3 w-7/12" />
    </div>
  );
}
