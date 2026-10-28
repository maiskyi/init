# Proposal

## Why

The uikit has two themes (`duckdice`, `tower`) but only one icon font. `fantasticonrc.cjs` builds a single `rockethash` font from one SVG folder, and its CSS is not theme-scoped, so `themeCssSplit` copies the duckdice glyphs into `tower.css` too. Tower has no way to ship its own icon artwork. Fantasticon's CLI accepts only one config object, so a second font today would mean a second, hand-synced config and a second icon type.

## What Changes

- One icon configuration file in `packages/uikit` declares the shared font options and the list of themes. `pnpm gen:icons` runs a generator script that calls fantasticon's `generateFonts` API once per theme.
- SVG sources move to one folder per theme: `src/components/Icon/svg/<theme>/`. The existing two SVGs go to `svg/duckdice/`. Every theme must provide the same set of icon names, and generation fails when the sets differ.
- Each theme gets its own font, with the family and file name `rockethash-<theme>`. Codepoints are pinned across themes (the first theme's assignment is reused), so a name maps to the same glyph slot in every font.
- One shared generated `IconName` union and `ICON_CODEPOINTS` map. The `Icon` component's props stay the same.
- Generated icon CSS is theme-scoped: the `font-family` and `:before { content }` rules sit under `[data-theme="<theme>"] .icon`. The `@font-face` rules stay top-level, because CSS does not allow `@font-face` inside a style rule (Sass hoists it out, and Lightning CSS drops it).
- `themeCssSplit` routes a top-level `@font-face` whose `font-family` ends in `-<theme>` (for a theme found in selectors) into that theme's file only. Other `@font-face` rules are still copied into every file. **BREAKING** (build output only): `duckdice.css` no longer contains the `rockethash` font, and `tower.css` no longer contains duckdice glyphs.
- The generated `:root { --icon-<name>: "\fXXX" }` codepoint variables are removed. Nothing uses them, and they share the `--icon-*` namespace with ThemeProvider's semantic color tokens (`--icon-primary`, `--icon-red`, ...), so an icon named e.g. `primary` would overwrite a color token.
- Tower SVGs: no tower artwork exists yet. The duckdice SVGs are copied into `svg/tower/` as placeholders until tower artwork arrives.

## Capabilities

### New Capabilities

- `uikit-icon-font`: generation of per-theme icon fonts from one configuration, shared icon names and codepoints across themes, and theme-scoped icon CSS.

### Modified Capabilities

- `uikit-theme-stylesheets`: "Shared CSS duplicated into every theme" changes so that `@font-face` rules tagged with a theme suffix go only to that theme's file. Its "Icon font styles present in each theme" scenario is replaced.

## Impact

- **Packages**: `packages/uikit` (icon config, generator script, `Icon` folder, SVG layout, `gen:icons` script) and `packages/vite` (`themeCssSplit`). `packages/typescript-config` is not touched.
- **apps/wallet**: it already depends on `@rockethash/uikit` (`workspace:*`) and imports uikit source through the root barrel, so it bundles the unsplit, attribute-scoped icon CSS. It keeps working because `index.html` sets `data-theme="duckdice"`. Both `@font-face` rules are present there; browsers download only the face in use, unless Vite inlines both as small data URIs. No wallet code changes. (AGENTS.md still says wallet does not depend on uikit, which is out of date.)
- **Storybook**: it keeps the unsplit CSS, so switching `data-theme` swaps icon fonts live.
- **Files**: `fantasticonrc.cjs` is replaced by the new config and script. `__generated__/` contents are renamed (`rockethash-duckdice.*`, `rockethash-tower.*`, shared `rockethash.ts`). `Icon.tsx`, `Icon/index.ts`, `Icon.gallary.mdx`, and `Icon.hbs` update their imports and templates.
- **Dependencies**: none added. `fantasticon@4.1.0` already exports `generateFonts`.
