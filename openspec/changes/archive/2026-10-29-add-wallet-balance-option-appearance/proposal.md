# Proposal

## Why

`apps/wallet` renders a currency picker in `WalletDepositCrypto` via
`Form.Select`, passing `getOptionLabel={(params) => <WalletBalanceOption {...params} />}`.
`WalletBalanceOption` is currently a stub that renders `<div>{name}</div>`, with
an empty `WalletBalanceOption.module.scss` beside it. The Figma design
(`Components`, node `4163:18003`) specifies a richer row — currency icon, symbol,
full name, balance and fiat equivalent — with distinct active and inactive
appearances. Without it the picker shows a bare currency name and gives no visual
signal of which currency is selected.

## What Changes

- Fill in `WalletBalanceOption` so it renders the full row from the Figma design:
  a 20px `CryptoIcon`, the currency symbol, the currency name as subtext, and a
  right-aligned two-line block holding the balance amount and its fiat equivalent.
- Give the component its active and inactive appearances, driven by the `isActive`
  prop that `Select` already passes into `getOptionLabel`. Symbol and amount
  colours derive from the inherited `currentColor` that `Dropdown.MenuItem`
  already sets per state, so hover stays correct; only font weight and the muted
  `--text-secondary` parts are set by the component.
- Populate `WalletBalanceOption.module.scss` as a `[data-theme="duckdice"]`-scoped
  SCSS Module using the existing semantic theme custom properties.
- Rename uikit's mismatched crypto icon assets so icon names match currency
  symbols exactly (`SHIBA.svg` -> `SHIB.svg`, `Ethena.svg` -> `ENA.svg`,
  `Trump` -> `TRUMP`), updating `CryptoIcon.const.ts` and `CryptoIcon.types.ts`.
  The balance option then passes its symbol straight to `CryptoIcon` with no
  lookup table, and reserves a blank 20px slot for a symbol with no icon
  (`DECOY`) so rows never shift.
- The balance (`0.00`) and fiat (`$0.00`) values are rendered as **static
  placeholders**. `DTO.Currency` carries no balance field, and wiring real
  balances is explicitly out of scope for this change.
- In `packages/uikit`, make the dropdown's `matchToggleWidth` option pin the
  content panel to the toggle's width instead of only setting a floor on it.
  Without this the panel is shrink-to-fit and grows to accommodate a long
  currency name, pushing the balance column out of the row; no styling on the
  balance option itself can prevent that, because the panel is sized *by* the
  content it is meant to constrain.

Not changing: the picker's row chrome. An earlier reading of this change assumed
the rows came from `Menu.module.scss` (`padding: 12px`) and would render ~60px
tall. That was wrong: `Dropdown.Menu` / `Dropdown.MenuItem` have their own styles
in `Dropdown.module.scss` (`.menu__item-content { padding: 0 12px; min-height:
44px }`), and the rows measure **44px**, matching Figma. `uikit-menu` describes
the standalone `Menu` component, which this picker does not use, and is untouched.

## Capabilities

### New Capabilities
- `wallet-balance-option`: the appearance of a single currency row inside the
  wallet's currency `Select` — its anatomy, its active and inactive states, and
  how currency symbols map onto the available crypto icons.
- `uikit-dropdown`: how the uikit `Dropdown`'s content panel is sized relative to
  its toggle. Introduced here because making the balance option's currency name
  truncate requires the panel to be pinned to the toggle's width, which is uikit
  behaviour and was previously unspecified.

### Modified Capabilities

(None. `uikit-menu` keeps its current requirements; this change does not alter
`Menu.Item` behaviour.)

## Impact

- **Packages**: `apps/wallet` (the component) and `packages/uikit` (one line in
  the dropdown's width handling). It adds no dependency between them beyond the
  existing `workspace:*` link.
- **Code**:
  - `apps/wallet/src/_common/components/WalletBalanceOption/WalletBalanceOption.tsx`
    (stub replaced)
  - `apps/wallet/src/_common/components/WalletBalanceOption/WalletBalanceOption.module.scss`
    (currently empty)
  - `apps/wallet/src/_common/components/WalletBalanceOption/index.ts` (may need to
    re-export the props type)
  - `packages/uikit/src/components/Dropdown/DropdownContent/DropdownContentDefault/DropdownContentDefault.tsx`
    (the panel's inline `style` now sets `maxWidth` alongside `minWidth` when
    `matchToggleWidth` is set)
  - `packages/uikit/src/components/CryptoIcon/CryptoIcon.const.ts`,
    `CryptoIcon.types.ts`, and the `duckdice/` assets renamed as described above
- **Consumed from uikit**: `CryptoIcon` and `CryptoIconName`, both already
  exported from the uikit root barrel.
- **Behaviour change for other uikit consumers**: any dropdown that passes
  `matchToggleWidth` now gets a panel exactly as wide as its toggle rather than
  one free to grow past it. `Select` is the only caller in this repo.
- **Theme tokens used** (all already defined in `ThemeProvider.scss`):
  `--text-secondary`, `--Details-Spacing-4`, `--Details-Spacing-6`,
  `--Details-Spacing-8`.
- **APIs / dependencies**: none added or changed. No new runtime dependencies.
- **Tests**: none. The repo has no test runner, and this change does not
  introduce one.
