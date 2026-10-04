import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/reactbits/reveal";
import { Section, SectionHead } from "./section";
import { FAQ } from "@/lib/content";

export function Faq() {
  return (
    <Section id="faq">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal>
          <SectionHead
            jp={FAQ.eyebrowJp}
            gloss={FAQ.eyebrowGloss}
            heading={FAQ.heading}
            lede={FAQ.lede}
          />
        </Reveal>

        <Reveal delay={120}>
          <Accordion className="border-t border-hairline">
            {FAQ.items.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`faq-${index}`}
                className="border-b border-hairline last:border-b-0"
              >
                <AccordionTrigger className="gap-6 rounded-none py-6 pr-8 font-display text-title font-normal hover:no-underline hover:text-brand data-open:text-brand">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-7 text-ink-muted">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </Section>
  );
}