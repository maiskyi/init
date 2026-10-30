# Tasks

Paths are relative to `packages/uikit/src/components/PaymentMethodIcon/` unless
stated otherwise. No Storybook task appears below: this change adds no UI and
leaves `PaymentMethodIcon.stories.tsx` working as-is (its `name: 'ADVANCED_CASH'`
arg is a published name and stays valid). No styling task appears — nothing
visual changes. No test task appears: the repo has no test runner and this change
does not introduce one.

This is a type-only change, so `tsc` is both the gate and the feature. Several
tasks below verify a **negative** — that a deliberately bad name now fails to
compile. Every such probe must be reverted before the task is marked complete.

## 1. The name type

- [x] 1.1 Replace the `keyof typeof PAYMENT_METHOD_ICONS` derivation in
  `PaymentMethodIcon.types.ts` with a hand-written union of the 53 published
  names from design.md D2, alphabetically ordered, and drop the now-unused import
  of `PAYMENT_METHOD_ICONS`. Match the formatting of `CryptoIcon.types.ts`
  (`export type X =` then one `  | 'NAME'` per line). Verify the union has
  exactly 53 members and that they diff clean against
  `ls duckdice/*.svg | xargs -n1 basename | sed 's/\.svg$//' | sort`.
- [x] 1.2 Confirm the type now constrains: temporarily assign a bad name
  (`const probe: PaymentMethodIconName = 'METAMSK';`) in a scratch file and
  verify `tsc` reports `TS2322`, then confirm a published name such as
  `'METAMASK'` compiles. Delete the scratch file before marking this complete —
  verify it is gone with `git status`.

## 2. The icon map

- [x] 2.1 In `PaymentMethodIcon.const.ts`, import the name type
  (`import { type PaymentMethodIconName } from './PaymentMethodIcon.types';`) as
  the first import, matching `CryptoIcon.const.ts:1`, and re-type the export as
  `Record<PaymentMethodIconName, typeof ADVANCED_CASH>`. Verify
  `pnpm -F @rockethash/uikit exec tsc -b` passes, which proves all 53 entries
  satisfy the union with none missing and none extra.
- [x] 2.2 Confirm the map is checked in both directions: temporarily delete one
  record entry and verify `tsc` fails with a missing-property error naming that
  key; restore it, then temporarily add an entry under a key not in the union and
  verify `tsc` fails with an excess-property error. Restore the file and verify
  `git diff` on it shows only the intended import and `Record<...>` changes.

## 3. The wallet consumer

- [x] 3.1 Verify the wallet's 30 hand-authored icon values now type-check
  against the union: run `pnpm -F @rockethash/wallet exec tsc -b` and confirm the
  error set is unchanged from the pre-existing baseline (~171 `TS2307` on
  `*.svg?react`), with no new error in `WalletPaymentMethodOption.const.ts`.
  Record the before/after counts rather than asserting "no errors", since the
  baseline is non-empty. A failure here means one of the 30 values is wrong and
  must be corrected against the asset list.
- [x] 3.2 Confirm the consumer is genuinely protected: temporarily change one
  value in `PAYMENT_METHOD_ICONS_BY_NAME` to a misspelling such as `'METAMSK'`
  and verify `tsc -b` in `apps/wallet` now reports an error on that line — the
  behaviour the archived change recorded as an open risk. Revert the value and
  verify `git diff` on the file is clean.
- [x] 3.3 Correct the stale comment in
  `apps/wallet/src/_common/components/WalletPaymentMethodOption/WalletPaymentMethodOption.const.ts`,
  which claims the icon set "exports it from no barrel" and that values "are not
  type-checked against the icon set". Replace that passage with what is now true:
  the values are checked against the exported union. Verify by re-reading the
  comment against the file's actual imports and types.

## 4. Gates

- [x] 4.1 Run `pnpm biome check --write` from the repo root and verify it exits
  clean, with no new warnings attributable to this change. Note that dropping the
  `PAYMENT_METHOD_ICONS` import from `.types.ts` in task 1.1 is what keeps
  `noUnusedImports` quiet there.
- [x] 4.2 Verify no runtime behaviour changed: run `pnpm -F @rockethash/wallet dev`,
  open the deposit-crypto screen's "Payment method" picker, and confirm the same
  six rows render with the same icons and labels as before, with no console
  errors. This is the spec's "typing the names changes no runtime behaviour"
  requirement.
