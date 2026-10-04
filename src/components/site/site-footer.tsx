import { FOOTER, SITE } from "@/lib/content";
import { BrandMark } from "@/components/site/brand-mark";

/**
 * Footer. Carries the demo statement and the in-page nav — on a phone
 * this is the only navigation on the page, since the masthead drops to a
 * wordmark below sm.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-16">
          <div className="flex max-w-sm flex-col gap-4">
            <p className="flex items-center gap-2 font-display text-lg">
              <BrandMark className="h-[1.15em] w-auto text-brand" />
              {SITE.name}
            </p>
            <p className="text-sm leading-relaxed text-ink-muted">
              {FOOTER.statement}
            </p>
          </div>

          <nav aria-label="Footer" className="shrink-0">
            <h2 className="eyebrow">Sections</h2>
            <ul className="-ml-2 mt-3 grid grid-cols-2 gap-x-10 gap-y-0.5">
              {FOOTER.nav.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-block rounded-sm px-2 py-1.5 text-sm text-ink-muted transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-muted">
            &copy; {new Date().getFullYear()} {SITE.name}.{" "}
            {SITE.tagline}
          </p>
          <p className="text-sm text-ink-faint">{FOOTER.build}</p>
        </div>
      </div>
    </footer>
  );
}