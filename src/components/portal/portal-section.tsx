import type { ReactNode } from "react";
import { cn } from "cn";

/**
 * Band wrapper for the catalogue surface.
 *
 * The landing page owns its rhythm in `site/section.tsx`, which exists because
 * that page is a single document read top to bottom. /home is a browsing
 * surface with repeated, structurally identical bands, so it needs a smaller
 * primitive: a heading, optional lede, optional trailing action, and a grid
 * underneath.
 *
 * The padding is inherited from `--spacing-band` rather than restated, so the
 * catalogue's vertical rhythm matches the landing page's without either page
 * hard-coding a number the other might change.
 */
export function PortalSection({
  id,
  eyebrow,
  title,
  lede,
  action,
  children,
  className,
  bodyClassName,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section id={id} className={cn("py-10 sm:py-14", className)}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="mb-2 font-mono text-[0.6875rem] tracking-[0.18em] text-brand uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="font-display text-2xl leading-tight font-normal sm:text-3xl">
              {title}
            </h2>
            {lede ? (
              <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-ink-muted">{lede}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>

        <div className={bodyClassName}>{children}</div>
      </div>
    </section>
  );
}
