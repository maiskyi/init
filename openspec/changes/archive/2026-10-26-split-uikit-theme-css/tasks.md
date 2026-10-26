# Tasks

## 1. Setup

- [x] 1.1 Add `postcss` and `postcss-selector-parser` as devDependencies of `packages/uikit` (`pnpm --filter @rockethash/uikit add -D postcss postcss-selector-parser`). Verify both appear in `packages/uikit/package.json` and `pnpm install` succeeds.
- [x] 1.2 Create `packages/uikit/plugins/themeCssSplit/themeCssSplit.plugin.ts` exporting a named `themeCssSplit()` that returns a no-op Vite plugin. Make the folder type-checked under the same strictness as `src` (design Decision 6). Verify `pnpm --filter @rockethash/uikit exec tsc -b` passes and reports errors from a deliberately broken line in the plugin file, then remove that line.

## 2. Split logic

- [x] 2.1 In `generateBundle`, collect every `.css` asset in bundle order, parse them with PostCSS, and delete them from the bundle. Verify `vite build` emits no `dist/index.css`.
- [x] 2.2 Implement selector classification and rewriting (design Decision 3): leading-compound `data-theme` removal, a bare `[data-theme=X]` becoming `:root`, per-selector splitting of mixed lists, shared selectors kept, and an error for a non-leading attribute. Verify with a build and the checks in 2.5 and 2.6.
- [x] 2.3 Implement the node walk: rules split per theme, conditional group at-rules (`@media`, `@supports`, `@container`, `@layer`) handled recursively with empty wrappers dropped, and all other nodes shared. Keep source order. Emit `themes/<theme>.css` with `this.emitFile` for each discovered theme. Verify `vite build` emits `dist/themes/duckdice.css`.
- [x] 2.4 Implement validation (design Decision 4): fail on duplicate `@keyframes` names within a theme file and fail when no theme is found, both through `this.error` with the offending name. Verify through the fixtures in 2.6.
- [x] 2.4a Turn off Vite's CSS minification from the plugin's `config` hook and minify each theme file with `lightningcss` after validation (design Decision 4a). Add `lightningcss` as a devDependency. Verify that the duplicate-keyframes fixture from 2.6 fails a default (minified) build, and that `dist/themes/duckdice.css` is still identical to the pre-change CSS with the attribute removed.
- [x] 2.5 Register `themeCssSplit()` in `packages/uikit/vite.config.ts`, in the non-Storybook branch only. Verify `pnpm --filter @rockethash/uikit build` succeeds and that `dist/themes/duckdice.css`:
  - contains no `data-theme`,
  - starts its token block with `:root{`,
  - contains `.icon-chevron-down:before`, the `rockethash` `@font-face`, and all 5 `@keyframes`,
  - has the same number of top-level rules as the old `index.css` (78 top-level nodes).
  Also verify `storybook-static` CSS still contains `[data-theme=duckdice]`.
- [x] 2.6 Using temporary fixture SCSS (not committed), verify each spec scenario not covered by today's code:
  - a second `[data-theme="tower"]` block produces `dist/themes/tower.css` without duckdice declarations,
  - a mixed selector list lands in both files,
  - an `@media` block is split per theme,
  - a bare `[data-theme="x"] { … }` becomes `:root`,
  - `.wrapper [data-theme="x"] .y` fails the build naming the selector,
  - the same `@keyframes` under two themes in one module fails the build naming it,
  - removing all theme scoping fails the build.
  Remove the fixtures afterwards and confirm `git status` shows no leftover fixture files.

## 3. Package surface and docs

- [x] 3.1 Add `"./themes/*.css": "./dist/themes/*.css"` to `packages/uikit/package.json` `exports`, keeping `"./*"` unchanged. After a build, verify `node -e "console.log(import.meta.resolve('@rockethash/uikit/themes/duckdice.css'))"`, run from a workspace package that depends on the uikit (or with `--input-type=module` from `packages/uikit`), resolves to `dist/themes/duckdice.css`.
- [x] 3.2 Update AGENTS.md §6 (Styling & theming) to describe the built output:
  - one `dist/themes/<theme>.css` per `data-theme` value, with the attribute stripped,
  - shared CSS duplicated into each file,
  - no combined stylesheet,
  - distinct `@keyframes` names required per theme,
  - Storybook still uses attribute scoping.
  Verify the section reads correctly and `pnpm biome check` passes.
- [x] 3.3 Run `pnpm biome check --write` and `pnpm --filter @rockethash/uikit build` (tsc, vite, and storybook) from a clean `dist/`. Verify both succeed and `dist/` contains `index.js` and `themes/duckdice.css` and no other CSS file.

## Workflow follow-up

- Separate change: repoint the uikit JS and type `exports` to `dist/`, so apps actually consume the built output and theme files.
- Possible follow-up: introduce Vitest and unit-test the split plugin against the fixtures from 2.6.
- When archiving, note that this change touched an area flagged in AGENTS.md (uikit `exports` still point at source).
