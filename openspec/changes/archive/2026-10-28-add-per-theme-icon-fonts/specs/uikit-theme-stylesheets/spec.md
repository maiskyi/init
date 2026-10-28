# Spec Delta

## MODIFIED Requirements

### Requirement: Shared CSS duplicated into every theme
CSS not scoped to any theme SHALL be included unchanged in every theme file. This covers rules without a `data-theme` selector, `@font-face` rules not tagged with a theme (see "Theme-tagged font faces routed to their theme"), and top-level `@keyframes`.

#### Scenario: Icon font styles present in each theme
- **WHEN** the library is built with two themes and each theme has a generated icon font
- **THEN** each theme file contains icon-font `@font-face` and icon class rules, using that theme's own font

#### Scenario: Untagged font face present in each theme
- **WHEN** the library is built with two themes and the CSS contains `@font-face { font-family: "Inter" }`
- **THEN** both theme files contain that `@font-face` rule

#### Scenario: Unscoped rules present in each theme
- **WHEN** the library is built with two themes and the CSS contains a rule without a `data-theme` selector
- **THEN** both theme files contain that rule

#### Scenario: Keyframes present in each theme
- **WHEN** a component stylesheet declares `@keyframes` (including inside a `data-theme` block, which Sass moves to the top level)
- **THEN** every theme file contains that `@keyframes` rule

## ADDED Requirements

### Requirement: Theme-tagged font faces routed to their theme
A top-level `@font-face` whose `font-family` value ends in `-<theme>`, where `<theme>` is a theme found in selectors, SHALL be emitted only into that theme's file. When several themes match as a suffix, the longest theme name SHALL win. Matching is exact and case-sensitive, ignoring quotes around the family name.

#### Scenario: Icon font goes only to its theme
- **WHEN** the library is built with themes `duckdice` and `tower`, and the CSS contains `@font-face { font-family: "rockethash-tower" }` and `@font-face { font-family: "rockethash-duckdice" }`
- **THEN** `tower.css` contains only the `rockethash-tower` face, and `duckdice.css` contains only the `rockethash-duckdice` face

#### Scenario: Suffix that is not a theme
- **WHEN** the CSS contains `@font-face { font-family: "Inter-bold" }` and no selector uses `data-theme="bold"`
- **THEN** every theme file contains that `@font-face` rule

#### Scenario: Longest matching theme wins
- **WHEN** themes `tower` and `big-tower` both exist and the CSS contains `@font-face { font-family: "icons-big-tower" }`
- **THEN** only `big-tower.css` contains that `@font-face` rule
