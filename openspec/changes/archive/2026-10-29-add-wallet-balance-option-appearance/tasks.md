# Tasks

All paths are relative to `apps/wallet/src/_common/components/WalletBalanceOption/`
unless stated otherwise. No Storybook task appears below: `apps/wallet` has no
Storybook instance (only `packages/uikit` does), and this change adds no uikit UI.
No test task appears either — the repo has no test runner and this change does not
introduce one.

## 1. Icon resolution

- [x] 1.1 Create `WalletBalanceOption.const.ts` exporting a symbol-to-icon alias
  record (`SHIB` -> `SHIBA`, `ENA` -> `Ethena`, `TRUMP` -> `Trump`). Use named
  exports and `SCREAMING_SNAKE_CASE` constant names, matching the
  `CryptoIcon.const.ts` precedent. No membership set is exported: `CRYPTO_ICONS`
  is not exported from any uikit barrel, so testing membership would mean copying
  uikit's 57-name union into the wallet where it would drift. Verify by importing
  it in `WalletBalanceOption.tsx` in task 2.2 and confirming `tsc -b` reports no
  error on the lookup's types.
- [x] 1.2 Resolve a currency symbol to a `CryptoIconName` by applying the alias
  record first and falling back to the symbol itself, letting `CryptoIcon` return
  `null` for a symbol with no icon. Verify by checking, in the running app (task
  5.1), that `BTC`, `SHIB`, `ENA`, `TRUMP`, and `DECOY` each render as described
  in tasks 2.2 and 5.2.

## 2. Component markup

- [x] 2.1 Replace the `<div>{name}</div>` stub in `WalletBalanceOption.tsx` with
  the row structure from the spec: icon slot, a leading group holding symbol then
  currency name, and a trailing block holding the balance above the fiat line.
  Keep props as `{ isActive, option }` and keep the named-export,
  inline-type-import style. Verify `tsc -b` in `apps/wallet` reports no new errors
  beyond the ~171 pre-existing `TS2307` `*.svg?react` errors and the one `TS6133`.
- [x] 2.2 Render the icon via uikit's `CryptoIcon` at `size={20}` using the
  resolver from task 1.2, falling back to an empty 20px element when the resolver
  returns `undefined`. Verify by confirming in task 5.2 that a currency with no
  icon keeps its symbol at the same horizontal position as one with an icon.
- [x] 2.3 Render `0.00` as the balance amount and `$0.00` as the fiat line as
  literal placeholders, reading no balance from `option` or anywhere else. Verify
  by confirming every row in the open picker shows the same two values.
- [x] 2.4 Apply the `active` modifier class from `isActive` to the symbol only, and
  set no colour on the symbol or balance amount so both inherit the row's
  `currentColor`. Verify by grepping the component and its stylesheet for
  `--text-primary` / `--text-accent-white` / `--text-title` and confirming none of
  them is applied to the symbol or amount.
- [x] 2.5 Re-export `WalletBalanceOptionProps` from `index.ts` alongside the
  component, as separate `export type { ... }` / `export { ... }` statements per
  AGENTS.md section 5. Verify the type is importable from
  `@common/components/WalletBalanceOption` and that `tsc -b` accepts it.

## 3. Styling

- [x] 3.1 Fill in `WalletBalanceOption.module.scss` with the row layout scoped
  under `[data-theme="duckdice"]` as its leading selector: flex row, full width,
  `var(--Details-Spacing-8)` gap, leading group flexing to absorb spare width with
  `min-width: 0`, trailing block right-aligned in a column with no gap. Verify by
  confirming in task 5.2 that the balance sits flush to the row's trailing edge.
- [x] 3.2 Add the typography rules: symbol 14px/20px, currency name 12px/16px in
  `var(--text-secondary)` with `var(--Details-Spacing-6)` separating them; balance
  amount 14px/20px at weight 600; fiat line 12px/16px in `var(--text-secondary)`.
  Verify computed styles in devtools match those values on a rendered row.
- [x] 3.3 Add the `active` modifier setting `font-weight: 600` on the symbol, and
  nothing else. Verify the inactive symbol computes to weight 400 and the active
  symbol to 600, while the balance amount computes to 600 in both.
- [x] 3.4 Add ellipsis truncation to the currency name. Requires the dropdown
  panel to have a definite width, so it depends on group 6. Verify by temporarily
  rendering a currency with a long name and confirming the name truncates while
  the balance stays at the trailing edge.

## 4. Formatting and type gates

- [x] 4.1 Run `pnpm biome check --write` from the repo root and verify it exits
  clean — this applies the enforced import ordering and the sorted JSX attribute,
  object key, and interface member assists. Note that SCSS is not formatted by
  Biome, so `WalletBalanceOption.module.scss` must be hand-formatted to match the
  surrounding stylesheets.
- [x] 4.2 Run `pnpm -F @rockethash/wallet exec tsc -b` and verify the error set is
  unchanged from the pre-existing baseline (~171 `TS2307` on `*.svg?react`, one
  `TS6133`) with nothing new attributable to this change.

## 5. Visual verification

- [x] 5.1 Run `pnpm -F @rockethash/wallet dev` and open the deposit-crypto screen's
  "Your balance" picker. Verify it starts and the picker opens without console
  errors.
- [x] 5.2 Check the open picker against the Figma frame (`Components`, node
  `4163:18003`): inactive rows show a regular-weight symbol in the row's primary
  colour with a muted name, a bold balance and a muted fiat line; the selected row
  shows a bold symbol on the translucent light background. Confirm `BTC` and `ETH`
  show icons and `SHIB`, `ENA`, and `TRUMP` show their aliased icons. `DECOY` is
  filtered out of this picker by `WalletDataProvider` (`!isInternal`), so the
  blank-slot path is confirmed structurally instead: the icon wrapper is a fixed
  20x20 span regardless of whether `CryptoIcon` renders an svg.
- [x] 5.3 Hover an unselected row and verify the symbol and balance amount follow
  the row to white while the name and fiat line stay muted — i.e. the inherited
  `currentColor` approach holds.
- [x] 5.4 Close the picker and inspect the selected value inside `SelectInput`.
  Record what the two-line trailing block does to the fixed 44px toggle (clipping,
  stretching, or fitting) and report it. Do not restyle `SelectInput` as part of
  this change — if it needs work, that is a separate change.
- [x] 5.5 Measure the rendered row height. Result: **44px**, matching Figma
  exactly. The anticipated deviation does not exist — the picker's rows are styled
  by `Dropdown.module.scss` (`.menu__item-content { padding: 0 12px }`), not by
  `Menu.module.scss` (`padding: 12px`), so no uikit change is needed or made.

## 6. Dropdown panel width (packages/uikit)

Added after group 3 revealed that the currency name could not truncate: the
dropdown panel was shrink-to-fit, so a long name widened the panel and pushed the
balance out of the row instead of ellipsising.

- [x] 6.1 In `DropdownContentDefault.tsx`, set `maxWidth` alongside the existing
  `minWidth` on the panel's inline style when `matchToggleWidth` is set, pinning
  the panel to the toggle's width. Verify `pnpm biome check` is clean and both
  `pnpm -F @rockethash/uikit exec tsc -b` and `pnpm -F @rockethash/wallet exec
  tsc -b` show no new errors against their pre-existing baselines.
- [x] 6.2 Verify in the running app that, with `matchToggleWidth` set, the panel
  width equals the toggle width and holds there when a row's content is
  deliberately made too wide. Measured: panel pinned at 460px = toggle width;
  with an overlong name the balance's right edge stays at 1064px and the name
  ellipsises, versus the panel growing 442 -> 599px before the fix.
