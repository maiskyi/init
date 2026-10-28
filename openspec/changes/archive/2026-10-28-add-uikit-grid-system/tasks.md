# Tasks

All paths are relative to `packages/uikit/src/`. `assets/scss/variables.scss` and `assets/scss/mixins.scss` have uncommitted work in progress (spacing entry, mixins file moved); build on it, do not overwrite it.

## 1. SCSS foundations

- [x] 1.1 Add `$themes: (duckdice: $duckdice);` to `assets/scss/variables.scss` below the existing map; verify with `pnpm --filter @rockethash/uikit exec sass --load-path=. src/assets/scss/variables.scss` (or an equivalent one-off compile) that it compiles without errors
- [x] 1.2 In `assets/scss/mixins.scss`, add a `sort-by-value($map)` function returning breakpoint keys in ascending pixel order and a `breakpoint-up($name, $breakpoints)` mixin emitting `@media (min-width: …)`; verify via a scratch compile that sorting the duckdice map yields `xss, xs, sm_max, sm, md_max, md, ld, ld_max, ld_xl, ld_xxl, ld_xxxl`

## 2. Grid container

- [x] 2.1 Add `Grid/Grid.types.ts` exporting `GridSpacing` (number); extend `GridProps` with `spacing`, `colSpacing`, `rowSpacing` and change the call-signature default to `C extends PolymorphicElement = 'div'`; verify `tsc -b` passes in `packages/uikit`
- [x] 2.2 In `Grid.tsx`, set inline `--grid-col-spacing` (`colSpacing ?? spacing ?? 0`) and `--grid-row-spacing` (`rowSpacing ?? spacing ?? 0`), merged before the consumer `style`; verify in Storybook devtools that a `Grid` with no spacing props still has both variables set to `0`
- [x] 2.3 Write the `.grid` rules in `Grid.module.scss` inside `@each $theme, $config in vars.$themes { [data-theme='#{$theme}'] { … } }`: flex + wrap, `--grid-col-gap`/`--grid-row-gap` computed from the multipliers × `map.get($config, spacing)`, `column-gap`/`row-gap`; verify in Storybook (duckdice) that `spacing={2}` gives 8px gaps both ways and `colSpacing={4} rowSpacing={1}` gives 16px / 4px

## 3. Grid.Cell spans

- [x] 3.1 Add `GridCell/GridCell.types.ts` (`GridCellSpan = 1…12 | 'hidden'`, `GridCellBreakpointProps = Partial<Record<BreakpointToken, GridCellSpan>>`) and `GridCell/GridCell.const.ts` (`GRID_CELL_BREAKPOINTS`, tokens in ascending width order); extend `GridCellProps` with `span` and the breakpoint props, fix the default `C` to `'div'`; verify `tsc -b` passes
- [x] 3.2 In `Grid.module.scss`, add `.cell` (default 12-column width, `min-width: 0`) and the gap-aware width rule from design §1, then generate `.span-1…12`/`.span-hidden` and, per breakpoint from `sort-by-value`, `.<token>-1…12`/`.<token>-hidden` inside `breakpoint-up`; numeric classes set `display: block`, hidden ones `display: none`; verify the compiled Storybook CSS lists the media blocks in ascending width order
- [x] 3.3 In `GridCell.tsx`, replace `styles.grid` with `styles.cell` and add span/breakpoint classes via `cn(…)`, keeping `className` last and stripping breakpoint props from what is spread onto the element; verify in the DOM that `<Grid.Cell span={6} md="hidden" />` has `cell span-6 md-hidden` (hashed) classes and no `md` attribute

## 4. Exports and Storybook

- [x] 4.1 Update `Grid/index.ts` and `GridCell/index.ts` with the new types (separate `export type {}` / `export {}` statements), and add `GridCell` plus the new types to the root `src/index.ts` in its existing style; verify `tsc -b` passes and `import { Grid, GridCell, type GridCellSpan } from '@rockethash/uikit'` type-checks from a scratch file
- [x] 4.2 Add `Grid/Grid.stories.tsx` (title under the existing Storybook hierarchy, alphabetically sorted `args`) with stories: Default (12 × `span={1}`), Responsive spans (`span={12} sm={6} md={4} ld={3}`), Hidden per breakpoint, Spacing (controls for `spacing`/`colSpacing`/`rowSpacing`), Nested grid; note in the docs that cells are block boxes and that `tower` has no grid styles yet; verify each spec scenario in `specs/uikit-grid/spec.md` by resizing the Storybook viewport across the relevant breakpoints

## 5. Integration checks

- [x] 5.1 Run `pnpm biome check --write` and `pnpm --filter @rockethash/uikit build`; verify both succeed, `dist/themes/duckdice.css` contains the `.grid`/`.cell`/span rules with no `data-theme` string, and no grid rules appear in any other theme file
