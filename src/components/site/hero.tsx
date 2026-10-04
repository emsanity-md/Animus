"use client";

import { useEffect, useState } from "react";
import { cn } from "cn";
import { CtaLink } from "@/components/site/cta-link";
import { BlurText } from "@/components/reactbits/blur-text";
import { DriftWall } from "@/components/reactbits/drift-wall";
import { HERO, LIBRARY } from "@/lib/content";
import { posterFor } from "@/lib/poster-art";

/**
 * Cover art for the wall. The same eight titles as the library shelf, so the
 * hero preview and the catalogue below read as one set.
 */
const WALL_ITEMS = LIBRARY.items.flatMap((item) => {
  const image = posterFor(item.title);
  return image ? [{ image, title: item.title }] : [];
});

/**
 * BlurText's `delay` is the stagger between words *within* a line, not a pause
 * before the line starts. So making the second line trail the first means
 * adding its index into the per-word figure, not passing a line offset.
 *
 * 55 and 70 reproduce the pair that was previously hand-tuned per line, so the
 * cascade looks identical to before; a third line would land on 85.
 */
const WORD_STAGGER = 55;
const LINE_STAGGER_STEP = 15;

/** Gap between the headline's lines. Uniform for every line after the first. */
const LINE_GAP = "mt-2 sm:mt-3";

function useColumns(): number {
  const [columns, setColumns] = useState(5);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const apply = () => setColumns(mq.matches ? 5 : 4);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return columns;
}

export function Hero() {
  const columns = useColumns();

  return (
    <div id="top" className="grain relative overflow-hidden">
      {/* Poster wall. Decorative: aria-hidden inside DriftWall, no tab stops,
          and the scrim below guarantees the headline's contrast over it. */}
      {WALL_ITEMS.length > 0 ? (
        <div className="absolute inset-0">
          <DriftWall items={WALL_ITEMS} columns={columns} planeX="70%" />
        </div>
      ) : null}

      {/* Scrim. The one gradient on the page, and it is load-bearing rather
          than decorative.
          Mobile: text spans the full width, so the wall is behind copy no
          matter where it sits — the scrim stays heavy across the board.
          Desktop: copy lives on the left, so the scrim is opaque there and
          clears to almost nothing on the right, which is where the wall has
          been offset to sit. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-background via-background/95 to-background/75 sm:via-background/88 sm:to-background/15"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
        <div className="flex flex-col gap-7">
          {/* Eyebrow: the Japanese term does the arguing. */}
          <p className="eyebrow rise-in" style={{ animationDelay: "60ms" }}>
            <span className="eyebrow-jp">{HERO.eyebrowJp}</span>
            <span aria-hidden="true" className="h-px w-8 shrink-0 bg-hairline" />
            <span>{HERO.eyebrowGloss}</span>
          </p>

          {/* One <h1>, rendered from however many lines the copy declares.
              The visible copy is split per word for the blur-in, so it is
              hidden from assistive tech and the whole sentence is announced
              once instead of line by line. */}
          <h1 className="text-display font-normal">
            <span className="sr-only">
              {HERO.headline.map((line) => line.text).join(" ")}
            </span>
            <span aria-hidden="true" className="block">
              {HERO.headline.map((line, index) => (
                <span
                  key={line.text}
                  className={cn(
                    "block",
                    index > 0 && LINE_GAP,
                    line.accent && "text-brand",
                  )}
                >
                  <BlurText
                    text={line.text}
                    delay={WORD_STAGGER + index * LINE_STAGGER_STEP}
                  />
                </span>
              ))}
            </span>
          </h1>

          <p
            className="text-lede text-ink-muted max-w-[58ch] rise-in"
            style={{ animationDelay: "340ms" }}
          >
            {HERO.lede}
          </p>

          <div
            className="flex flex-col gap-3 rise-in sm:flex-row sm:items-center sm:gap-4"
            style={{ animationDelay: "460ms" }}
          >
            <CtaLink href={HERO.primaryCta.href}>
              {HERO.primaryCta.label}
            </CtaLink>
            <CtaLink
              href={HERO.secondaryCta.href}
              variant="outline"
              className="hover:bg-stone"
            >
              {HERO.secondaryCta.label}
            </CtaLink>
          </div>
        </div>
      </div>
    </div>
  );
}