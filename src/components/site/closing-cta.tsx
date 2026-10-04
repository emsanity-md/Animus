import { CtaLink } from "@/components/site/cta-link";
import { Reveal } from "@/components/reactbits/reveal";
import { Section, Eyebrow } from "./section";
import { CLOSING_CTA } from "@/lib/content";

export function ClosingCta() {
  return (
    <Section tone="sand" className="border-y border-hairline">
      <Reveal>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <Eyebrow
            jp={CLOSING_CTA.eyebrowJp}
            gloss={CLOSING_CTA.eyebrowGloss}
            className="justify-center"
          />

          <h2 className="text-section font-normal text-balance">
            {CLOSING_CTA.heading}
          </h2>

          <p className="text-lede text-ink-muted max-w-[52ch]">
            {CLOSING_CTA.lede}
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <CtaLink href={CLOSING_CTA.primaryCta.href}>
              {CLOSING_CTA.primaryCta.label}
            </CtaLink>
            <CtaLink
              href={CLOSING_CTA.secondaryCta.href}
              variant="outline"
              className="hover:bg-paper"
            >
              {CLOSING_CTA.secondaryCta.label}
            </CtaLink>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}