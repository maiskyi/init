# Design

## Context

See proposal.md — Why. The facts that shape the approach, all verified against
the current tree:

- `duckdice/` holds 53 `.svg` files; `PaymentMethodIcon.const.ts` has 53 imports
  and 53 record entries. A diff of the import names against the record keys is
  empty in both directions, so the asset set, the imports and the map are
  already perfectly in step. Only the *type* is missing.
- The record uses shorthand property syntax (`ADVANCED_CASH,`), so every key is
  identical to its import binding, which is identical to its filename. The union
  is therefore mechanically derivable from `ls duckdice/*.svg`.
- A type probe confirms the current state: `'COMPLETE_NONSENSE'` is assignable
  to `PaymentMethodIconName` and rejected by `CryptoIconName`.
- Both barrels already export the type, and `apps/wallet` already imports it and
  annotates its 30 map values with it. No plumbing is missing.
- The real gates are `pnpm biome check --write` and each package's `tsc -b`.
  ESLint, Prettier and `turbo run lint` are **not wired up** (AGENTS.md §8), so
  nothing in this design depends on them. Because the change is type-only, `tsc`
  is not merely the gate — it *is* the feature.

## Goals / Non-Goals

**Goals:**

- Make `PaymentMethodIconName` admit exactly the 53 published names.
- Make the compiler enforce the map in both directions (no missing entry, no
  extra entry).
- Make the wallet's 30 hand-authored icon values compile-checked, with no cast.

**Non-Goals:**

- Touching `CryptoIcon` or `FiatIcon` (see proposal — Deliberately not in scope).
- Removing the unreachable null guards.
- Generating any of these files.
- Changing any runtime behaviour, asset, or rendered output.

## Decisions

### D1. Flip the derivation; do not try to infer the union from the imports

**Chosen:** hand-write the union in `PaymentMethodIcon.types.ts`, then type the
record `Record<PaymentMethodIconName, typeof ADVANCED_CASH>` and import the type
into `.const.ts`. Dependency runs `.types.ts` -> `.const.ts`, matching
`CryptoIcon.const.ts:1` and `FiatIcon.const.ts:1`.

**Why:** the current direction is circular in effect — the map is "checked"
against a type computed from the map, which is why it checks nothing. Only an
independently-declared union can constrain the map.

**Alternative rejected:** keep `keyof typeof PAYMENT_METHOD_ICONS` and instead
tighten the record with a satisfies-style annotation to infer literal keys. That
would make the union real without hand-writing it, but it inverts the sibling
pattern the change exists to match, and the inferred union would silently absorb
any typo'd key rather than rejecting it — the map would define truth instead of
being checked against it.

### D2. The union is the 53 filenames, verbatim

The names, as published today:

```
ADVANCED_CASH  AGRIBANK  ASTRO_PAY  BANCO_DO_BRASIL  BIDV  BINANCE_PAY
BRADESCO  CREDIT_CARDS  EXIMBANK  FAWRY  G2A  GIFT_CARD  GP_BANK  KINGUIN
KRYPTOVA  LIGHTNING_NETWORK  MASTERCARD  METAMASK  MTS  NAMA_BANK  NEOSURF
OCB  OCEAN_BANK  OPTIMIST  P2P  PAY_DO  PAY_DO_EWALLET  PAY_OP  PAY_POUND
PERFECT_MONEY  PG_BANK  QIWI  QR  SACOMBANK  SANTANDER  SEA_BANK  SHB
SKINS  SWAPPED  TECHCOMBANK  TELE2  TELEPHONE  TRON_LINK  UKR_CARD
VIETA_BANK  VIETIN_BANK  VISA  VOUCHER_1  WALLET_CONNECT  WEBMONEY
WORLWIDE  YANDEX  VP_BANK
```

Spellings are reproduced exactly as the files are named, including `WORLWIDE`
and `VOUCHER_1`. Correcting an asset name is a rename with its own ripple into
the wallet's map and is not part of this change.

Union member order does not matter to the compiler, and Biome's `useSortedKeys`
assist applies to object literals, not type unions — so neither sibling's
ordering is authoritative. Alphabetical is the obvious choice and makes the
diff against a directory listing readable.

### D3. Leave the unreachable guard in place

After this change, `const Icon = PAYMENT_METHOD_ICONS[name]` has type
`typeof ADVANCED_CASH`, never `undefined` — `noUncheckedIndexedAccess` adds
`| undefined` only for index-signature access, not for a `Record` over a literal
union. So `if (!Icon) return null` becomes dead code.

It stays anyway: `CryptoIcon.tsx:15` and `FiatIcon.tsx` carry the identical dead
guard, so removing only this one would *create* an inconsistency while trying to
remove one. It is also harmless insurance at runtime, where a JavaScript
consumer outside the type system can still pass anything.

### D4. The MDX galleries are left alone

All three `*.gallary.mdx` files do
`Object.keys(ICONS).map((icon) => <Icon name={icon} />)`. `Object.keys` returns
`string[]` regardless of the record's key type, so after this change that call
site is type-unsound for `PaymentMethodIcon` — exactly as it already is for
`CryptoIcon` and `FiatIcon`, both of which have had strict unions all along.

It does not break the build because `packages/uikit/tsconfig.json` sets
`include: ["src"]`, and `tsc` only picks up `.ts`/`.tsx` from that glob; `.mdx`
is never type-checked. Storybook compiles MDX without type-checking it. The
existing siblings are the evidence that this is survivable, and making the
galleries type-safe would be the same change in three places — a separate
cleanup.

## Risks / Trade-offs

- **A fourth list to keep in sync.** `duckdice/*.svg`, the imports, the record
  entries and now the union must agree. → Mitigation: the compiler now catches
  three of the four relationships automatically — a union member with no entry
  and an entry with no union member both fail `tsc`. Only "an SVG file exists
  that nothing imports" stays unchecked, which is the pre-existing situation and
  is a dead file rather than a broken render.
- **Type-level breaking change for uikit consumers.** Anything passing an
  arbitrary string to `name` stops compiling. → Mitigation: in this repo the
  only such call sites are the MDX galleries (D4, not type-checked). External
  consumers are the intended audience for the fix — a build error is the point,
  and it surfaces exactly the typos that currently render nothing.
- **A wrong name in the wallet's map becomes a build failure rather than a blank
  icon.** That is the goal, but it means this change can turn a silently-degraded
  screen into a red build. → Mitigation: the 30 values were verified against a
  directory listing when the map was written, and the first task re-runs that
  check, so any failure is expected to surface during implementation rather than
  later.
- **`VIETA_BANK` and `PAY_OP` become reachable-looking names.** Typing the union
  publishes every asset name, including two the wallet deliberately does not map
  because they are different brands from similarly-named payment methods. →
  Mitigation: that decision lives in the wallet's map and its comment, not in
  the type; the union describes what assets exist, not which are appropriate for
  a given slug.
