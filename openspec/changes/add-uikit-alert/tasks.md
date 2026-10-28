# Tasks

## 1. Icons

- [x] 1.1 Export `Icons / ok` (Figma node `3430:10043`) and compare it with `packages/uikit/src/components/Icon/svg/duckdice/check-circle.svg`; record the result here. If the glyphs differ, add `ok` to the icon list in 1.2 and update the `success` mapping in `specs/uikit-alert/spec.md` and design.md before continuing
  - Result: same glyph. `Icons / ok` (16-unit) matches `check-circle.svg` (32-unit) point for point at 2x scale; `success` keeps `check-circle`, no spec change.
- [x] 1.2 Export `Icons / alert` (`3430:10035`), `Icons / cancel` (`3430:10052`), `Icons / Face` (`3430:10119`) and `Icons / Support` (`5481:37778`) from Figma as 16×16 single-color SVGs and save them as `alert.svg`, `cancel.svg`, `face.svg`, `support.svg` in `src/components/Icon/svg/duckdice/`; verify each file opens and uses one fill/path set like the existing SVGs
- [x] 1.3 Copy the same four SVGs into `src/components/Icon/svg/tower/` as placeholders; verify `ls svg/duckdice` and `ls svg/tower` list identical names
- [x] 1.4 Run `pnpm gen:icons` in `packages/uikit`; verify it succeeds and `__generated__/rockethash.ts` now includes `alert | cancel | face | support` in `IconName` with codepoints for each, and the Icon gallery story shows the new glyphs under both themes

## 2. Alert component

- [x] 2.1 Create `src/components/Alert/Alert.types.ts` with `AlertVariant = 'warning' | 'success' | 'error' | 'default' | 'info'`; verify with `tsc -b`
- [x] 2.2 Create `Alert.const.ts` with `ALERT_DEFAULT_ICONS: Record<AlertVariant, IconName>` (`warning→alert`, `success→check-circle`, `error→cancel`, `default→face`, `info→support`); verify `tsc -b` errors if a variant is missing
- [x] 2.3 Create `Alert.tsx`: `AlertProps` (`children`, `className?`, `icon?: IconName`, `onClick?`, `variant?` defaulting to `'default'`); render `<button type="button">` with `handleOnClick` when `onClick` is set, else `<div>`; leading `Icon` (`icon ?? ALERT_DEFAULT_ICONS[variant]`), message, and trailing `chevron-right` `Icon` only when clickable; classes via `cn(styles.alert, styles[variant], { [styles.clickable]: !!onClick }, className)`; verify `tsc -b` passes and props are alphabetically sorted after `pnpm biome check --write`
- [x] 2.4 Create `Alert.module.scss` scoped with `@each $theme, $config in vars.$themes { [data-theme="#{$theme}"] { ... } }`: 12px padding, radius `--Details-Radius-rounded-6`, 14/20 text, 10px icon gap, 20px-tall icon box, 8px chevron gap, per-variant `panel-bg-*-10` background, text/icon accent colors, inset 1px box-shadow border for `warning|success|error` only, button reset for the clickable root, `panel-bg-*-20` hover with 0.3s transition, `:focus-visible` outline, chevron in `--icon-primary`; verify `vite build` in `packages/uikit` succeeds (themeCssSplit accepts the selectors) and `dist/themes/duckdice.css` contains the alert rules
- [x] 2.5 Create `Alert/index.ts` exporting `AlertProps` (type), `Alert`, and `AlertVariant` (type) as separate `export type {}`/`export {}` statements; verify `tsc -b`
- [x] 2.6 Add `Alert.stories.tsx` (`title: 'Feedback/Alert'`, args `children`, `variant: 'default'`, no `onClick` by default) with stories: `Default`, one per variant, `CustomIcon` (`icon="safe"`), `Clickable` (`onClick: fn()`), and `AllVariants` rendering every variant static and clickable side by side; verify in `pnpm dev` (Storybook) under the duckdice theme that each matches Figma frame `3430:10040`, that static alerts don't react to hover or Tab, and that clickable ones show the chevron, hover background, focus outline, and fire `onClick` in the Actions panel on click and on Enter/Space

## 3. Public exports

- [x] 3.1 In `src/index.ts`, add `export { Alert, type AlertProps, type AlertVariant } from './components/Alert';` and change the Icon line to `export { Icon, type IconName, type IconProps } from './components/Icon';` (keep alphabetical order); verify `pnpm biome check` reports no changes needed and `tsc -b` passes

## 4. Integration checks

- [x] 4.1 Run `pnpm build` in `packages/uikit` (`tsc -b && vite build && storybook build`); verify it succeeds
- [x] 4.2 Run `pnpm biome check` at the repo root; verify no errors in the new or changed files
- [x] 4.3 In Storybook, switch the theme to Tower and confirm the new icons render (placeholder duckdice glyphs) without console errors

## Workflow follow-up

- Archive the change with `/opsx:archive` after review.
- Optionally, in a separate change, update AGENTS.md §5, which still says the root barrel only exports Button, Select and ThemeProvider.
