import { Reveal } from "@/components/reactbits/reveal";
import { Section, SectionHead } from "./section";
import { PosterMarquee } from "./poster-marquee";
import { LIBRARY } from "@/lib/content";

/**
 * The shelf.
 *
 * This is the target of the hero's primary CTA, and it is what makes that
 * CTA point somewhere real. Eight real series with real cover art, served
 * from AniList's CDN.
 *
 * The entries drift as two endless marquee rows rather than sitting in a
 * static grid, so the section reads as a shelf that keeps going. See
 * poster-marquee.tsx for the loop mechanics and the accessibility work —
 * chiefly that moving content is pausable (WCAG 2.2.2) and that the
 * duplicated copy which makes the loop seamless is hidden from assistive
 * tech so the titles are not read twice.
 */
export function LibraryShelf() {
  return (
    <Section id="library" tone="stone" className="border-y border-hairline">
      <Reveal>
        <SectionHead
          jp={LIBRARY.eyebrowJp}
          gloss={LIBRARY.eyebrowGloss}
          heading={LIBRARY.heading}
          lede={LIBRARY.lede}
        />
      </Reveal>

      <Reveal>
        <PosterMarquee items={LIBRARY.items} />
      </Reveal>

      <p className="mt-10 border-t border-hairline pt-6 text-sm text-ink-muted max-w-[62ch]">
        {LIBRARY.caption}
      </p>
    </Section>
  );
}