/**
 * The queries this page runs, and the one it does not.
 *
 * Every row is a sort AniList can actually substantiate. Two things in the
 * reference layout are deliberately absent because the API cannot support them
 * honestly, and inventing them would have been the same mistake as fabricating
 * a share count:
 *
 *   - A "Today / Week / Month" tab set. TRENDING_DESC is a single composite
 *     score with no period dimension. Three tabs over one number is three
 *     identical lists wearing different labels.
 *   - HD / 4K quality badges. Media has no resolution field. `format` and
 *     `episodes` carry that metadata role instead, and both are real.
 *
 * Sub/dub availability is also absent: it is a property of a site's own
 * catalogue, not of the title, so it stays on the landing page's curated
 * shelf where the project actually declares it.
 */

import { CARD_SELECTION } from "./client";

/* -- rows ------------------------------------------------------------------- */

export const TRENDING = /* GraphQL */ `
  ${CARD_SELECTION}
  query Trending {
    Page(perPage: 18) {
      pageInfo { hasNextPage }
      media(type: ANIME, isAdult: false, sort: TRENDING_DESC) { ...Card }
    }
  }
`;

export const POPULAR = /* GraphQL */ `
  ${CARD_SELECTION}
  query Popular {
    Page(perPage: 24) {
      pageInfo { hasNextPage }
      media(type: ANIME, isAdult: false, sort: POPULARITY_DESC) { ...Card }
    }
  }
`;

export const TOP_AIRING = /* GraphQL */ `
  ${CARD_SELECTION}
  query TopAiring {
    Page(perPage: 18) {
      pageInfo { hasNextPage }
      media(type: ANIME, isAdult: false, status: RELEASING, sort: TRENDING_DESC) { ...Card }
    }
  }
`;

export const MOST_FAVORITE = /* GraphQL */ `
  ${CARD_SELECTION}
  query MostFavorite {
    Page(perPage: 18) {
      pageInfo { hasNextPage }
      media(type: ANIME, isAdult: false, sort: FAVOURITES_DESC) { ...Card }
    }
  }
`;

export const RECENTLY_COMPLETED = /* GraphQL */ `
  ${CARD_SELECTION}
  query RecentlyCompleted {
    Page(perPage: 18) {
      pageInfo { hasNextPage }
      media(type: ANIME, isAdult: false, status: FINISHED, sort: FINISHED_DATE_DESC) { ...Card }
    }
  }
`;

export const NEWLY_STARTED = /* GraphQL */ `
  ${CARD_SELECTION}
  query NewlyStarted {
    Page(perPage: 18) {
      pageInfo { hasNextPage }
      media(type: ANIME, isAdult: false, sort: START_DATE_DESC) { ...Card }
    }
  }
`;

export const UPCOMING = /* GraphQL */ `
  ${CARD_SELECTION}
  query Upcoming {
    Page(perPage: 18) {
      pageInfo { hasNextPage }
      media(type: ANIME, isAdult: false, status: NOT_YET_RELEASED, sort: POPULARITY_DESC) { ...Card }
    }
  }
`;

/* -- spotlight ------------------------------------------------------------- */

/**
 * The rotating spotlight set.
 *
 * These are the same AniList ids already encoded in the cover URLs hardcoded
 * in src/lib/poster-art.ts — `bx1-` is Cowboy Bebop, `bx5114-` is Fullmetal
 * Alchemist: Brotherhood, and so on. Reusing them means the spotlight promotes
 * titles the project already declares rather than a second unrelated set, and
 * it means no new poster URLs need maintaining: AniList returns the artwork
 * alongside the metadata.
 *
 * Order is the rotation order, so it is authored deliberately and the strongest
 * title leads. Note that AniList id 21 is *One Piece*, not FMAB, which is an
 * easy wrong guess.
 */
export const SPOTLIGHT_IDS = [5114, 1, 30, 1535, 9253, 21507];

export const SPOTLIGHT = /* GraphQL */ `
  ${CARD_SELECTION}
  query Spotlight($ids: [Int], $perPage: Int) {
    Page(perPage: $perPage) {
      pageInfo { hasNextPage }
      media(type: ANIME, isAdult: false, id_in: $ids) { ...Card }
    }
  }
`;

/* -- genres ---------------------------------------------------------------- */

export const GENRES = /* GraphQL */ `
  query Genres {
    GenreCollection
  }
`;

/* -- schedule -------------------------------------------------------------- */

/**
 * The weekly timetable is built from nextAiringEpisode.airingAt, which is a
 * real Unix timestamp. Bucketing those into Sun-Sat in the visitor's own
 * timezone gives a schedule that is correct rather than one authored by hand
 * and wrong for anyone outside its author's timezone.
 */
export const SCHEDULE = /* GraphQL */ `
  ${CARD_SELECTION}
  query Schedule($page: Int) {
    Page(perPage: 50, page: $page) {
      pageInfo { hasNextPage }
      media(type: ANIME, isAdult: false, status: RELEASING, sort: POPULARITY_DESC) { ...Card }
    }
  }
`;
