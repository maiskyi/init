# Design

## Context

uikit already has a polymorphic pattern: `types/polymorphic.types.ts` (`PolymorphicProps<C, OwnProps>`, which adds `as?: C`), used by `Card` and `Grid`. `Card` is the template for the component. Its generic defaults to `typeof Fragment` while it renders a `div` at runtime, which is a mismatch; `Grid` has the correct default, `C extends PolymorphicElement = 'div'`.

There are two theme-scoping styles in uikit SCSS. `Card.module.scss` hard-codes `[data-theme="duckdice"] { ... }`, while `Grid.module.scss` loops `@each $theme, $config in vars.$themes`. Either way `[data-theme]` stays the leading selector part, which `themeCssSplit` requires. The color token `--borders-border-gray` is defined per theme in `ThemeProvider.scss`.

## Goals / Non-Goals

**Goals:**
- A `Divider` that is styled the same regardless of `as`, including `hr`.
- A component that matches the `Card` code shape so it reads like its neighbours.

**Non-Goals:**
- Dividers with a text or label in the middle (children are not rendered).
- Spacing, inset or length props. Consumers control placement.
- Fixing `Card`'s generic default. That is noted, not changed here.
- AGENTS.md updates.

## Decisions

1. **Copy `Card`'s structure, with `Grid`'s generic default.** `DividerProps<C> = PolymorphicProps<C, { className?, orientation?, thickness? }>`, a `DividerComponent` call-signature interface with `<C extends PolymorphicElement = 'div'>`, and destructured defaults `as: Component = 'div'`, `orientation = 'horizontal'`, `thickness = 1`. *Alternative:* `forwardRef`. Rejected because `Card` and `Grid` don't forward refs either, and a generic forwardRef would need casts. In React 19, `ref` can be passed as a regular prop later if it's ever needed.

2. **`children` is not rendered.** `Divider` drops `children` instead of passing them to `Component`, so `as="hr"` (a void element) can never throw. *Alternative:* `Omit` `children` from the props type. Rejected because `PolymorphicProps` builds props from `ComponentPropsWithoutRef<C>` and omitting it per element type adds complexity for no gain.

3. **Draw with `background-color`, sized by width and height, rather than with a border.** Classes are `.divider`, `.horizontal` / `.vertical` and `.thickness-1` / `.thickness-2`, combined with `cn(...)` and `className` passed last. Base rules are `border: none; margin: 0; padding: 0; flex-shrink: 0; background-color: var(--borders-border-gray)`.
   - Horizontal: `width: 100%` (in flex columns `align-self: stretch` covers it) and `height: <t>px`.
   - Vertical: `width: <t>px`, `align-self: stretch`, and `min-height: 1em` as a fallback so it never collapses to nothing outside flex. The spec's scenarios only require the behaviour inside flex.

   The resets give `hr` the same look as `div`. *Alternative:* `border-top` / `border-left`. Rejected because sizing then depends on `box-sizing`, and `hr`'s default inset border styles would also have to be overridden per side.

4. **Thickness classes are explicit selectors, not inline style or a CSS variable.** Two values don't justify a variable. `styles[\`thickness-${thickness}\`]` keeps the `.pending`/`.active` class-based convention from AGENTS.md §6.

5. **Theme scoping uses the `vars.$themes` loop, like `Grid`.** The color comes from the theme's custom property, so the rule body is the same for every theme. The loop means a future theme needs no change here. *Alternative:* Card's literal `[data-theme="duckdice"]`. That works today but would need editing for each new theme.

6. **ARIA defaults are spread before `{...props}`.** `role="separator"` and `aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}` are set before the consumer props spread, so consumer values win (spec: "Consumer overrides role"). Horizontal is the ARIA default for separators, so the attribute is omitted then.

7. **Types live in `Divider.types.ts`.** `DividerOrientation = 'horizontal' | 'vertical'` and `DividerThickness = 1 | 2`. These are numeric literals rather than `'thin' | 'thick'`, because the values are literal pixels (similar to how `GridSpacing` is numeric).

8. **Exports.** `Divider/index.ts` uses separate `export type {}` / `export {}` statements. The root `src/index.ts` follows its existing combined style (`export { Divider, type DividerProps, ... } from './components/Divider'`), inserted alphabetically, and also adds `OutsideClickHandler, type OutsideClickHandlerProps`. Biome's organize-imports keeps the order.

**Tooling note:** verification relies on `pnpm biome check --write` and the uikit `build` script (`tsc -b && vite build && storybook build`). It does not rely on ESLint, Prettier or a turbo `lint`/`test` task, none of which run in this repo. No test runner exists, so scenarios are checked manually in Storybook and in the browser devtools.

## Risks / Trade-offs

- [Vertical divider outside a flex container has no height] → `min-height: 1em` fallback, and the story documents the flex-parent contract.
- [`width: 100%` on a horizontal divider placed as a flex-row item takes the whole row] → Expected for a horizontal rule. Use `orientation="vertical"` in rows.
- [A consumer passes `children` and expects them to render] → They are silently ignored. Labelled dividers are an explicit non-goal and could be a later variant.
- [`as` set to a custom component that doesn't forward `className`] → The divider renders unstyled. This is the same limitation as `Card` and `Grid`.
