import Link from "next/link";
import { MASTHEAD_LINKS, SITE } from "@/lib/content";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { BrandMark } from "@/components/site/brand-mark";

/**
 * Masthead. A wordmark, an inline nav for desktop, a link into the
 * catalogue, and nothing else — there is no account, so there is no sign-in
 * control, and no search, because the landing page has no catalogue behind it.
 *
 * The nav is desktop-only. The page is one document with eight bands; on a
 * phone the wordmark plus a dismissal that has to stay reachable is worth
 * more than a cramped row of section links, so mobile nav lives in the
 * footer instead. The catalogue link is the exception to that rule — see
 * below.
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

          {/*
            The way into /home.

            Deliberately not a filled primary button. This bar is 56px tall and
            sticky for the whole scroll, so a solid vermilion block here would
            out-shout the wordmark and pull the eye on every screen. An outlined
            link with an arrow reads as tappable and stays quiet.

            It is NOT desktop-only, unlike the section nav. On a phone that nav
            is hidden by design — section links live in the footer — so this is
            the only route to the catalogue above the fold, which is the
            opposite of the reason the nav is hidden.

            Which is also why it needs the short label below sm: at 320px the
            full "Open catalogue" plus its arrow measured ~131px against ~95px
            of available width, and overflowed the bar by 13px.
          */}
          <Link
            href="/home"
            className="flex shrink-0 items-center gap-1.5 rounded-md border border-hairline px-2.5 py-1.5 text-sm text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-3"
          >
            <span className="sm:hidden">Catalogue</span>
            <span className="hidden sm:inline">Open catalogue</span>
            <span aria-hidden="true" className="hidden sm:inline">
              →
            </span>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}