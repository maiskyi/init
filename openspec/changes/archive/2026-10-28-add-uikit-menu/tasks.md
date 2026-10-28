# Tasks

## 1. Component scaffolding and types

- [x] 1.1 Create `packages/uikit/src/components/Menu/` with `Menu.tsx`, `Menu.types.ts`, `Menu.module.scss`, `index.ts`, and `MenuItem/MenuItem.tsx` + `MenuItem/index.ts` (design §1); verify the files exist with `ls -R packages/uikit/src/components/Menu`
- [x] 1.2 In `Menu.types.ts`, define `MenuCompoundedComponent` (call signature for `MenuProps` plus `Item: typeof MenuItem`) and in `MenuItem.tsx` define `MenuItemProps<C>` via `PolymorphicProps` with `active`, `className`, `prefix`, `suffix`, `onClick`, plus the `MenuItemComponent` call-signature interface (design §2, §3); verify with `pnpm --filter @rockethash/uikit exec tsc -b`

## 2. Implementation

- [x] 2.1 Implement `MenuItem`: `li` wrapping the polymorphic element (default `'button'` with `type="button"`), `handleOnClick` calling `onClick` (default `noop`), `prefix`/`suffix` wrapped in slot spans only when provided, label in a flex-1 span, classes built with `cn(...)` and consumer `className` last (design §3, §5); verify `tsc -b` passes and `<MenuItem as="a" href="/x">` type-checks while `<MenuItem href="/x">` does not
- [x] 2.2 Implement `Menu`: `ul` with `cn(styles.menu, className)` rendering `children`, cast to `MenuCompoundedComponent`, then `Menu.Item = MenuItem` (design §2, §4); verify `tsc -b` passes
- [x] 2.3 Write `Menu.module.scss` scoped under `[data-theme="duckdice"]` at the top of the file: list reset + 4px gap; row 44px min-height, 12px padding, 8px gap, 6px radius, Open Sans 14/20, `--text-primary`, button/link reset; hover and `_active` using `--text-title` and `--surface-panels-panel-bg-light-10`; 16px icon wrappers inheriting `currentColor` (design §6); verify `pnpm --filter @rockethash/uikit exec vite build` succeeds and `dist/themes/duckdice.css` contains the `.menu` rules without the `data-theme` prefix

## 3. Exports

- [x] 3.1 Fill `Menu/index.ts` and `MenuItem/index.ts` with separate `export { ... }` / `export type { ... }` statements, and add `Menu`, `MenuProps`, `MenuItem`, `MenuItemProps` to `packages/uikit/src/index.ts` (design §7); verify by type-checking a scratch import `import { Menu, MenuItem } from './index'` with `tsc -b`, then removing it

## 4. Storybook

- [x] 4.1 Add `Menu.stories.tsx` (`title: 'Navigation/Menu'`) with a `Default` story reproducing the Figma Withdraw / Swap / Vault list (inline placeholder SVGs as `prefix`, `<Icon name="chevron-down" />` rotated −90° as `suffix`, `onClick: fn()`), plus `Active` and `AsLink` stories (design §8); verify in `pnpm --filter @rockethash/uikit storybook` that the stories render under the duckdice theme
- [x] 4.2 In Storybook, check every spec scenario in `specs/uikit-menu/spec.md` by hand: `ul`/`li` DOM, 44px rows 4px apart at 468px width, 12px/8px icon spacing, no empty icon spans, default/hover/active colours, click and Enter firing `onClick` in the Actions panel, `a` rows looking identical to button rows, custom `className` applied; compare the `Default` story with the Figma screenshot of node `10193:19470` and record any mismatches in the change
  - Result (checked with a Playwright script against Storybook, DuckDice theme): rows 468×44 at 4px spacing; left icon at 12px, label at 36px, right icon 12px from the edge; default `rgb(173,191,206)` on transparent; hover/active `rgb(255,255,255)` on `rgba(173,191,206,0.1)`; click and Enter each fire `onItemClick` once; `a` rows 44px, same font/colour, no underline; icon-less rows have no icon spans and label at 12px. `className` passthrough checked by code only (`cn(..., className)` last in both components), since Storybook did not apply a URL arg override.
  - Mismatch vs Figma: left icons are placeholders (withdraw/exchange/safe glyphs are not in the icon font), as planned in design §8. Layout, colours and typography match.
  - Found while verifying, not part of this change: `.storybook/preview.tsx` sets `defaultTheme: 'duckdice'`, but `withThemeByDataAttribute` expects a theme *name* (`'DuckDice'`), so with no toolbar selection every story renders with `data-theme="undefined"` and unstyled.

## 5. Final checks

- [x] 5.1 Run `pnpm biome check --write` at the repo root and confirm it reports no errors (import order, sorted keys/attributes/interface members)
- [x] 5.2 Run `pnpm --filter @rockethash/uikit build` (`tsc -b && vite build && storybook build`) and confirm it succeeds

## Workflow follow-up

- Confirm the hover/active colours against the library `Menu Item` component set variants (design Open Questions) during review.
- Possible follow-up changes: rebase `Dropdown.Menu`/`Dropdown.MenuItem` onto `Menu`; add withdraw/exchange/safe/chevron-right glyphs to the icon font for both themes; `tower` theme styles for `Menu`.
- Archive the change after review.
