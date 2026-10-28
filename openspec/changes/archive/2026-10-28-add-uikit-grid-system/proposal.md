# Proposal

## Why

`@rockethash/uikit` has a `Grid` / `Grid.Cell` skeleton (`packages/uikit/src/components/Grid/`) that renders plain `div`s with an empty `Grid.module.scss`, so there is no way to lay out responsive pages with the library. A 12-column, Flexbox grid in the spirit of Bootstrap, driven by the breakpoints and base spacing already declared in `src/assets/scss/variables.scss`, gives consumers one consistent layout primitive.

## What Changes

- `Grid` becomes a 12-column Flexbox container (wrapping row) with spacing props:
  - `spacing` — a non-negative multiplier of the theme's base spacing (`spacing: 4px` in the `$duckdice` map), applied to both the gap between columns and the gap between rows.
  - `colSpacing` / `rowSpacing` — the same multiplier for one axis only; each overrides `spacing` for its axis.
- `Grid.Cell` gets a column span per breakpoint, as flat props:
  - `span` — base span applied at every width (mobile-first default).
  - one prop per breakpoint token from the SCSS `breakpoints` map (`xss`, `xs`, `sm_max`, `sm`, `md_max`, `md`, `ld`, `ld_max`, `ld_xl`, `ld_xxl`, `ld_xxxl`), applied at `min-width: <token value>` and cascading upward, ordered by pixel value.
  - each value is an integer `1`–`12` or `'hidden'`, which hides the cell from that breakpoint upward until a larger breakpoint sets a span again.
- Grid styles are written once and generated per theme from the theme's variables map, so each theme uses its own base spacing and breakpoints. Only `duckdice` has a variables map today, so only `duckdice` gets grid styles in this change; adding a `tower` map later should be the only step needed to support it.
- Fixes in the existing skeleton: `GridCell` uses the `grid` class instead of a cell class, and both components default their polymorphic type parameter to `Fragment` while rendering `'div'` at runtime.
- Adds a reusable mobile-first breakpoint mixin to `src/assets/scss/mixins.scss` (currently empty).
- Adds a Storybook story for `Grid`.

Not in scope: per-breakpoint spacing, `'auto'`/content-sized cells, offsets, column ordering, nested-grid helpers, a `tower` variables map, and automated tests (none exist in the repo; stories remain the manual QA surface).

## Capabilities

### New Capabilities
- `uikit-grid`: the uikit responsive grid layout — the 12-column `Grid` container, `Grid.Cell` per-breakpoint spans and hiding, and theme-derived spacing.

### Modified Capabilities
<!-- none: the themeCssSplit build behavior (uikit-theme-stylesheets) is unchanged; Grid styles follow its existing rule of a leading [data-theme] selector. -->

## Impact

- **Package**: `packages/uikit` only. Does not touch `apps/wallet` and does not cross the wallet ↔ uikit boundary (they remain unwired).
- **Files** (following the `<Name>.<kind>.<ext>` scheme from AGENTS.md):
  - `components/Grid/Grid.tsx`, `Grid.types.ts` (new), `Grid.module.scss`, `Grid.stories.tsx` (new), `index.ts`
  - `components/Grid/GridCell/GridCell.tsx`, `GridCell.types.ts` (new), `index.ts`
  - `assets/scss/variables.scss` (add a `$themes` map), `assets/scss/mixins.scss`
- **Public API**: `Grid` gains `spacing`, `colSpacing`, `rowSpacing`; `Grid.Cell` / `GridCell` gain `span` and the 11 breakpoint props. New exported types for spans and spacing. Additive only; the components have no current consumers.
- **Build**: Grid CSS lands in `dist/themes/duckdice.css` via the existing `themeCssSplit` plugin; no plugin change.
- **Duplication noted, not fixed**: breakpoint values remain declared both in `variables.scss` and `constants/breakpoints.const.ts`.
