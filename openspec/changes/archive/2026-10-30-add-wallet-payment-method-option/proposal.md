# Proposal

## Why

`apps/wallet` renders a payment method picker in `WalletDepositCrypto` via
`Form.Select`, but passes `getOptionLabel={({ option }) => option.name}` — so the
picker shows the raw API slug (`gift-cards-g2a`, `payment-card-world-wide`) with
no icon and no visual signal of which method is selected.
`WalletPaymentMethodOption` exists beside it as a stub returning
`<div>WalletPaymentMethodOption</div>`, with no stylesheet and no barrel export.
The Figma design (`Wallet`, node `8011:11935`) specifies the row this picker
should show: a 30px payment-method icon, a human-readable label, and distinct
active and inactive appearances.

## What Changes

- Fill in `WalletPaymentMethodOption` so it renders the row from the Figma
  design: a 30px `PaymentMethodIcon` followed by the method's display label,
  separated by 10px.
- Give the component its active and inactive appearances, driven by the
  `isActive` prop that `Select` already passes into `getOptionLabel`. Only the
  font weight is set by the component (400 inactive, 600 active); the label sets
  **no colour**, inheriting the `currentColor` that `Dropdown.MenuItem` already
  manages per state. This follows the `wallet-balance-option` precedent
  (*"Symbol and amount colour follow the surrounding row"*) and keeps the row's
  hover-to-white affordance working.

  This is a deliberate, recorded deviation from the Figma frame: the design
  draws inactive labels at `#8a99a5` (`--text-secondary`), while inheriting
  yields `--text-primary` (`#adbfce`) — one step lighter. Pinning the colour to
  match the frame would make the label stop responding to the row's hover state,
  since the label's own class beats the inherited colour. Consistency with the
  sibling component and a working hover were chosen over exact fidelity on the
  inactive swatch.
- Add `WalletPaymentMethodOption.const.ts` holding **two** hand-written maps
  keyed by the API slug: slug -> `PaymentMethodIcon` name, and slug -> display
  label. `DTO.PaymentMethod` carries only `{ currencies, name }` — no title and
  no icon — so both have to be supplied by the wallet.
- Reserve a blank 30px square when a slug has no icon, so rows with and without
  an icon keep their labels at the same horizontal position. This mirrors
  `wallet-balance-option`'s *"Missing icon reserves its space"* requirement, and
  matters here far more than it did there: 15 of the 45 slugs in the mock data
  have no usable icon.
- Populate `WalletPaymentMethodOption.module.scss` as a
  `[data-theme="duckdice"]`-scoped SCSS Module using existing semantic theme
  custom properties.
- Export `WalletPaymentMethodOption` from
  `apps/wallet/src/_common/components/index.ts`, which it is currently missing,
  and wire it into `WalletDepositCrypto`'s payment method `Form.Select` as the
  option label. Without this the component is unreachable and unverifiable.

### Mapping coverage, and what is deliberately left blank

The mock cashier data (`CASHIER_INFO_DATA`) holds 45 unique slugs across deposit
and withdraw; uikit ships 53 payment method icons. They do not line up:

- **22 slugs map 1:1 with confidence** — `metamask` -> `METAMASK`,
  `gift-cards-g2a` -> `G2A`, `payment-card-ua` -> `UKR_CARD`,
  `vietnam_prosperity_joint-stock_commercial_bank` -> `VP_BANK`, and so on.
- **8 are reasoned, not literal**, and are flagged as such in the design:
  `coins` -> `QR` (Figma's first row pairs a QR glyph with "Wallet Address"), the
  three `*_qr` bank variants -> `QR`, `payment-card-ru` and `ob_card` ->
  `CREDIT_CARDS`, `phone-megafon` and `phone-beeline-ru` -> `TELEPHONE`.
- **15 are left unmapped on purpose**, falling back to the blank slot:
  `moon-pay`, `nagad`, `rocket`, `upay`, `bkash`, `easypaisa`, `pix`,
  `open_finance`, `jazzcash`, `imps`, `donga_bank`, `bank`, plus three near-miss
  traps — `vietcombank` is **not** mapped to `VIETA_BANK` (Vietcombank and Viet A
  Bank are different banks), `o_pay` is **not** mapped to `PAY_OP` (OPay and
  PayOp are different brands), and `asia_commercial_bank` has no ACB asset.
  Shipping a competitor's logo on a payment method is worse than shipping none.

25 icons go unused by the mock data — including `BINANCE_PAY` and
`LIGHTNING_NETWORK`, which are two of the six rows **in the Figma frame itself**.
The mock data is therefore a narrower slice than the live cashier API, which is
why both maps are built as partial lookups with graceful fallbacks rather than
exhaustive records.

Only six labels are confirmed by the design ("Wallet Address", "Binance Pay",
"Lighting" *(sic)*, "Gift Card", "Skins", "Voucher"). The remaining labels are
standard brand spellings chosen during implementation (`MetaMask`,
`WalletConnect`, `bKash`, `JazzCash`, `VPBank`, …) and **should be reviewed by
whoever owns the product copy**. An unmapped slug renders its raw slug rather
than disappearing.

## Capabilities

### New Capabilities

- `wallet-payment-method-option`: the appearance of a single payment method row
  inside the wallet's payment method `Select` — its anatomy, its active and
  inactive states, and how a payment method's API slug resolves to an icon and a
  display label.

### Modified Capabilities

(None. `wallet-balance-option` is untouched; this change follows its established
colour-inheritance and blank-icon-slot patterns rather than altering them.
`uikit-dropdown` is untouched.)

## Impact

- **Packages**: `apps/wallet` only. This change does **not** cross the
  `apps/wallet` <-> `packages/uikit` boundary — no uikit source is edited and no
  new icon assets are added. It consumes `PaymentMethodIcon`, which is already
  exported from the uikit root barrel.
- **Code**:
  - `apps/wallet/src/_common/components/WalletPaymentMethodOption/WalletPaymentMethodOption.tsx`
    (stub replaced)
  - `apps/wallet/src/_common/components/WalletPaymentMethodOption/WalletPaymentMethodOption.const.ts`
    (new — the icon and label maps)
  - `apps/wallet/src/_common/components/WalletPaymentMethodOption/WalletPaymentMethodOption.module.scss`
    (new)
  - `apps/wallet/src/_common/components/index.ts` (add the missing re-export)
  - `apps/wallet/src/components/Wallet/WalletDepositCrypto/WalletDepositCrypto.tsx`
    (`getOptionLabel` renders the component instead of the raw slug)
- **Consumed from uikit**: `PaymentMethodIcon`, already in the root barrel.
  `PaymentMethodName` resolves to `string` (`PAYMENT_METHOD_ICONS` is typed
  `Record<string, …>`) and is not exported from any barrel, unlike
  `CryptoIconName`/`FiatIconName`. The icon map therefore gets **no compile-time
  check** against the real icon set — a typo compiles and silently renders the
  blank slot. Tightening that type is a uikit public-surface change and is
  deliberately out of scope here; it is a candidate follow-up.
- **Theme tokens used** (all already defined in `ThemeProvider.scss`):
  `--Details-Spacing-10`.
- **Not touched**: the `NEW` pill and green dot on the Lightning row in the Figma
  frame — nothing in `DTO.PaymentMethod` marks a method as new. The dropdown and
  option container chrome are likewise out of scope, per the request. The empty
  `options={[]}` payment method selects in `WalletDepositCash` and
  `WalletBuyCrypto` are left as they are; they have no data to render yet.
- **APIs / dependencies**: none added or changed.
- **Tests**: none. The repo has no test runner and this change does not
  introduce one.
