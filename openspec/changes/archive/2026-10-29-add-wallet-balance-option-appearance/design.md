# Design

## Context

See proposal.md — Why. The constraints that shape the approach:

- `Select` calls `getOptionLabel({ isActive, option })` and renders the result in
  two places: as the `children` of a `Dropdown.MenuItem` for each list row, and
  inside `SelectInput` for the closed picker's selected value. The same component
  therefore has to work in both slots.
- `getOptionLabel` returns a bare `ReactNode`. `Select` owns the
  `Dropdown.MenuItem` call site, so a balance option cannot reach `MenuItem`'s
  `prefix` / `suffix` slots, nor pass it a `className`. Everything the design
  shows must be rendered inside the label slot, which uikit already styles as
  `flex: 1 0 0; min-width: 0`.
- `Dropdown.module.scss` — **not** `Menu.module.scss` — supplies the row chrome
  for this picker. `Dropdown.Menu` / `Dropdown.MenuItem` are separate from the
  uikit `Menu` component and carry their own `.menu__item-content`: 44px
  min-height, `padding: 0 12px`, 8px gap, 6px radius, Open Sans 14px/20px regular,
  `color: var(--text-primary)` by default and `color: var(--colors-white-100)`
  plus `background: var(--colors-gray-300a-10)` on `:hover` and `&_active`. That
  background is exactly the Figma active-row fill. `Dropdown.module.scss` also
  adds `padding-right: 36px` to every row, and a green check indicator on the
  active row, whenever any option is active.
- `DTO.Currency` exposes `name`, `symbol`, `precision*`, and `price*`. It has no
  balance field.
- `apps/wallet` has no Storybook and the repo has no test runner, so the only
  gates on this change are `pnpm biome check --write` (Husky pre-commit) and
  `tsc -b` / `vite build`. This design does not rely on ESLint, Prettier, or a
  turbo `lint` or `test` task — per AGENTS.md section 8 none of them execute in
  this repo.

## Goals / Non-Goals

**Goals:**

- Keep the active/inactive distinction correct under hover as well as selection,
  without the balance option duplicating uikit's state logic.
- Keep the component a pure presentational leaf: props in, markup out, no data
  access.
- Make the symbol-to-icon mapping explicit and greppable rather than a cast that
  silently drops icons.

**Non-Goals:**

- Restyling the picker's row chrome (`Dropdown.module.scss`) or the standalone
  `Menu` component. The one uikit change here is to the dropdown panel's width
  handling, nothing else.
- Sourcing, formatting, or converting balance figures.
- Adding a Storybook story or test — neither harness exists for `apps/wallet`.

## Decisions

### Inherit `currentColor` for the symbol and amount instead of branching on `isActive`

`MenuItem` already sets the row's `color` per state: `--text-primary` by default,
`--text-title` (white) when hovered or active. The Figma inactive row's symbol and
amount are `--text-primary`; its active row's are `--text-accent-white`. These are
the same two values. So the balance option sets no colour at all on the symbol and
amount, letting them inherit, and only sets `--text-secondary` on the currency name
and the fiat line.

*Alternative considered:* read `isActive` and set
`--text-accent-white` / `--text-primary` explicitly. Rejected — it reproduces logic
uikit already owns, and it breaks hover: hovering an inactive row turns the row
white via `MenuItem`, but an explicitly-coloured symbol would stay `--text-primary`
against a light background.

Consequence: `isActive` is used for exactly one thing — the symbol's font weight.

### `isActive` drives font weight only

Per the Figma frame, the balance amount is semibold in both states; only the symbol
changes weight (400 inactive, 600 active). The user confirmed Figma wins over the
looser "symbol and balance in bold" phrasing. So the component applies a single
`active` modifier class that sets `font-weight: 600` on the symbol.

### No row-height deviation after all

An earlier reading of this change expected ~60px rows, on the assumption that the
picker used `Menu.module.scss` (`padding: 12px`). Measured in the running app, the
rows are **44px**: the picker is styled by `Dropdown.module.scss`, whose
`.menu__item-content` uses `padding: 0 12px` with `min-height: 44px`. The design's
two-line trailing block is 36px and fits inside that without growing the row.

No uikit change is needed, and `uikit-menu`'s requirements remain untouched — they
describe the standalone `Menu` component, which this picker does not use.

### Icon assets renamed so symbols resolve directly

`CryptoIcon` takes a `CryptoIconName` union; `option.symbol` is a plain `string`,
so some narrowing is unavoidable. Of the 40 crypto currencies in `COMMON_DATA`, 36
match an icon name exactly. Three are published under a different name — `SHIB` as
`SHIBA`, `ENA` as `Ethena`, `TRUMP` as `Trump` — and exactly one, `DECOY`, has no
icon at all.

The mismatch was fixed at its source: uikit's icon assets were renamed so every
icon is published under the currency's own symbol. The balance option then passes
`option.symbol` straight to `CryptoIcon` with no lookup table and no membership
test — the latter was never viable anyway, since `CRYPTO_ICONS` is not exported
from any uikit barrel and testing membership would mean copying uikit's name union
into the wallet, where it would drift. `CryptoIcon`'s existing `null`-on-miss
behaviour covers a symbol with no icon, and the icon is wrapped in a fixed 20px
element so the slot is reserved either way, satisfying "Missing icon reserves its
space".

*Alternative considered:* a wallet-side alias record mapping the three mismatched
symbols onto their published icon names. Implemented first, then dropped once the
assets were renamed — a lookup table in the consumer would have papered over an
inconsistency in the library and drifted as icons were added. The
`option.symbol as CryptoIconName` cast remains, since symbols are plain strings,
and the reserved slot makes a miss a non-event for layout.

### Placeholders are literals in the markup

The balance and fiat lines render the string constants `0.00` and `$0.00`. No
`balance` prop is added: the component's props stay `{ isActive, option }`, exactly
what `getOptionLabel` supplies today.

*Alternative considered:* optional `balance` / `fiatBalance` props now. Rejected as
speculative — nothing can supply them, and an optional prop with no caller is
harder to reason about than a literal that is obviously a placeholder. Wiring real
balances is a separate change that will revisit these props anyway.

### Truncation guards the trailing block, and needs a uikit fix to work

The label slot is `flex: 1 0 0; min-width: 0`, so the leading group must carry its
own `min-width: 0` for text truncation to take effect. The currency name truncates
with an ellipsis; the symbol, balance, and fiat lines do not shrink.

That alone was not enough. `matchToggleWidth` set only `minWidth` on the floating
panel, and `.dropdown` is `width: auto`, so the panel was shrink-to-fit: a long
currency name simply widened the panel and pushed the balance column out of the
row. No CSS on a descendant can prevent this, because the ancestor is sized *by*
the very content that is supposed to be constrained — the dependency runs the
wrong way.

So `DropdownContentDefault` now sets `maxWidth` alongside `minWidth` when
`matchToggleWidth` is set, pinning the panel to the toggle's width. Measured
before and after on a deliberately overlong name: the panel went from growing
442 -> 599px (balance pushed 176px right) to holding at 460px with the name
ellipsised and the balance unmoved.

This is a behaviour change for every `matchToggleWidth` consumer, which is why it
is specified as its own capability (`uikit-dropdown`) rather than folded silently
into the wallet's spec. `Select` is the only caller in this repo.

*Alternatives considered:* (a) drop the truncation requirement — defensible, since
the longest real currency name is "Ethereum Classic" and nothing overflows today,
but it leaves a stated requirement unmet; (b) a fixed `max-width` on the name in
the wallet stylesheet — wallet-only, but an arbitrary magic number with no basis
in the design, and it would not stop the panel itself from growing.

## Risks / Trade-offs

- **~~Rows render ~60px instead of the design's 44px~~** → Did not occur. Measured
  at 44px; see "No row-height deviation after all" above.
- **~~The closed picker renders the same component at a tighter size~~** → Did not
  occur. Measured: the toggle stays 44px and the option content is 36px, so it fits
  with no clipping or stretching.
- **The alias map drifts as currencies or icons are added** → It is a small explicit
  record in one file, and an unmapped symbol degrades to a blank 20px slot rather
  than a broken layout. Accepted.
- **`--text-title` is also applied on hover** → This is what makes the
  `currentColor` approach work, but it means hovering an inactive row gives it the
  active row's text colour while the symbol stays at regular weight. That matches
  uikit's existing menu behaviour; Figma does not specify a hover state.
- **Verification is manual** → No Storybook in `apps/wallet` and no test runner
  anywhere, so correctness is confirmed by `tsc -b`, `pnpm biome check`, and looking
  at `pnpm dev`. `apps/wallet`'s `tsc -b` also has ~171 pre-existing `TS2307` errors
  on uikit's `*.svg?react` imports plus one `TS6133`; those are unrelated to this
  change and must be diffed against, not fixed here.
