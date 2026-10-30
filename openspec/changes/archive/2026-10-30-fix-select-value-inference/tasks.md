# Tasks

Baseline before starting: `pnpm tsc -b` reports 11 errors — 9 from
`apps/wallet` (which compiles uikit's source too) and 9 from
`packages/uikit`, overlapping on the `Select`/`FormSelect` files. Capture
the baseline output first so each group's progress is measurable.

The uikit and wallet edits cannot compile independently (see design.md —
Migration Plan), so expect a red build until group 4 completes. Within each
group, verify against the errors that group owns rather than a clean build.

## 1. Baseline

- [x] 1.1 Record the starting errors by running `pnpm tsc -b` in both
  `packages/uikit` and `apps/wallet`, and verify the two runs together
  account for the 11 errors listed in proposal.md — Impact, across the 6
  named files. Investigate any error not on that list before continuing.

## 2. Select's value-type contract

- [x] 2.1 In `packages/uikit/src/components/Select/Select.tsx`, retype
  `SelectProps<T extends object, V = string>` so that `value?: V` carries no
  `NoInfer` and `onChange?: (value: NoInfer<V>) => void` keeps it, per
  design.md — Decisions 1 and 2. Verify `SelectProps` still has `NoInfer`
  on exactly one member and that the member is `onChange`.
- [x] 2.2 Add the matching `V = string` default to the `SelectComponent`
  call signature in the same file, so the default applies at call sites and
  not only to the props type. Verify that a `SelectProps<T>` reference with
  one type argument resolves (it is relied on by task 3.1 and by the spec's
  "Existing single-type-argument references keep compiling" requirement).
- [x] 2.3 Fix the implementation's two assumptions that the value is a
  `string | number`, per design.md — Decision 3: give the internal change
  handler a `V` parameter, and derive each `Dropdown.MenuItem`'s React key
  from the option value rather than passing the value as the key. Verify
  `pnpm tsc -b` in `packages/uikit` no longer reports the three
  `Select.tsx` errors (lines 60, 92, 93 at baseline).

## 3. FormSelect and uikit stories

- [x] 3.1 In `packages/uikit/src/components/Form/FormSelect/FormSelect.tsx`,
  pin the wrapped select to `string` via `Omit<SelectProps<T, string>,
  'value'>`, keeping `FormSelect`'s own single type parameter, per
  design.md — Decision 4. Verify the TS2314 error at `FormSelect.tsx:11` is
  gone and that `FormSelect`'s call signature is unchanged.
- [x] 3.2 Update `packages/uikit/src/components/Select/Select.stories.ts` to
  supply both type arguments to `Meta<typeof Select<...>>`. The story's
  `Option.value` is a `number`, so the value type argument is `number`, not
  the `string` default. Verify the TS2635 error at `Select.stories.ts:16`
  and the two `implicitly any` errors on lines 19-20 are gone, and that the
  Select story still renders in `pnpm storybook`.
- [x] 3.3 Confirm `packages/uikit/src/components/Form/FormSelect/FormSelect.stories.tsx`
  needs no edit: its two `implicitly any` errors are fallout from 3.1 and
  should clear on their own. Verify by running `pnpm tsc -b` in
  `packages/uikit` and seeing a clean build; only if errors remain, pass the
  story's option type explicitly.

## 4. Wallet call sites

- [x] 4.1 Narrow the two handlers in
  `apps/wallet/src/components/Wallet/WalletDepositCrypto/WalletDepositCrypto.tsx`
  from `(x: string | number)` to `(x: string)`, matching the `string` the
  control now infers from `value`. Verify the two TS2322 errors (lines 66,
  84 at baseline) are gone and that `paymentMethod.currencies[balance]`
  type-checks without a cast, `currencies` being `Record<string, boolean>`.
- [x] 4.2 Narrow `handleOnTransportChange` in
  `.../WalletDepositCrypto/WalletDepositCryptoCoins/WalletDepositCryptoCoins.tsx`
  to `(transport: string)` and drop the now-unnecessary `transport as string`
  cast in the `setState` call. Verify the TS2322 error at line 27 is gone
  and that no cast remains in the handler.
- [x] 4.3 Confirm `WalletDepositCash.tsx` and `WalletBuyCrypto.tsx` need no
  edit: their four `implicitly any` errors are fallout from the
  `FormSelect` fix in 3.1. Verify by `pnpm tsc -b` in `apps/wallet`; these
  files should not appear in its output.

## 5. Integration verification

- [x] 5.1 Verify `pnpm tsc -b` is clean in both `packages/uikit` (TypeScript
  `~6.0.2`) and `apps/wallet` (TypeScript `~7.0.2`) — both compilers, per
  design.md — Decision 5, since the two packages are on different majors and
  the wallet compiles uikit's source inside its own program.
- [x] 5.2 Verify the two `// @ts-expect-error` comments in
  `WalletDepositCrypto.tsx` are both still suppressing a real error. An
  unused `@ts-expect-error` is itself an error, so a clean build in 5.1
  confirms this; if either now reports as unused, remove that comment rather
  than widening a type to keep it.
- [x] 5.3 Verify the spec's inference contract against the real call sites by
  checking the inferred types in the editor or via a scratch assertion: in
  `WalletDepositCrypto.tsx` both selects report `string`, and a deliberately
  mismatched `value` or handler is rejected. This is the only check that the
  value type is genuinely *inferred* rather than falling back — a green
  build alone cannot distinguish the two (design.md — Decisions 1 and 2
  describe both fallback traps). No test runner exists in this repo and this
  change does not introduce one, so this check is manual.
- [x] 5.4 Verify the uikit library build and Storybook build still pass with
  `pnpm build` in `packages/uikit`, since its build script chains
  `tsc -b && vite build && storybook build` and the story edits in 3.2 feed
  the last step.
- [x] 5.5 Verify `pnpm biome check` passes on the touched files, since the
  Husky `pre-commit` hook runs `pnpm biome check --write` and will reorder
  interface members and JSX attributes alphabetically. Expect it to re-sort
  `SelectProps` members after 2.1; let it, rather than hand-ordering.
