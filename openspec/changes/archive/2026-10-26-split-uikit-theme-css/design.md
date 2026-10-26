# Design

## Context

- `packages/uikit/vite.config.ts` runs Vite in library mode (`build.lib`, ES format, entry `src/index.ts`). There is already an `isStorybook` check that turns `build` off when Storybook drives Vite. Library mode extracts all CSS into a single asset, today `index.css` (about 28 KB). The JS chunk does not import it.
- By the time CSS reaches the bundle it has been through Sass and CSS Modules and is minified. Theme selectors appear unquoted (`[data-theme=duckdice]`) and class names are hashed (`._button_x1`). Sass has already moved `@keyframes` out of their `[data-theme]` blocks, so keyframes carry no theme information.
- A survey of today's output found 82 selectors of the form `[data-theme=X] <rest>`, 1 of the form `:root[data-theme=X]`, 5 unscoped rules (icon font CSS and the `:root` icon variables), 1 `@font-face` (woff inlined as a data URI), and 5 `@keyframes`. There are no `@media`/`@supports` rules yet.
- `tsconfig.json` only `include`s `src`. `vite.config.ts` and anything next to it is not type-checked by `tsc -b`; Vite loads it directly.
- There is no test runner in the repo (see proposal and AGENTS.md §7). Lint/format checks run only through Biome. The design does **not** rely on ESLint, Prettier, or a turbo `lint`/`test` task, because none of them run.

## Goals / Non-Goals

**Goals:**
- A small, self-contained Vite plugin that only post-processes the CSS asset the library build already produces.
- Behavior defined by `specs/uikit-theme-stylesheets/spec.md`, with build errors that name the offending selector or keyframes.

**Non-Goals:**
- Repointing JS/type `exports` to `dist/` (a separate change).
- Changing any component SCSS, `ThemeProvider`, or Storybook theming.
- Per-theme JS, or splitting the theme-specific SVG assets (`CryptoIcon/duckdice/*.svg` etc.).
- Optimizing the output beyond the minification Vite already applies (Decision 4a only moves where it happens).
- Adding a test runner (see Risks).

## Decisions

### 1. A Vite plugin at `generateBundle`, not a post-build script
The plugin hooks `generateBundle`. It finds every `.css` asset in the bundle, parses and concatenates them in bundle order, deletes them from the bundle, and calls `this.emitFile` once per theme with `fileName: 'themes/<theme>.css'`.
- *Why:* it runs inside `vite build`, so `pnpm build`, turbo caching, and `emptyOutDir` all behave the same as today, and no file ever lands on disk only to be removed. Working at `generateBundle` means it sees the final minified CSS with module class names already hashed, which is the exact text consumers would receive.
- *Alternative: a Node script run after `vite build` on `dist/index.css`.* Simpler to run on its own, but it adds a second step to the `build` script, relies on knowing the asset's file name, and briefly leaves the combined file in `dist/`.
- *Alternative: a PostCSS plugin in `css.postcss`.* That runs per module before bundling, so it cannot see the whole bundle or emit separate files.
- The plugin is registered only in the non-Storybook branch, next to the existing `isStorybook` check. Storybook therefore keeps the unsplit, attribute-scoped CSS.

### 2. PostCSS AST + `postcss-selector-parser`
CSS is parsed with `postcss`, and each selector with `postcss-selector-parser`.
- *Why:* splitting selector lists on commas, finding the leading compound, and removing one attribute node are fragile with regexes once `:is(...)`, `:has(...)`, or quoted attribute values appear. Both packages are standard and small, and `postcss` is already in the tree through Vite. Both are added as explicit devDependencies so the plugin does not rely on hoisting.
- *Alternative: Lightning CSS's visitor API.* Also available through Vite, but its selector AST is harder to rewrite for this case and the code would be less readable.

### 3. Classification algorithm
Walk the root's child nodes in order. For each node:
- **Rule.** Split its selector list. For each selector, look for an attribute node `data-theme` with an `=` operator:
  - In the **leading compound** (`[data-theme=X] .a`, `:root[data-theme=X]`, `[data-theme=X].a`): remove that attribute node and assign the selector to theme `X`. If removing it leaves the compound empty and nothing follows (a bare `[data-theme=X]`), replace the selector with `:root`. If it leaves the compound empty but a descendant combinator follows, drop the now-leading combinator (`[data-theme=X] .a` becomes `.a`).
  - **Elsewhere** in the selector: throw an error naming the selector.
  - **Absent**: the selector is shared.
  Then, for each theme, emit a clone of the rule whose selector list is that theme's rewritten selectors plus all shared selectors, skipping themes with no matches. If every selector is shared, the rule goes to every theme unchanged.
- **Conditional group at-rule** (`@media`, `@supports`, `@container`, `@layer` block): recurse into it, and wrap each theme's resulting children in a clone of the at-rule. Omit the wrapper when it has no children.
- **Any other at-rule or node** (`@font-face`, `@keyframes`, `@import`, `@charset`, comments): shared, cloned into every theme.

Themes are collected during the walk. The walk runs once to collect themes and assign each node, then once per theme to build its output, which keeps source order.
- *Why rewrite-and-strip in the leading compound only:* that is where today's SCSS puts the attribute (`[data-theme="x"] { … }` at the top of every module, and `:root { &[data-theme="x"] }`). Stripping it anywhere else would change what the selector matches, so the build fails there instead.
- *Mixed selector lists:* splitting per selector, rather than requiring rules to be single-theme, follows the spec and costs little.

### 4. Validation is done after the split, per theme file
After building each theme's root:
- If any two top-level `@keyframes` (including vendor-prefixed forms) share a name, throw an error naming the keyframes and the theme.
- If no theme was collected at all, throw an error before emitting anything.

Errors are raised with `this.error(...)`, so Vite reports them as plugin failures and `pnpm build` exits non-zero.

### 4a. The plugin minifies after splitting, instead of Vite
The plugin sets `build.cssMinify: false` from its `config` hook. After the split and validation, it minifies each theme file with `lightningcss` (`transform({ minify: true })`).
- *Why:* found during implementation. Vite's CSS minifier runs before `generateBundle` and silently drops all but the last `@keyframes` with a given name. A collision between two themes (both compile to the same hashed name) never reaches the plugin, so the duplicate check in Decision 4 would never fire. Minifying after the check keeps that requirement enforceable. As a side benefit, the minifier only sees one theme at a time, so it cannot merge rules across themes.
- *Alternative: drop the duplicate-keyframes requirement* and rely on "last definition wins". Rejected: the collision would stay silent.
- *Alternative: inspect each CSS module in a `transform` hook before bundling.* Rejected: it depends on Vite's internal CSS plugin order.
- `lightningcss` becomes an explicit devDependency. It is the minifier Vite already uses, so the output stays equivalent to today's.

### 5. Output path and package export
Theme files are emitted at `themes/<theme>.css`, relative to `build.outDir` (`dist`). `package.json` `exports` gains `"./themes/*.css": "./dist/themes/*.css"`. The existing `"./*"` source export stays as it is. Because the keys differ, `./themes/duckdice.css` matches the more specific `./themes/*.css` pattern under Node's longest-prefix resolution, not `./*`.

### 6. File location and naming
The plugin lives at `packages/uikit/plugins/themeCssSplit/themeCssSplit.plugin.ts` and is imported by `vite.config.ts`. It follows AGENTS.md's `<name>.<kind>.ts` scheme and "group non-component source by kind". It stays outside `src/` because it is build tooling, not library code, and `src/` is what `tsc -b` compiles as the library. `plugins/` is a new top-level folder in the package. It uses a named export `themeCssSplit()`, with no default export, as in the rest of the package.
- Because `tsconfig.json` only includes `src`, the plugin is **not** type-checked by `tsc -b`. A task adds `plugins` to type-checking (a small `tsconfig.node.json` referenced from the root config, or adding `plugins` and `vite.config.ts` to `include` if declaration output for them is harmless). That way the plugin gets the same strictness as library code.

## Risks / Trade-offs

- **[Risk] No automated tests:** the split logic has several edge cases (mixed lists, bare selector, at-rule nesting, errors), and there is no test runner. → *Mitigation:* the tasks include a manual verification step that builds the package and checks every spec scenario against the real output. They also include temporary fixture SCSS for the cases today's code does not contain (second theme, `@media`, mixed list, non-leading attribute, duplicate keyframes), removed before commit. Adding Vitest unit tests for the plugin is a worthwhile follow-up but outside this change.
- **[Trade-off] Shared CSS is duplicated:** each theme file carries the icon font (inlined woff, a few KB). → Accepted, as requested. Apps load one theme file at a time.
- **[Trade-off] Two theme files cannot be loaded together:** with the attribute removed, both files target the same hashed classes. → Accepted. Runtime theme switching means swapping the `<link>`/import. The proposal's Impact section documents this.
- **[Risk] Keyframes collide across themes:** Sass moves keyframes out of theme blocks, so their theme cannot be recovered. → The build fails on duplicate names (Decision 4), and authors must use distinct names per theme.
- **[Risk] Dev and production differ:** Storybook uses `data-theme` scoping while built consumers don't. A selector that only works because of the extra attribute specificity could behave differently. → Low today, since nothing relies on that specificity. Review the first real second theme in both Storybook and a built consumer.
- **[Risk] Vite renames the CSS asset or splits it:** a future Vite version or `build.cssCodeSplit` could emit several CSS assets or rename `index.css`. → The plugin handles every `.css` asset in the bundle, regardless of name, concatenated in bundle order.

## Migration Plan

Nothing consumes `dist/` today, so no consumer migration is needed. To roll back, remove the plugin from `vite.config.ts`; the build then emits `dist/index.css` again. Once the separate exports change lands, apps import `@rockethash/uikit/themes/<theme>.css` once at their entry point.
