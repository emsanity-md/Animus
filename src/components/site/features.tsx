import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Reveal } from "@/components/reactbits/reveal";
import { Section, SectionHead } from "./section";
import { FEATURES } from "@/lib/content";

export function Features() {
  return (
    <Section id="features">
      <Reveal>
        <SectionHead
          jp={FEATURES.eyebrowJp}
          gloss={FEATURES.eyebrowGloss}
          heading={FEATURES.heading}
          lede={FEATURES.lede}
        />
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {FEATURES.items.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 80}>
            <Card className="h-full rounded-lg bg-transparent p-7 ring-hairline transition-shadow duration-300 hover:shadow-lift">
              <CardHeader className="p-0">
                {/* Numerals in the margin, catalogue-index style. */}
                <span className="font-display text-sm text-brand" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <CardTitle className="font-display text-title font-normal">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-body text-ink-muted">
                  {feature.body}
                </CardDescription>
              </CardHeader>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}