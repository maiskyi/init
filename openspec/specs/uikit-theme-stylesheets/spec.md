# uikit-theme-stylesheets Specification

## Purpose

Defines how the `@rockethash/uikit` library build produces one standalone CSS file per theme, so an app loads only the theme it uses instead of every theme's styles.

## Requirements

### Requirement: One stylesheet per theme
The uikit library build SHALL emit one CSS file for each theme, at `dist/themes/<theme>.css`, where `<theme>` is the theme's `data-theme` value exactly as written in the source selectors.

#### Scenario: Single theme defined
- **WHEN** the library is built and the SCSS contains only `[data-theme="duckdice"]` selectors
- **THEN** the build emits `dist/themes/duckdice.css` and no other theme file

#### Scenario: Multiple themes defined
- **WHEN** the library is built and the SCSS contains `[data-theme="duckdice"]` and `[data-theme="tower"]` selectors
- **THEN** the build emits both `dist/themes/duckdice.css` and `dist/themes/tower.css`

### Requirement: No combined stylesheet
The uikit library build SHALL NOT emit a combined stylesheet containing all themes (no `dist/index.css`).

#### Scenario: Build output contains only per-theme CSS
- **WHEN** the library is built
- **THEN** the only CSS files in `dist/` are files under `dist/themes/`

### Requirement: Themes discovered from selectors
The set of emitted themes SHALL be derived from the `data-theme` attribute values in the bundled CSS selectors. It SHALL NOT be taken from a separately maintained list.

#### Scenario: Theme declared only outside CSS
- **WHEN** a theme name appears in Storybook configuration but in no SCSS selector
- **THEN** no stylesheet is emitted for that theme

### Requirement: Theme attribute removed from output
Each theme file SHALL contain that theme's rules with the `[data-theme="<theme>"]` part removed from every selector. The resulting CSS SHALL apply without any `data-theme` attribute in the DOM.

#### Scenario: Ancestor theme selector
- **WHEN** the source contains `[data-theme="duckdice"] .button { ... }`
- **THEN** `duckdice.css` contains `.button { ... }` with the same declarations

#### Scenario: Compound root selector
- **WHEN** the source contains `:root[data-theme="duckdice"] { --text-primary: ... }`
- **THEN** `duckdice.css` contains `:root { --text-primary: ... }`

#### Scenario: Bare theme selector
- **WHEN** the source contains a rule whose whole selector is `[data-theme="duckdice"]`
- **THEN** `duckdice.css` contains that rule's declarations under the selector `:root`

#### Scenario: No attribute left in output
- **WHEN** the library is built
- **THEN** no emitted theme file contains the string `data-theme`

### Requirement: Theme isolation
A theme file SHALL NOT contain rules that are scoped only to a different theme.

#### Scenario: Other theme's rules excluded
- **WHEN** the source contains `[data-theme="tower"] .button { color: red }`
- **THEN** `duckdice.css` does not contain that declaration

#### Scenario: Selector list mixing themes
- **WHEN** a rule's selector list is `[data-theme="duckdice"] .x, [data-theme="tower"] .x`
- **THEN** `duckdice.css` contains the rule with selector `.x`, and `tower.css` contains the rule with selector `.x`, each with the rule's declarations

### Requirement: Shared CSS duplicated into every theme
CSS not scoped to any theme SHALL be included unchanged in every theme file. This covers rules without a `data-theme` selector, `@font-face`, and top-level `@keyframes`.

#### Scenario: Icon font styles present in each theme
- **WHEN** the library is built with two themes
- **THEN** both theme files contain the icon-font `@font-face` rule and the unscoped icon class rules

#### Scenario: Keyframes present in each theme
- **WHEN** a component stylesheet declares `@keyframes` (including inside a `data-theme` block, which Sass moves to the top level)
- **THEN** every theme file contains that `@keyframes` rule

### Requirement: Source order preserved
Within each theme file, rules SHALL appear in the same relative order as in the bundled CSS, so that cascade results match the unsplit output.

#### Scenario: Later rule still overrides earlier rule
- **WHEN** two rules of the same specificity target the same element, and the second follows the first in the bundled CSS
- **THEN** the second rule also follows the first in the theme file

### Requirement: Conditional group rules split per theme
Rules nested inside conditional group at-rules (`@media`, `@supports`, `@container`, `@layer`) SHALL be split by theme in the same way as top-level rules. In each theme file the wrapping at-rule is kept, with only that theme's rules and the shared rules inside it. A wrapper with nothing left inside is omitted.

#### Scenario: Themed rules inside a media query
- **WHEN** the source contains `@media (min-width: 768px) { [data-theme="duckdice"] .x { ... } [data-theme="tower"] .x { ... } }`
- **THEN** `duckdice.css` contains `@media (min-width: 768px) { .x { ... } }` with only the duckdice declarations, and `tower.css` likewise with only the tower declarations

### Requirement: Build fails on a non-leading theme attribute
The build SHALL fail with an error naming the offending selector when a `data-theme` attribute appears anywhere in a selector other than its leading compound.

#### Scenario: Theme attribute in a descendant position
- **WHEN** the source contains `.wrapper [data-theme="duckdice"] .y { ... }`
- **THEN** the build fails and the error message includes that selector

### Requirement: Build fails on duplicate keyframe names
The build SHALL fail with an error naming the keyframes when a theme file would contain two `@keyframes` rules with the same name.

#### Scenario: Same keyframes declared under two themes
- **WHEN** one module declares `@keyframes dot` inside both `[data-theme="duckdice"]` and `[data-theme="tower"]` blocks, so both compile to the same hashed name
- **THEN** the build fails and the error message names that keyframes rule

### Requirement: Build fails when no theme is found
The build SHALL fail with an error when the bundled CSS contains no `data-theme` selector.

#### Scenario: All theme scoping removed
- **WHEN** the library is built and no selector contains a `data-theme` attribute
- **THEN** the build fails instead of emitting no theme files

### Requirement: Theme stylesheets are importable by path
The package SHALL expose each theme file through the subpath `@rockethash/uikit/themes/<theme>.css`.

#### Scenario: App imports a theme
- **WHEN** an app that depends on `@rockethash/uikit` imports `@rockethash/uikit/themes/duckdice.css`
- **THEN** the import resolves to the built `dist/themes/duckdice.css`

### Requirement: Storybook unaffected
The Storybook build and dev server SHALL keep serving the unsplit, `data-theme`-scoped styles, so that Storybook's theme switcher continues to work.

#### Scenario: Switching themes in Storybook
- **WHEN** Storybook runs and the user switches its `data-theme` toolbar value
- **THEN** components restyle according to the selected theme without reloading the stylesheet
