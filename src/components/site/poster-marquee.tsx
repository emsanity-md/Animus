"use client";

/**
 * PosterMarquee — two endless rows of catalogue entries drifting in
 * opposite directions, replacing the static shelf grid.
 *
 * How the loop stays seamless: the track renders the item list exactly
 * twice and animates to translate3d(-50%). Since both copies are identical
 * and the track is `w-max`, 50% of its width is exactly one copy — so when
 * the animation wraps, copy two is already sitting exactly where copy one
 * started. No seam, no jump.
 *
 * Why the second copy is aria-hidden: it is a visual duplicate. Without
 * this, assistive tech reads all sixteen titles instead of eight.
 *
 * Why there is a pause button: WCAG 2.2.2 requires moving content to be
 * pausable by the user. Hover alone is not enough — it is unusable on touch
 * and undiscoverable for keyboard users.
 *
 * Reduced motion: no animation, and the duplicate copy is not rendered at
 * all, so the row becomes an ordinary horizontally scrollable strip with
 * nothing hidden behind a seam.
 */

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";
import { posterFor } from "@/lib/poster-art";

export interface MarqueeItem {
  title: string;
  year: number;
  format: string;
  episodes: number;
  tracks: readonly string[];
  resolution: string;
}

const CARD_WIDTH = 176;

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/**
 * Resolves false on the server and on the first client render, then true.
 *
 * useSyncExternalStore alone is not enough here. A visitor with reduced
 * motion enabled gets `true` from getSnapshot() on the very first client
 * render while the server emitted `false` — and because that flag decides
 * whether the duplicate copy, the animation class and the pause control
 * exist at all, the two trees differ and React throws hydration mismatch
 * #418. Gating on this flag keeps the first paint identical to the server
 * output and settles on the following render.
 */
function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * Renders the card body only. The caller owns the wrapping <li>, so the
 * duplicate copy used for the loop can be a sibling rather than a nested
 * list item.
 */
function PosterCard({ item }: { item: MarqueeItem }) {
  const poster = posterFor(item.title);
  return (
    <article className="group/card flex flex-col gap-2.5">
      <div className="relative aspect-2/3 overflow-hidden rounded-md bg-sand ring-1 ring-hairline">
        {poster ? (
          <Image
            src={poster}
            alt={`${item.title} cover artwork`}
            fill
            sizes={`${CARD_WIDTH}px`}
            quality={90}
            className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.04]"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="font-display min-h-[2.7em] text-[0.9375rem] leading-snug font-normal">
          {item.title}
        </h3>

        <p className="text-xs text-ink-muted">
          {item.year} · {item.format}
          {item.episodes > 1 ? ` · ${item.episodes} eps` : ""}
        </p>

        <ul className="flex gap-1">
          {item.tracks.map((track) => (
            <li key={track}>
              <Badge
                variant="outline"
                className="h-4 rounded-sm border-hairline px-1 text-[0.5625rem] tracking-wide text-ink-muted"
              >
                {track}
              </Badge>
            </li>
          ))}
          {item.resolution === "4K" ? (
            <li>
              <Badge className="h-4 rounded-sm bg-primary px-1 text-[0.5625rem] tracking-wide text-primary-foreground">
                4K
              </Badge>
            </li>
          ) : null}
        </ul>
      </div>
    </article>
  );
}

function MarqueeRow({
  items,
  duration,
  reverse,
  reduced,
  decorative,
}: {
  items: MarqueeItem[];
  duration: number;
  reverse?: boolean;
  reduced: boolean;
  /**
   * Marks the whole row as a visual repetition of another row. Both rows
   * show the same eight series, so leaving the second one exposed means a
   * screen reader announces every title twice. Only the first row carries
   * the content.
   */
  decorative?: boolean;
}) {
  // Rotate the second row so it never shows the same title directly above
  // or below its counterpart in the first.
  const rotated = reverse ? [...items.slice(4), ...items.slice(0, 4)] : items;

  return (
    <div
      className="marquee-row overflow-hidden"
      aria-hidden={decorative || undefined}
    >
      <ul
        className={cn(
          "flex w-max",
          !reduced && "marquee-track",
          reduced && "overflow-x-auto pb-2",
        )}
        style={
          reduced
            ? undefined
            : ({
                "--marquee-duration": `${duration}s`,
                animationDirection: reverse ? "reverse" : "normal",
              } as React.CSSProperties)
        }
      >
        {rotated.map((item) => (
          <li key={item.title} className="w-[176px] shrink-0 px-2">
            <PosterCard item={item} />
          </li>
        ))}
        {reduced
          ? null
          : rotated.map((item) => (
              <li
                key={`dup-${item.title}`}
                aria-hidden="true"
                className="w-[176px] shrink-0 px-2"
              >
                <PosterCard item={item} />
              </li>
            ))}
      </ul>
    </div>
  );
}

export function PosterMarquee({ items }: { items: readonly MarqueeItem[] }) {
  const mounted = useIsMounted();
  const prefersReduced = usePrefersReducedMotion();
  const reduced = mounted && prefersReduced;
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const list = items as MarqueeItem[];

  return (
    <div ref={ref} data-marquee={paused ? "paused" : undefined} className="mt-14">
      {/* Edge fade so the rows dissolve into the page rather than being cut
          off by it. One gradient, same functional reason as the hero's. */}
      <div
        className="flex flex-col gap-5"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 4rem, #000 calc(100% - 4rem), transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 4rem, #000 calc(100% - 4rem), transparent)",
        }}
      >
        <MarqueeRow items={list} duration={62} reduced={reduced} />
        <MarqueeRow
          items={list}
          duration={78}
          reverse
          reduced={reduced}
          decorative
        />
      </div>

      {reduced || !onScreen ? null : (
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-hairline pt-5">
          <p className="text-sm text-ink-muted">Hover a row to hold it still.</p>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-hairline px-3 text-sm font-semibold text-ink transition-colors hover:bg-sand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {paused ? "Resume" : "Pause"}
            <span className="sr-only"> the poster carousel</span>
          </button>
        </div>
      )}
    </div>
  );
}