# Self-hosted fonts

Committed binaries, deliberately. `next/font/google` fetches from
`fonts.googleapis.com` and then `fonts.gstatic.com` on every build, and when
that request fails or is blocked, Turbopack reports it as a module-resolution
error pointing at `src/app/layout.tsx` — indistinguishable from a code fault.
Nothing in this repository caused it. Self-hosting removes the failure mode,
and makes builds offline-capable and CI-safe.

| File | Family | Weight | Upstream | Licence |
| --- | --- | --- | --- | --- |
| `shippori-mincho-400.woff2` | Shippori Mincho | 400 | `ofl/shipporimincho/ShipporiMincho-Regular.ttf` (8.3 MB) | SIL OFL 1.1 |
| `manrope-400.woff2` | Manrope | 400 | `ofl/manrope/Manrope[wght].ttf` (160 kB), instanced to 400 | SIL OFL 1.1 |
| `manrope-600.woff2` | Manrope | 600 | same variable font, instanced to 600 | SIL OFL 1.1 |

44 KB total instead of 16 MB upstream.

Both families are SIL Open Font License, which explicitly permits
redistribution, bundling and embedding in a repository. Shipping the
`ShipporiMincho-` prefix in the modified font name (as OFL requires) is done
by the subsetting tool.

## What "subset" means here

Every file is reduced to the characters this site actually renders — nothing
more. Two consequences worth knowing:

- **Shippori ships at 400 only.** Every heading sets `font-normal`
  explicitly, so a 700 face would be 19 KB of preloaded weight that nothing
  requests.
- **Latin is not the only coverage.** The eyebrow labels set Japanese terms —
  無登録, 無料, 機能, 使い方, ライブラリ, よくある質問, 再生 — so the Shippori
  subset carries those nineteen kana and kanji. The old Google-hosted setup
  got this by slicing the font into ~124 `unicode-range` files per weight; a
  subset just keeps the glyphs directly.

Note that `Manrope` has no CJK coverage at all. That is fine and intended:
the display face handles Japanese, the body face never does.

## Regenerating

If any string in `src/lib/content.ts` or the components gains a character
that is not in these files, it will fall back to a system font and look
wrong. When that happens, re-subset.

The script lives outside the repo (`%TEMP%\opencode\subset_fonts.py`) to keep
the build free of a Python dependency. It needs `fonttools` and `brotli`:

```sh
pip install fonttools brotli
python subset_fonts.py
```

It reads the upstream TTFs from the `google/fonts` repository, unions the
declared Unicode ranges with an explicit list of the Japanese glyphs used,
instances Manrope's variable axis to the two static weights, and writes
woff2 into this directory. Then re-run `npm run build`.

To check coverage without rebuilding anything:

```sh
python -c "from fontTools.ttLib import TTFont; print(TTFont('shippori-mincho-400.woff2').getBestCmap())"
```

Notes on glyph coverage:

- **The brand mark is not a glyph.** It was `◈` U+25C8, which exists in neither
  family and was silently rendering through a system fallback. It is now the
  eagle artwork in `src/assets/eagle.png`, applied as a CSS mask by
  `src/components/site/brand-mark.tsx`, so it no longer depends on font
  coverage at all and is not a candidate for this list.
- `·` U+00B7 and `•` U+2022 are present in both subsets. `·` is used in the
  catalogue meta lines.
