# Tasks

## 1. Baseline

- [x] 1.1 Before changing anything, run `pnpm --filter @rockethash/uikit build` and copy `packages/uikit/dist/themes/duckdice.css` to the session scratchpad as the reference output. Verify the build exits 0 and the copy exists.

## 2. Create `@repo/vite`

- [x] 2.1 Create `packages/vite/package.json` with name `@repo/vite`, `private: true`, `type: module`, `exports: { ".": "./src/index.ts" }`, `scripts.build: "tsc -b"`, and the dependency, peerDependency and devDependency entries from design Decision 4 (versions copied from uikit; `typescript: ~6.0.2`). Run `pnpm install`. Verify it succeeds and `packages/vite/node_modules/` contains `vite`, `postcss`, `postcss-selector-parser` and `lightningcss`.
- [x] 2.2 Create `packages/vite/tsconfig.json` extending `@repo/typescript-config/base.json`, with `composite`, `emitDeclarationOnly`, `allowImportingTsExtensions`, `erasableSyntaxOnly`, `rootDir: "src"`, `outDir` and `tsBuildInfoFile` under `node_modules/.tmp/`, and `include: ["src"]` (design Decision 3). Verify in task 2.4.
- [x] 2.3 `git mv packages/uikit/plugins/themeCssSplit/themeCssSplit.plugin.ts packages/vite/src/themeCssSplit/themeCssSplit.plugin.ts`, leaving its contents unchanged. Add `packages/vite/src/themeCssSplit/index.ts` (`export { themeCssSplit } from './themeCssSplit.plugin.ts';`) and `packages/vite/src/index.ts` (`export { themeCssSplit } from './themeCssSplit/index.ts';`). Verify `git diff -M --stat` shows the plugin as a 100% rename.
- [x] 2.4 Run `pnpm --filter @repo/vite build`. Verify it exits 0. Then temporarily add `enum E { A }` to `src/index.ts` and verify the build fails on `erasableSyntaxOnly`. Remove the line.
- [x] 2.5 Verify Node can load the package the way Vite will: from `packages/uikit` (after task 3.1 links it), `node --input-type=module -e "import('@repo/vite').then(m => console.log(typeof m.themeCssSplit))"` prints `function`.

## 3. Rewire `packages/uikit`

- [x] 3.1 In `packages/uikit/package.json`, add `@repo/vite: workspace:*` and remove `lightningcss`, `postcss` and `postcss-selector-parser` from devDependencies. Run `pnpm install`. Verify `packages/uikit/node_modules/@repo/vite` is a symlink to `packages/vite`.
- [x] 3.2 In `packages/uikit/vite.config.ts`, replace the relative plugin import with `import { themeCssSplit } from '@repo/vite';` (Biome sorts it into the bare-package group). Delete the now-empty `packages/uikit/plugins/` folder. Verify `ls packages/uikit/plugins` fails and `pnpm biome check` passes.
- [x] 3.3 In `packages/uikit/tsconfig.node.json`, change `include` to `["vite.config.ts"]` and add `references: [{ "path": "../vite" }]` (design Decision 3). Verify `pnpm --filter @rockethash/uikit exec tsc -b` exits 0. Fix any errors this newly exposes in `vite.config.ts`. Then temporarily misspell `themeCssSplit` in `vite.config.ts` and verify tsc reports it. Revert.

## 4. Documentation

- [x] 4.1 Update AGENTS.md: in §1, add `packages/vite` (`@repo/vite`, shared Vite plugins, one folder per plugin, root barrel export) to the structure tree and the package list. In §6, change the plugin path to `packages/vite/src/themeCssSplit/themeCssSplit.plugin.ts`, imported from `@repo/vite`. Add a short note that `@repo/vite` ships TS source loaded natively by Node, so it uses explicit `.ts` relative imports, no directory imports, and erasable syntax only. Verify `grep -n "uikit/plugins" AGENTS.md` returns nothing.

## 5. Integration check

- [x] 5.1 From the repo root, run `pnpm build` (Turbo). Verify it exits 0 and the Turbo output shows `@repo/vite#build` running before `@rockethash/uikit#build`.
- [x] 5.2 Verify `diff` between the baseline from 1.1 and the new `packages/uikit/dist/themes/duckdice.css` is empty, and `storybook-static` CSS still contains `[data-theme=duckdice]`.
- [x] 5.3 Run `pnpm biome check` and `openspec validate extract-vite-plugins-package`. Verify both pass.

## Workflow follow-up

- Archive the change with `/opsx:archive` after review. Note in the summary that it touched the TypeScript 6-vs-7 split from AGENTS.md §9: `@repo/vite` pins `~6.0.2` to match uikit.
