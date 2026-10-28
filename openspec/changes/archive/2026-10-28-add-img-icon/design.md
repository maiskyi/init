# Design

## Context

See proposal.md (Why). `CryptoIcon`, `FiatIcon` and `PaymentMethodIcon` share one pattern: SVGs under `<Component>/duckdice/` are imported with `vite-plugin-svgr`'s `?react` suffix, gathered in a hand-written `<NAME>_ICONS` map in `<Component>.const.ts`, and the component looks up `MAP[name]` and renders it with `height={size} width={size}`. The name union in `<Component>.types.ts` is written by hand separately, and it has already drifted in `FiatIcon` (duplicate members; `GHC` maps to `GH₵.svg`).

`svgr()` is used with default options in `packages/uikit/vite.config.ts`, so generated components keep the `width`/`height` attributes from the source file unless props override them. The four staged SVGs are 34×14, 33×14, 20×14 and 30×14.

## Goals / Non-Goals

**Goals:**
- Same file layout and lookup mechanism as the sibling icon components.
- The name type and the icon map are checked against each other at compile time.

**Non-Goals:**
- Aspect-ratio-preserving sizing logic (for example, deriving a missing dimension or setting it to `auto`).
- Theme-specific icon sets beyond the existing `duckdice/` folder convention.
- Refactoring the sibling icon components onto the derived-type approach.

## Decisions

### Hand-written `ImgIconName`, map annotated with it
`ImgIcon.types.ts` declares `ImgIconName` as a hand-written string-literal union of the filenames. `ImgIcon.const.ts` declares `IMG_ICONS: Record<ImgIconName, typeof ApplePay>`. This is the same pattern as the sibling icon components. Because the annotation uses `Record<ImgIconName, …>`, a name without a map entry is a missing-property error, and a map entry without a name is an excess-property error. The two lists are edited separately but can't silently drift.

- *Alternative: derive the type with `keyof typeof IMG_ICONS` from an unannotated map (the original plan).* This was rejected during implementation. uikit emits declarations, and svgr's ambient `*.svg?react` typing resolves `react` to a different `@types/react` copy (19.3.0) than uikit's own (19.2.18). The inferred map type therefore can't be named in the `.d.ts` (TS2883), and annotating with uikit's React types fails as "two different types with this name". Aligning `@types/react` across the workspace would make this possible again, but that belongs in its own change.
- *Alternative: `import.meta.glob('./duckdice/*.svg', { query: '?react', eager: true })`.* The keys come back as `string`, so you lose the literal name union. It would also be a pattern not used anywhere else in the repo.

### Keys are filenames; identifiers are PascalCase
Imports use PascalCase identifiers (`import ApplePay from './duckdice/apple-pay.svg?react'`), and map keys are the exact filename strings (`'apple-pay': ApplePay`). Biome's `useSortedKeys` sorts the keys automatically. Quoted kebab keys are new for this repo, but they are required by the "name equals filename" rule.

### Pass-through props, no default size
The props are `className?`, `name`, `width?: number | string` and `height?: number | string`. The component destructures `{ name, ...props }` and renders `<Icon {...props} />`, so only the props the caller actually passed reach the SVG. svgr generates `<svg width={…} height={…} {...props}>`, so passing an explicit `width={undefined}` (as the siblings' `width={size}` shape would) overwrites the size from the file and leaves the SVG with no width. The rest spread is what gives the intrinsic-size and single-dimension behavior in the spec. This was verified by server-rendering the component. It keeps the `if (!Icon) return null` guard, which matches the siblings and protects untyped/JS callers.

- *Alternative: setting a missing dimension to `auto`.* This was rejected in exploration to keep the component a thin pass-through. Callers can size logos with both props or with CSS.

### Exports
`index.ts` exports `ImgIcon`, `ImgIconProps` and `ImgIconName` using separate `export type {}` / `export {}` statements, following the FiatIcon barrel. The component is not added to the root `src/index.ts`, matching the sibling icon components.

## Risks / Trade-offs

- [Only one dimension given → letterboxed box] → This is documented behavior (see spec). Callers pass both dimensions or size with CSS.
- [Filenames with characters that aren't valid in identifiers (as with FiatIcon's `GH₵`)] → The key is a quoted string, so the name stays exact. Only the import identifier has to be sanitized.
- [No automated tests or lint task in the repo] → Verification uses `pnpm biome check --write`, `tsc -b` and `vite build` in `packages/uikit`, plus a visual check in Storybook. This design doesn't rely on ESLint, Prettier, or a turbo `lint`/`test` script, since none of them currently run.
