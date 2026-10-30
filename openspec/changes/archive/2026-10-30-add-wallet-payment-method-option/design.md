# Design

## Context

See proposal.md — Why. The constraints that shape the approach:

- `DTO.PaymentMethod` is `{ currencies: string[], name: string }` and nothing
  else. `name` is an API slug (`gift-cards-g2a`, `phone-mts-ru`), not a title and
  not an icon name. Both the icon and the label have to be derived in the wallet.
- `Select` calls `getOptionLabel({ isActive, option })` and places the result
  inside `Dropdown.MenuItem`, whose stylesheet already manages row colour per
  state: `.menu__item-content { color: var(--text-primary) }` with
  `&:hover, &_active { color: var(--colors-white-100) }`. The option component
  renders *inside* that, so it inherits a correct per-state colour for free.
- The sibling `wallet-balance-option` capability already settled two questions
  this change would otherwise re-litigate: text colour inherits from the row, and
  a missing icon reserves its slot. Both are followed here.
- `PaymentMethodIcon` renders `PAYMENT_METHOD_ICONS[name]` and returns `null`
  when the key is absent — a miss is already a safe no-op, not a crash.
- No test runner exists in this repo, so every requirement in the spec is
  verified by inspection in the running app. ESLint, Prettier and
  `turbo run lint` are **not wired up** (AGENTS.md §8) — nothing in this design
  depends on them. The real gates are `pnpm biome check --write` and
  `pnpm -F @rockethash/wallet exec tsc -b`.

## Goals / Non-Goals

**Goals:**

- Render the Figma row (30px icon, 10px gap, 14px/20px label) with active and
  inactive appearances driven by the `isActive` prop `Select` already supplies.
- Keep the row's hover affordance working, which rules out pinning the label's
  colour.
- Make both lookups partial and fail-soft, since the live cashier API sends slugs
  the mock data does not contain.
- Never render a wrong brand's logo on a payment method.

**Non-Goals:**

- Tightening `PaymentMethodName` from `string` into a real union. That is a uikit
  public-surface change; see Risks.
- The `NEW` pill and green dot in the Figma frame — no data models "new".
- Restyling `SelectInput`, `Dropdown`, or the option container chrome.
- Wiring the empty `options={[]}` payment method selects in `WalletDepositCash`
  and `WalletBuyCrypto`.

## Decisions

### D1. The label sets no colour; only font weight is toggled

**Chosen:** the label element carries no `color` declaration. `isActive` adds a
modifier class that sets `font-weight: 600`, and nothing else.

**Why:** `Dropdown.MenuItem` already resolves default / hover / selected colour
on the ancestor. Inheriting means all three states are correct with zero rules,
and it matches `wallet-balance-option`'s requirement *"Symbol and amount colour
follow the surrounding row"* — two sibling option components behaving the same
way is worth more than one of them matching a static frame exactly.

**Alternative rejected:** set `--text-secondary` when inactive and white when
active, matching the Figma frame literally. Because the declaration would sit on
the label's own class, it beats the colour inherited from
`.menu__item-content:hover`, so hovering an unselected row would no longer
lighten its label. The two stylesheets are separate CSS Modules with hashed class
names, so the option's stylesheet cannot write a `:hover` rule keyed off the
parent to win it back.

**Accepted deviation:** inactive labels render `--text-primary` (`#adbfce`)
where Figma draws `#8a99a5`. One step lighter, in exchange for a working hover.
Recorded here so a later reader does not "fix" it.

### D2. Both maps live in `apps/wallet`, as plain records

**Chosen:** one new `WalletPaymentMethodOption.const.ts` exporting two
`SCREAMING_SNAKE_CASE` records keyed by slug — one to icon name, one to label —
mirroring the `WalletBalanceOption.const.ts` precedent.

**Why:** the slugs are duckdice cashier vocabulary. `packages/uikit` is a generic
component library consumed by two external products; baking one product's API
slugs into `PaymentMethodIcon.const.ts` would make the library know about a
caller. Keeping both maps in the wallet also keeps this change inside one
package, so it does not cross the `apps/wallet` <-> `packages/uikit` boundary at
all.

**Alternatives rejected:** (a) adding the alias map to uikit — couples the
library to one product's API; (b) tightening `PaymentMethodName` into a real
union and exporting it so the map is typo-checked — correct, and it would fix a
genuine asymmetry with `CryptoIconName`/`FiatIconName`, but it changes uikit's
public surface for a wallet-local convenience. Noted as a follow-up.

### D3. Two separate records, not one record of objects

**Chosen:** `PAYMENT_METHOD_ICONS_BY_NAME` and `PAYMENT_METHOD_LABELS` as two
flat `Record<string, string>` maps, rather than one
`Record<string, { icon, label }>`.

**Why:** their coverage differs and will keep differing. Every slug gets a label
(45 of 45); only 30 get an icon. A combined record would need `icon?: string` on
every entry and would invite the reader to assume the two always travel together.
Two maps also let the icon map be deleted wholesale if uikit later accepts slugs
directly, without touching the labels.

### D4. Lookup is a plain index with a fallback, not a membership test

**Chosen:** `PAYMENT_METHOD_ICONS_BY_NAME[name]` → pass to `PaymentMethodIcon`
when present, render the empty slot when absent; `PAYMENT_METHOD_LABELS[name] ??
name` for the label.

**Why:** `PAYMENT_METHOD_ICONS` is not exported from any uikit barrel, so the
wallet cannot test membership against the real icon set without copying uikit's
53 names into the wallet, where they would drift. This is exactly the reasoning
`WalletBalanceOption.const.ts` recorded for the crypto icons. `tsconfig`'s
`noUncheckedIndexedAccess` already types both index reads as possibly
`undefined`, so the fallback paths are compiler-enforced.

### D5. The icon slot is a fixed-size wrapper, independent of the icon

**Chosen:** the icon is wrapped in a 30x30 `inline-flex` span with
`flex-shrink: 0`, exactly as `WalletBalanceOption` wraps its 20px icon. The
wrapper is rendered whether or not an icon resolves.

**Why:** satisfies *"Missing icon reserves its space"* structurally rather than
conditionally — there is no branch that can get it wrong, and 15 of 45 slugs take
this path, so it is the common case rather than an edge case.

### D6. Slug mapping table

Reviewed against the 53 assets in
`packages/uikit/src/components/PaymentMethodIcon/duckdice/`. Labels marked
**[F]** are confirmed by the Figma frame; the rest are brand spellings chosen
here and pending product-copy review.

**Confident 1:1 (22)**

| slug | icon | label |
| --- | --- | --- |
| `agribank` | `AGRIBANK` | Agribank |
| `astro-pay` | `ASTRO_PAY` | AstroPay |
| `bidv_bank` | `BIDV` | BIDV |
| `eximbank` | `EXIMBANK` | Eximbank |
| `gift-cards-g2a` | `G2A` | G2A Gift Card |
| `gift-cards-kinguin` | `KINGUIN` | Kinguin Gift Card |
| `metamask` | `METAMASK` | MetaMask |
| `payment-card-ua` | `UKR_CARD` | Bank Card (UA) |
| `payment-card-world-wide` | `WORLWIDE` | Bank Card (Worldwide) |
| `phone-mts-ru` | `MTS` | MTS |
| `phone-tele2` | `TELE2` | Tele2 |
| `qiwi` | `QIWI` | QIWI |
| `sacombank` | `SACOMBANK` | Sacombank |
| `skinsback` | `SKINS` | Skins **[F]** |
| `techcombank` | `TECHCOMBANK` | Techcombank |
| `tronlink` | `TRON_LINK` | TronLink |
| `vietinbank` | `VIETIN_BANK` | VietinBank |
| `vietnam_prosperity_joint-stock_commercial_bank` | `VP_BANK` | VPBank |
| `voucher` | `VOUCHER_1` | Voucher **[F]** |
| `wallet-connect` | `WALLET_CONNECT` | WalletConnect |
| `webmoney` | `WEBMONEY` | WebMoney |
| `yandex-money` | `YANDEX` | Yandex Money |

**Reasoned, not literal (8)** — a category stand-in, not the method's own mark:

| slug | icon | label | reasoning |
| --- | --- | --- | --- |
| `coins` | `QR` | Wallet Address **[F]** | Figma's first row pairs a QR glyph with "Wallet Address"; `coins` is the deposit-to-address method |
| `asia_commercial_bank_qr` | `QR` | Asia Commercial Bank QR | QR variants take the generic QR mark |
| `bidv_bank_qr` | `QR` | BIDV QR | as above |
| `vietcombank_qr` | `QR` | Vietcombank QR | as above |
| `ob_card` | `CREDIT_CARDS` | OB Card | generic card mark |
| `payment-card-ru` | `CREDIT_CARDS` | Bank Card (RU) | generic card mark; no RU-specific asset |
| `phone-beeline-ru` | `TELEPHONE` | Beeline | no Beeline asset; generic phone mark |
| `phone-megafon` | `TELEPHONE` | MegaFon | no MegaFon asset; generic phone mark |

**Deliberately unmapped (15)** — label only, blank 30px slot:

| slug | label | why no icon |
| --- | --- | --- |
| `asia_commercial_bank` | Asia Commercial Bank | no ACB asset |
| `bank` | Bank Transfer | no generic bank asset |
| `bkash` | bKash | no asset |
| `donga_bank` | DongA Bank | no asset |
| `easypaisa` | Easypaisa | no asset |
| `imps` | IMPS | no asset |
| `jazzcash` | JazzCash | no asset |
| `moon-pay` | MoonPay | no asset |
| `nagad` | Nagad | no asset |
| `o_pay` | OPay | **`PAY_OP` is PayOp, a different company** |
| `open_finance` | Open Finance | no asset |
| `pix` | Pix | no asset |
| `rocket` | Rocket | no asset |
| `upay` | Upay | no asset |
| `vietcombank` | Vietcombank | **`VIETA_BANK` is Viet A Bank, a different bank** |

The three bolded rows are the point of the "no wrong brand" requirement in the
spec: each has a tempting near-miss asset that a later contributor doing a fuzzy
name match would plausibly wire up.

## Risks / Trade-offs

- **The icon map is not type-checked against the icon set.** `PaymentMethodName`
  resolves to `string`, so `'METAMSK'` compiles and silently renders the blank
  slot — a bug that looks exactly like a deliberately unmapped method. →
  Mitigation: every mapped slug is confirmed by eye against a directory listing
  of `duckdice/` during implementation, and the reasoned/unmapped split above is
  recorded so a blank slot can be checked against intent. A follow-up change can
  tighten `PaymentMethodName` into a real exported union, which would turn this
  class of typo into a compile error for the whole repo.
- **Inactive labels are one shade lighter than the Figma frame.** → Accepted and
  recorded in D1; a reviewer comparing against the frame will see it.
- **Labels beyond the six in Figma are unreviewed product copy.** 39 of the 45
  are brand spellings chosen here. → Mitigation: flagged in the proposal and in
  the mapping table; the fallback renders the raw slug, so a missing entry is
  visible rather than silent.
- **The mock data is a narrower slice than the live API.** `BINANCE_PAY` and
  `LIGHTNING_NETWORK` appear in the Figma frame but in no mock slug, so those
  paths cannot be exercised locally. → Mitigation: both lookups are partial with
  fallbacks by design, so an unknown slug degrades to "blank icon, raw slug"
  rather than breaking the picker. Adding `binance-pay` / `lightning` entries is
  cheap once the real slugs are known.
- **30px icons in the closed `SelectInput`.** The toggle is 44px tall with 5px
  vertical padding, leaving 34px of content box — the icon fits with 2px to
  spare. → Mitigation: verified by measurement in the running app rather than
  assumed; if it clips, that is reported, not fixed by restyling `SelectInput`
  here.

## Open Questions

- Are the labels not confirmed by Figma correct product copy? Deferrable: the
  spec requires *a* mapped label, not specific strings, so correcting one later
  is a one-line edit to the const file that changes no requirement.
- What are the live API slugs for Binance Pay and Lightning Network? Deferrable
  for the same reason — adding them is two entries per map.
