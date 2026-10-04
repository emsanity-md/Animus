import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";

/**
 * A call to action that navigates, so it must be a link.
 *
 * These were originally `<Button render={<a href="…" />} />`. Base UI's Button
 * defaults to `nativeButton`, which means it expects to render a real
 * `<button>`; handing it an `<a>` drops native button semantics and Base UI
 * warns about it. Suppressing the warning with `nativeButton={false}` would
 * have silenced the symptom while keeping a button component in charge of
 * something that navigates.
 *
 * Since every CTA on this page points at an in-page anchor, the honest
 * element is a real `<a>` — correct link semantics, middle-click, "open in new
 * tab", and the browser status bar all work. It borrows its appearance from
 * shadcn's `buttonVariants` so focus-visible rings and press states stay
 * identical to every other button on the site.
 */
export function CtaLink({
  href,
  children,
  variant = "default",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        buttonVariants({ variant, size: "lg" }),
        "h-11 rounded-md px-5 text-[0.9375rem] font-semibold",
        variant === "outline" && "border-hairline bg-transparent",
        className,
      )}
    >
      {children}
    </a>
  );
}