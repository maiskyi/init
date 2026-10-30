# Tasks

## 1. Font prerequisite

- [x] 1.1 Confirm Open Sans - the face `Heading` renders in - is already loaded wherever a Heading renders, so no font-loading change is needed; verify the `Open+Sans` Google Fonts link is present in both `packages/uikit/.storybook/preview-head.html` and `apps/wallet/index.html`, and that `document.fonts.check('600 16px "Open Sans"')` is true in a rendered story

## 2. Component types and implementation

- [x] 2.1 Create `packages/uikit/src/components/Heading/Heading.types.ts` exporting `HeadingTag = 'h1' | 'h2' | 'h3' | 'h4'` and `HeadingWeight = 'regular' | 'medium' | 'semibold' | 'bold'` as string-literal unions; verify `pnpm --filter @rockethash/uikit exec tsc -b` passes
- [x] 2.2 Create `packages/uikit/src/components/Heading/Heading.tsx` as a non-generic `FC<HeadingProps>`, with `HeadingProps = PolymorphicProps<HeadingTag, { className?: string; weight?: HeadingWeight }> & { as: HeadingTag }`, destructuring `{ as: Component, children, className, weight = 'semibold', ...props }` and composing classes with ``cn(styles.heading, styles[`heading_${as}`], styles[`heading_${weight}`], className)``; verify `tsc -b` passes and that omitting `as` or passing `as="h5"` is a type error
- [x] 2.3 Create the folder barrel `packages/uikit/src/components/Heading/index.ts` re-exporting `Heading` and `HeadingProps` from `./Heading` and `HeadingTag`/`HeadingWeight` from `./Heading.types`, as separate `export` and `export type` statements; verify a scratch `import { Heading } from './components/Heading'` resolves under `tsc -b` and that the barrel is non-empty (AGENTS.md section 9 records several empty ones)

## 3. Styling

- [x] 3.1 Create `packages/uikit/src/components/Heading/Heading.module.scss` following the `@each $theme, $config in vars.$themes` + `[data-theme="#{$theme}"]` pattern used by `Divider.module.scss`, with a `.heading` block rule setting `color: var(--text-title)`, `font-family: "Open Sans", sans-serif`, and zero margin/padding; verify in Storybook that a rendered heading has no default browser margin
- [x] 3.2 Add the four level modifiers with literal metrics - `&_h1` 24px/28px, `&_h2` 20px/28px, `&_h3` 18px/24px, `&_h4` 16px/22px - and the four weight modifiers mapping `&_regular`/`&_medium`/`&_semibold`/`&_bold` to 400/500/600/700, nested under the `.heading` block as strict BEM modifiers following `Menu.module.scss`; verify each level and weight against the Figma specimen (node `3160:10831`) by measuring computed styles in DevTools
- [x] 3.3 Add the H1 desktop step inside `@include mx.breakpoint-up(md, $breakpoints)` nested in `&_h1`, raising it to 28px/38px, reading `$breakpoints` from `map.get($config, breakpoints)` as `Grid.module.scss` does; verify by resizing Storybook across 1025px and confirming the computed font size flips 24px <-> 28px while `heading_h2` stays 20px
- [x] 3.4 Run `pnpm --filter @rockethash/uikit build` and confirm it still emits `dist/themes/duckdice.css` without a `themeCssSplit` error, proving `[data-theme]` leads every selector in the new module

## 4. Public surface and story

- [x] 4.1 Export `Heading`, `type HeadingProps`, `type HeadingTag` and `type HeadingWeight` from `packages/uikit/src/index.ts`, keeping the barrel's alphabetical ordering (between `Grid` and `Icon`); verify `tsc -b` passes and the entry sorts as Biome's assist leaves it
- [x] 4.2 Create `packages/uikit/src/components/Heading/Heading.stories.tsx` with a default story exercising `as` and `weight` through argTypes, plus a specimen story rendering all four levels across all four weights so the Figma sheet can be compared side by side; verify both stories render in Storybook in the Open Sans face
- [x] 4.3 Run `pnpm biome check --write` at the repo root and confirm it reports no remaining diagnostics for the new files (note: ESLint, Prettier and `turbo run lint` do not execute in this repo - Biome is the only linter that runs)

## 5. Integration verification

- [x] 5.1 Run `pnpm --filter @rockethash/uikit exec tsc -b` and `pnpm --filter @rockethash/uikit build`; verify both succeed with no new diagnostics
- [x] 5.2 Run `pnpm --filter @rockethash/wallet exec tsc -b` and verify the error count and set match the pre-existing baseline (~171 `TS2307` on `*.svg?react` plus one `TS6133`) with nothing new attributable to `Heading` - the wallet type-checks uikit source through the workspace barrel, so a bad export surfaces here
- [x] 5.3 Render `<Heading as="h1">` through `<Heading as="h4">` temporarily in `apps/wallet` under `pnpm --filter @rockethash/wallet dev`, confirm the Open Sans face and the 1025px H1 step in a real app, then revert the scratch markup

## Workflow follow-up

- Archive the change once the implementation is reviewed and merged.
