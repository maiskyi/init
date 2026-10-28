# Tasks

All paths are relative to `packages/uikit/src/`.

## 1. Divider component

- [x] 1.1 Add `components/Divider/Divider.types.ts` exporting `DividerOrientation` (`'horizontal' | 'vertical'`) and `DividerThickness` (`1 | 2`); verify `pnpm --filter @rockethash/uikit exec tsc -b` passes
- [x] 1.2 Add `components/Divider/Divider.tsx` modelled on `Card.tsx`: `DividerProps<C>` via `PolymorphicProps`, `DividerComponent` call signature with `<C extends PolymorphicElement = 'div'>`, destructured defaults (`as: Component = 'div'`, `orientation = 'horizontal'`, `thickness = 1`), `children` dropped, `role="separator"` and vertical-only `aria-orientation` set before `{...props}`, classes via `cn(styles.divider, styles[orientation], styles[\`thickness-${thickness}\`], className)`; verify `tsc -b` passes and that `<Divider thickness={3} />` in a scratch file fails type-checking
- [x] 1.3 Add `components/Divider/Divider.module.scss` using the `@each $theme, $config in vars.$themes { [data-theme='#{$theme}'] { … } }` scoping from `Grid.module.scss`, with the `.divider` reset and background rules, `.horizontal` / `.vertical` sizing and `.thickness-1` / `.thickness-2` (design §3); verify in Storybook devtools that the computed `background-color` equals `--borders-border-gray` and that `as="hr"` shows no default border or margin
- [x] 1.4 Add `components/Divider/index.ts` with separate `export type { DividerProps } from './Divider'`, `export { Divider } from './Divider'` and `export type { DividerOrientation, DividerThickness } from './Divider.types'`; verify `tsc -b` passes

## 2. Storybook

- [x] 2.1 Add `components/Divider/Divider.stories.tsx` (`title: 'Layout/Divider'`, alphabetically sorted `args`, controls for `orientation` / `thickness` / `as`) with stories: Default (horizontal in a block), Thick (`thickness={2}`), Vertical (between items in a 40px flex row, with a note about the flex-parent contract), As list item (`as="li"` in a `ul`), As hr; verify each scenario in `specs/uikit-divider/spec.md` by inspecting the rendered DOM (element, role, aria-orientation, class, size) in Storybook

## 3. Root barrel

- [x] 3.1 In `src/index.ts`, add `export { Divider, type DividerOrientation, type DividerProps, type DividerThickness } from './components/Divider'` and `export { OutsideClickHandler, type OutsideClickHandlerProps } from './components/OutsideClickHandler'` in alphabetical position, matching the file's existing combined style; verify that every folder under `components/` now appears in the root barrel, and that `import { Divider, OutsideClickHandler } from '@rockethash/uikit'` type-checks from a scratch file

## 4. Integration checks

- [x] 4.1 Run `pnpm biome check --write` and `pnpm --filter @rockethash/uikit build`; verify both succeed and that `dist/themes/duckdice.css` contains the `.divider` rules with no `data-theme` string in them

## Workflow follow-up

- Archive the change after review. Note in the archive summary that AGENTS.md §5 and §9 (partial root barrel, empty component barrels) are out of date and a candidate for a docs follow-up.
