# Tasks

## 1. Route theme-tagged font faces in themeCssSplit

- [x] 1.1 In `packages/vite/src/themeCssSplit/themeCssSplit.plugin.ts`, pass the discovered `themes` into `buildThemeNodes` and drop any `@font-face` whose unquoted `font-family` ends in `-<t>` (longest matching discovered theme `t`) when `t` is not the theme being built; leave other `@font-face` copied as before. Verify with `tsc -b` in `packages/vite` and by running the plugin's `generateBundle` on a fixture string in a throwaway Node script (scratchpad, not committed) covering the three scenarios in `specs/uikit-theme-stylesheets/spec.md` (routed, non-theme suffix `Inter-bold`, longest match `big-tower`)
- [x] 1.2 Update the plugin's JSDoc (it currently says "CSS not scoped to a theme is copied into every theme file") to mention theme-tagged `@font-face` routing; verify by reading the comment against the spec

## 2. Per-theme SVG sources

- [x] 2.1 Move `src/components/Icon/svg/*.svg` into `src/components/Icon/svg/duckdice/` with `git mv`; verify `git status` shows renames, not delete+add
- [x] 2.2 Copy the duckdice SVGs into `src/components/Icon/svg/tower/` as placeholders; verify both folders list the same filenames

## 3. Single config + generator

- [x] 3.1 Add `packages/uikit/icons.config.ts` exporting `themes` (`['duckdice', 'tower']`) and the shared fantasticon options carried over from `fantasticonrc.cjs` (typed with `RunnerOptions`), then delete `fantasticonrc.cjs`; verify `fantasticonrc.cjs` is gone and the options match the old file
- [x] 3.2 Add `packages/uikit/scripts/genIcons.ts` per design §1–4: check name parity (report each missing `name`/`theme`, exit 1 before writing), compute sorted codepoints from `0xf101`, empty `__generated__/`, call `generateFonts` per theme (`name: rockethash-<theme>`, `inputDir: svg/<theme>`, `selector: [data-theme="<theme>"] .icon`, TS only on the first run via `pathOptions.ts` → `__generated__/rockethash.ts`), then write `__generated__/rockethash.css` with one `@import` per theme. Use `.ts` relative import specifiers only. Verify by deleting `svg/tower/check-circle.svg` temporarily: `pnpm gen:icons` exits non-zero naming `check-circle` and `tower`, and `git status` shows no `__generated__` changes; then restore the file
- [x] 3.3 Point `"gen:icons"` in `packages/uikit/package.json` at `node scripts/genIcons.ts` and add `icons.config.ts` and `scripts` to `tsconfig.node.json#include`; verify `tsc -b` in `packages/uikit` passes with both files type-checked
- [x] 3.4 Edit `src/components/Icon/Icon.hbs` per design §5 (remove the `:root` custom-property block and the unscoped `{{else}}` selector branch); verify after the next generation that no generated CSS contains `--icon-` or `[class^=`

## 4. Generate and wire up the Icon component

- [x] 4.1 Run `pnpm gen:icons`; verify `__generated__/` contains exactly `rockethash.ts`, `rockethash.css`, `rockethash-duckdice.{css,woff,woff2}`, `rockethash-tower.{css,woff,woff2}`, that `ICON_CODEPOINTS` matches the `content` codepoints in both theme CSS files, and that every icon selector starts with `[data-theme=`
- [x] 4.2 Confirm `Icon.tsx`, `Icon/index.ts` and `Icon.gallary.mdx` still resolve `./__generated__/rockethash` and `./__generated__/rockethash.css` (adjust only if a path changed); verify `tsc -b` in `packages/uikit` passes
- [x] 4.3 Add a `[data-theme="tower"]` block to `Icon.module.scss` with the same `xs`/`sm`/`md`/`lg` size classes as duckdice, so icon sizes apply under tower; verify the tower block leads with `[data-theme]` (required by the split)
- [x] 4.4 Verify in Storybook (`pnpm dev` in `packages/uikit`): the Icons gallery and `Icons/Icon` story render glyphs under both DuckDice and Tower toolbar themes, and DevTools shows the computed `font-family` switching between `rockethash-duckdice` and `rockethash-tower`
  - Note: verified headlessly; the `Icons/Icon` story switches between `rockethash-duckdice` and `rockethash-tower`. The `Icon.gallary.mdx` docs page renders `<Icon>` outside any `data-theme` element, so it shows no glyphs now that icon CSS is theme-scoped. Accepted as-is by the user.

## 5. Build output and docs

- [x] 5.1 Run `pnpm build` in `packages/uikit`; verify `dist/themes/duckdice.css` contains a `rockethash-duckdice` `@font-face` and no `rockethash-tower`, `dist/themes/tower.css` the reverse, and neither contains `data-theme`
- [x] 5.2 Run `pnpm build` in `apps/wallet`; verify it succeeds and icons in the wallet (served with `data-theme="duckdice"`) still render with `rockethash-duckdice`
  - Note: `pnpm build` in `apps/wallet` fails in `tsc -b` with an existing `TS2307` on uikit `*.svg?react` imports (files untouched by this change). Verified with `vite build` instead, which succeeds and bundles both theme-scoped icon fonts. The user accepted this check.
- [x] 5.3 Update AGENTS.md: §6 "Icons" bullet (per-theme SVG folders, `icons.config.ts` + `scripts/genIcons.ts`, `rockethash-<theme>` fonts, theme-tagged `@font-face` routing in the "Built CSS is split per theme" bullet), and correct the outdated statements that `apps/wallet` does not depend on `@rockethash/uikit` (§1, §9); verify by re-reading those sections against the code
- [x] 5.4 Run `pnpm biome check --write` at the repo root; verify it exits 0
