import eagle from "@/assets/eagle.png";
import { cn } from "cn";

/**
 * The Animus mark: a bald eagle's head, from the artwork in src/assets.
 *
 * Applied as a CSS mask rather than an <img>, which is the whole reason the
 * source file is a black silhouette on transparency. The two themes carry
 * different --brand values (#c0332a on paper, #e05a4e on the dark ground),
 * because no single vermilion clears 4.5:1 as text on near-black AND stays
 * legible behind a white label. A mask uses only the alpha channel, so the
 * colour is whatever `background-color` resolves to — meaning the mark
 * inherits `text-brand` and follows the palette automatically, with no second
 * asset and no `dark:` variant to keep in sync.
 *
 * It also means the antialiased edges are tinted rather than composited, so
 * there is no dark fringe against the dark theme's background.
 *
 * Decorative: the wordmark text beside it carries the name, so this is hidden
 * from assistive tech and kept out of the tab order.
 */
export function BrandMark({ className = "" }: { className?: string }) {
  const mask = `url(${eagle.src})`;
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block shrink-0 bg-current", className)}
      style={{
        /* Matches the source's 512x469 so `contain` is not needed and the
           mask lands on the element's box with no resampling. */
        aspectRatio: "512 / 469",
        maskImage: mask,
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "100% 100%",
        WebkitMaskImage: mask,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "100% 100%",
      }}
    />
  );
}
