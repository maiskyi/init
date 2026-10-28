# Tasks

## 1. SVG sources

- [x] 1.1 Export the four icons from Figma file `cFBTCE662HYRChalLq4p3B` (nodes `1:886`, `8719:284062`, `1:39`, `1:1211`) and reduce each to a minimal `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">` holding only the glyph `<path>` (keeping `fill-rule`/`clip-rule`, dropping background rects, `<g>`, `id`, `clipPath`/`defs` and `fill` colors) per design.md Decision 1; verify each file has exactly one `<path>` and no `<rect>`
- [x] 1.2 Save them as `packages/uikit/src/components/Icon/svg/duckdice/{chevron-right,arrow-up,exchange,safe}.svg` (`1:886` → `chevron-right`, `8719:284062` → `arrow-up`, `1:39` → `exchange`, `1:1211` → `safe`); verify `ls svg/duckdice` lists 6 SVGs
- [x] 1.3 Copy the same four files into `packages/uikit/src/components/Icon/svg/tower/`; verify `diff -r svg/duckdice svg/tower` reports no differences

## 2. Generate and verify

- [x] 2.1 Run `pnpm gen:icons` in `packages/uikit`; verify it prints `Generated 6 icons for themes: duckdice, tower` and `__generated__/rockethash.ts` lists `arrow-up`, `check-circle`, `chevron-down`, `chevron-right`, `exchange`, `safe` in `IconName`
- [x] 2.2 Run `pnpm biome check --write` and `tsc -b` in `packages/uikit`; verify both exit 0 (no lint/Prettier/test step exists to rely on, per AGENTS.md §8)
- [x] 2.3 Open Storybook's `Icons/Icon` gallery and check under both `duckdice` and `tower`: all six icons render (none as a solid square) and `chevron-right` keeps its padding next to `chevron-down` instead of filling the full height. If it doesn't, stop and raise the normalize question from design.md Decision 2 instead of working around it per icon
