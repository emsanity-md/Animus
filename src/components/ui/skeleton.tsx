import { cn } from "cn";

/**
 * A placeholder block for content that has not arrived yet.
 *
 * Colour comes from `--skeleton-base` rather than a literal, which is the
 * whole point: the same component renders correctly on the paper palette and
 * inside `.surface-ink` without a variant, because the token is redefined per
 * surface. shadcn's stock Skeleton hardcodes `bg-accent`, which is correct
 * for one theme and wrong for two.
 *
 * Callers own the dimensions. A skeleton that does not match the shape of the
 * content it stands in for guarantees a layout shift on swap, which is worse
 * than showing nothing at all — this project has held CLS at 0 throughout and
 * a loading state is the most likely thing to break that. Pair every one of
 * these with the exact aspect ratio or fixed height of its real counterpart.
 */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-skeleton rounded-sm bg-skeleton", className)}
      {...props}
    />
  );
}
