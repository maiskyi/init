# Design

## Context

See `proposal.md` — Why. The constraint that shapes everything below is the
mechanism by which `V` fails to infer, so it is worth stating precisely.

`Select`'s current shape:

```ts
export interface SelectProps<T extends object, V> {
  getOptionValue: SelectGetOptionValueFunction<T, V>;   // (p: {option: T}) => V
  onChange?: (value: NoInfer<V>) => void;
  value?: NoInfer<V>;
}
```

TypeScript infers call-site type arguments in two passes. Arguments that are
*context-sensitive* — function expressions whose parameters carry no
annotation, and so need a contextual type before they can be checked — are
deferred to the second pass. Everything else is inferred and checked in the
first.

```
  <Select
    options={cryptoCurrencies}                      PASS 1 -> T = DTO.Currency
    value={balance}                                 PASS 1 -> NoInfer, no candidate
    onChange={handleOnBalanceChange}                PASS 1 -> NoInfer, no candidate
                                                    ^ not context-sensitive, so it
                                                      is CHECKED in pass 1, which
                                                      forces V to be fixed now
    getOptionValue={({ option }) => option.symbol}  PASS 2 -> V = string
  />                                                        ^ too late

  V had zero candidates when it was fixed  ->  V = unknown
```

`getOptionValue` is the only inference site for `V`, and it is permanently a
pass-2 argument: its `option` parameter is unannotated and depends on `T`.
`NoInfer` removes the other two candidates. So pass 1 fixes `V` with nothing
to go on.

Two things follow, and both were confirmed by compiling isolated cases with
the repo's own `tsc`:

- The same call **outside** JSX infers `V = string` correctly. The failure
  needs a non-context-sensitive, `NoInfer`-typed prop to be *present*; it is
  that prop being checked in pass 1 that forces `V` early.
- An inline arrow (`onChange={(v) => ...}`) is itself context-sensitive, so
  it lands in pass 2 alongside `getOptionValue` and works. This is why the
  bug looks intermittent.

Evidence gathered per variant (all under `--strict`, JSX, TypeScript 7.0.2):

| Variant | `V` resolves to |
|---|---|
| Plain function call, not JSX | `string` |
| JSX, `onChange` passed by name | **`unknown`** |
| JSX, `onChange` inline arrow | `string` |
| JSX, no `onChange` prop at all | `string` |
| JSX, `getOptionValue` param annotated | `string` |
| JSX, `NoInfer` removed | `string` |

## Goals / Non-Goals

**Goals:**

- Keep exactly one inference site for `V` that TypeScript reaches in pass 1,
  so the type resolves without annotation.
- Keep `getOptionValue` a callback, so no existing call site changes shape.
- Keep the change non-breaking for `SelectProps<T>` written with one type
  argument.

**Non-Goals:**

- Making the uncontrolled, non-`string` case infer. It is unreachable with a
  callback accessor (see Decision 3) and is handled by a default plus an
  escape hatch rather than by design.
- Introducing `type-fest`. It carries no inference-priority helper;
  `NoInfer` has been built into TypeScript since 5.4 and is already used
  here. Nothing in this change needs a new dependency.
- Reworking `Form`/`FormController`'s value typing. `FormSelect` is pinned to
  `string` because `FormController<string>` already is; threading a value
  type through the form layer is a separate change.
- Fixing the two pre-existing `// @ts-expect-error` comments in
  `WalletDepositCrypto.tsx`, or the `Select.type.ts` / barrel-export
  inconsistencies noted at the end of this document.

## Decisions

### 1. Move `NoInfer` off `value` and onto `onChange` alone

```ts
export interface SelectProps<T extends object, V = string> {
  getOptionValue: SelectGetOptionValueFunction<T, V>;
  onChange?: (value: NoInfer<V>) => void;
  value?: V;    // <-- the pass-1 inference site
}
```

`value` becomes the pass-1 candidate, so `V` is fixed from it;
`getOptionValue`'s return is then *checked* against that in pass 2, and
`onChange` is checked against it too. All three must agree, and a
disagreement is reported.

**Why `value` rather than `onChange` as the inference site.** Both work
mechanically, but whichever prop is the inference site also sets the
*ceiling* on `V`, so a wide one silently loosens the contract. Measured:

| Inference site | Accessor returns `string`, handler declares `string \| number` |
|---|---|
| `onChange` (`NoInfer` on `value`) | `V` widens to `string \| number`; mismatch accepted |
| `value` (`NoInfer` on `onChange`) | `V` is `string`; handler checked against it |

The wide declaration in this repo is on the handlers — exactly the thing
that should be checked, not the thing that should define the type. The
current values (`balance`, `paymentMethod`, `transport`) are all concrete
`string`s.

**Alternative rejected — constrain `V extends string | number` and keep
`NoInfer` on both.** This makes `tsc` pass with zero call-site changes,
which is why it is worth naming: it is the trap. With no pass-1 candidate,
`V` falls back to its *constraint*, so it resolves to `string | number`
everywhere a named handler is passed. The build goes green while nothing is
inferred at all, and the original commit's intent is silently reverted.
Verified: constraining changes the fallback from `unknown` to
`string | number`; it does not restore inference.

**Alternative rejected — a key accessor** (`getOptionValue="symbol"`, with
`value?: T[K]`). This is the strongest option on the merits: a string
literal is never context-sensitive, so inference lands in pass 1 always,
errors are attributed to the offending prop, and the uncontrolled case works
too. All seven current call sites are bare property reads, so all would
convert. It was rejected as a breaking change to a published API, not on
technical grounds; it is also the only option where `type-fest` (`Get`,
`Paths`) would earn a place, if nested accessors were ever wanted. Worth
revisiting if `Select`'s API is broken for other reasons.

### 2. Default `V` to `string`

`value` is optional, so a select used uncontrolled has no pass-1 candidate
and `V` would fall back to `unknown` — the original bug, in a narrower case.
A default type argument fills exactly that gap:

| Case | Without default | With `V = string` |
|---|---|---|
| Uncontrolled, string accessor, named handler | `unknown` — fails | `string` — works |
| Uncontrolled, numeric accessor, named handler | `unknown` — fails | fails; explicit type args resolve it |
| Uncontrolled, no handler at all | accessor's type | accessor's type — default not engaged |
| Controlled, string | `string` | `string` |
| Controlled, numeric | `number` | `number` — `value` overrides the default |
| Controlled, mismatched value | rejected | rejected |

The default engages narrowly: only when `value` is absent *and* a named
change handler is present, since it is that handler being checked in pass 1
that forces `V` early. With no handler either, nothing forces `V` and the
accessor's return type is used as-is. Confirmed against the real `Select`
during implementation; the spec's scenarios state this distinction.

A default only applies when inference finds no candidate, so it cannot mask
a real mismatch: `value` still overrides it, and the controlled cases are
unaffected. It also keeps `SelectProps<T>` legal with one type argument,
which is what makes this change non-breaking.

### 3. Leave `V` unconstrained; derive list identity inside `Select`

`V` stays unconstrained, so the implementation can no longer assume the
value is a `string | number`. Two internal sites change:

- the internal change handler takes `V` instead of `string | number`;
- the rendered option's React key is derived from the value rather than
  being the value.

This is the cost of an unconstrained `V`. The upside is that option values
are not restricted to primitives.

The active-option comparison uses `lodash.isequal` rather than `===`, so a
non-primitive value matches structurally instead of by reference. This
landed from a concurrent edit while this change was being implemented, and
supersedes the reference-equality limitation originally recorded under
Risks: with an unconstrained `V`, `===` would have matched object values
only by identity, which is the gap `isEqual` closes. `lodash.isequal` and
`@types/lodash.isequal` are therefore new `packages/uikit` dependencies —
the only dependency addition in this change, and not one the proposal
anticipated.

Each rendered option is keyed by its position, with a single commented
suppression of Biome's `lint/suspicious/noArrayIndexKey`. An unconstrained
`V` has no reliably unique string form, so a value-derived key cannot
satisfy React: `String(...)` collapses every object value to
`"[object Object]"`. A module-level `WeakMap` assigning each option object a
stable id was considered and rejected — it changes every key when a consumer
rebuilds its option objects each render, remounting the whole list, which is
a worse and quieter failure than a positional key in a list of stateless
items.

There is exactly one value comparison. `selectedOption` is now derived from
the same `isActive` flag the options were built with, rather than repeating
the comparison with `===`. Two comparisons cannot then disagree — which they
did when `isActive` used `isEqual` and `selectedOption` still used `===`,
leaving an object value marked active while the input showed its
placeholder.

The internal handler is typed `NonNullable<typeof onChange>` rather than
being given an explicit `V` parameter. Naming `V` in the body would require
making the implementation an explicitly generic arrow, and neither generic
component in this package does that (`Select` and `FormSelect` both use the
plain `: XComponent = ({...}) =>` form). Deriving the handler's type from
the prop keeps that precedent and needs no new pattern.

### 4. Pin `FormSelect` to `string`

`FormSelect` wraps `FormController<string>` and supplies `value` itself, so
its value type is `string` by construction:

```ts
interface FormSelectProps<T extends object>
  extends Omit<SelectProps<T, string>, 'value'>, ... {}
```

`FormSelect` keeps its single type parameter, so its own call sites and its
stories are unaffected. Confirmed that this compiles with no `value` prop
reaching `Select` from the consumer and no type arguments written at the
call site — `V` needs no inference because it is already pinned.

**Why this is the whole fix for four of the eleven errors.** `FormSelect`'s
`SelectProps<T>` reference is a hard type error (TS2314), which makes `T`
unresolvable in anything that renders `Form.Select`. The four
`implicitly any` errors in `WalletDepositCash.tsx` and `WalletBuyCrypto.tsx`
are fallout, not independent problems, and clear once `FormSelect` compiles.

### 5. Verification is `tsc -b` in both packages

The gate for this change is `pnpm tsc -b` in `packages/uikit` and in
`apps/wallet`, going from 11 errors to 0. Per AGENTS.md section 8, this
design deliberately relies on **nothing else**: there is no ESLint config in
the repo, no Prettier invocation, no package implements a `lint` script, and
`turbo run lint` is a no-op. There are also no tests anywhere in the repo,
and this change does not introduce a test runner — so the compile-time
behavior the spec describes is verified by compiling the real call sites,
not by assertions.

Both packages must be checked, and the uikit check is not redundant: uikit
is on TypeScript `~6.0.2` while the wallet is on `~7.0.2` (AGENTS.md
section 9), and the wallet compiles uikit's source inside its own program.
The behavior relied on here — two-pass inference, `NoInfer`, default type
arguments — was confirmed on 7.0.2 and is long-standing in 6.x, but the two
compilers should both be run rather than assumed equivalent.

## Risks / Trade-offs

- **The uncontrolled, non-`string` case still fails to infer.** A select
  with no `value` prop and a numeric accessor needs explicit type arguments.
  → No call site in the repo hits this today: all three direct `Select`
  usages pass `value`, and every `Form.Select` usage goes through the pinned
  `FormSelect`. Mitigated by the `string` default for the common case, and
  the failure is a clear compile error with two documented escape hatches
  (explicit type arguments, or an inline arrow handler). Recorded as a
  scenario in the spec so it is a known contract, not a surprise.

- **The fix depends on TypeScript's inference-pass ordering**, which is
  compiler behavior, not a documented API. A future compiler could change
  when `V` is fixed. → The failure mode would be a loud compile error in the
  wallet's `tsc -b`, not silent wrong behavior. The spec states the
  *contract* in terms of what a consumer observes, so a future change can
  be re-satisfied by a different mechanism — the key accessor from
  Decision 1 being the obvious fallback.

- **Error attribution is imperfect.** When `value` and `getOptionValue`
  disagree, the error is reported on `getOptionValue` (the pass-2 argument
  checked against an already-fixed `V`) rather than on the offending
  `value`. → Cosmetic; the error text names both types. The key accessor
  would fix this, at the cost of a breaking change.

- **Options are keyed by position, not by value.** `noArrayIndexKey` is
  suppressed once, with a comment, because an unconstrained `V` has no
  reliably unique string form — `String(...)` is `"[object Object]"` for
  every object value. → Index keys misbehave only when list items hold
  state or reorder; `Dropdown.MenuItem` is stateless presentational markup,
  so a mis-reuse re-renders content and nothing more. This replaced a
  `String(...)` key once `WalletDepositCryptoCoins` became a real
  object-valued consumer and all nine of its options collided on one key.

- **A narrowed handler could make a `@ts-expect-error` redundant.**
  `WalletDepositCrypto.tsx` carries two `@ts-expect-error` comments; an
  unused one is itself an error. → Neither sits on an expression whose type
  depends on `V`, so neither is expected to change. Called out as an
  explicit verification step rather than assumed.

- **`SelectProps`'s second type parameter is public API.** External code
  whose handler relies on receiving `string | number` from a narrower
  accessor may need to narrow. → Low: a handler that accepts *more* than the
  value type is still accepted (function parameter contravariance), so only
  handlers that accept *less* break, and those were already unsound.

## Migration Plan

Single atomic change, no runtime or data migration — every edit is
type-level except the derived React key, which changes the key's value but
not the rendered output. The uikit and wallet edits must land together: the
wallet type-checks uikit's source inside its own program, so neither side
compiles alone.

Rollback is a revert. Note that reverting this change alone restores the red
build, since the break originates in `fb60681`; a rollback would need to
revert that commit too.

## Open Questions

None. The two decisions that would have changed the approach — callback
versus key accessor, and whether to constrain `V` — were resolved before
drafting.

For the record, three pre-existing inconsistencies were found in `Select`
and deliberately left alone, as fixing them is not required to make the
build green:

- `Select.type.ts` is singular where AGENTS.md section 2 specifies
  `<Name>.types.ts`.
- `Select/index.ts` does not re-export `SelectGetOptionValueFunction` or
  `SelectGetOptionLabelFunction`, so consumers cannot name the accessor
  types — which matters more now that the value type is part of the
  contract.
- `Select.context.ts` types its context value as `unknown` and is not
  generic, so the context carries no value type. Nothing reads it today.
