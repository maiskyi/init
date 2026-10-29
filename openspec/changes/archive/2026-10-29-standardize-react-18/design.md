# Design

## Context

See `proposal.md` — Why. The constraints that actually shape the approach:

- **React Compiler is enabled in both `packages/uikit` and `apps/wallet`** via
  `reactCompilerPreset()` from `@vitejs/plugin-react`, called with no options.
  The installed `babel-plugin-react-compiler@1.0.0` types its target as
  `'17' | '18' | '19' | {donotuse_meta_internal}` and defaults to `'19'`, which
  emits `import { c } from 'react/compiler-runtime'`. React 18 does not ship
  that module. This, not the version specs, is the real work.
- **`apps/wallet` type-checks `packages/uikit`'s source.** uikit's
  `exports["."]` resolves to `./src/index.ts`, so uikit `.tsx` files enter the
  wallet's own `tsc -b` program as source, not as `.d.ts` — `skipLibCheck` does
  not apply to them. A split `@types/react` major would put two copies of the
  React types in one program.
- **The products will consume `dist/`**, so uikit's build output is the
  compatibility contract. uikit's build externalizes `react`, `react-dom`,
  `react/jsx-runtime`, and `react/compiler-runtime`.
- **Nothing in this repo verifies a React version claim automatically.** Per
  AGENTS.md §8 the only enforced gates are Husky running `biome check --write`
  and `commitlint`; `turbo run lint` is declared but no package implements a
  `lint` script, and there is no test runner or `test` script anywhere. Every
  verification step in this design is therefore a per-package
  `tsc -b && vite build` plus a manual smoke run. This design does not assume
  ESLint, Prettier, or a turbo `lint`/`test` task will run, because none of
  them do.

## Goals / Non-Goals

**Goals:**

- One React version resolved across the workspace, declared identically in
  every manifest that mentions React.
- A single uikit build artifact that runs correctly on React 18 and React 19,
  with its compiler runtime resolvable from uikit's own dependency closure.
- Make React 18 a build-time constraint: a React 19-only API should fail
  `tsc -b` here, not surface in the React 18 product.

**Non-Goals:**

- Not introducing a mechanism (catalog, override, or script) that *enforces*
  version uniformity going forward. This change establishes the aligned state;
  keeping it aligned is left to review. See Decision 2.
- Not adding a React 19 verification surface. The change removes the repo's only
  React 19 tree and knowingly leaves that gap open.
- Not changing uikit's `exports` map, publish story, or the pre-existing
  `TS2307` svg failure in `apps/wallet` (AGENTS.md §9).
- No source changes to components. A scan found no React 19-only API usage; if
  one surfaces during verification it is handled, not hunted for.

## Decisions

### 1. Develop against React 18, the lower bound, rather than React 19 with a widened peer range

Keeping development on React 19 and merely widening uikit's peer range to
`^18 || ^19` would declare React 18 support without exercising it. Nothing in
the repo would stop a `useActionState` or a ref-as-prop component from
compiling, and the failure would land in the React 18 product. Developing on
the floor means the type checker is the gate.

The cost is real and accepted: React 19-only regressions can no longer be
caught in-tree at all. Noted under Risks.

### 2. Declare explicit identical version ranges per manifest; no catalog, no overrides

Three ways to get one React version across a pnpm workspace:

| Approach | Effect | Verdict |
| --- | --- | --- |
| Identical explicit range in each manifest | States the version where a reader looks for it; drift is possible but visible in review | **Chosen** |
| `pnpm-workspace.yaml` catalog (`catalog:react`) | Single source of truth, drift impossible | Rejected for now |
| Root `pnpm.overrides` | Forces the version through the whole tree, transitive deps included | Rejected |

A catalog is the mechanically correct answer and worth a follow-up change, but
it rewrites how every manifest declares React and the repo uses no catalog
today — bundling that into this change mixes a version alignment with a
dependency-declaration convention change. `pnpm.overrides` is rejected outright:
it would silently rewrite transitive peers too, which is exactly the kind of
forced resolution that hides a genuine incompatibility instead of reporting it.

Concrete ranges:

```
react              ^18.3.1      (18.3.1 is the final React 18 release)
react-dom          ^18.3.1
@types/react       ^18.3.31
@types/react-dom   ^18.3.7
```

`playgrounds/next` currently declares the looser `^18` / `^18` / `^18`; it moves
to the explicit ranges so all four manifests read identically.

### 3. Set the React Compiler target to `'18'` in both uikit and wallet

```
  reactCompilerPreset({ target: '18' })

  before (default '19'):  import { c } from 'react/compiler-runtime'
                          ^ does not exist in React 18

  after  (target '18'):   import { c } from 'react-compiler-runtime'
                          ^ react-compiler-runtime@1.0.0
                            peers: react ^17.0.0 || ^18.0.0 || ^19.0.0
```

Set in both packages rather than uikit alone. The wallet runs on React 18 after
this change, so it needs the same target for its own code; and because it
compiles uikit's source through its own Vite pipeline, a mismatch would mean
uikit's source is compiled at one target in uikit's build and another in the
wallet's.

The property that makes this work: `react-compiler-runtime`'s peer range spans
17–19, so a `target: '18'` build also runs on React 19. Targeting the floor
gives one artifact for both products. The alternative — two builds, or
`target: '19'` with a React 18 shim — buys nothing and doubles the surface.

Alternative considered and rejected: dropping React Compiler from uikit
entirely to sidestep the runtime question. It is load-bearing in this codebase
— AGENTS.md §4 records that manual `useMemo`/`useCallback` is deliberately
absent because the compiler handles memoization. Removing it would degrade
every component.

### 4. `react-compiler-runtime` is a runtime dependency of uikit, a devDependency of the wallet

uikit externalizes it, so it must be present in the consuming product's install
— that means `dependencies`, not `devDependencies`. The wallet bundles it, so
`devDependencies` is correct there and matches the (unusual but established)
pattern of the wallet declaring `react` itself in `devDependencies`.

uikit's `rolldownOptions.external` gains `react-compiler-runtime` and loses
`react/compiler-runtime`. Leaving the stale entry would be harmless but
misleading; leaving the new one out would inline the runtime into uikit's
bundle, giving a React 19 product two copies of `c` — one from the bundle, one
from React itself.

### 5. Peer range spelled `^18.3.1 || ^19.0.0`

Not `>=18`, which would also accept React 20 before anyone has tried it. Not
`^18.0.0 || ^19.0.0`: 18.3.1 is the version actually developed and verified
against, and it is the last React 18, so a narrower floor costs consumers
nothing. `react-dom` gets the same range; uikit genuinely needs it, using
`createPortal` in `DropdownContent`, `DropdownContentDrawer`, and `FormError`.

`apps/wallet`'s `peerDependencies` block stays, with only its `react` /
`react-dom` entries realigned to `^18.3.1` — a single range, not a span, since
the wallet is a `private: true` leaf app and not a shared package. The block is
inert either way; removing it was considered and deliberately left out of scope.

### 6. `vike-react` pinned with a tilde: `~0.5.13`

The 0.6.x line is next after 0.5.x, and every 0.6 release declares
`react >=19`. A caret range (`^0.5.13`) stays inside 0.5.x today — but the
intent is "do not cross into the line that drops React 18," and `~0.5.13` says
that where `^0.5.13` only happens to. The React 18 ceiling here is a hard
framework boundary, not a preference, and the pin should read like one.

`vike` and `@vikejs/express` are deliberately left current:

```
  @vikejs/express@0.4.1  peers  vike: ^0.4.268         <- pins vike
  vike@0.4.268           peers  vite >=7.1.0
                                react-streaming >=0.3.42
  vike-react@0.5.13      peers  vike >=0.4.182         <- satisfied by 0.4.268
                         deps   react-streaming ^0.3.48 (peers react >=18)
```

Downgrading `vike` to a release contemporary with `vike-react@0.5.13` would
force dropping `@vikejs/express` too, cascading a throwaway playground into the
largest part of the change. Holding `vike` still is the smaller bet — and if it
does not hold, the fallback is to stop downgrading rather than to chase it
further (see Risks).

## Risks / Trade-offs

**`vike-react@0.5.13` paired with `vike@0.4.268` spans roughly 20 minor releases.
The peer ranges declare them compatible; nothing has verified it.** → Verify by
running the playground's `build` *and* `dev` before considering the task done —
a config-resolution break will not necessarily fail the build. If it does not
work, do not escalate into downgrading `vike` and dropping `@vikejs/express`:
revert `playgrounds/vike` to React 19 and record it as the explicit exception
the spec's "Deviations are explicit" requirement provides for. It is a declared
throwaway example, not shipped product.

**Downgrading `@types/react` 19 → 18 can surface type errors the React 19 types
accepted.** → The known shapes: `useRef<T>()` with no argument returns
`MutableRefObject<T | undefined>` under 18 (19 requires the argument, so code
written against 19 always passes one and is safe), and `ReactNode` is wider
under 18 than 19 — a downgrade of types is mostly permissive. Expect few or no
errors; fix at the call site rather than by loosening `tsconfig`.

**`apps/wallet`'s `tsc -b` already fails with `TS2307` on uikit's `*.svg?react`
imports, which will mask whether this change introduced anything new.** →
Capture the full error list before touching anything and diff against the list
after. Do not fix the svg errors here; do not let them be read as success or as
this change's failure.

**`target: '18'` output is slightly less efficient on React 19**, where
`react-compiler-runtime`'s `c` is a `useMemo`-based polyfill rather than
React's built-in. → Accepted. One artifact that is correct on both majors beats
two artifacts, and the gap is a memoization implementation detail.

**This change removes the only React 19 tree in the repo**, so React 19
regressions in uikit become undetectable here. → Accepted and left open, not
silently absorbed. The cheap recovery later is a Storybook or CI job resolving
uikit against React 19; the expensive one is keeping `apps/wallet` on React 19,
which reintroduces the duplicate `@types/react` problem Decision 2 exists to
avoid. Recorded in Open Questions.

**pnpm will report peer warnings mid-migration** if manifests are updated in a
different order than installs happen. → Change every manifest, then run a
single install, rather than installing per package.

## Migration Plan

1. Record the baseline: current `pnpm build` output per package, so the
   pre-existing `TS2307` failures are known rather than discovered.
2. Update all four manifests (uikit, wallet, next, vike) in one pass — versions,
   uikit peer ranges, `react-compiler-runtime` additions, `vike-react` pin.
3. Single `pnpm install`; confirm the lockfile resolves exactly one `react` and
   one `react-dom`.
4. Update both Vite configs (`target: '18'`, uikit externals).
5. Verify per package: uikit `tsc -b && vite build && storybook build`; wallet
   `tsc -b && vite build` diffed against the baseline; both playgrounds `build`
   and `dev`.
6. Inspect uikit's `dist/index.js` for the emitted runtime import — it must read
   `react-compiler-runtime` and must not be inlined.

Rollback is `git revert` of the commit plus `pnpm install`; no persisted state,
no published artifact, nothing to undo outside the repo.

## Open Questions

- How should React 19 be verified once nothing in the repo runs it? A Storybook
  configuration resolving uikit against React 19, or a CI matrix, are both
  plausible. Deferrable: it changes neither the specs, this approach, nor the
  task breakdown, and it is better decided alongside the uikit publish story.
- Should the explicit per-manifest ranges be replaced by a pnpm catalog as a
  follow-up? Decision 2 argues yes eventually; it does not affect this change's
  outcome.
