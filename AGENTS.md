# AGENTS.md

Conventions observed in this repository, for agents and contributors working
in it. This document describes **what the codebase actually does today**. It
distinguishes rules that are mechanically **enforced** by configuration from
patterns that are merely **observed** in existing code (i.e. convention by
precedent, not by tooling). Where the two conflict, say so explicitly rather
than picking one.

This file was derived from reading configuration and representative source
files; it does not invent conventions beyond what was found.

## 1. Repository structure & package boundaries

Monorepo managed with **pnpm workspaces** + **Turborepo**.

```
apps/            deployable applications
  wallet/        React + Vite SPA (@rockethash/wallet)
packages/        shared, publishable/workspace-internal packages
  uikit/         React component library (@rockethash/uikit), built with
                 Vite + Storybook
  typescript-config/  shared tsconfig bases (@repo/typescript-config)
playgrounds/     throwaway/example apps, not part of the product
  next/          Next.js playground
  vike/          Vike (vite-plugin-ssr successor) playground
openspec/        OpenSpec spec-driven workflow artifacts (changes, specs,
                 config.yaml)
```

- Workspace globs (`pnpm-workspace.yaml`): `apps/*`, `packages/*`,
  `playgrounds/*`.
- Package manager is pinned: `pnpm@11.25.0` (`package.json#packageManager`).
  `engines.node` requires `>=24`.
- Turborepo (`turbo.json`) defines `build`, `dev`, and `lint` pipeline tasks,
  but **no package currently implements a `lint` (or `test`/`format`)
  script** — the `lint` task is declared at the root but is a no-op in
  practice today (see §9).
- Package naming: product packages/apps use the `@rockethash/*` scope
  (`@rockethash/wallet`, `@rockethash/uikit`); shared tooling packages use
  `@repo/*` (`@repo/typescript-config`). Workspace-internal deps are
  referenced as `workspace:*`.
- `apps/wallet` consumes generated API types/hooks (`orval`, react-query) but
  does **not** currently depend on `@rockethash/uikit` — the two packages are
  not yet wired together.
- `packages/uikit` exports its public surface via a single root
  `src/index.ts` barrel, and additionally via a package-level wildcard
  export map (`"exports": { "./*": "./src/*.tsx" }`), allowing deep imports
  of individual component files by consumers in addition to the root barrel.

## 2. Naming conventions

### Folders & files (packages/uikit — the most developed package)

- One folder per component, PascalCase, matching the component name exactly:
  `src/components/Button/`, `src/components/Dropdown/`.
- Within a component folder, files are named `<ComponentName>.<kind>.<ext>`:
  - `Button.tsx` — the component implementation
  - `Button.types.ts` — exported prop/union types not defined inline
  - `Button.const.ts` — constants (e.g. `FormNumber.const.ts`,
    `CryptoIcon.const.ts`)
  - `Button.context.ts` — React context + default value (e.g.
    `Dropdown.context.ts`, `Form.context.ts`, `Select.context.ts`)
  - `Button.hooks.ts` — component-local hooks (e.g. `Dropdown.hooks.ts`,
    `Form.hooks.ts`)
  - `Button.messages.ts` — user-facing copy (seen in `Form.messages.ts`)
  - `Button.module.scss` — CSS Modules stylesheet
  - `Button.stories.ts(x)` — Storybook CSF story (`.ts` when no JSX is
    needed, `.tsx` otherwise — both are used, apparently based on whether
    the story file needs JSX)
  - `Button.gallary.mdx` *(sic — misspelling of "gallery", used
    consistently across `CryptoIcon`, `FiatIcon`, `PaymentMethodIcon`,
    `Icon`)* — Storybook MDX doc/gallery page
  - `index.ts` — the folder's public barrel (see §5 on exports; **this is
    inconsistently populated**, see §10)
- Nested/compound sub-components live in their own subfolder under the
  parent, e.g. `Dropdown/DropdownContent/DropdownContentDefault/`,
  `Form/FormNumber/FormNumberInput/`, each following the same
  `<Name>.<kind>.ts(x)` scheme recursively.
- Non-component source is grouped by kind under `src/`: `src/hooks/`,
  `src/constants/`, `src/types/`. Standalone hook files are named
  `use<Thing>.hooks.ts` inside a `useThing/` folder (e.g.
  `hooks/useBreakpoint/useBreakpoint.hooks.ts`,
  `hooks/useIsomorphicLayoutEffect/useIsomorphicLayoutEffect.hooks.ts`).
  Standalone type files use `<name>.types.ts` (e.g.
  `types/breakpointToken.types.ts`, `types/polymorphic.types.ts`) and
  constants `<name>.const.ts` (e.g. `constants/breakpoints.const.ts`).
- Generated code lives under a `__generated__/` folder next to what it's
  generated for (`components/Icon/__generated__/`,
  `apps/wallet/src/_services/api/__generated__/`) and is not meant to be
  hand-edited.

### Folders & files (apps/wallet)

- `src/_services/` — leading-underscore folder for app infrastructure/data
  layer, aliased as `@services/*` in `tsconfig.json`/`vite.config.ts`. Not
  used anywhere else in the repo, so it reads as app-local convention rather
  than a repo-wide one.
- Within a service, files use `<name>.service.ts`, `<name>.types.ts`,
  `<name>.utils.ts` suffixes (`api.service.ts`, `api.types.ts`,
  `api-instance.utils.ts`), mirroring the uikit `<Name>.<kind>.ts` scheme
  but kebab-cased for multi-word names (`api-instance`, `api-query-options`)
  rather than PascalCase, since these are not components.
- `src/_services/api/openapi.json` is the orval input spec; generated output
  goes to `src/_services/api/__generated__/client*.ts` (tags-split mode, one
  file per API tag, e.g. `pet/pet.ts`, `store/store.ts`, `user/user.ts`).

### Components

- Component names: PascalCase, no prefixes/suffixes beyond semantic meaning
  (`Button`, `Dropdown`, `FormNumber`). Compound/related components are
  prefixed with the parent's name: `DropdownContent`, `DropdownMenuItem`,
  `FormCheckbox`, `FormNumberInput` — not nested namespacing in the type
  system, just the folder/file name.
- Compound component API: a parent component attaches its sub-components as
  static properties for consumer ergonomics (`Form.Number`, `Form.Select`,
  `Dropdown.Menu`, `Dropdown.Toggle`), while the sub-components are also
  individually exported as standalone named exports from their own folders.
  The compounded type is spelled out as an explicit interface
  (`FormCompoundedComponent`, `DropdownCompoundedComponent`) listing each
  static member plus a call signature, then the component is cast to that
  interface after `forwardRef`/plain definition.

### Hooks

- Hook names: `use<Thing>` (`useBreakpoint`, `useDropdown`,
  `useIsomorphicLayoutEffect`). Hooks that belong to one component live in
  `<Component>.hooks.ts` next to it and are consumed internally; hooks
  meant to be reused across components live in their own
  `src/hooks/use<Thing>/` folder with a barrel `index.ts`.

### Types

- Prop types: named `<Component>Props` (`ButtonProps`, `SelectProps`,
  `CheckboxProps`, `InputProps`).
- Union/enum-like tokens: named `<Component><Aspect>` (`ButtonSize`,
  `ButtonVariant`, `ButtonType`, `DropdownPlacement`, `SelectSize`), defined
  as string-literal unions, not TS `enum`.
- `type` vs `interface`: both are used, with no single rule, but a visible
  tendency — `interface` for prop shapes that `extend`/`omit` another type
  or that will be implemented by a class-like static-members object
  (`FormCompoundedComponent`, `DropdownContextProps`), `type` for simple
  shapes, especially ones wrapped in `PropsWithChildren<{...}>`
  (`ButtonProps`, `CheckboxProps`, `ToggleProps`, `DropdownProps`). Treat
  this as a loose tendency, not an enforced rule — nothing in Biome config
  enforces `interface`-over-`type` or vice versa.

## 3. TypeScript patterns

- **Type-only imports are inlined**, not written as separate `import type`
  statements: `import { type FC, forwardRef } from 'react'`. This is
  mechanically enforced — Biome's `style.useImportType` rule is `"on"` with
  `"style": "inlineType"`.
- Props destructured directly in the function signature, with defaults
  assigned there (`size = 'medium'`, `variant = 'tertiary'`) rather than via
  `defaultProps` or inside the body.
- Generic, polymorphic components use a **call-signature interface** instead
  of `FC<Props>` when the component itself is generic over a type param
  (`SelectComponent`, `FormCompoundedComponent`), because `FC` cannot express
  a generic call signature. Non-generic components use `FC<Props>` or
  `forwardRef<Element, Props>(...)` for anything that forwards a DOM ref.
- Shared/base tsconfig (`packages/typescript-config/base.json`) turns on:
  `strict`, `noUncheckedIndexedAccess`, `isolatedModules`,
  `moduleDetection: "force"`, `module`/`moduleResolution: NodeNext`,
  targeting `ES2022`, and emits declarations (`declaration`,
  `declarationMap`). `react-library.json` layers `jsx: "react-jsx"` on top;
  `nextjs.json` layers Next-specific bundler settings. These bases are
  **only consumed by `packages/uikit`** (`tsconfig.json` extends
  `@repo/typescript-config/react-library.json`) — `apps/wallet` does **not**
  extend `@repo/typescript-config` at all; its `tsconfig.app.json`/
  `tsconfig.node.json` are hand-rolled Vite-generated configs with their own
  strictness flags (`noUnusedLocals`, `noUnusedParameters`,
  `verbatimModuleSyntax`, `erasableSyntaxOnly`). This is a real split, not
  an oversight to silently "fix" — treat wallet and uikit as having
  independently-configured TypeScript strictness until unified.
- `type-fest` is used for utility types where the stdlib falls short
  (`PartialDeep` in `Form.types.ts`).

## 4. React patterns

- React 19, function components only — no class components anywhere in
  `src/`.
- React Compiler is enabled in both `packages/uikit` and `apps/wallet` via
  `babel-plugin-react-compiler` + `@rolldown/plugin-babel`
  (`reactCompilerPreset()`) wired into each package's `vite.config.ts`.
  Because the compiler handles memoization, manual `useMemo`/`useCallback`
  appears only where needed for referential stability across a context
  value or an imperative handle (e.g. `Dropdown.tsx`'s `contextValue`,
  `close`/`open` callbacks), not as a blanket habit.
- Context: one context per concern, created with a fully-populated default
  value object (every field given a concrete/no-op default, e.g. `noop` from
  `lodash.noop` for callback defaults) rather than `undefined` +
  a "must be used within provider" invariant check. Consumption goes through
  a dedicated hook (`useDropdown`) rather than raw `useContext` at call
  sites.
- Refs: `forwardRef` is used for any component that forwards a DOM node ref
  or exposes an imperative handle (`Button`, `Input`, `Dropdown` via
  `useImperativeHandle`).
- Conditional classNames are built with the `classnames` package (imported
  as `cn`), using the `cn(base, variantClass, { conditionalClass: bool },
  externalClassName)` shape consistently, external/consumer `className`
  passed last so it can override.
- Event handlers are named `handleOn<Event>` internally (`handleOnClick`,
  `handleOnChange`) and exposed to consumers as plain `on<Event>` props.
- Boolean/callback props default via destructuring defaults, not
  `?? false`/`?? noop` inline in the JSX.
- No `export default` on any component, hook, util, or type across
  `packages/uikit/src` or `apps/wallet/src/_services` — exports are always
  named (`export { Button }`, `export type { ButtonProps }`). The only
  `export default` usages in the repo are: (a) Storybook `.stories.*`
  files' `meta` object, which is required by Storybook's CSF format, and
  (b) `apps/wallet/src/App.tsx` / default Vite-scaffold files, which still
  carry the unmodified `create-vite` template and have not yet been adapted
  to this repo's conventions (see §10).

## 5. Imports & exports

- **Import ordering/grouping is enforced by Biome's `organizeImports`
  assist**, applied automatically on save/commit, in this exact group
  order: URL imports → blank line → node/bun protocol imports → blank line →
  bare package imports → blank line → alias (`@/...`) imports → blank line →
  relative path imports → blank line → style imports (`.css`/`.scss`) last.
  This is why every component file has the shape: external packages, blank
  line, local/relative imports, blank line, `styles from
  './X.module.scss'` as its own trailing group.
- Each barrel `index.ts` re-exports the component and its public type(s)
  explicitly, e.g.:
  ```ts
  export type { ButtonProps } from './Button';
  export { Button } from './Button';
  export type { ButtonSize, ButtonVariant } from './Button.types';
  ```
  Type and value exports are kept as separate `export type { ... }` /
  `export { ... }` statements rather than `export { type X, Y }` combined
  syntax.
- JSX attributes, object literal keys, and interface members are kept
  **alphabetically sorted** — this is mechanically enforced by Biome's
  assist actions (`useSortedAttributes`, `useSortedKeys`,
  `useSortedInterfaceMembers`, all `"on"`), not just a style choice. Expect
  this ordering in diffs and don't fight it.
- The package root barrel (`packages/uikit/src/index.ts`) only re-exports
  `Button`, `Select`, and `ThemeProvider` today, despite the package
  containing many more components (`Form`, `Dropdown`, `Checkbox`, `Input`,
  `Toggle`, `Loader`, icon components, etc.). Treat the root barrel as
  **partial/in-progress**, not as the definitive list of "public" vs
  "internal" components.

## 6. Styling & theming

- **SCSS Modules** (`*.module.scss` + `import styles from './X.module.scss'`)
  are the default for components with non-trivial styling. A few things are
  plain (non-module) `.scss` imported for side effects only:
  `ThemeProvider.scss` (defines the CSS custom-property theme) and
  generated icon-font CSS.
- Theming is done entirely through **CSS custom properties scoped by a
  `data-theme` attribute**: `ThemeProvider.scss` defines hundreds of
  `--Namespace-Token` custom properties under `:root[data-theme="duckdice"]`
  (raw design-token values like `--Colors-Gray-300`, plus semantic aliases
  like `--text-primary: var(--Colors-Gray-300)`), and component stylesheets
  key their root class off the same attribute, e.g. `Button.module.scss`
  starts with `[data-theme="duckdice"] { .button { ... } }`. Components
  reference only the **semantic** custom properties (`--text-primary`,
  `--buttons-layer-orange-default`), never the raw `--Colors-*` tokens
  directly — the raw tokens exist solely to be aliased.
  `"duckdice"` is currently the only theme defined; the data-theme
  mechanism implies multi-brand/theme support is intended but only one
  theme exists today.
- `ThemeProvider` itself is a no-op at the React level (`<>{children}</>`)
  — all its effect comes from the side-effect CSS import. It exists as a
  seam for future theme-switching logic, not as working theme-switching
  logic today.
- Class names inside SCSS use BEM-ish flat naming scoped by nesting
  (`.button`, `.button.primary`, `.button.icon-only`) rather than strict
  `block__element--modifier` BEM; state/variant classes
  (`.pending`, `.disabled`, `.active`) are applied as additional classes
  computed by `cn(...)` in the component, not as data-attributes.
- Icons: SVGs under `components/Icon/svg/` are compiled to an icon font by
  `fantasticon` (`fantasticonrc.cjs`, run via `pnpm gen:icons`), emitting a
  generated `IconName` union + codepoint map + webfont + CSS into
  `components/Icon/__generated__/`. `CryptoIcon`/`FiatIcon`/
  `PaymentMethodIcon` instead inline per-currency SVGs via `vite-plugin-svgr`
  and a generated-by-hand `*.const.ts` map from name to component.

## 7. Testing

- **There are no test files in this repository** (`*.test.ts(x)`,
  `*.spec.ts(x)`, or any `vitest.config.*`/test runner config) at the time
  of writing. `@storybook/addon-vitest` is installed in `packages/uikit`,
  which wires Storybook stories into Vitest's browser-mode test runner, but
  no actual test assertions exist yet — stories currently serve as visual
  documentation/manual QA, not automated tests.
- Do not assume a test runner config exists to extend; if asked to add
  tests, a Vitest setup needs to be introduced, choosing conventions rather
  than following an established one.

## 8. ESLint, Prettier, TypeScript & build configuration

**Enforced** (wired into tooling that actually runs):

- **Biome** (`biome.json`, `@biomejs/biome`) is the real linter *and*
  formatter for this repo. It runs via `pnpm biome check --write` in the
  Husky `pre-commit` hook (`.husky/pre-commit`) and is the default
  formatter in `.vscode/settings.json` for JS/TS/JSON/CSS. Key settings:
  single quotes, `recommended` rule preset plus `noUnusedVariables: error`,
  `a11y` rules turned **off**, inline type-import style (`useImportType`),
  import-organize/sort assists described in §5.
- **TypeScript** strictness as described in §3 — enforced per-package via
  `tsc -b` in each package's `build` script (`apps/wallet`:
  `tsc -b && vite build`; `packages/uikit`:
  `tsc -b && vite build && storybook build`), not via a repo-wide
  `tsc --noEmit` step.
- **Commit messages**: `commitlint` (`commitlint.config.mjs`, extends
  `@commitlint/config-conventional`) enforced via Husky's `commit-msg` hook.
  Conventional Commits format (`type: subject`) is required; actual history
  shows a repo-specific habit of appending an issue/ticket reference, e.g.
  `feat: form number. #1` — that trailing `#1`/period is an **observed
  habit from commit history, not something commitlint enforces**.
- **Husky** hooks: `pre-commit` → `pnpm biome check --write`;
  `commit-msg` → `commitlint --edit $1`. These are the only two enforced
  gates in the repo.

**Present in config but not currently enforced/wired up** — do not assume
these do anything without checking first:

- **ESLint**: `apps/wallet/package.json` lists `@eslint/js` and
  `typescript-eslint` as devDependencies, and `.vscode/settings.json`
  configures `eslint.validate`/`eslint.workingDirectories`, but **no
  `eslint.config.*` file exists anywhere in the repo**. ESLint is not
  actually running; Biome is doing all real linting. `apps/wallet/README.md`
  still carries the stock `create-vite` instructions for *adding* an ESLint
  config, which have not been acted on.
- **Prettier**: listed as a root devDependency and configured as VS Code's
  default formatter for `.scss` only, but there is no `.prettierrc*` /
  `prettier.config.*` anywhere, and nothing invokes `prettier` from a
  script or hook. Biome does not format SCSS, so in practice SCSS files are
  formatted only if a contributor's editor happens to apply the VS Code
  default — there's no CLI-enforced formatting for SCSS.
- **Turbo `lint` task**: `turbo.json` declares a `lint` pipeline task with
  `dependsOn: ["^lint"]`, but no package in the workspace defines a `lint`
  script, so `turbo run lint` currently does nothing. There is also no root
  `lint`/`format`/`test` script in the root `package.json`.
- Both the root `README.md` and `apps/wallet/README.md` are unedited
  framework boilerplate (`create-turbo` and `create-vite` starter text
  respectively) and do not describe this project — do not treat their
  content as authoritative about repo structure or tooling.

## 9. Known inconsistencies worth flagging (not silently "fixed")

- Several component barrels are **empty** despite being the only way their
  component is imported elsewhere in the codebase: `Checkbox/index.ts`,
  `Form/index.ts`, `CryptoIcon/index.ts`, `FiatIcon/index.ts`,
  `PaymentMethodIcon/index.ts` are all 0 bytes. `Form.tsx` and its stories
  are imported as `from '../Form'`/`from '../FormCheckbox'` — i.e. imports
  that resolve to these empty barrels — which reads as incomplete/unfinished
  work rather than an intentional pattern. Verify a given barrel actually
  re-exports what you need before relying on it.
- `Button.types.ts` exports `ButtonType` alongside `ButtonSize` and
  `ButtonVariant`, but `Button/index.ts` only re-exports `ButtonSize` and
  `ButtonVariant` — `ButtonType` is unreachable from outside the folder.
  Not every component consistently re-exports its own `*Props` type either
  (compare `Input/index.ts`, which exports `Input` but not `InputProps` —
  and `InputProps` isn't even exported from `Input.tsx` itself — against
  `Button`/`Toggle`, which do export their props type).
  Don't assume a type is part of the public surface just because a sibling
  component exports its equivalent.
- `apps/wallet` does not depend on `@rockethash/uikit` yet, and
  `apps/wallet/src/App.tsx`/`main.tsx` are still the unmodified
  `create-vite` + React template (default export, demo counter, template
  copy) rather than app code following this repo's conventions (§4). Don't
  use `App.tsx` as a reference for conventions; use `packages/uikit`
  instead.
- `packages/uikit` targets `typescript: "~6.0.2"` (devDependency) while the
  rest of the repo (`apps/wallet`, root) targets `typescript: "~7.0.2"`/
  `"7.0.2"` — a real version split across the workspace, not a typo to
  silently align.
- `CryptoIcon.gallary.mdx` / `FiatIcon.gallary.mdx` /
  `PaymentMethodIcon.gallary.mdx` / `Icon.gallary.mdx` consistently misspell
  "gallery" as "gallary". It's consistent enough across 4 files to be the
  established (if typo'd) naming — match it rather than "fixing" it in
  isolation.

## 10. OpenSpec

This repository uses OpenSpec (`openspec/`) for spec-driven change proposals
(`openspec/changes/`, `openspec/specs/`, `openspec/config.yaml`). Project
context and per-artifact/operation rules for OpenSpec workflows are
configured in `openspec/config.yaml`, which points back to this file for
codebase conventions rather than duplicating them.
