/**
 * Every string on the landing page, in one file.
 *
 * The copy is the product. Animus's claim is not "free anime" — it is
 * "free anime without the sketchy part." So the tone throughout is plain
 * and a little dry about the ad situation, and every claim here is one
 * the product can actually honour.
 */

export const SITE = {
  name: "Animus",
  tagline: "Free anime. One ad. No account.",
} as const;

/* ---------------------------------------------------------------- notice */

export const DEMO_NOTICE = {
  label: "Demo build",
  /* Kept to one clause. This is a bar, not a paragraph — on a phone an
     earlier, fuller version of this sentence pushed the hero below the
     fold on its own. The full explanation lives in the FAQ. */
  body: "A portfolio project. The interface is real code; the content behind it isn't shipped.",
  action: "Why it says demo",
  href: "#faq",
} as const;

/* ------------------------------------------------------------------ hero */

export const HERO = {
  eyebrowJp: "無登録",
  eyebrowGloss: "no account, ever",
  /* One entry per rendered line, because the line break is a decision about
     the copy, not about the markup: "Pay nothing." landing on its own line is
     what makes the accent read as a second beat rather than a stray red word.
     `accent` marks which lines take the brand colour. Both keys are written
     out on every line rather than left to be inferred, so adding, removing or
     reordering a line needs no matching edit in the hero.

     Each line is also sized to sit on ONE row at the desktop measure, which
     is why line two is "Sign nothing" rather than the longer "Create
     nothing": at 88px the original needed 1142px of a 1088px measure and
     wrapped, and the accent block stopped reading as a single beat. Every
     line here is under 1088px. Lengthen one and it will wrap again — the
     hero renders whatever it is given rather than truncating it. */
  headline: [
    { text: "Watch anime in Ultra HD.", accent: false },
    { text: "Pay nothing. Sign nothing.", accent: true },
  ],
  lede: "Animus streams and downloads subbed and dubbed anime in up to 4K. No account, no payment, no email address. One ad — and that's the entire business model.",
  primaryCta: { label: "Browse the library", href: "#library" },
  secondaryCta: { label: "How it works", href: "#how-it-works" },
} as const;

/* ----------------------------------------------------------------- stats */

export const STATS = {
  eyebrowJp: "無料",
  eyebrowGloss: "free of charge",
  items: [
    { value: 4, prefix: "", suffix: "K", label: "Max resolution", note: "where the source allows" },
    { value: 0, prefix: "", suffix: "", label: "Accounts required", note: "no email, no password" },
    { value: 0, prefix: "$", suffix: "", label: "Lifetime cost", note: "and nothing renews" },
    { value: 1, prefix: "", suffix: "", label: "Ad per page", note: "we count them" },
  ],
} as const;

/* -------------------------------------------------------------- features */

export const FEATURES = {
  eyebrowJp: "機能",
  eyebrowGloss: "what's included",
  heading: "What free actually gets you here",
  lede: "Four things a paid service would sell you, minus the checkout.",
  items: [
    {
      title: "Ultra HD, sub or dub",
      body: "Titles stream and download in 1080p, with 4K wherever the source allows it. Choose subtitles or an English dub per title and switch mid-episode without losing your place.",
    },
    {
      title: "Download the episode, not just the link",
      body: "Pull down a single episode or a whole season in one click, at the same resolution as playback. Then watch it on a plane, on a dead connection, or with the lights off.",
    },
    {
      title: "No account. None.",
      body: "No email, no password, no phone number, no free trial that quietly becomes a subscription. There is nothing to create because there is nothing to log into.",
    },
    {
      title: "One ad per page",
      body: "A single ad instead of the pop-unders, interstitials and trackers most free sites run. That is the whole revenue path, which is why there is nothing else bolted on.",
    },
  ],
} as const;

/* --------------------------------------------------------------- library */

export const LIBRARY = {
  eyebrowJp: "ライブラリ",
  eyebrowGloss: "the shelf",
  heading: "Browse the way you'd actually look for something",
  lede: "Laid out by title, era and format — not by which plan it upsells you to.",
  caption:
    "Demo catalog. Titles are real series; cover art is served from AniList's CDN and remains the property of its respective rights holders.",
  /**
   * `episodes: 1` means the meta line reads "2001 · Film" rather than the
   * redundant "Film · 1 film". Cover art URLs live in lib/poster-art.ts —
   * kept out of here so the content model stays free of third-party hosts.
   */
  items: [
    { title: "Cowboy Bebop", year: 1998, format: "TV", episodes: 26, tracks: ["Dub"], resolution: "4K" },
    { title: "Fullmetal Alchemist: Brotherhood", year: 2009, format: "TV", episodes: 64, tracks: ["Sub", "Dub"], resolution: "4K" },
    { title: "Neon Genesis Evangelion", year: 1995, format: "TV", episodes: 26, tracks: ["Dub"], resolution: "1080p" },
    { title: "Spirited Away", year: 2001, format: "Film", episodes: 1, tracks: ["Sub", "Dub"], resolution: "4K" },
    { title: "Death Note", year: 2006, format: "TV", episodes: 37, tracks: ["Sub", "Dub"], resolution: "1080p" },
    { title: "Mob Psycho 100", year: 2016, format: "TV", episodes: 37, tracks: ["Sub", "Dub"], resolution: "4K" },
    { title: "Jujutsu Kaisen", year: 2020, format: "TV", episodes: 24, tracks: ["Sub", "Dub"], resolution: "4K" },
    { title: "Steins;Gate", year: 2011, format: "TV", episodes: 24, tracks: ["Sub"], resolution: "1080p" },
  ],
} as const;

/* ---------------------------------------------------------- how it works */

export const HOW_IT_WORKS = {
  eyebrowJp: "使い方",
  eyebrowGloss: "how it works",
  heading: "Four steps. None of them are signing up.",
  lede: "This is the whole flow. There is no fifth step where we ask for your email.",
  steps: [
    {
      title: "Find something",
      body: "Search, or filter by genre, era, format or studio. Filters are unlimited and free, because there is no tier to hold them back.",
    },
    {
      title: "Pick sub or dub",
      body: "Every title lists the tracks it actually has. Choose per title, or per episode if your loyalty is inconsistent.",
    },
    {
      title: "Stream or download",
      body: "Play it in the browser, or take the file with you. Downloads carry the same resolution as playback — you never get handed a fallback.",
    },
    {
      title: "Press play",
      body: "No account screen. No email confirmation. No paywall arriving at episode seven with a card field attached.",
    },
  ],
} as const;

/* ------------------------------------------------------------- why free */

export const WHY_FREE = {
  eyebrowJp: "無料",
  eyebrowGloss: "the honest version",
  heading: "Free isn't a trial",
  lede: "Most free anime sites aren't free. They're funded by the sale of your attention, which is why they arrive with pop-unders, fake download buttons and three ad exchanges stacked on one page. Animus runs a single ad and stops there.",
  points: [
    {
      title: "No tiers, because there's no product to tier",
      body: "Premium exists to make the free tier feel limited. Nothing here is locked, so there is nothing to unlock.",
    },
    {
      title: "No account, because nothing is being sold to an account",
      body: "We can't email you, so there's no address of yours to sell, resell, or hand to a partner.",
    },
    {
      title: "One ad, and it's the entire business",
      body: "One impression is a fragile business model. It is also the only way the page stays readable and stays safe.",
    },
    {
      title: "This is a demo",
      body: "Animus is a portfolio project. Treat every title on this page as a mock, because that's what it is.",
    },
  ],
} as const;

/* ------------------------------------------------------------------- faq */

export const FAQ = {
  eyebrowJp: "よくある質問",
  eyebrowGloss: "questions",
  heading: "The things people actually ask",
  lede: "Including the one about the catch.",
  items: [
    {
      question: "Is Animus really free, or is there a catch?",
      answer: "No catch, and no trial either. There is no paid tier to upgrade to, because there is no paid tier. The single ad per page is the only revenue path in the design.",
    },
    {
      question: "Do I need to make an account?",
      answer: "No. No email, no username, no session cookie that outlives the tab. That is a deliberate constraint: an account is something you can lose, and there is nothing here worth storing.",
    },
    {
      question: "What quality do I get?",
      answer: "1080p as the baseline, 4K where the source allows it. Downloads carry the same resolution as playback, so a saved episode is never a quietly downscaled substitute.",
    },
    {
      question: "Can I watch dubbed anime?",
      answer: "Yes — English dubs alongside subs, switchable per episode. Older titles lean dub, newer ones lean sub, and each title page lists precisely which tracks exist for it.",
    },
    {
      question: "Why does the site say “demo only”?",
      answer: "Because it is one. The interface, catalog and download flow are real code in this repository. The content pipeline behind them is not shipped, and nothing here streams an actual broadcast.",
    },
    {
      question: "Why so few ads?",
      answer: "Because most free sites run four or more ad exchanges, and any one of them can serve malware, fake download buttons, or a crypto miner. Running a single ad is the fastest way to become the site people keep telling each other is safe.",
    },
  ],
} as const;

/* ------------------------------------------------------------ closing cta */

export const CLOSING_CTA = {
  eyebrowJp: "再生",
  eyebrowGloss: "playback",
  heading: "Press play. Create nothing.",
  lede: "Browse the library, pick sub or dub, and watch in Ultra HD. No account, no payment, one ad.",
  primaryCta: { label: "Browse the library", href: "#library" },
  secondaryCta: { label: "Read the FAQ", href: "#faq" },
} as const;

/* ----------------------------------------------------------------- chrome */

export const MASTHEAD_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Library", href: "#library" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
] as const;

export const FOOTER = {
  statement:
    "Animus is a demo project built as a design and front-end exercise. It streams and downloads nothing.",
  nav: [
    { label: "Features", href: "#features" },
    { label: "Library", href: "#library" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Why it's free", href: "#why-free" },
    { label: "FAQ", href: "#faq" },
  ],
  build: "Next.js · Tailwind CSS · shadcn/ui",
} as const;