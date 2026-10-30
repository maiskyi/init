# Proposal

## Why

The uikit ships `Heading`, which covers the design system's Title scale, but
has no component for the Paragraph scale that sits beside it in the Figma
Components file. Every component that needs body copy therefore hardcodes its
own `font-size`/`line-height`/`font-family` in its SCSS module — `Alert`,
`Checkbox`, `Toggle`, `Menu` and `Dropdown` each repeat
`font-family: "Open Sans", sans-serif` and a size that may or may not match a
declared design token. A `Text` component closes the other half of the
typography system and gives those components something to converge on.

## What Changes

- Add a new `Text` component to `packages/uikit`, covering the five Paragraph
  sizes and four Paragraph weights declared as text styles in the Figma
  Components file.
- `Text` is polymorphic: an `as` prop selects the rendered element from a
  curated set of text containers, deliberately excluding `h1`–`h6` so the
  Title scale stays the exclusive concern of `Heading`.
- `Text` is the first polymorphic component in the uikit whose candidate tags
  do **not** share an identical prop shape (`label` adds `htmlFor`/`form`), so
  it is typed with a generic call-signature interface rather than
  `FC<Props>`. See design.md.
- `Text` takes its font family from the existing `--fonts-family-main` theme
  token rather than hardcoding `"Open Sans"`, which is what every current
  consumer of that face does.
- No breaking changes. Nothing existing is modified; the component's styling
  is additive and no current component is refactored onto it in this change.

## Capabilities

### New Capabilities

- `uikit-text`: the uikit's `Text` component — the design system's Paragraph
  type scale, rendered as a consumer-selected non-heading text element, in
  five sizes, four weights and an optional uppercase transform, coloured and
  faced from the active theme's tokens.

### Modified Capabilities

None. `uikit-heading` is untouched: `Text` deliberately cannot render a
heading element, so the two capabilities stay disjoint.

## Impact

- **Package**: `packages/uikit` only. Does **not** cross the
  `apps/wallet` <-> `packages/uikit` boundary — the wallet gains access to
  `Text` through uikit's source barrel, but no wallet code is changed here.
- **New files**, following the AGENTS.md §2 `<ComponentName>.<kind>.<ext>`
  scheme and `Heading`'s layout one-for-one:
  `packages/uikit/src/components/Text/` containing `Text.tsx`,
  `Text.types.ts`, `Text.const.ts`, `Text.module.scss`, `Text.stories.tsx`
  and `index.ts`.
- **Modified files**: `packages/uikit/src/index.ts`, to re-export `Text` and
  its public types from the root barrel alongside `Heading`.
- **Dependencies**: none added. Reuses `classnames` and the existing
  `PolymorphicProps` helper in `src/types/polymorphic.types.ts`.
- **Theme tokens consumed**: `--fonts-family-main` and `--text-primary`, both
  already defined in `ThemeProvider.scss` for the `duckdice` theme.
- **Out of scope, recorded as follow-ups**: `Heading` hardcodes
  `"Open Sans"` where this Figma file gives the Title scale Alexandria
  (`--fonts-family-marketing`); and neither `Heading` nor `Text` forwards a
  ref, since `PolymorphicProps` is built on `ComponentPropsWithoutRef`.
  Neither is addressed here.
