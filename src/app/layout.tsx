import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/site/providers";
import "./globals.css";

/**
 * Fonts are self-hosted rather than fetched from Google at build time.
 *
 * `next/font/google` makes every build perform a live request to
 * fonts.googleapis.com and then to fonts.gstatic.com. When that request
 * fails, is throttled, or is blocked, Turbopack's font pipeline fails with
 *
 *   Can't resolve '@vercel/turbopack-next/internal/font/google/font'
 *   next/font/google queries have exactly one entry
 *
 * which surfaces as a build error pointing at this file and looks like a
 * code fault rather than a network one. It was not reproducible from a
 * clean checkout and nothing in the repository caused it; the only trigger
 * is that the build reached the network and the network did not answer.
 * That made it the one genuinely non-hermetic thing left in an otherwise
 * self-contained build, so it is gone.
 *
 * Committing font binaries is licence-clean here: both families are SIL
 * Open Font License and explicitly permit redistribution. The files in
 * src/fonts are subsets — 44KB for all three, against 16MB of upstream
 * TTF — holding only the glyphs this site renders, Japanese eyebrow terms
 * included. See src/fonts/README.md for provenance and how to regenerate.
 */

/**
 * Shippori Mincho — a Japanese mincho serif cut from 1914-style forms,
 * now the house face of art institutions and literary publishers.
 * Archival rather than cute, which is the whole point: the site's pitch
 * is credibility, so the display face has to look curated.
 *
 * Shipped at 400 only. Every heading in the page sets font-normal
 * explicitly, and mincho bold is a much heavier, more emphatic cut than
 * this design wants — so a 700 file would have been 19KB of preloaded
 * bytes that nothing ever requested. If a bold display weight is ever
 * genuinely needed, add it back and expect the face to change character.
 */
const shippori = localFont({
  src: [
    {
      path: "../fonts/shippori-mincho-400.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-shippori",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

/**
 * Manrope for body copy — wide apertures, distinctive a and g.
 * 400 for prose, 600 for the small emphases (stat figures, the demo
 * disclosure, link weight on the CTA). Two weights, which is the budget.
 */
const manrope = localFont({
  src: [
    { path: "../fonts/manrope-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/manrope-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://animus.vercel.app"),
  title: {
    default: "Animus — free anime in Ultra HD, sub or dub, no account",
    template: "%s · Animus",
  },
  description:
    "Animus streams and downloads subbed and dubbed anime in up to 4K. No account, no payment, no email. One ad per page — and that's the whole business model.",
  keywords: [
    "anime",
    "free anime",
    "anime streaming",
    "dubbed anime",
    "subbed anime",
    "4K anime",
    "anime download",
  ],
  openGraph: {
    type: "website",
    siteName: "Animus",
    title: "Watch anime in Ultra HD. Pay nothing. Create nothing.",
    description:
      "Subbed and dubbed anime in up to 4K. No account, no payment, no email. One ad per page.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Watch anime in Ultra HD. Pay nothing. Create nothing.",
    description:
      "Subbed and dubbed anime in up to 4K. No account, no payment, no email. One ad per page.",
  },
  robots: { index: true, follow: true },
};

/**
 * Every entrance animation on this page hides content with CSS and then
 * reveals it with JavaScript. That is fine when scripting works and
 * catastrophic when it does not: motion serialises its `initial` state into
 * the server HTML as `opacity: 0`, so without JS the <h1> and every
 * scroll-revealed band render blank — the entire page below the eyebrow.
 *
 * This restores the real styles when scripting is off, so the animations
 * stay progressive enhancement. `!important` is required because motion
 * writes inline styles, which would otherwise win.
 */
const NO_SCRIPT_STYLES = `
  .blur-text span,
  .reveal {
    opacity: 1 !important;
    filter: none !important;
    transform: none !important;
  }
  .rise-in {
    animation: none !important;
    opacity: 1 !important;
    filter: none !important;
    transform: none !important;
  }
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // next-themes writes the stored theme class onto <html> before paint,
      // which the server cannot know about. Without this, every visit logs a
      // hydration mismatch on the html element.
      suppressHydrationWarning
      className={`${shippori.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        {/*
         * dangerouslySetInnerHTML on <noscript> rather than a <style>
         * child. With a real child element React tries to reconcile it,
         * but browsers with scripting enabled parse <noscript> content as
         * raw text, so React warns that it "encountered a script tag while
         * rendering". Handing over the markup as a string keeps React out
         * of it entirely while producing identical HTML.
         */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<style>${NO_SCRIPT_STYLES}</style>`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}