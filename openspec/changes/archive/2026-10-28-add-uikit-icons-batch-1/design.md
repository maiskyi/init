# Design

## Context

See proposal.md for the icons and names. The pipeline is already in place: `pnpm gen:icons` (`packages/uikit/scripts/genIcons.ts`) reads `src/components/Icon/svg/<theme>/*.svg` for each theme in `icons.config.ts` (`duckdice`, `tower`), checks that every theme has the same names, and runs fantasticon once per theme with `normalize: true`. Codepoints are assigned by `genIcons.ts`, not by fantasticon: the sorted icon names get `0xf101 + index`.

What the Figma exports look like (checked during exploration):

- Each icon is a 16×16 symbol containing a single **filled** path (`fill-rule="evenodd"` on two of them). There are no strokes, so no outlining is needed for a font glyph.
- A plain SVG export of the node also contains **two background `<rect>`s**: a 16×16 `#484848` square and the 1280×874 page background, under several `<g>` wrappers. `Icons / Safe` also has a `clipPath` and a hidden layer, which the export leaves out.
- The existing SVGs are IcoMoon exports on a **32×32** viewBox. The new ones are **16×16**.

## Goals / Non-Goals

**Goals:**
- Four font-safe SVGs per theme that render each glyph with the same padding it has in Figma.
- Regenerated fonts, CSS, and `IconName`, with no change to the generator, the config, or `Icon`.

**Non-Goals:**
- Different tower artwork (same SVGs in both themes, see proposal).
- Changing how codepoints are assigned or making them stable across generations.
- Re-exporting the existing 32×32 icons on a 16×16 grid.

## Decisions

**1. Keep only the glyph path; strip everything else.**
Each committed SVG is a minimal `<svg viewBox="0 0 16 16" xmlns=...>` with the one `<path d=...>` copied from Figma (keeping `fill-rule`/`clip-rule` where present). The background rects, `<g>` wrappers, `id`s, `clipPath`/`defs`, and hard-coded `fill="#ADBFCE"` are dropped.
- *Why:* svgicons2svgfont merges every filled shape into the glyph, so a leftover background rect turns the icon into a solid square. Color comes from CSS (`currentColor`), so a fill value in the file is meaningless at best.
- *Alternative:* the per-vector `svgAssets` export from Figma, which already leaves out the page rects. It is fine as a source, but its viewBox is cropped to the vector's bounds, so the 16×16 padding is lost (the chevron would be scaled to fill the whole box). Copy the path into a 16×16 viewBox either way.

**2. Keep the 16×16 viewBox; don't rescale to 32×32.**
`normalize: true` scales glyphs to a common height. The new icons only need to look right next to the existing ones at the same font size, and both grids are square with the shape sitting inside the frame.
- *Alternative:* multiply the path coordinates by 2 so they match the IcoMoon 32×32 files. That adds a transform step and makes the files differ from Figma, with no visual difference if normalize scales by viewBox.
- *Verification, not assumption:* after generating, check in the Storybook gallery that `chevron-right` (whose shape is only ~6×12 inside the 16 box) keeps its padding and isn't blown up to full height next to `chevron-down`. If it is, normalize is scaling by the shape's bounds rather than the viewBox. The fix then belongs in the generator config (e.g. `normalize: false` with a fixed `fontHeight`), which would change all icons. Stop and raise it rather than working around it per icon.

**3. Accept the codepoint shift.**
Sorted names become `arrow-up, check-circle, chevron-down, chevron-right, exchange, safe`, so `check-circle` moves from `0xf101` to `0xf102` and `chevron-down` from `0xf102` to `0xf103`. The `.icon-<name>` classes, the fonts, and `ICON_CODEPOINTS` are all rewritten in the same generation run and shipped together, so consumers who use `Icon`/class names notice nothing.
- *Alternative:* add new names at the end to keep existing codepoints. That needs a codepoint map stored in the repo and a change to `genIcons.ts`. It isn't worth doing until a consumer depends on raw codepoints.

## Risks / Trade-offs

- [Leftover background rect in an SVG → glyph renders as a filled square] → Each committed file contains exactly one `<path>` and no `<rect>`. Check this by eye in the gallery for both themes.
- [normalize scales by shape bounds, so the chevron is over-scaled] → Check in the gallery as described in Decision 2. If it fails, stop and raise a generator-level change.
- [Codepoint shift with cached, mismatched font/CSS versions] → Only possible with stale caches across deploys. Font and CSS are bundled together, so this is low risk.
- No lint, test, or Prettier step checks any of this (AGENTS.md §8): SVGs aren't checked by Biome, and there is no test runner. Checking is manual: `pnpm gen:icons`, `tsc -b`/build, and the Storybook gallery.
