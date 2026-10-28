# Design

## Context

See proposal.md for the Why. Icons are SVGs in
`packages/uikit/src/components/Icon/svg/<theme>/`. `pnpm gen:icons`
(`scripts/genIcons.ts`) builds one `rockethash-<theme>` font per theme
from them. The script sorts the union of names alphabetically and assigns
codepoints from `0xf101` by index. `Icon` renders
`<span class="icon icon-<name>">`, and the generated CSS maps that class
to the codepoint.

The Figma node `3355:32386` ("Icons / arrow left") is a 16×16 symbol
holding one 6×12 vector, a chevron. The existing `chevron-right.svg` is a
filled, even-odd outline on a `0 0 16 16` viewBox, spanning x≈5–11 and
y≈2–14. So the Figma glyph is most likely its designed mirror.

## Goals / Non-Goals

**Goals:**
- The `chevron-left` glyph renders correctly in both theme fonts and
  looks like the mirror of `chevron-right` (same weight, size and
  position in the 16-unit box).

**Non-Goals:**
- Making codepoints stable across icon additions (see Risks).
- Normalizing other SVG sources, e.g. the 32-unit IcoMoon
  `chevron-down.svg`.

## Decisions

**Name it `chevron-left`, not `arrow-left`.** The library names icons by
shape. `arrow-up` has a shaft and the `chevron-*` icons don't. Following
the Figma layer name would make `arrow-*` mean two different shapes.
Alternative: mirror Figma names 1:1 for easier design handoff. Rejected
because consumers choose icons by name in code, and the Figma name is
easy to look up from the node id recorded here.

**Export from Figma, then outline before saving.** Icon fonts keep only
filled outlines. If the Figma vector is a stroke, it must be flattened
(Outline stroke + Flatten) before export, or the glyph comes out empty.
Save it with a `viewBox="0 0 16 16"`, a single `<path>` and no `fill`
colour, like the existing SVGs. Alternative: mirror `chevron-right.svg`
by transforming its path. Rejected as the default because Figma is the
source of truth. It is still a fallback if the export does not line up
with `chevron-right` (see Risks).

**Same file in both theme folders.** Copy the duckdice SVG to `tower/`
unchanged. This matches the precedent set by `add-uikit-alert` and all 10
existing icons.

**No spec delta (`skip_specs: true`).** `uikit-icon-font` already covers
everything this change relies on. No spec lists icons one by one.

## Risks / Trade-offs

- [Codepoint shift: inserting `chevron-left` moves the codepoints of
  `chevron-right`, `exchange`, `face`, `safe` and `support` up by one]
  → Harmless today. `Icon` uses the `icon-<name>` class, the font and CSS
  are regenerated together, and no source outside `__generated__/`
  references `ICON_CODEPOINTS` or a raw codepoint (only the gallery
  iterates its keys). It would matter only if a consumer cached an old
  font against new CSS, and no deployed consumer does that.
- [Stroke-based or offset export leaves the glyph empty, or out of line
  with `chevron-right`] → Compare the two side by side in the Icon
  gallery. If they differ, fall back to a horizontally mirrored copy of
  `chevron-right.svg`'s path and note that in the commit.
- [Tower may get its own artwork later] → Replace
  `svg/tower/chevron-left.svg` and regenerate. No code or API change.
- Verification relies on `pnpm gen:icons`, `tsc -b`, `vite build`,
  `pnpm biome check` and a manual Storybook check. No ESLint, Prettier,
  turbo `lint`/`test` or automated tests exist in this repo, so none of
  them are relied on.
