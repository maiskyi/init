# Proposal

## Why

The Wallet modal in Figma ([Wallet › Modal, node `10193:19427`](https://www.figma.com/design/Ua1p9u6H4fy7VcwHn5efSA/Wallet?node-id=10193-19427&m=dev))
has a vertical list of navigation rows (Withdraw, Swap, Vault), each built from
the design library's `Menu Item` component: a left icon, a label, and a right
chevron. The uikit has no standalone component for this. The only menu UI
today is `Dropdown.Menu`/`Dropdown.MenuItem`, which is bound to
`DropdownContext` (clicking an item calls the dropdown's `close()`) and has no
icon slots, so it cannot be placed inline in a modal or page.

## What Changes

- Add a `Menu` compound component to `packages/uikit`: `Menu` renders the
  list, `Menu.Item` renders one row. `MenuItem` is also exported on its own,
  following the `Dropdown`/`Form` compound pattern (AGENTS.md §2).
- `Menu.Item` has optional `prefix` and `suffix` slots (any React node, e.g. an icon), a
  label from `children`, an `active` state, an `onClick` callback, and an
  `as` prop so a row can be a `button` (default), an `a`, or a router link.
- Styles follow the Figma `Menu Item` (44px row, 12px padding, 8px gap,
  6px radius, Open Sans 14/20, `--text-primary`) and the 4px gap between rows
  in the `Menu` list, in a `data-theme="duckdice"`-scoped SCSS Module.
- Export `Menu`, `MenuItem` and their props types from the uikit root barrel.
- Add a Storybook story that reproduces the Figma Withdraw/Swap/Vault list.

Not included: the rest of the Wallet modal (header, deposit cards, info
section, recent-withdrawals ticker), changes to `Dropdown`, and new glyphs in
the icon font (see design.md).

## Capabilities

### New Capabilities

- `uikit-menu`: the uikit's `Menu` compound component: a vertical list of
  clickable rows, each with optional prefix/suffix content, a label, and an active
  state.

### Modified Capabilities

None.

## Impact

- **Package**: `packages/uikit` only. New folder
  `src/components/Menu/` (`Menu.tsx`, `Menu.types.ts`, `Menu.module.scss`,
  `Menu.stories.tsx`, `index.ts`) with a nested `MenuItem/` subfolder
  (`MenuItem.tsx`, `index.ts`); one edit to `src/index.ts`.
- **apps/wallet**: not touched. The wallet already depends on
  `@rockethash/uikit` (`workspace:*`) and imports its source through the root
  barrel, so `Menu` becomes available to it once exported, but no wallet code
  uses it in this change.
- **Dependencies**: none new (`classnames` and `lodash.noop` are already
  used by uikit).
- **Public API**: additive only; no breaking changes.
