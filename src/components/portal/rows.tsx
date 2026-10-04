"use client";

import { useAniListPage } from "@/lib/anilist/use-anilist";
import {
  NEWLY_STARTED,
  SPOTLIGHT,
  SPOTLIGHT_IDS,
  TOP_AIRING,
  TRENDING,
} from "@/lib/anilist/queries";
import { MediaGrid } from "./media-grid";
import { MediaRail } from "./media-rail";
import { PortalSection } from "./portal-section";
import { Spotlight } from "./spotlight";

/**
 * The catalogue rows, each owning its own request.
 *
 * Split per row rather than fetched together in one component so a single
 * failing query degrades one band instead of the page, and so the rows land
 * independently — the spotlight is one title and should not wait behind
 * eighteen trending covers.
 */

export function SpotlightRow() {
  const state = useAniListPage(SPOTLIGHT, {
    ids: SPOTLIGHT_IDS,
    perPage: SPOTLIGHT_IDS.length,
  });

  /**
   * AniList answers `id_in` in its own order, not the order asked for — it
   * came back ascending by id, which put Evangelion ahead of FMAB and quietly
   * defeated the authored rotation. So the order is reapplied here.
   *
   * `indexOf` returning -1 for an unknown id would sort it first, so unknown
   * ids are pushed to the end rather than promoted.
   */
  const rank = (id: number) => {
    const at = SPOTLIGHT_IDS.indexOf(id);
    return at === -1 ? Number.MAX_SAFE_INTEGER : at;
  };

  const ordered =
    state.status === "ready"
      ? {
          ...state,
          data: {
            ...state.data,
            items: [...state.data.items].sort((a, b) => rank(a.id) - rank(b.id)),
          },
        }
      : state;

  /* The anchor lives outside the state branch so the footer's jump link has
     something to land on before the request resolves. */
  return (
    <div id="spotlight">
      <Spotlight state={ordered} />
    </div>
  );
}

export function TrendingRow() {
  const state = useAniListPage(TRENDING);
  return (
    <PortalSection
      id="trending"
      eyebrow="Trending"
      title="What is moving this week"
      lede="AniList's trending score, which weighs recent activity rather than all-time popularity."
    >
      <MediaRail state={state} count={12} numbered />
    </PortalSection>
  );
}

export function AiringNowRow() {
  const state = useAniListPage(TOP_AIRING);
  return (
    <PortalSection
      id="airing"
      eyebrow="Airing now"
      title="Currently releasing"
      lede="Series with a confirmed next episode. Episode numbers come from AniList's broadcast schedule."
    >
      <MediaGrid state={state} count={12} />
    </PortalSection>
  );
}

export function NewlyStartedRow() {
  const state = useAniListPage(NEWLY_STARTED);
  return (
    <PortalSection
      id="new"
      eyebrow="Just started"
      title="Recently begun"
      lede="Ordered by original broadcast date, newest first."
    >
      <MediaGrid state={state} count={12} />
    </PortalSection>
  );
}
