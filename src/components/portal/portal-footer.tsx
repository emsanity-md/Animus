import Link from "next/link";
import { BrandMark } from "@/components/site/brand-mark";
import { SITE } from "@/lib/content";

/**
 * Catalogue footer.
 *
 * Omits two things the reference layout carries. There is no social row,
 * because the project has no accounts and inventing links to four platforms
 * would be four dead hrefs. And there is no A-Z index yet: an alphabet strip
 * is only meaningful against a catalogue this page can actually enumerate,
 * and a strip of letters that all resolve to the same six rows is worse than
 * no strip. It arrives with the search work, when there is something behind
 * it.
 */
export function PortalFooter() {
  return (
    <footer className="mt-8 border-t border-hairline">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-12 sm:px-8 sm:py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-16">
          <div className="flex max-w-sm flex-col gap-3">
            <p className="flex items-center gap-2 font-display text-lg">
              <BrandMark className="h-[1.15em] w-auto text-brand" />
              {SITE.name}
            </p>
            <p className="text-sm leading-relaxed text-ink-muted">
              A portfolio project. Cover art and catalogue metadata come from
              AniList; there is no player here and nothing streams.
            </p>
          </div>

          <nav aria-label="Catalogue" className="shrink-0">
            <h2 className="font-mono text-[0.6875rem] tracking-[0.18em] text-ink-faint uppercase">
              This page
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {[
                { href: "#spotlight", label: "Spotlight" },
                { href: "#trending", label: "Trending" },
                { href: "#airing", label: "Airing now" },
                { href: "#new", label: "Recently started" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="rounded-sm text-sm text-ink-muted transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
          <p className="text-sm text-ink-faint">
            © 2026 {SITE.name}. {SITE.tagline}
          </p>
          <Link
            href="/"
            className="rounded-sm text-sm text-ink-muted transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            About this project
          </Link>
        </div>
      </div>
    </footer>
  );
}
