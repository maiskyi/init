# uikit-icon-font Specification

## Purpose

Defines how the uikit generates one icon font per theme from a single configuration, so each theme can ship its own icon artwork while consumers keep one `Icon` API and one set of icon names.

## Requirements

### Requirement: Single configuration for all theme fonts
The uikit SHALL generate the icon fonts for every theme from one configuration file with one command (`pnpm gen:icons`). The configuration SHALL list the themes; adding a theme SHALL NOT require a second configuration file.

#### Scenario: Two themes from one command
- **WHEN** the configuration lists `duckdice` and `tower` and `pnpm gen:icons` runs in `packages/uikit`
- **THEN** a font is generated for `duckdice` and a font is generated for `tower`

### Requirement: Per-theme SVG sources
Each theme's icons SHALL be read from its own folder, `src/components/Icon/svg/<theme>/`, where `<theme>` is the theme's `data-theme` value. An icon's name SHALL be its SVG filename without the `.svg` extension.

#### Scenario: Theme artwork comes from its folder
- **WHEN** `svg/tower/chevron-down.svg` and `svg/duckdice/chevron-down.svg` contain different artwork
- **THEN** the tower font's `chevron-down` glyph matches the tower SVG and the duckdice font's glyph matches the duckdice SVG

### Requirement: Same icon names in every theme
Every theme folder SHALL contain the same set of icon names. Generation SHALL fail with an error naming each missing icon and the theme it is missing from, and SHALL NOT write any output when the sets differ.

#### Scenario: Icon missing from one theme
- **WHEN** `svg/duckdice/close.svg` exists and `svg/tower/close.svg` does not
- **THEN** `pnpm gen:icons` exits with a non-zero status, the error names `close` and `tower`, and no generated file changes

### Requirement: Theme-named font family
Each theme's font SHALL use the font-family name `rockethash-<theme>`, so the theme can be identified from the family name.

#### Scenario: Font family per theme
- **WHEN** fonts are generated for `duckdice` and `tower`
- **THEN** the generated CSS declares `@font-face` rules for the families `rockethash-duckdice` and `rockethash-tower`

### Requirement: Codepoints identical across themes
A given icon name SHALL have the same codepoint in every theme's font.

#### Scenario: Same codepoint for the same name
- **WHEN** fonts are generated for `duckdice` and `tower`
- **THEN** for each icon name, the codepoint in the duckdice font equals the codepoint in the tower font

### Requirement: One shared icon name type
The generator SHALL emit exactly one `IconName` union and one `ICON_CODEPOINTS` map shared by all themes. `Icon`'s `name` prop SHALL be typed as that `IconName`.

#### Scenario: Unknown name rejected at compile time
- **WHEN** a consumer writes `<Icon name="paypal" />` and no theme folder contains `paypal.svg`
- **THEN** type-checking fails on the `name` prop

### Requirement: Icon styles scoped by data-theme
The generated icon class rules (font-family and per-icon `content`) SHALL be scoped under `[data-theme="<theme>"]` as the leading part of the selector, so the active `data-theme` decides which font renders. `@font-face` rules SHALL remain top-level.

#### Scenario: Switching data-theme switches the font
- **WHEN** an `Icon` renders inside an element with `data-theme="tower"` while the unsplit CSS is loaded (e.g. Storybook)
- **THEN** the icon renders with `rockethash-tower`, and after switching to `data-theme="duckdice"` it renders with `rockethash-duckdice`

#### Scenario: No theme attribute
- **WHEN** an `Icon` renders under no `data-theme` attribute while the unsplit CSS is loaded
- **THEN** no icon font rule applies to it

### Requirement: No generated codepoint custom properties
The generated icon CSS SHALL NOT declare custom properties, so it cannot overwrite the theme's `--icon-*` design tokens.

#### Scenario: Icon named like a token
- **WHEN** an icon named `primary` is generated
- **THEN** `--icon-primary` still resolves to the ThemeProvider's color token
