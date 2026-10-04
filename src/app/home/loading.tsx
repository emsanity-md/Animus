import { Skeleton } from "@/components/ui/skeleton";

/**
 * Route-transition shell for the catalogue.
 *
 * Scoped to the /home segment deliberately. A `loading.tsx` at the app root
 * wraps EVERY route in a Suspense boundary, which put this catalogue skeleton
 * in front of the landing page too — on a page that is fully static, has no
 * loading state, and therefore should never flash a placeholder at all. The
 * file living here instead of one level up is what keeps the two surfaces'
 * behaviour independent.
 *
 * What it does reserve is the shape of the catalogue rather than a spinner, so
 * navigating here lands on something the same size as the page it becomes:
 * every skeleton below matches its counterpart's real dimensions, which is
 * what keeps the swap from registering as layout movement.
 *
 * `.surface-ink` because this appears against the dark ground, and a
 * paper-coloured skeleton flashing during the transition would be the most
 * visible thing on the screen.
 */
/**
 * `data-loading-shell` exists so the layout's <noscript> block can hide this
 * fallback. Without scripting it is the only thing that ever paints, so a
 * visitor with JS off would otherwise get the explanation stacked above 128
 * permanent skeletons — technically informative, visually broken.
 */
export default function Loading() {
  return (
    <div data-loading-shell className="surface-ink min-h-dvh bg-background text-foreground">
      <div className="sticky top-0 z-50 border-b border-hairline">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-24" />
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl px-5 pt-8 sm:px-8 sm:pt-12">
        <div className="overflow-hidden rounded-lg border border-hairline bg-card">
          <div className="px-5 py-10 sm:px-10 sm:py-16">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-4 h-9 w-4/5 sm:h-12" />
            <Skeleton className="mt-4 h-3 w-2/3" />
            <Skeleton className="mt-6 h-3 w-full max-w-[54ch]" />
            <Skeleton className="mt-2 h-3 w-11/12 max-w-[54ch]" />
          </div>
        </div>

        <div className="py-10 sm:py-14">
          <Skeleton className="mb-6 h-7 w-64" />
          <div className="flex gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="w-[132px] shrink-0">
                <Skeleton className="aspect-[0.707] w-full rounded-md" />
                <Skeleton className="mt-2 h-3.5 w-full" />
                <Skeleton className="mt-1.5 h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
