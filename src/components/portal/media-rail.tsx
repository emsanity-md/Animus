"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "cn";
import { MediaCardView } from "./media-card";
import { GridFailure, RailSkeleton } from "./media-grid";
import type { CatalogueState } from "@/lib/anilist/use-anilist";
import type { MediaCard } from "@/lib/anilist/types";

/**
 * A horizontal run of titles with arrows.
 *
 * Built on native overflow scrolling rather than a transform track, for three
 * reasons that all came up on the landing page's marquee: a native scroller
 * keeps momentum scrolling on touch, keeps the browser's own scrollbar and
 * find-in-page working, and cannot desynchronise from its content the way a
 * duplicated `-50%` track can.
 *
 * The arrows are the only affordance, so the container is deliberately not a
 * tab stop — a keyboard user reaches the run through the buttons rather than
 * through an extra empty stop before the first card.
 */

const CARD_WIDTH = 132;

export function MediaRail({
  state,
  count = 12,
  numbered = false,
}: {
  state: CatalogueState<{ items: MediaCard[] }>;
  count?: number;
  /** Leading 01-06 index, as the reference layout does for trending. */
  numbered?: boolean;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // 1px of slack: fractional layout widths mean scrollLeft rarely lands on
    // an exact 0 or max, and without it the trailing arrow stays disabled on
    // a track that has in fact reached the end.
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync, state.status]);

  const nudge = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: direction * Math.max(CARD_WIDTH * 2, el.clientWidth * 0.8),
      // Explicit smooth ignores the stylesheet's reduced-motion override, so
      // the preference has to be honoured here or it would animate anyway.
      behavior: reduced ? "auto" : "smooth",
    });
  };

  if (state.status === "loading") return <RailSkeleton count={6} />;
  if (state.status === "error")
    return <GridFailure failure={state.failure} onRetry={state.retry} />;

  const items = state.data.items.slice(0, count);
  if (items.length === 0) {
    return <p className="py-6 text-sm text-ink-muted">Nothing in this row right now.</p>;
  }

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((card, index) => (
          <li key={card.id} className="w-[132px] shrink-0 snap-start">
            {numbered ? (
              <span className="mb-1.5 block font-mono text-[0.6875rem] text-ink-faint tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
            ) : null}
            <MediaCardView card={card} sizes={`${CARD_WIDTH}px`} />
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-end gap-2">
        <RailArrow direction="left" disabled={atStart} onClick={() => nudge(-1)} />
        <RailArrow direction="right" disabled={atEnd} onClick={() => nudge(1)} />
      </div>
    </div>
  );
}

function RailArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const glyph = direction === "left" ? "←" : "→";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Scroll back" : "Scroll forward"}
      className={cn(
        "grid size-9 place-items-center rounded-md border border-hairline text-sm text-ink transition-colors",
        "hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        "disabled:pointer-events-none disabled:opacity-35",
      )}
    >
      <span aria-hidden="true">{glyph}</span>
    </button>
  );
}
