import Link from "next/link";
import { BrandMark } from "@/components/site/brand-mark";
import { SITE } from "@/lib/content";

/**
 * Catalogue chrome.
 *
 * Not the landing page's Masthead, and deliberately so. That one is a document
 * header: wordmark, in-page sections, theme. This is an application header
 * with somewhere else to go and a way back, and it carries no theme toggle —
 * this surface has a fixed dark ground by design, so offering a light/dark
 * switch here would be offering a control that does nothing.
 *
 * The back link is the important one. /home is reachable from the landing page
 * and has to be leaveable in one click, or it reads as a dead end.
 */
export function PortalHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-background/92 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/home"
            className="flex items-center gap-2 font-display text-lg tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            <BrandMark className="h-[1.15em] w-auto text-brand" />
            {SITE.name}
          </Link>
          <span aria-hidden="true" className="h-4 w-px shrink-0 bg-hairline" />
          <span className="truncate font-mono text-[0.6875rem] tracking-[0.14em] text-ink-faint uppercase">
            Catalogue
          </span>
        </div>

        <Link
          href="/"
          className="shrink-0 rounded-sm border border-hairline px-3 py-1.5 text-sm text-ink-muted transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Back to site
        </Link>
      </div>
    </header>
  );
}
