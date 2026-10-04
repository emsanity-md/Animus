import { MASTHEAD_LINKS, SITE } from "@/lib/content";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { BrandMark } from "@/components/site/brand-mark";

/**
 * Masthead. A wordmark, an inline nav for desktop, and nothing else —
 * there is no account, so there is no sign-in control, and no search,
 * because there is no catalog behind this build yet.
 *
 * The nav is desktop-only. The page is one document with eight bands; on a
 * phone the wordmark plus a dismissal that has to stay reachable is worth
 * more than a cramped row of section links, so mobile nav lives in the
 * footer instead.
 */
export function Masthead() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-background/92 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <a
          href="#top"
          className="flex items-center gap-2 font-display text-lg tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          <BrandMark className="h-[1.15em] w-auto text-brand" />
          {SITE.name}
        </a>

        <div className="flex items-center gap-3">
          <nav aria-label="Sections" className="hidden sm:block">
            <ul className="flex items-center gap-1">
              {MASTHEAD_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="rounded-sm px-2.5 py-1.5 text-sm text-ink-muted transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <span aria-hidden="true" className="hidden h-4 w-px bg-hairline sm:block" />

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}