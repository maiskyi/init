# Tasks

## 1. Component

- [x] 1.1 Create `packages/uikit/src/components/ImgIcon/ImgIcon.const.ts` with `?react` imports of `duckdice/apple-pay.svg`, `google-pay.svg`, `mastercard.svg` and `visa.svg` (PascalCase identifiers) and `IMG_ICONS: Record<ImgIconName, typeof ApplePay>`, whose keys are the exact filenames (`'apple-pay'`, `'google-pay'`, `mastercard`, `visa`). Verify that each key matches a file in `duckdice/` and that `tsc -b` passes.
- [x] 1.2 Create `ImgIcon.types.ts` exporting `ImgIconName` as a hand-written union of the four filenames. Verify with `tsc -b` that it passes and that dropping a union member makes `IMG_ICONS` fail to type-check.
- [x] 1.3 Create `ImgIcon.tsx`: an `FC<ImgIconProps>` with `className?`, `name: ImgIconName`, `width?: number | string` and `height?: number | string`. It destructures `{ name, ...props }`, looks up `IMG_ICONS[name]`, returns `null` if nothing is found, and otherwise renders `<Icon {...props} />` with no default size. Explicitly passing `undefined` dimensions would erase the size from the file. Export it as `export type { ImgIconProps }` / `export { ImgIcon }`. Verify with `tsc -b` in `packages/uikit`.
- [x] 1.4 Create `index.ts` that re-exports `ImgIconProps` and `ImgIcon` from `./ImgIcon`, and `ImgIconName` from `./ImgIcon.types`, using separate `export type` / `export` statements (same layout as `FiatIcon/index.ts`). Verify with `tsc -b`.
- [x] 1.5 Styling: confirm that no SCSS module or `data-theme` styling is needed. The sibling icon components (`CryptoIcon`, `FiatIcon`, `PaymentMethodIcon`) have none, and callers style the icon through `className`. Verify that no `.module.scss` is added and that `className` reaches the SVG in Storybook.

## 2. Storybook

- [x] 2.1 Add `ImgIcon.stories.tsx` (title `Icons/Img`, `component: ImgIcon`, default args `className: 'img-icon'`, `name: 'visa'`, `height: 28`, `width: 60`) following `FiatIcon.stories.tsx`. Verify in `pnpm dev` (Storybook on port 5001) that changing `width`/`height` in Controls resizes the logo and that clearing both shows the intrinsic 30×14 size.
- [x] 2.2 Add `ImgIcon.gallary.mdx` (keeping the repo's "gallary" spelling) that renders every key of `IMG_ICONS` in an `IconGallery`, with no size props. Verify in Storybook that all four logos appear at their intrinsic sizes with the correct names.

## 3. Integration checks

- [x] 3.1 Run `pnpm biome check --write` on the new files. Verify that it passes and that keys and JSX attributes come out sorted.
- [x] 3.2 Run `pnpm --filter @rockethash/uikit build` (`tsc -b && vite build && storybook build`). Verify that it succeeds and that the `themeCssSplit` step does not fail.
- [x] 3.3 Check that the compile-time name guard works: temporarily write `<ImgIcon name="paypal" />` in a story, confirm `tsc -b` reports an error on `name`, then remove the line.

## Workflow follow-up

- No automated tests are added. The repo has no test runner, and this change does not introduce one, so verification is Storybook plus `tsc`/build.
- Archive the change with `/opsx:archive` after review.
