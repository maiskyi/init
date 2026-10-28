# Tasks

## 1. Icon source

- [x] 1.1 Export Figma node `3355:32386` (`Icons / arrow left`, Components file `cFBTCE662HYRChalLq4p3B`) as a 16×16 SVG, outlining and flattening any stroke first. Save it as `packages/uikit/src/components/Icon/svg/duckdice/chevron-left.svg` with `viewBox="0 0 16 16"`, one filled `<path>` and no `fill` colour, matching `chevron-right.svg`. Verify the file has no `stroke` attributes and that its path spans about x 5–11 / y 2–14.
- [x] 1.2 Copy the same file to `packages/uikit/src/components/Icon/svg/tower/chevron-left.svg`. Verify that `cmp` reports the two files identical and that `ls svg/duckdice svg/tower` list the same 11 names.

## 2. Font generation

- [x] 2.1 Run `pnpm gen:icons` in `packages/uikit`. Verify it prints `Generated 11 icons for themes: duckdice, tower`, and that `__generated__/rockethash.ts` has `'chevron-left'` in `IconName` and `ICON_CODEPOINTS`. Verify that `rockethash-duckdice.css` and `rockethash-tower.css` each contain an `.icon-chevron-left` rule under their `[data-theme]` selector.
- [x] 2.2 Run `pnpm biome check --write` and `pnpm build` in `packages/uikit` (`tsc -b && vite build && storybook build`). Verify both succeed and that `dist/themes/duckdice.css` and `dist/themes/tower.css` contain `icon-chevron-left`.

## 3. Visual check

- [x] 3.1 In Storybook (`pnpm dev` in `packages/uikit`), open `Icons/Icon`. Under both `duckdice` and `tower`, verify that `chevron-left` renders, matches Figma node `3355:32386`, and is the mirror image of `chevron-right` (same weight, size and vertical position). Verify that `chevron-right`, `exchange`, `face`, `safe` and `support`, whose codepoints shifted, still render their own glyphs. If `chevron-left` does not line up, apply the fallback from design.md (mirror `chevron-right.svg`'s path), then redo 1.2 and 2.1.
