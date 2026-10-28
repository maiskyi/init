# Proposal

## Why

The uikit has no way to draw a separator line. Today a consumer has to hand-roll a border in their own styles and pick a color token, so the thickness and color drift between uses. The design system defines a divider: 1px or 2px thick, horizontal or vertical, in the `Borders Border Grey` color. The uikit should provide it as a component.

Separately, the root barrel `packages/uikit/src/index.ts` is supposed to export every component, but it is missing `OutsideClickHandler`, even though that component's own folder barrel already exports it.

## What Changes

- Add a polymorphic `Divider` component to `packages/uikit` (`src/components/Divider/`). It follows the existing `Card` pattern: an `as` prop through `PolymorphicProps`, with the generic defaulting to `'div'` as `Grid` does.
  - `orientation`: `'horizontal' | 'vertical'`, default `'horizontal'`.
  - `thickness`: `1 | 2` (pixels), default `1`.
  - Color: the semantic token `--borders-border-gray` ("Borders Border Grey" in the design).
  - Exposes `role="separator"`, and adds `aria-orientation="vertical"` when vertical.
  - No built-in margins; consumers own the spacing around it.
- Add `Divider/index.ts` exporting `Divider`, `DividerProps`, `DividerOrientation` and `DividerThickness`.
- Add a `Layout/Divider` Storybook story.
- Make the root barrel `src/index.ts` export every component folder: add `Divider` and the missing `OutsideClickHandler` (with their props types).

## Capabilities

### New Capabilities

- `uikit-divider`: the uikit `Divider` separator component, covering orientation, thickness, color, polymorphic rendering, separator semantics and its public exports.

### Modified Capabilities

None. The root-barrel addition of `OutsideClickHandler` is an export-surface fix with no existing spec that covers it, so it is captured in the tasks rather than as a requirement change.

## Impact

- **Packages:** `packages/uikit` only. This does not cross the `apps/wallet` <-> `packages/uikit` boundary; wallet still does not depend on uikit.
- **New files:** `packages/uikit/src/components/Divider/` with `Divider.tsx`, `Divider.types.ts`, `Divider.module.scss`, `Divider.stories.tsx` and `index.ts`.
- **Modified files:** `packages/uikit/src/index.ts`, which gains the `Divider` and `OutsideClickHandler` exports. Both are additive and non-breaking.
- **Build output:** the divider rules appear in `dist/themes/<theme>.css` through the existing `themeCssSplit` build.
- **Out of scope:** updating AGENTS.md §5 and §9, which are out of date (the root barrel is no longer partial and component barrels are no longer empty). That is left for a separate docs change.
