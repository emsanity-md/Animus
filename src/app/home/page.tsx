"use client";

import { PortalFooter } from "@/components/portal/portal-footer";
import { PortalHeader } from "@/components/portal/portal-header";
import { AiringNowRow, NewlyStartedRow, SpotlightRow, TrendingRow } from "@/components/portal/rows";

/**
 * The catalogue.
 *
 * A client component because every band on it is fetched from AniList in the
 * browser — see src/lib/anilist/client.ts for why that is deliberately not a
 * build-time or server-time fetch. The trade is that this page has states the
 * rest of the site does not, and they are handled per section rather than by
 * a boundary that would take the whole page down.
 *
 * The `.surface-ink` wrapper paints the dark ground. It is a scope class, not
 * `.dark`, so it holds whichever theme the visitor chose on the landing page
 * and leaves that choice untouched when they come back.
 *
 * The no-JS notice is in layout.tsx, not here — see the note there.
 */
export default function CataloguePage() {
  return (
    <div className="surface-ink min-h-dvh bg-background text-foreground">
      <PortalHeader />

      <main id="main" className="flex-1 pb-10">
        <SpotlightRow />
        <TrendingRow />
        <AiringNowRow />
        <NewlyStartedRow />
      </main>

      <PortalFooter />
    </div>
  );
}
