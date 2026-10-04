"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PosterImage } from "@/components/poster-image";
import { Skeleton } from "@/components/ui/skeleton";
import { formatLabel, progressLabel, scoreLabel, yearLabel } from "@/lib/format";
import type { CatalogueState } from "@/lib/anilist/use-anilist";
import { describeFailure } from "@/lib/anilist/use-anilist";
import type { MediaCard } from "@/lib/anilist/types";

/**
 * The rotating spotlight.
 *
 * A named set rather than the head of a sorted list, so the banner is an
 * editorial decision instead of a side effect of somebody's ranking.
 *
 * There is no pause control, by explicit instruction, and that is a known
 * WCAG 2.2.2 failure: the content replaces itself every 3.5 seconds and nothing
 * on the page can stop it. What is left as mitigation is the two conditions
 * below — rotation halts while the pointer is over the section or focus is
 * inside it, and never starts under reduced motion. That covers keyboard and
 * screen reader visitors, who arrive by focusing the section; it does not
 * cover a pointer user who wants the banner to hold still. Written down so the
 * trade is visible instead of being re-litigated each time this file is read.
 *
 * Because the rotation is not pausable, none of it is announced. `aria-live`
 * is "off" on the slide itself, and the position line is polite only while the
 * section is being interacted with — that is, when the content is stationary
 * and any change was the visitor's own doing. Announcing on the timer would
 * refill the speech queue every 3.5 seconds and make the page unusable.
 */

/** Requested cadence, in ms. */
const ROTATE_MS = 3500;

export function Spotlight({ state }: { state: CatalogueState<{ items: MediaCard[] }> }) {
  const [index, setIndex] = useState(0);
  const [interacting, setInteracting] = useState(false);
  /*
   * Bumped by a dot click purely to restart the rotation timer, so a chosen
   * slide gets a full interval to be read instead of being replaced up to 3.5
   * seconds later. With the pause control gone this is the only respect the
   * rotation pays a manual choice; without it, clicking a dot is close to
   * useless for anyone not already hovering the section.
   */
  const [manual, setManual] = useState(0);
  const reduced = useRef(false);

  const items = state.status === "ready" ? state.data.items : [];
  const count = items.length;

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const go = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
      setManual((n) => n + 1);
    },
    [count],
  );

  useEffect(() => {
    if (count < 2 || interacting || reduced.current) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(timer);
  }, [count, interacting, manual]);

  if (state.status === "loading") return <SpotlightSkeleton />;

  if (state.status === "error") {
    return (
      <section className="mx-auto w-full max-w-6xl px-5 pt-8 sm:px-8 sm:pt-12">
        <div className="rounded-lg border border-hairline bg-card px-5 py-8">
          <p className="text-sm text-ink-muted">
            {describeFailure(state.failure)} The rows below are unaffected.
          </p>
          <button
            type="button"
            onClick={state.retry}
            className="mt-3 rounded-sm border border-hairline px-3 py-1.5 text-sm text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (count === 0) return null;
  /* Derived rather than corrected by an effect: if the set ever shrinks, the
     index wraps on read instead of being reset by a setState in an effect body,
     which React rightly flags as a cascading render. */
  const active = index % count;
  const card = items[active];

  const meta = [formatLabel(card.format), yearLabel(card)].filter(Boolean).join(" · ");
  const score = scoreLabel(card);
  const position = progressLabel(card);
  /* Banner preferred, portrait cover only when a title has no banner. */
  const art = card.banner ?? card.cover;

  return (
    <section
      className="mx-auto w-full max-w-6xl px-5 pt-8 sm:px-8 sm:pt-12"
      aria-roledescription="carousel"
      aria-label="Spotlight"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false);
      }}
    >
      <div className="relative overflow-hidden rounded-lg border border-hairline bg-card">
        {/*
          Keyed on the id so each rotation mounts a fresh element, which is what
          re-triggers the fade. The box around it is a fixed height, so nothing
          moves when the copy inside changes.
        */}
        <div
          key={card.id}
          className="spotlight-slide relative"
          aria-live="off"
          aria-atomic="true"
        >
          {/*
            The banner fills the section; the portrait cover is only a fallback.

            The cover was the wrong asset for a wide hero, and measurably so:
            against this 1088x448 box a 460x640 cover loses 73% of its height to
            the crop and needs a 4.7x upscale at 2x. A banner loses nothing
            vertically — the 1900x400 strips map almost exactly onto the box's
            height — so the crop becomes horizontal, roughly 45% off the sides
            where a subject is usually centred, and the upscale drops to about
            2x behind a scrim. The taller 1900x1188 banner animes get needs
            1.15x.

            So the trade is a cropped background rather than a cropped face, and
            softness a scrim partly hides rather than softness on the one
            element a visitor looks straight at.

            Banners are not one ratio either — 4.75:1 for most titles, 1.6:1 for
            others — so this is object-cover on a fixed box, not a frame sized
            to fit. That is also why the scrim is load-bearing rather than
            decorative: the artwork behind the text is arbitrary, so contrast
            cannot be left to the key art happening to be dark.
          */}
          {art ? (
            <div className="absolute inset-0" aria-hidden="true">
              <PosterImage
                src={art}
                alt=""
                sizes="(min-width: 1152px) 1152px, 100vw"
                quality={90}
                priority={active === 0}
                className="size-full rounded-none ring-0"
                imageClassName="object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-r from-card via-card/90 to-card/45" />
            </div>
          ) : null}

          <div className={HERO_BOX}>
            <div className="min-w-0 lg:max-w-[62%]">
              <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-brand uppercase">
                Spotlight
              </p>

              <h2 className="mt-3 line-clamp-2 font-display text-3xl leading-tight font-normal sm:text-4xl lg:text-5xl">
                {card.title}
              </h2>

              <p className="mt-3 flex h-4 items-center gap-x-3 overflow-hidden whitespace-nowrap font-mono text-[0.75rem] text-ink-muted">
                {meta ? <span>{meta}</span> : null}
                {position ? <span className="text-brand">{position}</span> : null}
                {score ? <span>score {score}</span> : null}
                {card.status === "RELEASING" ? (
                  <span className="text-brand">airing</span>
                ) : null}
              </p>

              <p className="mt-5 line-clamp-3 max-w-[54ch] text-sm leading-relaxed text-ink-muted sm:text-base">
                {card.summary ?? ""}
              </p>

              <ul className="mt-5 flex h-5 flex-wrap gap-2">
                {card.genres.slice(0, 4).map((genre) => (
                  <li
                    key={genre}
                    className="rounded-4xl border border-hairline px-2.5 py-0.5 font-mono text-[0.6875rem] text-ink-muted"
                  >
                    {genre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/*
          The dots are the only control left, so they have to carry the tap
          target themselves: each is a 24px button with the bar drawn inside it.
          Bare 6px bars fail the 24px minimum, and the usual fix — an expanded
          pseudo-element — would have overlapped the neighbours, since the bars
          sit 12px apart and the targets would have been 26px wide. Exactly
          adjacent 24px targets solve both at once.
        */}
        <div className="flex items-center px-5 pb-5 sm:px-10 sm:pb-6">
          {count > 1
            ? items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show ${item.title}`}
                  aria-current={i === active}
                  className="group grid size-6 place-items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 rounded-4xl transition-all ${
                      i === active
                        ? "w-5 bg-brand"
                        : "w-1.5 bg-hairline group-hover:bg-brand/60"
                    }`}
                  />
                </button>
              ))
            : null}
        </div>
      </div>

      {/*
        Polite only while the section is hovered or focused, which is exactly
        when rotation is suspended — so this fires on the visitor's own dot
        click and never on the timer.
      */}
      <p className="sr-only" aria-live={interacting ? "polite" : "off"}>
        {`Slide ${active + 1} of ${count}: ${card.title}`}
      </p>
    </section>
  );
}

/**
 * Fixed, not min-height — and shared verbatim by the hero and its skeleton.
 *
 * The hero's natural height depends on how many lines this particular title
 * and synopsis happen to occupy, which is why matching it with a placeholder
 * kept failing: guessed heights missed by 28px on a phone and 33px on desktop
 * in opposite directions, and borrowing the type classes still missed by 37px
 * because the real synopsis does not always fill three lines.
 *
 * The clamps make the height *bounded*, which is what makes pinning it
 * legitimate rather than a clip risk.
 *
 * lg is 28rem rather than 30rem because the copy now sits over a banner
 * instead of beside a portrait, and a wide, shallower box suits a 4.75:1
 * source: it crops far less of the artwork and needs less upscaling.
 *
 * One constant, used by both hero and skeleton, so they cannot drift apart.
 */
const HERO_BOX =
  "relative h-[22rem] overflow-hidden px-5 py-8 sm:h-[26rem] sm:px-8 sm:py-10 lg:h-[28rem] lg:px-10 lg:py-12";


/**
 * Mirrors the real hero by borrowing its type classes and sharing its fixed
 * height, so the two occupy the same box by construction rather than by
 * measurement.
 *
 * Bars sit adjacent rather than spaced with margins, because real lines of
 * text are adjacent too; a `mt-2` between them would reserve height the copy
 * never occupies. Each holds a non-breaking space so its height comes from
 * its own line box.
 *
 * The dot row is wrapped in size-6 cells for the same reason the real dots
 * are buttons of that size: the row's height comes from the control, not from
 * the 6px bar, so reserving only the bar would leave the card 18px short and
 * shift everything below it on swap.
 */
function SpotlightSkeleton() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pt-8 sm:px-8 sm:pt-12">
      <div className="overflow-hidden rounded-lg border border-hairline bg-card">
        <div className={HERO_BOX}>
          <div className="min-w-0 lg:max-w-[62%]">
            <Skeleton className="text-[0.6875rem] leading-relaxed">&nbsp;</Skeleton>

            <div className="mt-3">
              <Skeleton className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
                &nbsp;
              </Skeleton>
              <Skeleton className="w-2/3 text-3xl leading-tight sm:text-4xl lg:text-5xl">
                &nbsp;
              </Skeleton>
            </div>

            <Skeleton className="mt-3 h-4 w-1/2" />

            <div className="mt-5">
              <Skeleton className="text-sm leading-relaxed sm:text-base">
                &nbsp;
              </Skeleton>
              <Skeleton className="text-sm leading-relaxed sm:text-base">
                &nbsp;
              </Skeleton>
              <Skeleton className="w-4/5 text-sm leading-relaxed sm:text-base">
                &nbsp;
              </Skeleton>
            </div>

            <div className="mt-5 flex h-5 gap-2">
              <Skeleton className="h-5 w-16 rounded-4xl" />
              <Skeleton className="h-5 w-20 rounded-4xl" />
              <Skeleton className="h-5 w-14 rounded-4xl" />
            </div>
          </div>
        </div>

        {/*
          The dot row has to be reserved too. It only exists once data has
          arrived, so leaving it out made the card taller on swap and pushed
          every band below it down — 0.034 CLS at 375 and 0.018 at 1280,
          measured, when it was still carrying three size-9 buttons. Same
          padding and same size-6 cells as the real row.
        */}
        <div className="flex items-center px-5 pb-5 sm:px-10 sm:pb-6">
          {["w-5", "w-1.5", "w-1.5", "w-1.5"].map((w, i) => (
            <span key={i} className="grid size-6 place-items-center">
              <Skeleton className={`h-1.5 rounded-4xl ${w}`} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
