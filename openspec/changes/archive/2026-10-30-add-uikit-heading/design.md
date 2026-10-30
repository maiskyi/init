# Design

## Context

See proposal.md - Why. Requirements are in `specs/uikit-heading/spec.md`.

What shapes the approach:

- The uikit already has a polymorphic helper, `PolymorphicProps<C, OwnProps>`
  in `src/types/polymorphic.types.ts`, used by `Grid`, `GridCell`, `Card`,
  `Divider`, `MenuItem` and `DropdownMenuItem`. All six are *open*
  polymorphic: `C extends PolymorphicElement`, any element or component,
  with a default (`'div'`, `'hr'`). None of them constrains `C` to a closed
  set, and all six therefore need a call-signature interface
  (`interface DividerComponent { <C ...>(props): ReactElement }`) because
  `FC<Props>` cannot express a generic call signature.
- Component SCSS iterates `@each $theme, $config in vars.$themes` and nests
  everything under `[data-theme="#{$theme}"]`, because the `themeCssSplit`
  build plugin requires `[data-theme]` to lead every selector and strips it
  per theme file.
- `assets/scss/mixins.scss` provides `breakpoint-up($name, $breakpoints)`,
  a mobile-first `min-width` query over the per-theme breakpoint map in
  `assets/scss/variables.scss`, where `md: 1025px`.
- `ThemeProvider.scss` defines `--fonts-size-10` through `--fonts-size-28`,
  `--fonts-family-main` ("Open Sans") and `--fonts-family-marketing`
  ("Alexandria"), but **no** line-height and **no** font-weight tokens.
- Open Sans is already loaded in both places a Heading renders:
  `.storybook/preview-head.html` and `apps/wallet/index.html`.
- `Menu.module.scss` is the repo's BEM precedent: a block (`.menu`) with
  `&__element`, `&-subpart` and single-underscore `&_modifier` nesting,
  read at the call site as `styles['menu__item-content_active']`.

## Goals / Non-Goals

**Goals:**

- One component that expresses the Title scale exactly as the Figma specimen
  defines it, with no way to produce an off-scale heading.
- Keep the surface small enough that it can grow a decoupling prop later
  without a breaking change.
- Keep the SCSS inside the conventions `themeCssSplit` depends on.

**Non-Goals:**

- A general `Typography`/`Text` component covering the Paragraph scale.
- Theme-switchable heading typography. This design hardcodes the family and
  the metrics; a second theme would need rule overrides.
- Ref forwarding. No current consumer needs a heading ref, and the sibling
  polymorphic components do not forward one.
- Automated tests. The repo has no test runner (see proposal Impact);
  verification is Storybook plus `tsc -b`.

## Decisions

### `as` selects element and scale together

`as` is a closed union `'h1' | 'h2' | 'h3' | 'h4'` that drives both the
rendered tag and the type scale. There is no `variant`/`size`/`level` prop.

*Alternative considered*: `as` for the tag plus `variant` for the look, so a
semantic `<h2>` could carry H4 styling - the usual design-system answer, since
document outline and visual hierarchy genuinely diverge in cards, sidebars and
modals.

*Why not now*: the one-prop form cannot be misused, and adding an optional
`variant` later is purely additive - existing call sites keep working because
`variant` would default to `as`. Starting decoupled and tightening later is the
direction that *would* be breaking. The cost is accepted and recorded: until
that prop exists, a consumer who needs an `<h2>` at H4 size must override via
`className`.

### `as` is required, with no default

Unlike `Grid` (`as = 'div'`) and `Divider` (`as = 'hr'`), `Heading` has no
default element. `PolymorphicProps` makes `as` optional, so the props type
intersects it back to required:

```ts
type HeadingProps = PolymorphicProps<HeadingTag, { ... }> & { as: HeadingTag };
```

*Why*: there is no neutral heading level. Any default would silently emit the
wrong level into the document outline at call sites that forgot the prop - an
accessibility defect that is invisible in review. Requiring it moves that to a
compile error.

### Plain `FC`, not a call-signature interface

Because `as` is a fixed union rather than a type parameter, `Heading` is not
generic. All four tags share `HTMLAttributes<HTMLHeadingElement>`, so
`ComponentPropsWithoutRef<'h1' | 'h2' | 'h3' | 'h4'>` collapses to a single
prop shape and `FC<HeadingProps>` expresses it.

*Why*: AGENTS.md section 3 says the call-signature interface exists only
because `FC` cannot express a *generic* call signature. That constraint does
not apply here, so the simpler form is correct. This is a deliberate
divergence from `Divider`/`Grid`, not an oversight - worth stating in review
because the file will look different from its siblings.

### Literal font metrics and family; tokenised colour only

`font-size`, `line-height`, `font-weight` and `font-family` are written as
literal values. `color` stays `var(--text-title)`.

*Why*: there are no line-height or font-weight tokens to use, and introducing
a token family is a larger change than this component should carry. The size
tokens (`--fonts-size-16/18/20/24/28`) do exist and would cover the sizes, but
mixing tokenised sizes with literal line heights reads worse than keeping the
whole metric block literal and consistent.

*Trade-off accepted*: this makes `Heading` the one component whose typography
does not follow the theme. A future second theme that wants a different
heading face must override the rule rather than redefine a property.

### Headings render in Open Sans, not the specimen's Alexandria

The Figma specimen sets all four Title levels in Alexandria
(`--fonts-family-marketing`) and uses Open Sans only for the Paragraph
scale. `Heading` nonetheless renders in Open Sans, the product's main face.

*Why*: an explicit product decision, taken after the specimen was read. It
is recorded as a decision rather than silently followed so that a later
reader comparing the component against Figma finds the divergence explained
instead of filing it as a bug. Reverting it is a one-line change to the
`font-family` declaration; nothing else in the component depends on the
face.

*Side effect*: Open Sans is already loaded by Storybook and by the wallet,
so unlike Alexandria this needs no font-loading change anywhere, and the
heading face matches body copy out of the box.

### Strict BEM class names

Classes are `heading`, `heading_h1`-`heading_h4` and
`heading_regular`-`heading_bold`: one block with two families of
single-underscore modifiers, nested in SCSS as `&_h1`.

*Deviation*: AGENTS.md section 6 records the house style as "BEM-ish flat
naming scoped by nesting" (`.button`, `.button.primary`), not strict BEM.
Strict BEM here is an explicit instruction, and `Menu.module.scss` already
uses the block/element/modifier form, so this follows the repo's existing
BEM component rather than inventing a third convention.

*Why single-underscore modifiers over `--`*: `Menu` spells its modifier
`&_active`, so `heading_h1` matches the one precedent in the codebase.
Modifier values do not collide across the two families (`h1`-`h4` versus the
four weight names), so a key-value form (`heading_level_h1`) would add
length without removing ambiguity.

### H1 responsiveness lives in CSS, not JavaScript

The H1 step is a `breakpoint-up(md, $breakpoints)` block nested inside the
`&_h1` modifier in `Heading.module.scss`, written mobile-first: the base
`heading_h1` rule carries 24px/28px and the `md` block raises it to
28px/38px.

*Alternative considered*: the existing `useBreakpoint` hook (`react-responsive`).

*Why not*: a hook costs a render pass, renders the wrong size on the first
paint, and makes the component stateful for something CSS does for free. The
hook exists for behavioural branching, not styling. Mobile-first also matches
`Grid.module.scss`, the only other breakpoint-aware stylesheet.

### Weight as a named union, mapped in CSS

`weight` is `'regular' | 'medium' | 'semibold' | 'bold'`, mapped to 400/500/
600/700 by one class each. Default `'semibold'`.

*Why*: every existing token union in the uikit is string-literal
(`ButtonSize`, `DividerOrientation`); the one numeric union, `DividerThickness`
(`1 | 2`), is numeric because the values *are* pixels. Weight names read
better at call sites and leave room for a weight the numeric scale would
collide with.

*Why `'semibold'`*: it is the most frequent weight in the specimen and the only
one present at every level including H1 mobile.

### Verification approach

`pnpm biome check --write` and `packages/uikit`'s `tsc -b` / `vite build`,
plus Storybook for the visual check. Per AGENTS.md section 8, ESLint, Prettier
and `turbo run lint` do **not** execute in this repo - no step of this design
relies on them. When checking `apps/wallet`, diff against the ~171 pre-existing
`TS2307` errors on uikit's `*.svg?react` imports rather than reading them as a
regression.

## Risks / Trade-offs

- **The component diverges from the Figma specimen's face** → anyone checking
  the component against the design file sees a mismatch. Mitigated by
  recording it as an explicit decision above and in the proposal, not by
  changing either side.
- **uikit does not ship the webfont** → a consumer that omits it gets correct
  metrics in the wrong face, with no error. Both current render targets
  (`apps/wallet/index.html`, `.storybook/preview-head.html`) already load
  Open Sans at the needed weights. The spec records the contract.
- **Tag and appearance are coupled** → a page needing an `<h2>` at H4 size has
  to reach for `className`. Accepted; the additive `variant` escape hatch is
  described above.
- **Heading opts out of theme typography** → a second theme cannot restyle the
  heading face through custom properties. Accepted per the explicit decision to
  hardcode; revisit if a second theme lands.
- **Divergent file shape** → `Heading.tsx` will use `FC` where its polymorphic
  siblings use a call-signature interface. Mitigation: the rationale above, and
  AGENTS.md section 3 already sanctions `FC` for non-generic components.

## Open Questions

None. The API shape, breakpoint, weight naming and tokenisation boundary were
settled before this change was written.
