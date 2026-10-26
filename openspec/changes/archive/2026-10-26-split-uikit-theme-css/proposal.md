# Proposal

## Why

The `packages/uikit` library build emits one `dist/index.css` that holds the styles of every theme, scoped by `[data-theme="<name>"]` selectors. Apps that use a single brand theme have to download and parse every other theme's styles as well. Storybook already lists a second theme (`tower`), so this cost grows as soon as a second theme lands in SCSS. Apps will consume the uikit as built `dist/` output, so the build should emit one self-contained stylesheet per theme.

## What Changes

- Add a build step to `packages/uikit` (a Vite plugin wired into `vite.config.ts`, running only for the library build and not for Storybook). It splits the bundled CSS into one file per `data-theme` value at `dist/themes/<theme>.css`.
- Themes are discovered from the `[data-theme="<name>"]` selectors in the bundled CSS. There is no hand-maintained theme list.
- In each theme file, the `[data-theme="<name>"]` part is removed from selectors, so the output is plain CSS that applies without any `data-theme` attribute in the DOM. For example, `:root[data-theme=duckdice]` becomes `:root`.
- CSS with no theme scope (the icon-font `@font-face`, the `:root` icon custom properties, the `[class^=icon-]` rules, and top-level `@keyframes`) is copied into every theme file.
- **BREAKING** (build output): `dist/index.css` is no longer emitted. The per-theme files replace it. Nothing consumes `dist/` yet, so this affects no current app.
- The build fails with a clear message, instead of emitting wrong CSS, when:
  - a selector has the `data-theme` attribute somewhere other than its leading part,
  - two `@keyframes` with the same name end up in a theme file,
  - no theme is found at all.
- Add a `"./themes/*.css": "./dist/themes/*.css"` entry to the uikit `package.json` `exports`, so apps can `import '@rockethash/uikit/themes/duckdice.css'`.

Out of scope, and planned as a separate change: repointing the JS `exports` (`"./*": "./src/*.tsx"`) and type declarations to `dist/`. Until that change lands, apps that consume the uikit as source do not pick up the theme files.

## Capabilities

### New Capabilities

- `uikit-theme-stylesheets`: how the uikit library build turns `data-theme`-scoped SCSS into one standalone stylesheet per theme. Covers output location and naming, theme discovery, selector rewriting, handling of shared CSS, and the conditions that fail the build.

### Modified Capabilities

None. No specs exist yet in `openspec/specs/`.

## Impact

- **Package touched:** `packages/uikit` only. Nothing in `apps/wallet` or `packages/typescript-config` changes, and this change does not wire wallet to the uikit.
- **Code:** `packages/uikit/vite.config.ts` (plugin registration) and a new build-plugin source file in `packages/uikit`. Existing SCSS is unchanged; current selectors already have the supported shape (82 leading `[data-theme] .x` selectors, 1 `:root[data-theme]`, 5 unscoped).
- **Package metadata:** `packages/uikit/package.json` gains a `./themes/*.css` export, and `postcss`, `postcss-selector-parser` and `lightningcss` become explicit devDependencies. `postcss` and `lightningcss` are currently only present transitively (through Vite); `postcss-selector-parser` is new. CSS minification for the library build moves from Vite into the plugin (see design Decision 4a).
- **Runtime model for consumers:** the built CSS no longer depends on the `data-theme` attribute. Apps switch themes by swapping which stylesheet is loaded; they cannot load two theme files side by side. Storybook and `ThemeProvider` keep using `data-theme` against source SCSS, so this is a difference between development and production.
- **Authoring constraint:** theme-specific `@keyframes` declared under different themes in the same module must use distinct names. The build enforces this.
