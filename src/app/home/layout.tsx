import type { Metadata } from "next";

/**
 * Route metadata lives in a server layout so `page.tsx` can stay a client
 * component. `page.tsx` cannot export `metadata` — that export only exists on
 * server components — and splitting the route further just to keep one export
 * legal would be the tail wagging the dog.
 */
export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Browse anime by what is trending, what is airing, and what has just started. Cover art and metadata from AniList.",
  alternates: { canonical: "/home" },
  robots: { index: false, follow: true },
};

/**
 * The no-JS notice lives here, not in page.tsx, and that placement is the whole
 * point.
 *
 * `loading.tsx` puts a Suspense boundary around the page. Without scripting the
 * streamed response is never applied, so the fallback is all that ever paints:
 * measured, a no-JS visit to /home showed 128 permanent skeletons and zero
 * characters of text. An explanation placed inside the page would have been
 * part of what never arrives.
 *
 * The layout renders outside that boundary, so this is the one part of the
 * route that a visitor without JavaScript is guaranteed to see. Markup is
 * handed over as a string because a browser with scripting enabled parses
 * <noscript> content as raw text and React warns about the resulting script tag
 * — the same reason the root layout does it.
 */
const NO_SCRIPT_HTML = `
<style>[data-loading-shell]{display:none}</style>
<div class="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
  <p class="font-display text-2xl">This catalogue needs JavaScript.</p>
  <p class="mt-3 max-w-[54ch] text-sm leading-relaxed text-ink-muted">
    Every title, cover and broadcast time here is fetched from AniList as the
    page loads, so there is nothing to show without scripting — not a cached
    copy, not a summary. The
    <a href="/" class="text-brand underline underline-offset-4">landing page</a>
    is fully static and works either way.
  </p>
</div>`;

export default function CatalogueLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <noscript dangerouslySetInnerHTML={{ __html: NO_SCRIPT_HTML }} />
      {children}
    </>
  );
}
