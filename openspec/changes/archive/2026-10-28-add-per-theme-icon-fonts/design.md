# Design

## Context

- Icons are built today by `fantasticon --config fantasticonrc.cjs`. It reads one SVG folder and outputs `__generated__/rockethash.{woff,woff2,css,ts}`. `Icon.tsx` imports the CSS and the `IconName` type from there. `Icon.hbs` is the CSS template.
- Fantasticon 4.1's CLI loads exactly one config object, and `parseConfig` rejects unknown keys such as a `themes` field. Its programmatic `generateFonts(options)` is exported and takes the same options, including `codepoints`, `selector` and `pathOptions`.
- `@font-face` can't be theme-scoped in CSS. Sass hoists a nested `@font-face` out of `[data-theme]`, and Lightning CSS drops it as an unknown nested at-rule (both verified). The theme can only be encoded in the family name, so the split plugin routes fonts by name (see specs).
- `themeCssSplit` (`packages/vite/src/themeCssSplit/themeCssSplit.plugin.ts`) discovers themes from selectors, and `buildThemeNodes` copies every non-rule node (including `@font-face`) into every theme file. Vite inlines the small font files as base64 `url(data:...)`, so each face adds its whole font to every file that contains it.
- Biome ignores `**/__generated__`. `packages/uikit/tsconfig.node.json` type-checks only `vite.config.ts`.

## Goals / Non-Goals

**Goals:**
- Adding a theme to icons means adding a theme name to the config and an SVG folder. No changes to `Icon.tsx` or the split plugin.
- Each built theme file contains only its own icon font.

**Non-Goals:**
- Different icon sets per theme. Names must match, as the spec requires.
- Moving `CryptoIcon` / `FiatIcon` / `ImgIcon` (inline SVGR icons) to per-theme artwork.
- Shipping fonts as separate files instead of inlined data URIs.
- Real tower artwork. Placeholders are copied from duckdice.

## Decisions

### 1. Config file + generator script instead of the fantasticon CLI
- `packages/uikit/icons.config.ts` exports `{ themes: ['duckdice', 'tower'], options: <shared fantasticon options> }`. The shared options are what `fantasticonrc.cjs` has today: font types, TS format options, normalize, and the template path.
- `packages/uikit/scripts/genIcons.ts` imports the config and calls `generateFonts` once per theme. `"gen:icons": "node scripts/genIcons.ts"` runs it through Node 24's native type stripping, the same mechanism `@repo/vite` relies on. That means `.ts` relative import specifiers and erasable syntax only.
- Both files are added to `tsconfig.node.json#include`, so `tsc -b` type-checks them, and `RunnerOptions` from `fantasticon` types the options.
- *Alternative:* a CLI config file per theme plus a `&&`-chained script. Rejected because the user wants one config, and the codepoint pinning and name checks need code that spans themes.
- *Alternative:* put the generator in `@repo/vite`. Rejected because it is not a Vite plugin, and that package's purpose is shared Vite plugins.

### 2. Validate before writing, then regenerate from scratch
The script lists `svg/<theme>/*.svg` for every theme. If the name sets differ, it reports each `name / missing-from-theme` pair and exits 1 before touching `__generated__/`. Otherwise it empties `__generated__/` and regenerates, so outputs from removed themes or the old `rockethash.*` files don't linger.

### 3. Codepoints assigned by the script
The script assigns codepoints itself: names sorted alphabetically get `0xf101 + i`, the same base fantasticon uses. It passes that map as `codepoints` to every `generateFonts` call. This is deterministic regardless of folder or file-system order, and identical across themes by construction.
- *Alternative:* reuse the first theme's auto-assigned result. That also works, but it depends on readdir order.
- Trade-off: adding an icon can shift the codepoints of icons after it alphabetically. That's harmless because the CSS and fonts are regenerated together and nothing hardcodes codepoints (`ICON_CODEPOINTS` is only read for its keys in `Icon.gallary.mdx`).

### 4. Output layout
```
__generated__/
  rockethash.ts                 IconName + ICON_CODEPOINTS (first theme run only, via pathOptions.ts)
  rockethash.css                written by the script: @import per theme
  rockethash-duckdice.{css,woff,woff2}
  rockethash-tower.{css,woff,woff2}
```
- Each run sets `name: 'rockethash-<theme>'` (the font family and file names), `inputDir: svg/<theme>`, and `selector: '[data-theme="<theme>"] .icon'`. Only the first theme gets `assetTypes: ['ts', 'css']`; the rest get `['css']`.
- `Icon.tsx` keeps a single `import './__generated__/rockethash.css'`. Vite inlines the `@import`s, so adding a theme needs no component change. `Icon.tsx`, `Icon/index.ts` and `Icon.gallary.mdx` keep importing `./__generated__/rockethash` for types, so those paths stay the same.

### 5. Template changes (`Icon.hbs`)
- Drop the `:root { --icon-<name> }` block. It's unused, and it shares the namespace with the ThemeProvider `--icon-*` color tokens.
- Remove the `{{else}}` branch (the unscoped `[class^="icon-"]` selector). `selector` is always set now, and an unscoped fallback would break the "no data-theme → no icon font" behavior.
- The resulting rules are `[data-theme="tower"] .icon { font-family: rockethash-tower !important; ... }` and `[data-theme="tower"] .icon.icon-chevron-down:before { content: "\f101" }`. `[data-theme]` leads the selector, as `themeCssSplit` requires. `Icon.tsx` already renders the `icon` class.
- The per-icon `content` rules are repeated per theme even though the codepoints are equal. Sharing them unscoped would save a few bytes but bring back an unscoped icon rule. Repeating them keeps each theme's icon CSS self-contained.

### 6. `themeCssSplit`: route theme-tagged `@font-face`
- `buildThemeNodes` gets the discovered `themes` set. For an `atrule` named `font-face`, it reads the `font-family` declaration, strips the quotes, and finds the longest theme `t` where `family.endsWith('-' + t)`. If one matches and `t !== theme`, the node is dropped; otherwise it is cloned as before. This works anywhere `buildThemeNodes` already walks: at the top level and inside group at-rules.
- Generic rule, not icon-specific: the plugin knows nothing about `rockethash`. Any font named `*-<theme>` gets routed.
- *Alternative:* a marker comment or a custom descriptor in `@font-face`. Rejected because minifiers and Lightning CSS may strip or reject them, and the family name is already what the CSS uses.

### Tooling note
Nothing here relies on ESLint, Prettier or a turbo `lint`/`test` task. None of them run in this repo. Verification is `tsc -b` / `pnpm build` per package, plus `pnpm biome check --write`.

## Risks / Trade-offs

- [A non-icon font whose family accidentally ends in `-<theme>` gets routed to one theme] → The longest exact suffix match against discovered themes keeps this narrow. The behavior is documented in the theme-stylesheets spec.
- [Wallet and Storybook bundle the unsplit CSS, so both faces are declared; if Vite inlines both as data URIs, both load] → Acceptable while the fonts are a few KB. The split library output is where size matters.
- [Placeholder tower SVGs look identical to duckdice] → Expected. The story/gallery shows switching works mechanically; replace when tower artwork arrives.
- [Behavior change for `dist/themes/*.css` consumers: family renamed from `rockethash`] → Nothing outside uikit references the family name (checked: only generated files and `fantasticonrc.cjs`).
- [`__generated__/` is emptied on each run] → It holds only generator output, as AGENTS.md says (not hand-edited).

## Migration Plan

Single PR. Move the SVGs, add the config and script, regenerate, and update the plugin and template. Rollback is a git revert. There is no persisted state. Also update the AGENTS.md §6 "Icons" bullet and the outdated "wallet does not depend on uikit" notes.
