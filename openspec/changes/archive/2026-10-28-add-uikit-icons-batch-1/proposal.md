# Proposal

## Why

The uikit icon font ships only `check-circle` and `chevron-down`, but upcoming components and wallet screens need four more icons that already exist in the Figma Components library: arrow right, arrow up, Exchange, and Safe. They need to be in the font so consumers can render them with `<Icon name="..." />`.

## What Changes

- Add four icons to the uikit icon font, taken from the Figma file `cFBTCE662HYRChalLq4p3B` (Components):

  | Figma node    | Figma layer          | Icon name       |
  |---------------|----------------------|-----------------|
  | `1:886`       | Icons / arrow right  | `chevron-right` |
  | `8719:284062` | Icons / arrow up     | `arrow-up`      |
  | `1:39`        | Icons / Exchange     | `exchange`      |
  | `1:1211`      | Icons / Safe         | `safe`          |

- `Icons / arrow right` is named `chevron-right`, not `arrow-right`: it is drawn as a chevron, like the existing `chevron-down`. Keeping the `arrow-*` prefix for arrows with a stem (such as `arrow-up`) stops one prefix from meaning two shapes.
- The same SVG artwork goes into both theme folders, `svg/duckdice/` and `svg/tower/`, following the precedent of the existing two icons, which are identical in both themes. Tower can replace its copies with its own artwork later without changing names or codepoints.
- Regenerate `components/Icon/__generated__/` with `pnpm gen:icons`. `IconName` gains `arrow-up`, `chevron-right`, `exchange`, and `safe`. The Storybook icon gallery lists the new icons automatically from `ICON_CODEPOINTS`.
- No API or component changes. Existing icon names keep working. Their numeric codepoints shift, because codepoints are assigned in alphabetical order (see design.md). Nothing outside the generated files depends on the numbers.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. Every `uikit-icon-font` requirement describes how fonts are generated from the per-theme SVG folders (one config, the same names in every theme, theme-named families, shared codepoints, `data-theme` scoping). None of them lists which icons exist, and all of them still hold after this change. The change sets `skip_specs: true`.

## Impact

- **Package**: `packages/uikit` only. This does not cross into `apps/wallet`, which picks the new names up through uikit source the next time it builds.
- **Files**:
  - New: `src/components/Icon/svg/duckdice/{arrow-up,chevron-right,exchange,safe}.svg`
  - New: `src/components/Icon/svg/tower/{arrow-up,chevron-right,exchange,safe}.svg`
  - Regenerated: `src/components/Icon/__generated__/*` (fonts, per-theme CSS, `rockethash.ts`)
- **Dependencies**: none added.
