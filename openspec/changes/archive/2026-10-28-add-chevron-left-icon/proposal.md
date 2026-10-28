# Proposal

## Why

The Figma Components file defines a left-pointing chevron
(`Icons / arrow left`, node `3355:32386`, 16×16), but the uikit icon font
has only `chevron-right` and `chevron-down`. UI that goes "back" or to the
"previous" item (pagination, steppers, back links) cannot use the shared
`Icon` component and would have to inline its own SVG.

## What Changes

- Add one icon to the uikit icon font, named **`chevron-left`**, exported
  from Figma node `3355:32386`.
- The name follows the glyph's shape, not the Figma layer name. The glyph
  is a chevron (no shaft), the mirror of the existing `chevron-right`. The
  library's existing `arrow-up` is a real arrow with a shaft, so calling
  this `arrow-left` would give `arrow-*` two different shapes.
- The same SVG goes in `svg/duckdice/` and `svg/tower/`, because the
  icon-font spec requires every theme folder to hold the same names. All
  10 existing icons are identical across both themes today. Tower-specific
  artwork can replace the file later without code changes.
- Regenerate the font. `IconName` gains `'chevron-left'`, and
  `ICON_CODEPOINTS` gains its codepoint.
- Out of scope: renaming or redrawing existing icons (e.g. the 32-unit
  IcoMoon `chevron-down.svg`), and adding other directions
  (`chevron-up`, `arrow-left`, …).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. `uikit-icon-font` already defines how an icon is added: the name
comes from the SVG filename, the same names are required in every theme,
and codepoints and the `IconName` type are shared. The set of icon names
is not specified per icon in any spec, so adding one changes no
requirement. The change sets `skip_specs: true`.

## Impact

- **Package:** `packages/uikit` only. It does not cross into
  `apps/wallet`. The wallet picks the icon up through uikit source like
  any other icon, and nothing in it uses the icon.
- **Files:** two new SVGs,
  `src/components/Icon/svg/{duckdice,tower}/chevron-left.svg`. Regenerated
  `src/components/Icon/__generated__/*` (both theme fonts and CSS, plus
  `rockethash.ts`).
- **API:** additive. `IconName` gains `'chevron-left'`. Codepoints are
  assigned by alphabetical index, so `chevron-right`, `exchange`, `face`,
  `safe` and `support` each move up by one. `Icon` renders through the
  `icon-<name>` class, and the font and CSS are regenerated together, so
  nothing visible changes. Only code that hard-codes a codepoint would
  break, and none exists (see design).
- **Docs:** the `Icons/Icon` gallery (`Icon.gallary.mdx`) lists icons from
  `ICON_CODEPOINTS`, so the new icon appears without edits.
