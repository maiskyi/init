# Proposal

## Why

Commit `fb60681` added a second type parameter `V` to `packages/uikit`'s
`Select`, so that the control's value type could be derived from whatever
`getOptionValue` returns instead of being hard-coded to `string | number`.
Only `Select.tsx` was updated. Every consumer of the old one-parameter type
was left behind, and `V` was wired in a way that cannot actually infer under
JSX, so `apps/wallet`'s `tsc -b` now reports 11 errors across 6 files — the
build is red, and project context requires it to be green.

The visible symptom is that `WalletDepositCrypto`'s `onChange` handlers fail
to type check. The cause is not local to the wallet: `V` collapses to
`unknown` at every call site, because `NoInfer<V>` is applied to both `value`
and `onChange`, leaving `getOptionValue` as the only inference site — and
`getOptionValue` is a context-sensitive arrow function, which TypeScript
resolves in a later inference pass than the one in which it must already
know `V` to check an `onChange` handler passed by reference.

## What Changes

- Rewire which `Select` props participate in inferring `V`, so that the type
  is inferred automatically rather than collapsing to `unknown`:
  `NoInfer<V>` stays on `onChange` only, and `value` becomes the inference
  site. `getOptionValue` remains a callback, so no call site changes shape.
- Give `V` the default `string`, so a `Select` used without a `value` prop
  still resolves to a usable type instead of `unknown`.
- Leave `V` unconstrained, and adjust `Select`'s own implementation, which
  currently assumes the value is a `string | number`: it passes the value to
  a narrower internal handler and uses it directly as a React `key`.
- Repair the consumers the original commit left on the one-parameter type:
  `FormSelect`, which pins its value type to `string`, plus the `Select` and
  `FormSelect` stories.
- Narrow the three wallet handlers that declare `string | number` to the
  `string` the control now infers. The type system tolerates the wider
  declaration, so this is a correctness cleanup rather than a build fix: the
  values are used to index `Record<string, boolean>` maps and to populate
  `string`-typed state.
- Not breaking. `getOptionValue` keeps its signature, `value` and `onChange`
  keep their names and positions, and `string`-valued selects behave exactly
  as before.

## Capabilities

### New Capabilities

- `uikit-select`: The `Select` control's option/value contract — how the
  type of a selected value is determined from the option accessor, and how
  the `value` and change-notification props must agree with it. No spec
  currently covers `Select`; `uikit-dropdown` covers only the floating
  panel's width.

### Modified Capabilities

None. No existing spec describes `Select`'s value typing, and this change
alters no behavior covered by `uikit-dropdown`, `react-version-support`, or
any other current capability.

## Impact

Touches `packages/uikit` and `apps/wallet`, and therefore crosses the
boundary between them — the wallet imports uikit through its source barrel,
so uikit's `.tsx` is type-checked inside the wallet's own `tsc -b` program
and both sides must land together to make that build green.

**`packages/uikit`**

- `src/components/Select/Select.tsx` — `SelectProps`, the `SelectComponent`
  call signature, and the implementation's internal value handling.
- `src/components/Select/Select.stories.ts` — story `Meta` passes one type
  argument to a two-parameter generic.
- `src/components/Form/FormSelect/FormSelect.tsx` — references
  `SelectProps<T>` with one type argument.
- `src/components/Form/FormSelect/FormSelect.stories.tsx` — collateral
  `implicitly any` errors that clear once `FormSelect` compiles.

**`apps/wallet`**

- `WalletDepositCrypto.tsx`, `WalletDepositCryptoCoins.tsx` — change handler
  signatures; the latter also carries an `as string` cast that becomes
  unnecessary.
- `WalletDepositCash.tsx`, `WalletBuyCrypto.tsx` — collateral
  `implicitly any` errors on `Form.Select` that clear once `FormSelect`
  compiles.

**Public API** — `@rockethash/uikit`'s exported `SelectProps` gains a second
type parameter with a default. External code writing `SelectProps<Option>`
keeps compiling; external code that relies on `onChange` receiving
`string | number` where the accessor returns a narrower type may need to
narrow its handler.

**Dependencies** — `lodash.isequal` and `@types/lodash.isequal` are added to
`packages/uikit`, so that `Select`'s active-option check compares
structurally rather than by reference now that an option value need not be
a primitive. `NoInfer` itself is built into TypeScript and already in use
here; `type-fest` offers nothing that applies to this problem and is not
introduced.
