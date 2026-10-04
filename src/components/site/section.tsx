import { cn } from "cn";

/**
 * Layout primitives.
 *
 * Every band on the page renders through <Section>, so the vertical
 * rhythm and the horizontal measure are defined in exactly one place.
 * Alignment stops being a per-section discipline and becomes structural.
 */

type Tone = "paper" | "stone" | "sand";

const TONES: Record<Tone, string> = {
  paper: "bg-background",
  stone: "bg-stone",
  sand: "bg-sand",
};

export function Section({
  id,
  tone = "paper",
  className,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("py-20 sm:py-28 lg:py-32", TONES[tone], className)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

/**
 * Section eyebrow: Japanese term, hairline rule, roman gloss.
 * The rule is what makes the serif read as typeset rather than decorative.
 */
export function Eyebrow({
  jp,
  gloss,
  className,
}: {
  jp: string;
  gloss: string;
  className?: string;
}) {
  return (
    <p className={cn("eyebrow", className)}>
      <span className="eyebrow-jp">{jp}</span>
      <span aria-hidden="true" className="h-px w-8 shrink-0 bg-hairline" />
      <span>{gloss}</span>
    </p>
  );
}

/** Eyebrow + h2 + lede. The shape every content band shares. */
export function SectionHead({
  jp,
  gloss,
  heading,
  lede,
  align = "left",
  className,
}: {
  jp: string;
  gloss: string;
  heading: string;
  lede?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Eyebrow jp={jp} gloss={gloss} />
      <h2 className="text-section font-normal text-balance">{heading}</h2>
      {lede ? (
        <p
          className={cn(
            "text-lede text-ink-muted max-w-[54ch]",
            align === "center" && "mx-auto",
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}