# Design

## Context

See proposal.md — Why. Two existing pieces shape the approach:

- `src/types/polymorphic.types.ts` already provides `PolymorphicProps<C, OwnProps>`,
  built on `ComponentPropsWithoutRef<C>`.
- `src/components/Heading/` is the closest precedent — a polymorphic typography
  component over a tag union, with `.const.ts` driving its Storybook controls
  and a `@each $theme` SCSS module keying off `[data-theme]`.

The Figma source is node `3160:10831` of the Components file, which holds both
scales side by side. Only the five right-hand Paragraph columns are in scope;
the four left Title columns are `Heading`, already shipped.

## Goals / Non-Goals

**Goals:**

- Reproduce the Paragraph text styles exactly as Figma declares them, with no
  invented sizes, weights or metrics.
- Keep per-element prop narrowing intact, so `as="label"` is actually useful.
- Consume theme tokens for face and colour instead of hardcoding either.

**Non-Goals:**

- Ref forwarding. `PolymorphicProps` is built on `ComponentPropsWithoutRef`,
  and `Heading` does not forward refs either. Matching the precedent keeps the
  two typography components consistent; changing it is a separate change that
  should cover both.
- Refactoring `Alert`, `Checkbox`, `Toggle`, `Menu` or `Dropdown` onto `Text`.
  That is the payoff this change makes possible, not part of it.
- Responsive behaviour. No Paragraph style has a mobile variant, so
  `Text.module.scss` reads `vars.$themes` for the `@each` but never calls
  `mx.breakpoint-up`.

## Decisions

### Generic call-signature interface rather than `FC<TextProps>`

`Heading` is typed `FC<HeadingProps>` over a `'h1' | 'h2' | 'h3' | 'h4'`
union, which works only because all four map to `HTMLHeadingElement` with an
identical prop shape. `Text`'s tag set is the first in the uikit where that is
false: React types `label` as `LabelHTMLAttributes`, adding `htmlFor` and
`form` on top of `HTMLAttributes`.

`PolymorphicProps` applies `Omit<ComponentPropsWithoutRef<C>, ...>`, and
`keyof (A | B)` is the *intersection* of their keys while `Omit` is not
distributive. Instantiating `C` as the whole union therefore collapses the
props to only what every tag shares, silently dropping `htmlFor` — which
removes most of the reason to render a `label`.

So `Text` is generic over one tag, per AGENTS.md §3 ("Generic, polymorphic
components use a call-signature interface instead of `FC<Props>` when the
component itself is generic over a type param") and following `SelectComponent`
in `Select.tsx`:

```ts
interface TextComponent {
  <C extends TextTag = 'p'>(props: TextProps<C>): ReactElement;
}
```

*Alternatives considered.* Keeping `FC<TextProps>` and accepting the loss —
rejected because it makes `as="label"` misleading rather than merely limited.
Dropping `label` from the union to keep every tag prop-identical — rejected
because `label` is one of the six tags the component is for. Both were put to
the user; the generic signature was chosen.

### `uppercase` is a prop; underline is not

The `small` and `mini` specimen columns each carry two uppercase samples and
one underlined sample beyond their four weights. Uppercase appears twice per
column in two different weights, which reads as deliberate systematic use, so
it becomes a prop. Underline appears once per column and is a one-property
override at the call site, so it stays a consumer concern.

The prop is a boolean, `uppercase?: boolean`, rather than a
`transform?: 'uppercase'` single-member union. A one-value union reads as a
scale with room to grow, which this is not: the Paragraph styles define no
other casing, and `lowercase`/`capitalize` would be inventions. The boolean
also matches how the uikit already spells binary props (`disabled`, `invalid`,
`active`), so it composes through `cn`'s object form per AGENTS.md §4 rather
than as another template-literal class lookup. Widening it later to a union
would be a breaking change, but so would narrowing an invented union.

*Alternatives considered.* Both as props — rejected as inventing more API than
the specimen supports. Neither as props — rejected because uppercase recurs
systematically enough to belong to the scale.

### Uppercase does not alter line height

The Figma `mini` uppercase samples carry `line-height: 12px` against mini's
declared 16px. This is read as a slip in the design file, not a rule, on three
grounds: the underlined `mini` sample carries the same 12px even though
underline is no reason to tighten leading; the `small` column's uppercase
samples keep their declared 18px; and 12px is exactly the `micro` line height,
consistent with a copy-paste from the adjacent column. `uppercase` therefore
emits `text-transform` only, leaving metrics untouched at every size.

*Alternative considered.* Treating the tighter leading as intentional caps
leading — rejected because it would have to apply to `small` too, and does not.

### Full 5 x 4 cross product, including `micro` + `regular`

Figma declares `micro/600`, `micro/700` and `micro/800` but no `micro/400`.
Rather than carve a hole in the type union, all twenty pairs are accepted. The
`uikit-heading` spec already set this precedent in its "Weight is independent
of viewport" requirement, which accepts a regular-weight H1 at mobile size
although that specimen shows no such sample. A single rectangular
`size x weight` matrix is also far simpler to express in both the types and
the SCSS than a scale with one excluded corner.

### Independent `size` and `weight` classes, as `Heading` does

`Text.module.scss` emits `.text` plus one size modifier and one weight
modifier, composed by `cn(...)` — ten classes, not twenty. This is what keeps
the cross product above cheap.

The modifiers are **namespaced** (`&_size_medium`, `&_weight_regular`) rather
than flat as in `Heading.module.scss`. Flat modifiers are not viable here:
Figma names a *size* `regular` and this component also names a *weight*
`regular`, so `&_regular` would be emitted twice and CSS Modules would hash
both to one `.text_regular` carrying font-size, line-height *and* font-weight.
`<Text size="medium" weight="regular">` would then resolve to 14px rather than
15px, since the two rules have equal specificity and the weight block comes
later. Namespacing makes the axes collision-proof by construction.

The Figma names themselves are kept rather than renamed, because divergence
between the design file and the prop values would cost more than the overlap
does; it is confined to the prop values and never reaches the CSS.

### Theme tokens for face and colour

`--fonts-family-main` (`"Open Sans"`) and `--text-primary` are already defined
in `ThemeProvider.scss`, and Figma's Paragraph styles agree with both. `Text`
references the tokens. This differs from every current consumer of that face,
which hardcodes `font-family: "Open Sans", sans-serif`, including
`Heading.module.scss`.

## Risks / Trade-offs

- **`Heading` and `Text` now disagree about how to reach a font family** →
  `Text` uses the token, `Heading` hardcodes the literal. Accepted for now and
  recorded as a follow-up in proposal.md — Impact. Converting `Heading` is also
  a *behaviour* change, since Figma gives the Title scale Alexandria
  (`--fonts-family-marketing`), not Open Sans, so it needs its own change with
  a `uikit-heading` spec delta rather than being folded in here.
- **No ref forwarding** → consumers needing a DOM node must wrap `Text`.
  Consistent with `Heading`; see Non-Goals.
- **The `regular` size/weight name overlap will read oddly at call sites** →
  Mitigated by the `Specimen` story rendering the full matrix with labels, so
  the two axes are visible together.
- **No automated tests exist in this repo** → The type-level scenarios in the
  spec (rejected props, accepted `htmlFor`) are verified by `tsc -b`, and the
  visual scenarios by the Storybook `Specimen` story. Per AGENTS.md §8,
  verification uses `pnpm biome check --write` and the package's own `tsc -b`;
  this design does **not** rely on ESLint, Prettier, or a turbo `lint`/`test`
  task, none of which execute in this repo.

## Migration Plan

Not applicable — purely additive. `Text` is a new export; nothing imports it
yet, so there is no rollout or rollback step beyond reverting the commit.
