# Proposal

## Why

`turbo run build` fails at `@rockethash/wallet#build` with 172 TypeScript errors
from two unrelated causes: 171 `TS2307` on uikit's `*.svg?react` imports, and
one `TS2322` where the deposit-crypto picker hands the payment-method option row
a shape it does not accept. The first is a gap in uikit's own type surface that
every consumer of the package hits, not a wallet misconfiguration; the second is
a real defect that reached `main` behind the noise of the first, and was
mistaken for a pre-existing unused-variable error in the project's own baseline
note. Until the build is green, `tsc -b` gates `vite build`, so no wallet
artifact can be produced and no future type regression is detectable.

## What Changes

- **uikit carries its own asset-import types.** Add
  `/// <reference types="vite-plugin-svgr/client" />` to the four uikit
  `*.const.ts` files that import `*.svg?react`, so uikit's source type-checks
  inside any consumer's TypeScript program without that consumer declaring
  uikit's build-time ambient types. This clears all 171 `TS2307`.
- **The deposit-crypto picker stops reshaping payment-method data.** Remove the
  array-to-lookup-map transform in `WalletDataProvider`, so the context carries
  `DTO.PaymentMethod[]` as the API supplies it and the option row receives the
  shape its prop type already declares. The availability filter becomes
  `currencies.includes(selectedBalance)`. This clears the `TS2322`, deletes the
  `WalletPaymentMethod` view-model, and removes a type declaration that claimed
  `Record<string, boolean>` for an object the code populated with strings.
  Observable behaviour is unchanged: both forms select exactly the methods whose
  `currencies` contain the selected balance symbol.
- **The two stale build-baseline notes are corrected.** `openspec/config.yaml`
  and AGENTS.md §9 both state that the wallet build fails with ~171 `TS2307`
  plus one `TS6133`, and instruct readers to treat that tail as pre-existing
  noise. The `TS6133` is long gone and the current tail is a genuine defect, so
  the note as written tells an agent to dismiss a real regression. Replace it
  with the post-change expectation — the wallet's `tsc -b` passes — rather than
  re-pinning a count and an error code that will drift again.

No breaking changes. No public API, prop, or rendered output changes.

Explicitly **not** in scope, and left for a separate change: the three
`@ts-expect-error` sites on `userBalances.main?.[symbol]`, the
`symbol as CryptoIconName` / `as FiatIconName` casts, and the fact that `DTO.*`
is inferred from hand-written fixtures via `typeof` while orval still points at
the Swagger Petstore sample spec. Those share a root cause with each other but
not with either build failure, and fixing them ripples through every `Wallet*`
component that reads a DTO.

## Capabilities

### New Capabilities

- `uikit-source-consumption`: The contract uikit's TypeScript source must honour
  as a source-consumed package — that it type-checks inside a consuming
  product's own program, carrying whatever ambient module declarations its
  imports depend on, without requiring the consumer to configure anything on
  uikit's behalf. This is the durable property the `TS2307` failure violated,
  and it is not specific to SVG imports: any future non-standard import
  specifier in uikit source is bound by it. It sits alongside
  `react-version-support`, which constrains the same source-in-consumer-program
  relationship from the React-types direction.

### Modified Capabilities

- `wallet-payment-method-option`: Add two requirements covering what the payment
  method picker hands to the option row, which the existing requirement
  "Payment method picker uses the option row" leaves open. First, that the data
  passed to the row is the payment-method record as the API supplies it, with no
  intermediate shape interposed — the disagreement that produced the `TS2322`.
  Second, that the picker offers only methods supporting the currently selected
  balance currency, which is existing unspecified behaviour this change rewrites
  the implementation of and must therefore pin down.

## Impact

**`packages/uikit`** — four files gain one reference line each, no logic change:

```
src/components/CryptoIcon/CryptoIcon.const.ts
src/components/FiatIcon/FiatIcon.const.ts
src/components/PaymentMethodIcon/PaymentMethodIcon.const.ts
src/components/ImgIcon/ImgIcon.const.ts
```

These are the only four files in the workspace that import `*.svg?react`.

**`apps/wallet`** — three files:

```
src/components/WalletProvider/WalletDataProvider/WalletDataProvider.context.ts
  drop the WalletPaymentMethod interface; paymentMethods: DTO.PaymentMethod[]
src/components/WalletProvider/WalletDataProvider/WalletDataProvider.tsx
  drop the currencies reduce, pass availableMethods through
src/components/Wallet/WalletDepositCrypto/WalletDepositCrypto.tsx
  currencies[defaultBalance] -> currencies.includes(defaultBalance)
```

`WalletPaymentMethodOption.tsx` is **not** touched: its
`option: DTO.PaymentMethod` prop type is already correct and becomes satisfiable
once the provider stops reshaping.

**Package boundary** — this change crosses `apps/wallet` ↔ `packages/uikit`, but
only in the direction that already exists: wallet imports uikit through
`exports["."] -> ./src/index.ts`, so uikit's source is compiled by wallet's
`tsc -b`. Nothing new is wired up.

**Dependencies** — none added. `vite-plugin-svgr` is already a devDependency of
both packages.

**Docs** — `openspec/config.yaml` (`context` field) and AGENTS.md §9.

**Verification** — `pnpm build` in `apps/wallet` must reach and complete
`vite build`; `turbo run build` must report 5 of 5 successful. `vite build` and
`vite dev` already succeed today and must continue to. There are no tests in the
repo and this change does not introduce a test runner, so verification is the
type check and build plus a manual check of the deposit-crypto picker.

**Follow-on risk retired** — once the wallet build is green, any future
`tsc -b` error in `apps/wallet` is attributable to the change that introduced
it. That is the point of fixing the 171 rather than documenting them: the
`TS2322` survived review precisely because a 171-error baseline hid it.
