import { CountUp } from "@/components/reactbits/count-up";
import { Reveal } from "@/components/reactbits/reveal";
import { Section, Eyebrow } from "./section";
import { STATS } from "@/lib/content";

/**
 * The trust band.
 *
 * This section is the pitch. Everything else on the page is elaboration
 * on these four numbers, so they get a full band rather than a footnote
 * under the hero — and the count-up gives them a moment to land.
 */
export function StatStrip() {
  return (
    <Section tone="stone" className="border-y border-hairline">
      <Eyebrow jp={STATS.eyebrowJp} gloss={STATS.eyebrowGloss} />

      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 lg:grid-cols-4">
        {STATS.items.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 90}>
            <div className="flex flex-col gap-2 border-t border-hairline pt-5">
              <dt className="flex flex-col gap-2">
                <span className="font-display text-[clamp(2.75rem,2rem+2.6vw,4rem)] leading-none tracking-tight">
                  {stat.prefix ? (
                    <span className="text-brand">{stat.prefix}</span>
                  ) : null}
                  <CountUp to={stat.value} />
                  {stat.suffix ? (
                    <span className="text-brand">{stat.suffix}</span>
                  ) : null}
                </span>
                <span className="text-sm font-semibold text-ink">
                  {stat.label}
                </span>
              </dt>
              <dd className="text-sm text-ink-muted">{stat.note}</dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}