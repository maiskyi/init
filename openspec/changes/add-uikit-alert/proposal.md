# Proposal

## Why

The uikit has no component for inline status messages, and the Figma
"Info Section" component set (Components file, node `3430:10040`) defines
one: a tinted, rounded banner with a status icon and copy, optionally
clickable. Products need a single themed way to show warnings, success,
errors, announcements and info notes instead of hand-styling them per
screen.

## What Changes

- Add an `Alert` component to `packages/uikit`
  (`src/components/Alert/`) with five variants: `warning`, `success`,
  `error`, `default`, `info`, mapped to the Figma variants Alert, Success,
  Error, Announcement, Information.
- Each variant has a default icon; an optional `icon` prop typed as the
  icon font's `IconName` replaces it.
- An optional `onClick` makes the whole alert clickable and shows a
  `chevron-right` icon on the right edge.
- Add four icons to the icon font, taken from the Figma duckdice artwork:
  `alert`, `cancel`, `face`, `support`. The same duckdice SVGs are also
  placed in `svg/tower/` (the icon-font spec requires every theme folder to
  hold the same names); tower-specific artwork can replace them later
  without code changes. `check-circle` and `chevron-right` are reused.
- Export `Alert`, `AlertProps`, `AlertVariant` and `IconName` from the
  uikit root barrel. `IconName` is needed by consumers to type the `icon`
  prop and is not exported from the root today.
- Out of scope: the hidden inline action `Button` present in every Figma
  variant. It may later be added as an optional `action` slot; this change
  does not add it.

## Capabilities

### New Capabilities
- `uikit-alert`: the `Alert` component's variants, default and overriding
  icons, content, clickable behavior and theming.

### Modified Capabilities
<!-- None. Adding icon names to the font follows the existing
     `uikit-icon-font` requirements without changing them. -->

## Impact

- Package touched: `packages/uikit` only. Does not cross into
  `apps/wallet`; the wallet picks the component up through the uikit source
  barrel like any other component.
- New files: `src/components/Alert/{Alert.tsx, Alert.types.ts,
  Alert.const.ts, Alert.module.scss, Alert.stories.tsx, index.ts}`.
- Icon font: four new SVGs in each of `src/components/Icon/svg/duckdice/`
  and `svg/tower/`, then regenerated `src/components/Icon/__generated__/*`
  via `pnpm gen:icons`. `IconName` gains `alert | cancel | face | support`
  (additive, non-breaking).
- `src/index.ts`: new exports `Alert`, `AlertProps`, `AlertVariant`,
  `IconName`.
- No new dependencies. No tests (none exist in the repo; this change adds a
  Storybook story as the existing pattern does).
