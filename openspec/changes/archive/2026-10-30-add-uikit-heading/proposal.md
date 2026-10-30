# Proposal

## Why

The uikit has no typography component. Every heading in a product is written
as a raw `<h1>`-`<h4>` with ad-hoc styling, so the design system's Title
scale (Figma `Components`, node `3160:10831`) is not expressible from the
library.

`Heading` is the first piece of that scale: the four Title levels, each with
the four weights the design defines, and the one responsive step the design
calls for (H1 shrinks below tablet).

The Figma specimen draws the Title levels in Alexandria
(`--fonts-family-marketing`), but this component renders them in Open Sans,
the product's main face, by explicit decision. That is a deliberate
departure from the design file, recorded here so it is not later read as a
transcription error.

## What Changes

- Add `packages/uikit/src/components/Heading/` with `Heading.tsx`,
  `Heading.types.ts`, `Heading.module.scss`, `Heading.stories.tsx`, and a
  folder barrel `index.ts`.
- `Heading` takes a required `as` prop of `'h1' | 'h2' | 'h3' | 'h4'`, which
  selects the rendered element **and** the type scale together. There is no
  separate variant/size prop: tag and appearance are deliberately coupled in
  this first version, and an optional decoupling prop can be added later
  without breaking the surface.
- `Heading` takes an optional `weight` prop of
  `'regular' | 'medium' | 'semibold' | 'bold'` (400/500/600/700), defaulting
  to `'semibold'`.
- The H1 scale is responsive: 24px/28px below the `md` breakpoint (1025px)
  and 28px/38px from `md` up. H2, H3 and H4 are fixed at every width.
- Font metrics (`font-size`, `line-height`, `font-weight`) and the font
  family are written as literal CSS values, not custom properties. Only the
  text colour stays tokenised, as `var(--text-title)`.
- Export `Heading`, `HeadingProps`, `HeadingTag` and `HeadingWeight` from the
  package root barrel `src/index.ts`.
- Class names follow strict BEM (`heading`, `heading_h1`, `heading_bold`)
  rather than the flat variant classes described in AGENTS.md section 6,
  matching the `Menu` component's block/element/modifier precedent.

Not in scope: the Paragraph half of the same Figma node (Open Sans
medium/regular/small/mini/micro, with uppercase and underline variants). It
is a separate component and a separate capability.

No breaking changes: this is additive.

## Capabilities

### New Capabilities
- `uikit-heading`: the uikit's `Heading` component - which element it
  renders, the Title type scale per level, the weight scale, the responsive
  H1 step, and the theming contract (tokenised colour, literal font metrics,
  consumer-supplied webfont).

### Modified Capabilities
<!-- none -->

## Impact

- **Packages touched**: `packages/uikit` only. Nothing in `apps/wallet`
  changes; it picks `Heading` up automatically through the workspace source
  barrel it already imports, but no wallet markup is migrated to it here.
  The change does not cross the wallet <-> uikit boundary.
- **New files**: `src/components/Heading/*`; modified: `src/index.ts`.
- **Dependencies**: none added. `classnames` and the existing
  `PolymorphicProps` helper in `src/types/polymorphic.types.ts` cover it.
- **Runtime contract**: uikit does not ship or `@font-face` the Open Sans
  family. Consumers must load it themselves, as `apps/wallet/index.html` and
  `.storybook/preview-head.html` both already do; a consumer that does not
  gets the sans-serif fallback at the correct size, weight and line height.
  No font-loading change is needed anywhere for this component.
- **Theming**: because the family is literal rather than
  `var(--fonts-family-main)`, a future second theme cannot change the
  heading face without overriding the rule. This is a deliberate trade
  accepted for this change, not an oversight.
