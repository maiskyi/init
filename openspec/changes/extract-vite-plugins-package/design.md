# Design

## Context

See proposal.md (Why) for motivation. The current state and constraints that shape the approach:

- The plugin is a single self-contained file, `packages/uikit/plugins/themeCssSplit/themeCssSplit.plugin.ts`. It imports only `vite` (a type), `postcss`, `postcss-selector-parser` and `lightningcss`, and nothing from uikit.
- uikit's `vite.config.ts` imports it by relative path with an explicit `.ts` extension. Vite bundles it into the config today.
- uikit's `tsconfig.node.json` (composite, `emitDeclarationOnly`, referenced from `tsconfig.json`) includes only `plugins/`. `vite.config.ts` is in no tsconfig and is not type-checked.
- **Vite 8.3.4 config loading** (default `configLoader: 'bundle'`): the `externalize-deps` plugin marks *every* bare import as external, workspace packages included. Older Vite versions bundled linked packages; Vite 8 does not. `@repo/vite` is therefore loaded by Node at config time, not by Vite's bundler.
- **Node 24** strips types natively for `.ts` files whose real path is outside `node_modules`. pnpm's workspace symlink resolves to `packages/vite/src/...`, so this applies. Probed in a scratch project: loading through the symlink works, but a directory import (`export { a } from './a'`) fails with `ERR_UNSUPPORTED_DIR_IMPORT`. Extensionless relative imports fail the same way.
- **TypeScript and source imports** (probed with uikit's tsc 6.0.3): when a composite consumer imports `.ts` source from another package, tsc type-checks that file with the *consumer's* options. The `.ts` import paths then fail with TS5097 unless the consumer also enables `allowImportingTsExtensions`.

## Goals / Non-Goals

**Goals:**
- `@repo/vite` works with no build step: Node and Vite run its source as-is.
- Each package type-checks the plugin source under that package's own settings, with `tsc -b` as the gate (AGENTS.md §8).
- Adding a second plugin later means one new folder plus one barrel line.

**Non-Goals:**
- Publishing `@repo/vite` outside the workspace (it is `private: true`).
- Changing any plugin logic. The file moves byte-for-byte except for import paths.

## Decisions

### 1. Package layout and exports: a single root barrel

```
packages/vite/
  package.json            name @repo/vite, private, type module,
                          exports { ".": "./src/index.ts" }
  tsconfig.json
  src/
    index.ts              export { themeCssSplit } from './themeCssSplit/index.ts';
    themeCssSplit/
      index.ts            export { themeCssSplit } from './themeCssSplit.plugin.ts';
      themeCssSplit.plugin.ts
```

- This is the user's choice: one import surface, `import { themeCssSplit } from '@repo/vite'`.
- Each plugin folder follows AGENTS.md's `<name>.<kind>.ts` naming plus a folder barrel `index.ts`, like uikit's component folders. The plugin keeps its named export and has no default export.
- *Trade-off accepted:* importing `@repo/vite` evaluates every plugin module, so all of their top-level dependencies are loaded. With one plugin this costs nothing. If a future plugin brings heavy dependencies, adding a subpath export (`"./*"`) next to `"."` is a non-breaking follow-up.
- *Alternatives:* subpath per plugin (`@repo/vite/themeCssSplit`), or both. Both were rejected in favor of the simpler single surface.

### 2. No build step; source is Node-loadable TypeScript

`exports` points at `.ts` source, as `@repo/typescript-config` and uikit's `"./*": "./src/*.tsx"` already do. Because Node loads this source directly (Context), the source must follow two rules:
- **Explicit `.ts` relative paths and no directory imports.** Barrels import `./themeCssSplit/index.ts`, not `./themeCssSplit`. This needs `allowImportingTsExtensions`, which TypeScript allows only with `noEmit` or `emitDeclarationOnly`.
- **Only erasable syntax:** no `enum`, `namespace` or parameter properties. `erasableSyntaxOnly: true` in the package tsconfig enforces this at type-check time. The current plugin already complies (interfaces, `as` casts and inline `type` imports only).
- *Alternative: compile to `dist/` with tsc and export JS.* Rejected: it adds a build artifact and a watch step for dev, and it would be the first package in the repo to build JS for internal use.

### 3. Type-checking through a project reference

- `packages/vite/tsconfig.json` extends `@repo/typescript-config/base.json`. Its `NodeNext` resolution matches how Node actually loads the files. It adds `composite`, `emitDeclarationOnly`, `allowImportingTsExtensions`, `erasableSyntaxOnly`, `rootDir: src`, and an `outDir` under `node_modules/.tmp/` (the same pattern as uikit's `tsconfig.node.json`). The declarations exist only so references work; nothing publishes them.
- uikit's `tsconfig.node.json` changes `include` from `["plugins"]` to `["vite.config.ts"]` and adds `references: [{ "path": "../vite" }]`. tsc then resolves `@repo/vite` to the referenced project's emitted `.d.ts` instead of re-checking the source with uikit's options. Probed in a scratch project: exit 0, and uikit does **not** need `allowImportingTsExtensions`.
- `@repo/vite` gets `"build": "tsc -b"`, so Turbo's `^build` type-checks it before uikit builds.
- *Alternative: no reference; add `allowImportingTsExtensions` to uikit's `tsconfig.node.json`.* That also probed green, but every future consumer would need the same flag, and the plugin would be checked under each consumer's options instead of its own.
- `vite.config.ts` is type-checked for the first time. If this surfaces existing errors, they are fixed as part of the change, since the include change is what exposes them.

### 4. Dependencies

| Package | Field | Entries |
|---|---|---|
| `@repo/vite` | `dependencies` | `lightningcss`, `postcss`, `postcss-selector-parser` (versions copied from uikit) |
| `@repo/vite` | `peerDependencies` | `vite: ^8.3.0` |
| `@repo/vite` | `devDependencies` | `vite`, `typescript`, `@repo/typescript-config: workspace:*` |
| `packages/uikit` | `devDependencies` | `+ @repo/vite: workspace:*`; `- lightningcss`, `- postcss`, `- postcss-selector-parser` |

- `vite` is also a devDependency so that `import { type Plugin } from 'vite'` resolves from `packages/vite/src` at type-check time. At runtime the inline type import is stripped to `import {} from 'vite'`, which still needs `vite` to resolve from the plugin's real path.
- **TypeScript version:** `~6.0.2`, matching uikit. uikit's `tsc -b` builds the referenced project with uikit's compiler anyway, and matching versions avoids the two compilers invalidating each other's `.tsbuildinfo`. This sides with the referencing package for this case only; it does not settle the repo-wide 6-vs-7 split that AGENTS.md §9 flags.

## Risks / Trade-offs

- **[Risk] Vite or Node loading differs from the probe.** The probe used a minimal scratch project, not the real config. → *Mitigation:* the tasks require a real `pnpm --filter @rockethash/uikit build` and a check of `dist/themes/duckdice.css` against the pre-move output.
- **[Risk] Someone later adds a directory import or an `enum` to `@repo/vite`.** → `allowImportingTsExtensions` does not *require* extensions, so tsc will not catch a directory import; it fails only when Vite loads the config, with `ERR_UNSUPPORTED_DIR_IMPORT`. `erasableSyntaxOnly` does catch non-erasable syntax. → *Mitigation:* a short note in AGENTS.md about the source rules.
- **[Trade-off] Root barrel loads all plugins.** See Decision 1.
- **[Risk] Biome rules and the new package.** Biome runs repo-wide from the root `biome.json`, so the new files are covered with no extra config. Nothing here relies on ESLint, Prettier or a Turbo `lint`/`test` script, none of which run in this repo.

## Migration Plan

All in one commit: create `packages/vite`, move the file, rewire uikit, then `pnpm install` to relink. Nothing outside uikit consumes the plugin. Rollback means reverting the commit.
