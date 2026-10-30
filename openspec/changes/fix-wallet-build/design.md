# Design

## Context

See proposal.md — Why. The structural facts that shape the approach:

`@rockethash/uikit` declares `"exports": { ".": "./src/index.ts" }`, so a
consumer importing from the package root pulls uikit's `.ts`/`.tsx` **source**
into its own TypeScript program. `apps/wallet` is such a consumer, and its
`build` script is `tsc -b && vite build`, so the type check gates bundling.

The declaration that makes `import X from './foo.svg?react'` legal is an ambient
module declaration supplied by `vite-plugin-svgr/client`. In uikit it is reached
via `src/vite-env.d.ts`:

```
uikit/src/vite-env.d.ts
  /// <reference types="vite/client" />
  /// <reference types="vite-plugin-svgr/client" />
```

That file enters uikit's own program only because `uikit/tsconfig.json` lists it
in `include` (`["src", "src/vite-env.d.ts"]` — the explicit second entry is
itself a trace of someone hitting this before). Nothing imports it. A consumer's
program, whose `include` covers only its own sources, therefore never loads it,
and every `*.svg?react` import in uikit source is unresolved there. Four uikit
files import that specifier — `CryptoIcon`, `FiatIcon`, `PaymentMethodIcon` and
`ImgIcon` `*.const.ts` — accounting for all 171 `TS2307`.

Two findings constrain the option space:

1. **The leak is in uikit's public type surface, not just its source.** The
   built declarations repeat the specifier:

   ```
   dist/src/components/CryptoIcon/CryptoIcon.const.d.ts
     import AAVE from './duckdice/AAVE.svg?react';
     export declare const CRYPTO_ICONS: Record<CryptoIconName, typeof AAVE>;
   ```

   So the icon maps are typed as `typeof <an SVG module import>`. Any consumer
   needs svgr's ambient types whether it consumes source or declarations.

2. **`dist/` is not a usable consumer surface today.** It has no
   `dist/src/components/CryptoIcon/duckdice/` directory for those declarations
   to point at, and it still contains `dist/src/__typecheck-scratch.d.ts` for a
   source file that no longer exists. It is stale and incomplete.

On the wallet side, `WalletDataProvider` converts each method's
`currencies: string[]` into a lookup object, while `WalletPaymentMethodOption`
types its prop as the raw `DTO.PaymentMethod`. The provider's declared type
(`Record<string, boolean>`) does not even match what its `reduce` writes
(`[currency]: currency`, a string); it type-checks only because the accumulator
seeds as `{}`, which is assignable to anything object-shaped. Nothing reads the
value — `currencies[symbol]` is used purely as a truthiness probe — so the
mismatch is invisible at runtime and surfaces only where the reshaped object
meets the row's prop type.

## Goals / Non-Goals

**Goals:**

- Clear both causes so `apps/wallet`'s `tsc -b` passes and `vite build` runs.
- Put the `*.svg?react` fix inside the package that owns the requirement, so the
  two external products consuming uikit are fixed by the same edit.
- Remove the shape disagreement at its source rather than papering it over, and
  with it the mis-declared lookup type.
- Leave the repo's build-baseline notes describing a green build, with no error
  count or code left to drift.

**Non-Goals:**

- Getting `typeof <svg module>` out of uikit's public type surface. Finding 1
  above means the ambient-type requirement still travels to consumers through
  the declarations. Retyping the icon maps as
  `FunctionComponent<SVGProps<SVGSVGElement>>` would end that, but it is a
  larger change to the package's exported types and is not needed to make the
  build green.
- Making `dist/` consumable (finding 2) or switching wallet to consume built
  declarations via a tsconfig project reference. That would also change which
  CSS the wallet bundles — `dist/themes/*.css` is theme-split with the
  `[data-theme]` selector stripped, whereas wallet currently bundles uikit's
  unsplit attribute-scoped CSS — so it is a product decision, not a build fix.
- The `@ts-expect-error` sites, the `as *IconName` casts, and the
  fixture-inferred `DTO.*` types. Out of scope per proposal.
- Introducing a test runner. None exists; this change does not add one.

**This design relies on no linting or test tooling that does not currently run.**
Per AGENTS.md §8, ESLint has no config file anywhere, Prettier is invoked by
nothing, and `turbo run lint` matches no package script. Verification here is
exactly the tooling that does run: each package's `tsc -b` and `vite build`,
`turbo run build` at the root, and `pnpm biome check --write` (which the
`pre-commit` hook runs anyway).

## Decisions

### D1: Put the svgr reference in the four importing files, inside uikit

Add `/// <reference types="vite-plugin-svgr/client" />` as the first line of each
of the four `*.const.ts` files that import `*.svg?react`.

A `/// <reference types="..." />` in any file that is part of a program loads
those ambient declarations into that whole program. Putting it in the importing
file means it travels with the source into whatever program compiles it, which
is exactly the property the spec requires. It needs no cooperation from the
consumer and no change to uikit's exported types.

Why not the alternatives:

- **Add `"vite-plugin-svgr/client"` to `apps/wallet`'s `tsconfig.app.json`
  `types`.** One line, and `vite-plugin-svgr` is already a wallet devDependency,
  so it works today. Rejected because it fixes one consumer. uikit ships to two
  external products that consume the same source entry point and hit the same
  171 errors; each would need the same line, and each new consumer after them.
  It makes uikit's build requirement every consumer's standing obligation.
- **Retype the icon maps so no SVG module type is exported.** The right
  long-term shape (see Non-Goals) and it would make D1 unnecessary, but it
  changes uikit's public types, touches all four components' typing, and pulls
  in the stale-`dist` question. Disproportionate to a build fix.
- **Have wallet consume `dist/*.d.ts` through a project reference.** Does not
  work as-is (findings 1 and 2) and changes the CSS story. Rejected.

Trade-off accepted: four duplicated reference lines. A single shared file would
not help — the duplication exists precisely because the declaration has to be
reachable from each importing file rather than from one file only uikit's
`include` sees. `src/vite-env.d.ts` stays as it is; it still serves uikit's own
program and Storybook.

### D2: Delete the lookup-map transform instead of accommodating it

Let `DTO.PaymentMethod` flow from the fixture through the context to the option
row unchanged, and filter with `currencies.includes(selectedBalance)`.

This resolves the `TS2322` by removing the disagreement rather than describing
it: the provider stops producing a second shape, so the row's existing
`option: DTO.PaymentMethod` prop type becomes satisfiable without being touched.
It is a net deletion — the `WalletPaymentMethod` interface, the `reduce`, and the
`Record<string, boolean>` that was never true all go.

Behaviour is preserved. Previously `currencies[symbol]` returned the symbol
string (truthy) when present and `undefined` otherwise; now `.includes(symbol)`
returns `true`/`false` for the same inputs. The filter selects the same methods,
so the picker's contents and default selection are unchanged.

Why not the alternatives:

- **Narrow the row's prop to `Pick<DTO.PaymentMethod, 'name'>`.** The row only
  reads `name`, so this compiles and keeps the O(1) lookup. Rejected because it
  leaves the mis-declared `Record<string, boolean>` in place — the defect that
  made the two shapes diverge stays, just no longer caught anywhere.
- **Keep the map and make it honest** (`[c]: true`, seeded as
  `Record<string, boolean>`, with the row typed against the view-model).
  Rejected because `_common/components` would then import a type from
  `components/WalletProvider`, inverting the layering — `_common` is the shared
  lower layer. The view-model would need a new home to avoid that, which is more
  structure than a two-field object earns.

Performance is not a reason to prefer either map variant: the longest
`currencies` list in the fixture is 39 symbols, over a handful of methods, run
once per render of one form.

### D3: Replace the baseline note rather than re-pinning it

Both `openspec/config.yaml` (`context`) and AGENTS.md §9 tell readers the wallet
build fails with ~171 `TS2307` plus one `TS6133`, and to treat that tail as
pre-existing. The `TS6133` is gone and a `TS2322` stands in its place — so the
note currently instructs an agent to ignore a genuine defect. That is not a
hypothetical: it is how this defect stayed in the tree.

Once the build is green there is no baseline to enumerate, so state the
expectation instead of a count: the wallet's `tsc -b` is expected to pass, and
any error it reports belongs to the change in hand. This has no code or spec
counterpart left to drift against. Correcting `TS6133` → `TS2322` was rejected
for the same reason the original note failed — it would be wrong again the next
time the tail changed, and wrong immediately once the build is green.

AGENTS.md §9 is a list of known inconsistencies deliberately **not** silently
fixed. The entry for this failure is removed because the change fixes it; the
other entries in that section stay untouched. The entry's observation that
`vite build` alone succeeds while `pnpm build` fails stops being true and goes
with it.

### D4: Fix both causes in one change rather than two

They are unrelated faults and could ship separately. Keeping them together is
deliberate: the value of D2 is small on its own, and the value of D1 is mostly
that it makes D2-class defects visible. A green build is the unit of work worth
delivering — 171 standing errors is a baseline no reviewer reads, which is what
let a real error hide in it.

## Risks / Trade-offs

- **The `typeof <svg module>` type stays in uikit's public surface** → Accepted,
  and recorded as a Non-Goal with the evidence (finding 1) so the next person
  reaching for `dist/` or a project reference does not have to rediscover it.
  D1 keeps that surface compiling for every consumer in the meantime.
- **Four duplicated reference lines can drift** → A fifth file importing
  `*.svg?react` without the reference would reintroduce the failure in
  consumers, while uikit's own build stays green and hides it. Mitigated by the
  wallet build being green from now on: that consumer compiles uikit source in
  CI-equivalent form, so the omission fails here rather than in an external
  product. The spec states this as a requirement.
- **`apps/wallet`'s `tsc -b` becomes a real gate** → Previously it always failed,
  so nothing downstream of it was ever exercised. Clearing it may expose further
  errors in wallet's own code that were never reached. Mitigated by running the
  wallet type check after D1 and before D2, so any additional errors surface
  attributed rather than mixed into the `TS2322` fix. If any appear, stop and
  report rather than widening scope silently.
- **`DTO.PaymentMethod` is inferred from a fixture via `typeof`** → `currencies`
  is typed `string[]` only because the fixture holds strings; a real API payload
  of a different shape would change the type under `.includes()`. Accepted: the
  fixture-derived DTO problem is explicitly out of scope, and `.includes()` is no
  more exposed to it than the `reduce` it replaces. The spec's "currency support
  is read from the method record" scenario is written so it stays satisfiable
  when the DTOs are later hand-authored.
- **No automated test covers the picker** → The filter rewrite is verified by
  type check, build, and a manual check that the deposit-crypto picker still
  lists methods and defaults to the first. There is no test runner to extend and
  this change does not add one.

## Migration Plan

Nothing to deploy or roll back: no runtime dependency, data, or API change, and
both edits are reversible in place. Sequencing matters only for attribution:

```
1. D1 (uikit, 4 reference lines)
   -> run apps/wallet `tsc -b`
   -> expect: 171 TS2307 gone, TS2322 remains, nothing new
      (anything new = pre-existing, previously unreachable; report it)

2. D2 (wallet, 3 files)
   -> run apps/wallet `tsc -b`   -> expect clean
   -> run apps/wallet `vite build`  -> expect success (it already did)
   -> run `turbo run build` at root -> expect 5 of 5 successful

3. D3 (docs) last, so the note is rewritten against an observed green build
   rather than an expected one
```

uikit's own `tsc -b`, `vite build` and `storybook build` already pass and must
continue to; D1 adds only type-only reference lines, so the theme-split CSS
output and Storybook's unsplit attribute-scoped CSS are unaffected.
