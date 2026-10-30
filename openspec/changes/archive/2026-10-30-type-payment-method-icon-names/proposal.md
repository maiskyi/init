# Proposal

## Why

`PaymentMethodIconName` exists, is exported from both the folder barrel and the
uikit root barrel, and is already imported by `apps/wallet` — and it constrains
nothing. It is defined as `keyof typeof PAYMENT_METHOD_ICONS`, and
`PAYMENT_METHOD_ICONS` is typed `Record<string, …>`, so the whole chain collapses
to `string`. A type probe confirms it: `const a: PaymentMethodIconName =
'COMPLETE_NONSENSE'` compiles, while the same assignment to `CryptoIconName`
is rejected.

The naming and the export paths were brought into line with
`CryptoIconName`/`FiatIconName` in `fca3b1b`, but the derivation was not. The
siblings hand-write a union and type their record against it; `PaymentMethodIcon`
derives its union *from* an untyped record, which is circular in effect — the
record is checked against a type that is computed from the record.

The consumer is already waiting. `apps/wallet` declares
`PAYMENT_METHOD_ICONS_BY_NAME: Record<string, PaymentMethodIconName>`, a
hand-authored map of 30 payment method slugs to icon names. Those 30 values are
exactly the thing a real union would police. Today a typo such as `'METAMSK'`
compiles and renders a blank icon slot that is indistinguishable from a
deliberately-unmapped method — a failure mode recorded as an open risk in the
archived `add-wallet-payment-method-option` change.

## What Changes

- Hand-write `PaymentMethodIconName` in `PaymentMethodIcon.types.ts` as a union
  of the 53 published icon names, replacing the `keyof typeof` derivation.
- Type `PAYMENT_METHOD_ICONS` as
  `Record<PaymentMethodIconName, typeof ADVANCED_CASH>` in
  `PaymentMethodIcon.const.ts`, so the dependency runs types -> const as it does
  in `CryptoIcon.const.ts` and `FiatIcon.const.ts`. The compiler then enforces
  both directions: every name in the union must have an entry, and no entry may
  exist that is not in the union.
- Correct the now-false comment in the wallet's
  `WalletPaymentMethodOption.const.ts`, which still claims the icon set "exports
  it from no barrel, so a membership type would mean copying its 53 names into
  the wallet". Both halves stop being true with this change.

### Deliberately not in scope

- **`CryptoIcon` and `FiatIcon` are untouched.** Their name types are already
  real unions; their remaining issues are different problems. In particular
  `WalletBalanceOption` writes `<CryptoIcon name={symbol as CryptoIconName} />`
  because `symbol` is a runtime API string — a cast no union can remove.
  `PaymentMethodIcon` is in a structurally better position: the wallet's map
  *keys* are runtime slugs, but its *values* are authored literals, so typing
  them needs no cast anywhere.
- **The unreachable `if (!Icon) return null` guard stays.** Once the record is
  typed, indexing it with a value of the union type can never be `undefined`
  (`noUncheckedIndexedAccess` applies to index signatures, not literal keys), so
  the guard becomes dead code. `CryptoIcon.tsx` and `FiatIcon.tsx` carry the
  identical dead guard today; removing all three is a separate cleanup.
- **The union is hand-written, not generated.** This adds a fourth list to keep
  in step with `duckdice/*.svg`, the 53 imports and the 53 record entries. That
  is the same drift exposure the two siblings already live with, and matching
  their pattern is the point of this change. Generating these maps is a
  worthwhile separate change.

## Capabilities

### New Capabilities

- `uikit-payment-method-icon`: the payment method icon component — the set of
  icons it publishes, the name type consumers address them by, and how a name
  resolves to an asset. Introduced here because the existing icon capabilities
  do not cover it: `uikit-icon-font` specifies the generated webfont pipeline
  and its own shared name type, and `uikit-img-icon` specifies `ImgIcon`.
  Neither describes the SVG-component icon sets.

### Modified Capabilities

(None. `uikit-icon-font` and `uikit-img-icon` keep their current requirements;
this change alters neither the webfont pipeline nor `ImgIcon`.)

## Impact

- **Packages**: `packages/uikit` (the type and the record) and `apps/wallet` (one
  stale comment). It **does** touch the `apps/wallet` <-> `packages/uikit`
  boundary, but only by tightening a type already exported from uikit's root
  barrel and already imported by the wallet — no new export and no new
  dependency.
- **Code**:
  - `packages/uikit/src/components/PaymentMethodIcon/PaymentMethodIcon.types.ts`
    (derivation replaced by a hand-written union)
  - `packages/uikit/src/components/PaymentMethodIcon/PaymentMethodIcon.const.ts`
    (record re-typed; gains an import of the name type)
  - `apps/wallet/src/_common/components/WalletPaymentMethodOption/WalletPaymentMethodOption.const.ts`
    (comment only)
- **Runtime behaviour**: none. This is a compile-time change only — no emitted
  JavaScript differs, no rendering changes, and no asset is added, removed or
  renamed.
- **Behaviour change for other uikit consumers**: **BREAKING at the type level
  only.** Any consumer passing an arbitrary string to `PaymentMethodIcon`'s
  `name` prop, or assigning one to `PaymentMethodIconName`, stops compiling. In
  this repo the only such call site is the three icon gallery MDX files, which
  pass `Object.keys(...)` (typed `string`) straight to the `name` prop —
  `CryptoIcon` and `FiatIcon` already have strict unions and their galleries do
  the same thing, so this is established precedent and compiles today only
  because `tsconfig`'s `include: ["src"]` never type-checks `.mdx`.
- **APIs / dependencies**: none added or changed.
- **Tests**: none. The repo has no test runner and this change does not
  introduce one. The change is verified by `tsc -b` accepting the correct
  mapping and rejecting a deliberately-introduced bad name.
