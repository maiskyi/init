# Proposal

## Why

The `themeCssSplit` Vite plugin lives inside `packages/uikit/plugins/` and can only be imported by uikit's own `vite.config.ts`. Other Vite packages in the monorepo (`apps/wallet`, `playgrounds/vike`) have no clean way to reuse it, and more shared Vite plugins are expected. A dedicated workspace package gives shared Vite tooling one home with its own dependencies.

## What Changes

- Add a new workspace package `packages/vite`, named `@repo/vite` (a tooling package, so it uses the `@repo/*` scope like `@repo/typescript-config`).
- Move `packages/uikit/plugins/themeCssSplit/themeCssSplit.plugin.ts` into `packages/vite/src/themeCssSplit/`. The plugin's behavior, Vite plugin name (`theme-css-split`) and error messages stay the same.
- `@repo/vite` exposes a single root entry (`"exports": { ".": "./src/index.ts" }`). The root barrel `src/index.ts` re-exports every plugin, so consumers write `import { themeCssSplit } from '@repo/vite'`. Each future plugin gets its own `src/<pluginName>/` folder and one more line in the root barrel.
- The package ships TypeScript source and has no JS build step, the same as `@repo/typescript-config` and uikit's source exports.
- Move the plugin-only dependencies (`postcss`, `postcss-selector-parser`, `lightningcss`) from uikit's devDependencies to `@repo/vite`'s `dependencies`. `vite` becomes a peerDependency of `@repo/vite`.
- `packages/uikit` adds `@repo/vite: workspace:*`, imports the plugin from `@repo/vite` in `vite.config.ts`, and deletes its `plugins/` folder.
- Repoint uikit's `tsconfig.node.json` from `plugins` (which disappears) to `vite.config.ts`. Without this, `tsc -b` finds no inputs and `pnpm build` fails. As a side effect, `vite.config.ts` gets type-checked for the first time.
- Update AGENTS.md (§1 repo structure, §6 styling) to name the new package and the plugin's new location.

No **BREAKING** changes: uikit's build output (`dist/themes/<theme>.css`) and the `@rockethash/uikit/themes/*.css` export are unchanged.

Out of scope: wiring `@repo/vite` into `apps/wallet` or `playgrounds/vike`; making the plugin configurable (attribute name, output folder); adding tests for the plugin.

## Capabilities

### New Capabilities

None. `@repo/vite` is internal build tooling with no product behavior of its own.

### Modified Capabilities

None. Every requirement in `uikit-theme-stylesheets` describes uikit's build output, not where the plugin's source lives, and all of them still hold after the move. The change sets `skip_specs: true`.

## Impact

- **Packages touched:** new `packages/vite`; `packages/uikit` (`vite.config.ts`, `package.json`, `tsconfig.node.json`, removal of `plugins/`). `packages/typescript-config` is reused, not changed. `apps/wallet` is untouched, and the change does not cross the wallet <-> uikit boundary.
- **Dependencies:** `pnpm-lock.yaml` changes because dependencies move from uikit to `@repo/vite`. No new third-party packages are added.
- **Loading model:** Vite 8 externalizes bare imports in config files, so Node 24 loads `@repo/vite`'s `.ts` source directly through native type stripping. The package's source must therefore use only erasable TypeScript syntax and explicit `.ts` relative import paths (see design).
- **Build order:** Turbo's `build` runs `^build` first, so `@repo/vite`'s type-check runs before uikit's build.
- **Docs:** AGENTS.md §1 and §6.
