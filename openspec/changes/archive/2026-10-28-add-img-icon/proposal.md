# Proposal

## Why

The uikit needs to render wide brand/logo SVGs (Apple Pay, Google Pay, Mastercard, Visa). The existing SVG icon components (`CryptoIcon`, `FiatIcon`, `PaymentMethodIcon`) only take a square `size` prop (`width = height = size`, default 24), which letterboxes non-square artwork. The assets are already staged in the untracked `packages/uikit/src/components/ImgIcon/duckdice/` folder and have no component to render them.

## What Changes

- Add an `ImgIcon` component to `packages/uikit`, following the same SVG-to-component pattern as `CryptoIcon`/`FiatIcon` (svgr `?react` imports collected in a name → component map).
- `ImgIcon` takes optional `width` and `height` props (instead of `size`) and passes them to the rendered SVG unchanged. When omitted, the SVG keeps the intrinsic dimensions declared in its file.
- Icon names are exactly the SVG filenames without `.svg`, including kebab-case names (`apple-pay`, `google-pay`, `mastercard`, `visa`).
- The `ImgIconName` type is derived from the icon map's keys, so the name list and the map cannot drift apart.
- Add the folder barrel, a Storybook story, and a gallery MDX page, matching the sibling icon components.

Out of scope: adding `ImgIcon` to the root `src/index.ts` barrel (the sibling icon components are not there either), and fixing the duplicate names / `GHC` ↔ `GH₵.svg` mismatch in `FiatIcon`.

## Capabilities

### New Capabilities
- `uikit-img-icon`: the uikit's component for rendering named, arbitrary-aspect-ratio image icons (brand logos) from bundled SVG files, with caller-controlled width and height.

### Modified Capabilities
<!-- none -->

## Impact

- Package: `packages/uikit` only. Does not touch `apps/wallet` and does not cross the wallet ↔ uikit boundary (they remain unwired).
- New files under `packages/uikit/src/components/ImgIcon/`: `ImgIcon.tsx`, `ImgIcon.const.ts`, `ImgIcon.types.ts`, `index.ts`, `ImgIcon.stories.tsx`, `ImgIcon.gallary.mdx`; the existing `duckdice/*.svg` assets become tracked.
- Public surface: reachable via the package's `./*` deep-import export map (`@rockethash/uikit/components/ImgIcon/ImgIcon`); not added to the root barrel.
- No new dependencies; uses the already-configured `vite-plugin-svgr`.
