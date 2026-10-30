# Tasks

Sequencing follows design.md — Migration Plan: uikit first, then wallet, docs
last against an observed green build. Groups 1 and 2 are each independently
verifiable, so a run interrupted between them leaves the tree in a known state.

## 1. uikit source carries its own svgr declarations

- [x] 1.1 Add `/// <reference types="vite-plugin-svgr/client" />` as the first
  line of `packages/uikit/src/components/CryptoIcon/CryptoIcon.const.ts`,
  `FiatIcon/FiatIcon.const.ts`, `PaymentMethodIcon/PaymentMethodIcon.const.ts`
  and `ImgIcon/ImgIcon.const.ts`, above the existing imports. Verify
  `grep -rl 'svg?react' packages/uikit/src --include='*.ts' --include='*.tsx'`
  returns exactly those four files and
  `grep -l 'vite-plugin-svgr/client' <those four>` returns all four — i.e. every
  file in the workspace importing that specifier now carries the reference.
- [x] 1.2 Leave `packages/uikit/src/vite-env.d.ts` and
  `packages/uikit/tsconfig.json`'s `include` unchanged, and verify uikit's own
  build is unaffected: `pnpm --filter @rockethash/uikit build` completes
  `tsc -b`, `vite build` and `storybook build` with no new error, and
  `ls packages/uikit/dist/themes/` still lists the per-theme CSS files it listed
  before.
- [x] 1.3 Verify the 171 `TS2307` are gone and nothing new appeared:
  `cd apps/wallet && pnpm exec tsc -b` reports no `TS2307`, reports the single
  `TS2322` at `WalletDepositCrypto.tsx:72`, and reports no other error. If any
  other error appears it is pre-existing code that was previously unreachable
  behind the 171 — stop and report it rather than folding a fix into group 2.

## 2. Wallet payment-method data reaches the option row unreshaped

- [x] 2.1 In
  `apps/wallet/src/components/WalletProvider/WalletDataProvider/WalletDataProvider.context.ts`,
  delete the `WalletPaymentMethod` interface and type the context field as
  `paymentMethods: DTO.PaymentMethod[]`. Verify
  `grep -rn 'WalletPaymentMethod\b' apps/wallet/src` returns no hit outside
  `WalletPaymentMethodOption*` (a different, unrelated name).
- [x] 2.2 In `WalletDataProvider.tsx`, drop the `.map()` with the `currencies`
  `reduce` and pass `CASHIER_INFO_DATA.deposit.availableMethods` through to the
  provider value unchanged. Verify `grep -n 'reduce' WalletDataProvider.tsx`
  returns nothing and the file no longer names `currencies`.
- [x] 2.3 In `apps/wallet/src/components/Wallet/WalletDepositCrypto/WalletDepositCrypto.tsx`,
  change the payment-method filter from `paymentMethod.currencies[defaultBalance]`
  to `paymentMethod.currencies.includes(defaultBalance)`. Verify
  `cd apps/wallet && pnpm exec tsc -b` now exits 0 with no output — this is the
  task that clears the `TS2322`.
- [x] 2.4 Verify `WalletPaymentMethodOption.tsx` was not edited
  (`git diff --name-only` does not list it): its existing
  `option: DTO.PaymentMethod` prop type is the target shape, and needing to
  change it would mean group 2 took the wrong approach.
- [x] 2.5 Verify the behaviour the spec pins down is unchanged, with
  `pnpm --filter @rockethash/wallet dev` and the deposit-crypto screen open: the
  payment method picker lists methods for the default balance currency, the
  closed picker shows the first offered method selected, and switching the
  balance currency to one with a different method set changes the list
  accordingly. There is no test runner in this repo and this change does not
  introduce one, so this check is manual.

## 3. Build-baseline notes describe a green build

- [x] 3.1 In `openspec/config.yaml`, replace the `context` paragraph stating that
  `apps/wallet`'s build fails with ~171 `TS2307` plus one `TS6133` with the
  post-change expectation: the wallet's `tsc -b` passes, and any error it
  reports is a regression from the change in hand. Verify no error count or
  `TS####` code remains in that paragraph
  (`grep -n 'TS2307\|TS6133\|TS2322' openspec/config.yaml` returns nothing) and
  that `openspec context --json` still resolves the root with the `context`
  field intact.
- [x] 3.2 In AGENTS.md §9, remove the bullet describing the `apps/wallet`
  `TS2307` failure and its "`vite build` alone succeeds" observation, now that
  neither is true. Verify `grep -n 'TS2307' AGENTS.md` returns nothing, and that
  the section's other known-inconsistency bullets (empty barrels, `ButtonType`
  reachability, the TypeScript version split, the `gallary` spelling) are
  untouched in `git diff AGENTS.md`.

## 4. Whole-workspace verification

- [x] 4.1 Verify the full pipeline from a cold cache: `turbo run build --force`
  at the repo root reports `Tasks: 5 successful, 5 total` with no `Failed:` line,
  and `apps/wallet`'s log shows `tsc -b` followed by a completed `vite build`
  (previously `vite build` was never reached).
- [x] 4.2 Verify formatting and lint with the tooling that actually runs in this
  repo — `pnpm biome check --write` leaves the working tree clean on a re-run.
  Do not expect `turbo run lint`, ESLint or Prettier to check anything: per
  AGENTS.md §8 no package defines a `lint` script, no `eslint.config.*` exists,
  and nothing invokes Prettier.
- [x] 4.3 Delete the untracked `build.log` from the repo root, which captured the
  failing run this change was diagnosed from, and verify `git status` shows only
  intended changes.
