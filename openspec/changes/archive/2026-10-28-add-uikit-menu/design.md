# Design

## Context

- Source design: Figma Wallet file, node `10193:19427` ("Modal"). The menu is
  the `dop` frame inside it: three instances of the library `Menu Item`
  component set (Withdraw / Swap / Vault), stacked with a 4px gap. Each
  instance is a 44px-tall row: `Left icon` (16px), label (Open Sans 14/20,
  `--text/primary`), `Right icon` (16px chevron), 12px padding, 8px gap, 6px
  radius. Only the default variant is visible in this frame. The `Menu Item`
  component set lives in a separate library file ("Components") that was not
  inspected, so its hover/active/disabled variants are not known.
- `Dropdown.Menu`/`Dropdown.MenuItem` (`components/Dropdown/`) already render a
  `ul`/`li` list with near-identical row styles (44px, 12px padding, 8px gap,
  6px radius, hover = white text on `--colors-gray-300a-10`). They are coupled
  to `DropdownContext`: `DropdownMenuItem` calls `close()` on click and puts
  the click handler on the `li`, not the focusable element.
- The icon font (`components/Icon/__generated__/rockethash.ts`) has only
  `chevron-down` and `check-circle`. The Figma glyphs (withdraw, exchange,
  safe, chevron-right) are not in it, and the font has two themes
  (`duckdice`, `tower`) whose SVG folders must hold the same file names.
- Other uikit components (`Card`, `Divider`, `DropdownMenuItem`) use the
  `PolymorphicProps` / call-signature-interface pattern for an `as` prop.

## Goals / Non-Goals

**Goals:**
- A standalone `Menu` + `Menu.Item` that matches the Figma row and list
  exactly in the `duckdice` theme, with no dependency on `Dropdown`.
- Icon-agnostic slots, so consumers can pass `Icon`, `CryptoIcon`, `ImgIcon`
  or any SVG.

**Non-Goals:**
- Refactoring `Dropdown.Menu`/`Dropdown.MenuItem` onto `Menu`. Possible later,
  but it changes Dropdown markup and click behaviour, so it gets its own change.
- `tower` theme styles. Only `Button` and `Icon` style `tower` today; `Menu`
  follows `Card`/`Dropdown` and styles `duckdice` only.
- Adding Figma glyphs to the icon font (needs `tower` SVGs nobody has yet).
- Keyboard roving focus / `role="menu"` semantics. This is a navigation list,
  not an ARIA menu widget; each row is a native button or link and gets
  normal Tab focus.
- A `disabled` state (not in the visible design).

## Decisions

1. **Folder layout.** `components/Menu/` with `Menu.tsx`, `Menu.types.ts`,
   `Menu.module.scss`, `Menu.stories.tsx`, `index.ts`, and a nested
   `MenuItem/` folder (`MenuItem.tsx`, `index.ts`), mirroring
   `Dropdown/DropdownMenuItem/`. One shared `Menu.module.scss` (imported by
   `MenuItem` as `'../Menu.module.scss'`) as Dropdown does, rather than a
   second stylesheet for a three-rule row.

2. **Compound typing.** `Menu` is non-generic, so it is a plain function
   component typed through a `MenuCompoundedComponent` interface: a call
   signature for `MenuProps` plus `Item: typeof MenuItem`, then
   `Menu.Item = MenuItem`. No `forwardRef`: `Dropdown` needs one for its
   imperative handle, `Menu` has nothing to expose, and React 19 passes `ref`
   as a normal prop if one is wanted later. `MenuItem` is generic over `as`,
   so it uses a `MenuItemComponent` call-signature interface with
   `PolymorphicProps<C, {...}>`, like `DropdownMenuItem` and `Card`.
   Alternative: `FC<MenuItemProps>`, which cannot express the generic `as`.

3. **Slots as `ReactNode`: `prefix` / `suffix`.** These map to the Figma
   `Left icon` / `Right icon` layers. They are named by position in the row
   rather than as icons or as left/right, so the names still fit right-to-left
   layouts and non-icon content. Each slot is wrapped in a span only when
   provided, so a row without them has no empty gap. The wrapper is still a
   16px box (`.menu__item-icon`) sized for icons, as in the design. Icon colour comes from `currentColor`
   (the row's text colour), so `Icon`-font glyphs follow hover/active
   automatically. Alternatives: an `icon: IconName` prop (only two glyphs
   exist, and it would block `CryptoIcon`/`ImgIcon`), or a built-in `arrow`
   boolean (bakes a glyph choice the font cannot supply yet).

4. **No context.** `Menu` has no state to share with its items; each item is
   self-contained. This differs from `Dropdown`, which needs context for
   open/close. If `Menu` later gains a selected value, a `Menu.context.ts`
   with a fully populated default (AGENTS.md §4) is the place for it.

5. **Click on the row element, default `as="button"` with `type="button"`.**
   `onClick` (default `noop`) is wired via `handleOnClick` on the polymorphic
   element, not the `li`, so keyboard activation of a button/link fires it
   and a router `Link` gets the click. `type="button"` prevents accidental
   form submission when a menu sits inside a `Form`. Consumer props are spread
   after, so `as="a" href=...` works.

6. **Styling.** `[data-theme="duckdice"] { .menu { ... } }` at the top of the
   module (required by `themeCssSplit`, AGENTS.md §6). Values map to existing
   tokens: `--Details-Spacing-4` (list gap), `--Details-Spacing-12` (padding),
   `--Details-Spacing-8` (gap), `--Details-Radius-rounded-6`, `--text-primary`.
   Highlight (hover / `.active`) uses `--text-title` and
   `--surface-panels-panel-bg-light-10`: these are the semantic aliases of the
   same raw values Dropdown's hover uses (`--colors-white-100`,
   `--colors-gray-300a-10`), keeping to the "semantic tokens only" rule.
   Button reset (`border: none; background: transparent; font: inherit;
   text-align: left; width: 100%`) plus `text-decoration: none` so `a` rows
   look identical. Classes: `.menu`, `.menu__item`, `.menu__item-content`,
   `.menu__item-content_active`, `.menu__item-icon`, `.menu__item-label`,
   matching Dropdown's naming in the same kind of component.

7. **Exports.** `Menu/index.ts` re-exports `Menu`, `MenuProps`, `MenuItem`,
   `MenuItemProps` as separate `export` / `export type` statements, and the
   root `src/index.ts` adds `export { Menu, type MenuProps } from
   './components/Menu'` and the same for `MenuItem`, in the root barrel's
   current inline `type` style.

8. **Story.** `Menu.stories.tsx` (`title: 'Navigation/Menu'`) with a story
   reproducing the Figma list (Withdraw / Swap / Vault). Since the font lacks
   those glyphs, the story passes small inline placeholder SVGs for
   `prefix` and `<Icon name="chevron-down" />` rotated −90° for
   `suffix`, and an `Active` story. Placeholders live only in the story
   file, not in the component.

## Verification approach

No test runner exists (AGENTS.md §7) and this change does not add one. The
spec scenarios are checked by hand in Storybook (DOM via devtools, sizes via
the box model, hover/active/keyboard by interaction) and against the Figma
screenshot. Static checks are `pnpm biome check --write` and `tsc -b` /
`vite build` in `packages/uikit`. Nothing here relies on ESLint, Prettier or a
turbo `lint`/`test` task, none of which run in this repo (AGENTS.md §8).

## Risks / Trade-offs

- [Hover/active colours are inferred from Dropdown, not read from the Figma
  `Menu Item` variants] → Isolated to two declarations in
  `Menu.module.scss`; confirm against the library component during review.
- [Two near-duplicate menu-row implementations (Dropdown and Menu)] →
  Accepted for now; tracked as a follow-up to rebase Dropdown onto Menu.
- [Story icons are placeholders, so the story won't match Figma glyph for
  glyph] → Layout, sizes and colours still match; real glyphs arrive with an
  icon-font change.
- [`packages/uikit` `tsc -b` is the type gate; `apps/wallet` build already
  fails on unrelated svgr types (AGENTS.md §9)] → Verify in uikit; do not
  treat the wallet's pre-existing failure as caused by this change.

## Open Questions

- Exact hover/active colours of the library `Menu Item` component set; only
  two SCSS values change if they differ.
