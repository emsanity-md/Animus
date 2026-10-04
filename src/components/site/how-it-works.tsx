import { Reveal } from "@/components/reactbits/reveal";
import { Section, SectionHead } from "./section";
import { HOW_IT_WORKS } from "@/lib/content";

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <Reveal>
        <SectionHead
          jp={HOW_IT_WORKS.eyebrowJp}
          gloss={HOW_IT_WORKS.eyebrowGloss}
          heading={HOW_IT_WORKS.heading}
          lede={HOW_IT_WORKS.lede}
        />
      </Reveal>

      {/* A ruled table, not cards: the steps are a sequence, and the
          hairlines between them are what make it read as an order rather
          than four unrelated benefits. */}
      <ol className="mt-14 border-t border-hairline">
        {HOW_IT_WORKS.steps.map((step, index) => (
          <li key={step.title}>
            <Reveal delay={index * 70}>
              <div className="grid gap-x-6 gap-y-2 border-b border-hairline py-8 sm:grid-cols-[3.5rem_13rem_1fr] sm:items-baseline">
                <span
                  className="font-display text-brand tabular-nums"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="font-display text-title font-normal">
                  {step.title}
                </h3>

                <p className="text-ink-muted">{step.body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}