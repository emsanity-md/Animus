"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { MediaCardSkeleton, MediaCardView } from "./media-card";
import { describeFailure, type CatalogueState } from "@/lib/anilist/use-anilist";
import type { FetchFailure, MediaCard } from "@/lib/anilist/types";

/**
 * A grid of titles with its three non-content states.
 *
 * The failure state is inline and in place rather than behind a page-level
 * boundary, on purpose. /home fetches at runtime, so it can genuinely fail,
 * and one unreachable request should not take the page down or leave a hole
 * where a section used to be — the rest of the catalogue is still worth
 * reading. This is also why the retry lives here: the user clicks next to the
 * thing that failed, not somewhere else on the page.
 */

const GRID = "grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";

export function MediaGrid({
  state,
  count = 6,
  priorityCount = 0,
  className,
}: {
  state: CatalogueState<{ items: MediaCard[] }>;
  count?: number;
  priorityCount?: number;
  className?: string;
}) {
  if (state.status === "loading") {
    return (
      <div className={`${GRID} ${className ?? ""}`} aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <MediaCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (state.status === "error") {
    return <GridFailure className={className} failure={state.failure} onRetry={state.retry} />;
  }

  const items = state.data.items.slice(0, count);
  if (items.length === 0) {
    return (
      <p className={`py-6 text-sm text-ink-muted ${className ?? ""}`}>
        Nothing in this row right now.
      </p>
    );
  }

  return (
    <ul className={`${GRID} ${className ?? ""}`}>
      {items.map((card, index) => (
        <li key={card.id}>
          <MediaCardView card={card} priority={index < priorityCount} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Why the failure gets its own wording: a rate limit and a dead network need
 * different things from the reader. "Try again" is right for the first and
 * pointless for the second, and AniList's limit is low enough (90/min, shared
 * across everything in this browser) that a refresh loop reaches it.
 */
export function GridFailure({
  className,
  failure,
  onRetry,
}: {
  className?: string;
  failure?: FetchFailure;
  onRetry?: () => void;
}) {
  return (
    <div
      className={`flex flex-col items-start gap-3 rounded-md border border-hairline bg-card px-4 py-6 ${
        className ?? ""
      }`}
    >
      <p className="text-sm text-ink-muted">
        {failure
          ? describeFailure(failure)
          : "This row could not be loaded. The rest of the catalogue is unaffected."}
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-sm border border-hairline px-3 py-1.5 text-sm text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

/**
 * Reserved, not painted — for rails, whose cards are a fixed 132px wide.
 *
 * The arrow row is part of the reservation, not an afterthought. Leaving it
 * out made the real rail grow by the height of two buttons plus their margin
 * the moment the cards arrived, which is exactly the kind of shift a skeleton
 * exists to prevent.
 */
export function RailSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div aria-hidden="true">
      <div className="flex gap-4">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="w-[132px] shrink-0">
            <MediaCardSkeleton />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Skeleton className="size-9 rounded-md" />
        <Skeleton className="size-9 rounded-md" />
      </div>
    </div>
  );
}

export { MediaCardSkeleton };
