# Tasks

Verification throughout is per-package `tsc -b` / `vite build` plus manual smoke
runs. This is deliberate, not an omission: there is no test runner, no `test`
script, and no working `turbo run lint` in this repo (AGENTS.md §8), and this
change does not introduce one — a dependency alignment is not the right place to
choose the repo's testing conventions.

## 1. Baseline

- [x] 1.1 Capture the current build output of every package to a scratch file —
      `pnpm build` at the root, plus `pnpm -F @rockethash/wallet build` on its
      own — and verify the record includes the known pre-existing `TS2307`
      errors on uikit's `*.svg?react` imports (AGENTS.md §9). Every later
      verification step diffs against this file; without it a pre-existing
      failure reads as a regression.
- [x] 1.2 Record the currently installed React versions
      (`pnpm why react`, `pnpm why react-dom`) and verify the record shows the
      three distinct trees (18.3.1, 19.2.8, 19.3.1) that this change collapses.

## 2. Manifest alignment

- [x] 2.1 In `packages/uikit/package.json`, set `react` and `react-dom` to
      `^18.3.1`, `@types/react` to `^18.3.31`, `@types/react-dom` to `^18.3.7`
      in `devDependencies`; set the `peerDependencies` entries for `react` and
      `react-dom` to `^18.3.1 || ^19.0.0`. Verify by re-reading the file that no
      React 19 range remains in `devDependencies`, and that the two peer ranges
      are the span (which does name `^19.0.0`, by design).
- [x] 2.2 Add `react-compiler-runtime` at `^1.0.0` to `packages/uikit`'s
      `dependencies` (not `devDependencies` — uikit externalizes it, so
      consumers of `dist/` must get it from uikit's own closure). Verify it
      appears under `dependencies` alongside the existing `lodash.*` entries.
- [x] 2.3 In `apps/wallet/package.json`, set `react`, `react-dom`,
      `@types/react`, `@types/react-dom` to the same four ranges in
      `devDependencies`, and realign the `react` / `react-dom` entries inside
      the existing `peerDependencies` block to `^18.3.1` (single range, not a
      span — the wallet is a private leaf app). Verify the `peerDependencies`
      block is otherwise untouched: `@rockethash/uikit`, `classnames`, and `qs`
      keep their current values.
- [x] 2.4 Add `react-compiler-runtime` at `^1.0.0` to `apps/wallet`'s
      `devDependencies` (the wallet bundles it). Verify placement.
- [x] 2.5 In `playgrounds/next/package.json`, replace the loose `^18` specs with
      the same four explicit ranges. Verify `next@14.2.35`'s peer range
      (`react ^18.2.0`) is still satisfied by `^18.3.1`.
- [x] 2.6 In `playgrounds/vike/package.json`, set the same four React ranges and
      change `vike-react` from `^0.6.29` to `~0.5.13`. Leave `vike@^0.4.268`
      and `@vikejs/express@^0.4.1` untouched. Verify by checking the three peer
      ranges line up: `@vikejs/express` needs `vike ^0.4.268`, `vike` needs
      `react-streaming >=0.3.42`, and `vike-react@0.5.13` needs
      `vike >=0.4.182` and brings `react-streaming ^0.3.48`.
- [x] 2.7 Confirm `packages/vite` and `packages/typescript-config` declare no
      React dependency and are correctly left unmodified — verify with
      `grep -l react packages/*/package.json`.

## 3. Install

- [x] 3.1 Run a single `pnpm install` from the root (one install after all
      manifests are changed, not one per package — see design.md Risks). Verify
      it completes without an unmet-peer error.
      **Needed a fix not in the original plan.** `vike` declares
      `react-streaming` as a *peer*, which `playgrounds/vike` never supplied,
      so pnpm auto-installed the newest match — `0.4.21`, peering `react >=19`
      — alongside the `0.3.50` that `vike-react@0.5.13` depends on. Added
      `react-streaming: ^0.3.50` to `playgrounds/vike`'s `dependencies` (what
      vike's peer declaration asks the app to do); `pnpm why react-streaming`
      now reports one version, 0.3.50, and the React 19 peer demand is gone.
      Re-verified the playground after the change: build, prod (`/`, `/todo`,
      `/star-wars` all 200 with content) and dev + counter hydration, clean.
      One **pre-existing** unmet React peer remains and was deliberately not
      touched: `airbnb-prop-types@2.16.0` (via uikit's
      `react-outside-click-handler`) peers `react ^0.14 || ^15.0.0 ||
      ^16.0.0-alpha`, which React 19 did not satisfy either — confirmed
      against `git show HEAD:pnpm-lock.yaml`.
- [x] 3.2 Verify `pnpm why react` and `pnpm why react-dom` now each report
      exactly one version, `18.3.1`, across every workspace package, and that
      `grep -c "^  react@" pnpm-lock.yaml` shows no React 19 entry remains.
- [x] 3.3 Verify `react-compiler-runtime@1.0.0` is installed and that its
      declared peer range (`react ^17.0.0 || ^18.0.0 || ^19.0.0`) is recorded in
      the lockfile — this range is what lets one build serve both majors.

## 4. React Compiler target

- [x] 4.1 In `packages/uikit/vite.config.ts`, change `reactCompilerPreset()` to
      `reactCompilerPreset({ target: '18' })`. Verify `tsc -b` accepts the
      option (it is typed as `'17' | '18' | '19'` in the installed
      `babel-plugin-react-compiler@1.0.0`).
- [x] 4.2 In the same file, update `rolldownOptions.external`: add
      `react-compiler-runtime`, remove `react/compiler-runtime`. Verify the
      array stays alphabetically ordered, matching the existing list and Biome's
      sort assists (AGENTS.md §5).
- [x] 4.3 In `apps/wallet/vite.config.ts`, make the same
      `reactCompilerPreset({ target: '18' })` change. Verify the `resolve.alias`
      and `dedupe` entries for react/react-dom are left as they are.

## 5. Per-package verification

- [x] 5.1 Build uikit: `pnpm -F @rockethash/uikit build`
      (`tsc -b && vite build && storybook build`). Verify it succeeds, and in
      particular that `tsc -b` reports no error caused by the `@types/react`
      19→18 downgrade. Fix any that appear at the call site — do not loosen
      `tsconfig` strictness to absorb them.
- [x] 5.2 Verify the uikit build artifact is the compatibility contract it has
      to be: `grep -n "compiler-runtime" packages/uikit/dist/index.js` must show
      an import from `react-compiler-runtime`, must show no reference to
      `react/compiler-runtime`, and the runtime must be imported rather than
      inlined (no `function c(` definition in the bundle).
- [x] 5.3 Verify the uikit build still emits `dist/themes/*.css` and no
      `dist/index.css`, so the externals change did not disturb the per-theme
      CSS split that the `uikit-theme-stylesheets` spec requires.
- [x] 5.4 Run `pnpm -F @rockethash/uikit dev` (Storybook on port 5001) and
      verify components render and the theme switcher still works — the
      compiler target change affects emitted code, which a type check alone
      does not exercise.
- [x] 5.5 Build the wallet: `pnpm -F @rockethash/wallet build`. Diff the output
      against the baseline from 1.1 and verify the only remaining failures are
      the pre-existing `TS2307` svg errors — no new error, and no fewer (this
      change neither causes nor fixes them).
- [x] 5.6 Run `pnpm -F @rockethash/wallet dev` and verify the app renders,
      confirming React 18 `createRoot` in `src/main.tsx` and uikit's
      `createPortal` usage both work under the aligned version.
- [x] 5.7 Build and run `playgrounds/next` (`build`, then `dev` on port 3002).
      Verify both succeed — this playground was already on React 18, so a
      failure here points at the explicit version ranges, not the downgrade.
- [x] 5.8 Build **and** run `playgrounds/vike` (`build`, then `dev` on port
      3001, then `prod`). Verify the index, `/todo`, and `/star-wars` pages all
      render and the counter is interactive. Run `dev` as well as `build`: a
      `vike-react` config-resolution break between 0.5.13 and `vike@0.4.268`
      will not necessarily fail the build.
- [x] 5.9 If 5.8 fails: do not escalate into downgrading `vike` or dropping
      `@vikejs/express` (design.md Decision 6). Revert `playgrounds/vike` to
      React 19 with `vike-react@^0.6.29`, and record it in `proposal.md` as the
      named exception that the `react-version-support` spec's "Deviations are
      explicit" requirement provides for, stating `vike-react`'s
      `react >=19` peer as the blocking reason. Verify the exception names the
      dependency and its range.
      **Condition did not fire** — 5.8 passed in full (build, dev, prod, all
      three pages, counter interactive, no console errors), so no fallback was
      applied and no exception was recorded. No action taken.

## 6. Documentation

- [x] 6.1 Update AGENTS.md §4, which opens "React 19, function components only".
      State React 18 as the development target and the `^18.3.1 || ^19.0.0`
      support range, and note that the React Compiler runs at `target: '18'` so
      the built output resolves `react-compiler-runtime` rather than
      `react/compiler-runtime`. Verify by grepping AGENTS.md for `React 19`
      that no stale claim remains.
- [x] 6.2 Update the `context` block in `openspec/config.yaml`, which describes
      `apps/wallet` as "React 19 + Vite SPA". While correcting it, also fix the
      adjacent stale sentence claiming `apps/wallet` does not depend on
      `packages/uikit` — it does now (`workspace:*`, imported through uikit's
      source barrel), and that dependency is exactly why the `@types/react`
      majors must match. Verify the block no longer states either stale fact.

## 7. Integration check

- [x] 7.1 Run `pnpm build` from the root (`turbo run build` across all packages)
      and verify the result matches the per-package outcomes from group 5, with
      no cross-package failure that the individual builds missed.
- [x] 7.2 Verify the spec's central claim end to end: a single uikit `dist/`
      built at `target: '18'` resolves under both majors. Resolve uikit's built
      output against React 18 (the workspace state) and then against a React 19
      install, and verify the compiler runtime import resolves in both. If this
      cannot be done without a publish step, record what was verified and what
      was not rather than marking it done — the "Built output resolves its
      compiler runtime on both majors" requirement is the whole point of the
      change.
- [x] 7.3 Run `pnpm biome check` and verify the changed files are clean, since
      the Husky `pre-commit` hook runs `biome check --write` and will otherwise
      reformat them during commit.
