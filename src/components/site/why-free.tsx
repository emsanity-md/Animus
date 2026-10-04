import { Reveal } from "@/components/reactbits/reveal";
import { Section, SectionHead } from "./section";
import { WHY_FREE } from "@/lib/content";

/**
 * Why it's free — the honest substitute for a pricing table.
 *
 * There are no tiers in this product, so a three-column plan comparison
 * would be fiction. What a visitor actually needs here is the reasoning:
 * why there is nothing to upgrade to, and why that is better than the
 * alternative. The demo disclosure sits in this section rather than
 * hidden, because it is part of the same argument.
 */
export function WhyFree() {
  return (
    <Section id="why-free" tone="stone" className="border-y border-hairline">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        <Reveal>
          <SectionHead
            jp={WHY_FREE.eyebrowJp}
            gloss={WHY_FREE.eyebrowGloss}
            heading={WHY_FREE.heading}
            lede={WHY_FREE.lede}
            className="lg:sticky lg:top-24"
          />
        </Reveal>

        <Reveal delay={120}>
          <dl className="flex flex-col">
            {WHY_FREE.points.map((point) => (
              <div
                key={point.title}
                className="border-t border-hairline py-6 last:border-b"
              >
                <dt className="font-display text-title font-normal">
                  {point.title}
                </dt>
                <dd className="mt-2 text-ink-muted">{point.body}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}