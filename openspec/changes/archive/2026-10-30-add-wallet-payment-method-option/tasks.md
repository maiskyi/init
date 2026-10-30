# Tasks

Unless stated otherwise, paths are relative to
`apps/wallet/src/_common/components/WalletPaymentMethodOption/`. No Storybook
task appears below: `apps/wallet` has no Storybook instance (only
`packages/uikit` does), and this change adds no uikit UI. No test task appears
either — the repo has no test runner and this change does not introduce one. The
full slug -> icon / label table this work implements is in design.md — D6.

## 1. Slug resolution

- [x] 1.1 Create `WalletPaymentMethodOption.const.ts` exporting two
  `SCREAMING_SNAKE_CASE` records keyed by the API slug —
  `PAYMENT_METHOD_ICONS_BY_NAME` (30 entries) and `PAYMENT_METHOD_LABELS` (45
  entries) — transcribed from design.md D6. Use named exports and inline type
  imports, matching the `WalletBalanceOption.const.ts` precedent. Verify by
  listing `packages/uikit/src/components/PaymentMethodIcon/duckdice/` and
  confirming every icon value in the record has a matching `.svg` file, and that
  none of `vietcombank`, `o_pay`, or `asia_commercial_bank` appears in the icon
  record at all.
- [x] 1.2 Confirm every slug in the mock data is covered by the label record.
  Verify by extracting the unique slugs from
  `apps/wallet/src/_services/api/constants/cashierInfoData.const.ts` and diffing
  that set against the record's keys — the diff must be empty in both
  directions.

## 2. Component markup

- [x] 2.1 Replace the `<div>WalletPaymentMethodOption</div>` stub in
  `WalletPaymentMethodOption.tsx` with the row structure from the spec: a
  fixed-size icon slot followed by the label. Keep props as
  `{ isActive, option }`, keep the named-export and inline-type-import style, and
  keep the existing combined `export { X, type XProps }` line that file already
  uses. Verify `pnpm -F @rockethash/wallet exec tsc -b` reports no new errors
  beyond the pre-existing baseline (~171 `TS2307` on `*.svg?react`, one
  `TS6133`).
- [x] 2.2 Render the icon via uikit's `PaymentMethodIcon` at `size={30}`, looked
  up through `PAYMENT_METHOD_ICONS_BY_NAME[option.name]`, rendering the wrapper
  span whether or not a name resolves. `noUncheckedIndexedAccess` types the index
  read as possibly `undefined`, so the absent branch is compiler-enforced. Verify
  by confirming in task 5.2 that a row for an unmapped slug keeps its label at
  the same horizontal position as a row with an icon.
- [x] 2.3 Render the label as `PAYMENT_METHOD_LABELS[option.name] ?? option.name`
  so an unknown slug from the live API degrades to the raw slug rather than an
  empty row. Verify by temporarily passing a slug absent from both records and
  confirming the row renders that slug beside a blank icon slot.
- [x] 2.4 Apply the `active` modifier class from `isActive` to the label, and set
  no colour on the label at all so it inherits the row's `currentColor`. Verify
  by grepping the component and its stylesheet for `color`, `--text-primary`,
  `--text-secondary`, `--text-accent-white`, and `--text-title` and confirming
  none of them is applied to the label.

## 3. Styling

- [x] 3.1 Create `WalletPaymentMethodOption.module.scss` with the row layout
  scoped under `[data-theme="duckdice"]` as its leading selector: flex row,
  `align-items: center`, `column-gap: var(--Details-Spacing-10)`, and a
  non-shrinking 30px square `inline-flex` icon slot. Hand-format it to match the
  surrounding stylesheets — Biome does not format SCSS and Prettier is not wired
  up in this repo (AGENTS.md §8). Verify the computed gap is 10px and the icon
  slot measures 30x30 in devtools on a rendered row.
- [x] 3.2 Add the label typography: 14px with a 20px line height, weight 400,
  `white-space: nowrap`, and no `color` declaration. Verify computed styles in
  devtools match those values on an inactive row.
- [x] 3.3 Add the `active` modifier setting `font-weight: 600` on the label, and
  nothing else. Verify the inactive label computes to weight 400 and the active
  label to 600, with both resolving the same `color` as their containing row.

## 4. Wiring

- [x] 4.1 Add `WalletPaymentMethodOption` and its props type to
  `apps/wallet/src/_common/components/index.ts` as separate
  `export type { ... }` / `export { ... }` statements, matching the
  `WalletBalanceOption` lines already there (AGENTS.md §5). Verify the component
  is importable as `import { WalletPaymentMethodOption } from '@common/components'`
  and that `tsc -b` accepts it.
- [x] 4.2 In `WalletDepositCrypto.tsx`, change the payment method `Form.Select`'s
  `getOptionLabel` from `({ option }) => option.name` to render
  `<WalletPaymentMethodOption {...params} />`, leaving `getOptionValue` on
  `option.name` so the form value and `defaultPaymentMethod` lookup keep working.
  Verify the selected method still round-trips: the picker opens with
  `paymentMethodOptions[0]` marked active and selecting another row updates the
  closed picker.

## 5. Gates and visual verification

- [x] 5.1 Run `pnpm biome check --write` from the repo root and verify it exits
  clean — this applies the enforced import ordering and the sorted JSX attribute,
  object key, and interface member assists. Note the two records in task 1.1 will
  be re-sorted alphabetically by the `useSortedKeys` assist; that is expected.
- [x] 5.2 Run `pnpm -F @rockethash/wallet dev`, open the deposit-crypto screen's
  "Payment method" picker, and check it against the Figma frame (`Wallet`, node
  `8011:11935`): 30px icons, 10px gap, 14px/20px labels, the selected row's label
  semibold and white, unselected rows regular weight. Confirm `coins` shows the
  QR mark labelled "Wallet Address", `metamask` and `wallet-connect` show their
  own marks, and no row displays a raw slug. Verify no console errors.
- [x] 5.3 Hover an unselected row and verify its label follows the row to white,
  returning to the default colour on leave — i.e. the inherited `currentColor`
  approach from design.md D1 holds.
- [x] 5.4 Close the picker and inspect the selected value inside `SelectInput`.
  Measure whether the 30px icon fits the 44px toggle (34px content box) or clips.
  Report the result; do **not** restyle `SelectInput` as part of this change — if
  it needs work, that is a separate change.
- [x] 5.5 Run `pnpm -F @rockethash/wallet exec tsc -b` and verify the error set is
  unchanged from the pre-existing baseline, with nothing new attributable to this
  change. Record the before/after counts rather than asserting "no errors", since
  the baseline is non-empty.
