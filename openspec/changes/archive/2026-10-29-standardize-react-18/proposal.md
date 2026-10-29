# Proposal

## Why

`@rockethash/uikit` is about to be consumed by two products on different React
majors — one on React 18, one on React 19 — but today every workspace package
develops against React 19 and declares `react: ^19.2.8` as a peer. Nothing in
the repo would catch a React-19-only API or a React-19-only build artifact
before it reached the React 18 product. Aligning development on React 18 (the
lower bound) while widening the shared packages' peer ranges to span both
majors makes the React 18 product a build-time constraint instead of a
post-release discovery.

A second, smaller motivation: the same singleton dependency is currently
declared four different ways across the workspace (`^19.3.1`, `^19.2.8`,
`^18`, and nothing), and the lockfile installs three separate React trees.

## What Changes

**React version alignment (all workspace packages)**

- Pin `react` / `react-dom` to `^18.3.1` and `@types/react` / `@types/react-dom`
  to `^18.3.31` / `^18.3.7` in every package that declares them:
  `packages/uikit`, `apps/wallet`, `playgrounds/next`, `playgrounds/vike`.
- `packages/vite` and `packages/typescript-config` declare no React
  dependencies and are untouched.

**Shared-package peer ranges**

- **BREAKING (for consumers)** `packages/uikit` peer ranges widen from
  `react: ^19.2.8` / `react-dom: ^19.2.8` to `^18.3.1 || ^19.0.0`. This is
  breaking only in the sense that the declared contract changes; it strictly
  widens what consumers may install.
- `apps/wallet` keeps its (inert) `peerDependencies` block; only the
  `react` / `react-dom` entries inside it are realigned to `^18.3.1`. It is a
  `private: true` leaf app, so the block has no effect either way — removing
  it is explicitly out of scope for this change.

**React Compiler target (the substantive work)**

- Both `packages/uikit` and `apps/wallet` call `reactCompilerPreset()` with no
  options, which defaults to `target: '19'` and emits
  `import { c } from 'react/compiler-runtime'` — a module React 18 does not
  ship. Left alone, a uikit build on React 18 produces output that cannot
  resolve its own runtime import.
- Pass `reactCompilerPreset({ target: '18' })` in both Vite configs.
- Add `react-compiler-runtime@^1.0.0` as a runtime **dependency** of
  `packages/uikit` (consumers of `dist/` need it resolvable) and as a
  **devDependency** of `apps/wallet` (it bundles).
- Update `packages/uikit`'s `rolldownOptions.external` list: add
  `react-compiler-runtime`, drop `react/compiler-runtime`.
- `react-compiler-runtime@1.0.0` declares `peerDependencies: react ^17.0.0 ||
  ^18.0.0 || ^19.0.0`, so a single `target: '18'` build runs correctly on both
  React 18 and React 19. This is what makes one `dist/` serve both products.

**`playgrounds/vike` framework downgrade**

- Every `vike-react` 0.6.x release declares `peerDependencies: react >=19`, so
  the playground cannot reach React 18 on its current major. Downgrade
  `vike-react` from `^0.6.29` to `~0.5.13` (the last line declaring
  `react >=18.0.0`, whose `react-streaming@^0.3.48` dependency also peers
  `react >=18`).
- `vike@^0.4.268` and `@vikejs/express@^0.4.1` are **unchanged**:
  `@vikejs/express@0.4.1` pins `vike: ^0.4.268`, and `vike@0.4.268` peers only
  `vite >=7.1.0` and `react-streaming >=0.3.42` — all satisfied.
- The playground uses only `vike-react/config`, `vike-react/useData`,
  `vike-react/usePageContext`, and the `+Head` / `+Layout` / `+data` /
  `+onPageTransition*` config hooks, all of which exist in 0.5.x.

## Capabilities

### New Capabilities

- `react-version-support`: the React version the workspace develops against,
  and the range of React majors the shared packages support — covering the
  single-version development invariant, the uikit peer contract, and the
  requirement that uikit's built output resolve its React Compiler runtime on
  both supported majors. Named without the `uikit-` prefix that the existing
  specs carry because the invariant spans every workspace package, not one
  component.

### Modified Capabilities

None. `uikit-theme-stylesheets` also describes the uikit library build, but
only its CSS output; this change touches the JS externals and compiler target
and does not alter any requirement in that spec.

## Impact

**Packages touched**

| Package | What changes |
| --- | --- |
| `packages/uikit` | `package.json` (devDeps, peerDeps, new runtime dep), `vite.config.ts` (compiler target, externals) |
| `apps/wallet` | `package.json` (devDeps, peerDep versions), `vite.config.ts` (compiler target) |
| `playgrounds/next` | `package.json` only (version specs made explicit) |
| `playgrounds/vike` | `package.json` (React + `vike-react` downgrade) |
| `pnpm-lock.yaml` | regenerated |

**Does it cross the `apps/wallet` ↔ `packages/uikit` boundary?** Yes, and this
is load-bearing. `apps/wallet` now depends on `@rockethash/uikit`
(`workspace:*`) and imports it through `exports["."] → ./src/index.ts`, so
uikit's `.tsx` source enters the wallet's own `tsc -b` program. Had the two
packages landed on different `@types/react` majors, that program would hold two
incompatible copies of the React types; aligning both on `@types/react@18` is
what prevents it. (Repo context describing the two packages as not yet wired
together is out of date.)

**Source changes: none at runtime, four files at the type level.** A scan of
`packages/uikit/src` and `apps/wallet/src` found no React-19-only *runtime*
APIs: zero uses of `useActionState`, `useFormStatus`, `useOptimistic`, `use()`,
or ref-as-plain-prop; five files use `forwardRef`; `createRoot` and
`createPortal` are both React 18 APIs. Every React-consuming dependency already
spans both majors (`react-hook-form`, `react-number-format`,
`react-outside-click-handler`, `react-responsive`, `@hookform/error-message`,
`@tanstack/react-query`, `@storybook/react-vite`).

That scan looked only for runtime APIs, and missed React 19 **types-only**
APIs. `tsc -b` against `@types/react@18` reported 8 errors across 4 files, in
two shapes:

- `ChangeEventHandler` takes a second type argument only in `@types/react@19`
  (`<CurrentTarget, Target>` vs `<T>` in 18). `Checkbox.tsx`, `Input.tsx`
  (twice) and `Toggle.tsx` used the two-argument form.
- `RefObject<T>` already includes `| null` in `current` under 18, so the React
  19 idiom `RefObject<HTMLDivElement | null>` double-nulls and fails variance
  when passed to a `ref` prop. `Dropdown.context.ts` used it for `contentRef`,
  `dropdownControllerRef` and `toggleRef`.

Both were fixed at the call sites, never by loosening `tsconfig`. This is the
change working as intended rather than a complication: the point of developing
on the floor is that the type checker catches this here instead of in the React
18 product. The compatible spellings are now recorded in AGENTS.md §4.

**Known risks**

- The `vike-react` downgrade spans roughly 20 minor releases while `vike` stays
  current. The peer ranges declare them compatible, but the gap is real and
  unverified until installed. Fallback if it will not run: leave
  `playgrounds/vike` on React 19 as a documented exception, since it is a
  throwaway example rather than shipped product.
- Downgrading removes the repo's only in-tree React 19 surface. Storybook is
  the cheaper place to regain a React 19 check later; this change does not add
  one.

**Explicitly out of scope** (pre-existing, not introduced or fixed here)

- `packages/uikit` declares `exports["."] → ./src/index.ts` while the products
  are to consume `dist/`. That mismatch, and uikit's `private: true` with no
  publish story, need their own change.
- `apps/wallet`'s `pnpm build` already fails `TS2307` on uikit's `*.svg?react`
  imports (AGENTS.md §9). Aligning React versions neither causes nor fixes it.
- The `typescript@~6.0.2` vs `~7.0.2` split across the workspace (AGENTS.md §9).
- `@chromatic-com/storybook: "latest"`, the one floating version spec in an
  otherwise pinned repo.
