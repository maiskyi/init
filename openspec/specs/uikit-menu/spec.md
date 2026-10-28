# uikit-menu Specification

## Purpose


Provides the uikit's `Menu` compound component: a vertical list of clickable rows, each with optional prefix and suffix content, a label, and an active state, usable inline in any page or modal.

## Requirements


### Requirement: Compound API
The uikit SHALL export `Menu` and `MenuItem` from its root entry. `MenuItem` SHALL also be reachable as `Menu.Item`, and both forms SHALL render the same component.

#### Scenario: Static member
- **WHEN** a consumer renders `<Menu><Menu.Item>Withdraw</Menu.Item></Menu>`
- **THEN** a one-row menu with the label "Withdraw" is rendered

#### Scenario: Standalone import
- **WHEN** a consumer imports `{ Menu, MenuItem }` from `@rockethash/uikit` and renders `<Menu><MenuItem>Swap</MenuItem></Menu>`
- **THEN** the result is the same as using `Menu.Item`

### Requirement: List semantics and layout
`Menu` SHALL render a list element with one list item per `Menu.Item`, with no bullets or default list indentation. Rows SHALL stack vertically, fill the menu's width, and be separated by a 4px gap.

#### Scenario: Three rows
- **WHEN** `Menu` is rendered with three `Menu.Item` children inside a 468px-wide container
- **THEN** the DOM contains a `ul` with three `li` children, each row is 468px wide, and adjacent rows are 4px apart

### Requirement: Row anatomy
Each `Menu.Item` row SHALL be at least 44px tall, with 12px padding, its content vertically centred, and an 8px gap between prefix, label, and suffix. The label SHALL take the remaining width so the suffix sits at the row's trailing edge.

#### Scenario: Row with prefix and suffix
- **WHEN** `<Menu.Item prefix={a} suffix={b}>Vault</Menu.Item>` is rendered in a 468px-wide menu
- **THEN** the row is 44px tall, `a` is 12px from the left edge, `b` is 12px from the right edge, and "Vault" starts 8px after `a`

#### Scenario: Row without prefix or suffix
- **WHEN** `<Menu.Item>Vault</Menu.Item>` is rendered
- **THEN** no empty prefix or suffix placeholders are rendered and the label starts 12px from the left edge

### Requirement: Default appearance
In the `duckdice` theme, a row in its default state SHALL have a transparent background, a 6px corner radius, and Open Sans 14px/20px regular text in the theme's primary text colour; icons SHALL inherit that colour.

#### Scenario: Default row
- **WHEN** a `Menu.Item` is rendered under `data-theme="duckdice"` and is not hovered or active
- **THEN** its text colour equals `--text-primary` and its background is transparent

### Requirement: Hover and active states
A row SHALL switch to the highlighted appearance (white text, translucent light background) when hovered, and SHALL stay highlighted while its `active` prop is `true`. `active` SHALL default to `false`.

#### Scenario: Hover
- **WHEN** the pointer moves over a non-active row
- **THEN** the row shows the highlighted appearance, and returns to default when the pointer leaves

#### Scenario: Active
- **WHEN** a row is rendered with `active`
- **THEN** it shows the highlighted appearance without being hovered

### Requirement: Click handling
`Menu.Item` SHALL call its `onClick` prop when the row is clicked or activated with the keyboard. Rendering a row without `onClick` SHALL NOT throw.

#### Scenario: Click
- **WHEN** a row with `onClick={fn}` is clicked
- **THEN** `fn` is called once

#### Scenario: Keyboard activation
- **WHEN** a default row (rendered as a button) has focus and the user presses Enter
- **THEN** `onClick` is called

### Requirement: Polymorphic row element
`Menu.Item` SHALL render its row as a native `button` with `type="button"` by default, and SHALL accept an `as` prop to render it as another element or component, forwarding that element's own props (for example `href`).

#### Scenario: Default element
- **WHEN** `<Menu.Item>Withdraw</Menu.Item>` is rendered
- **THEN** the row element is a `button` with `type="button"`, inside the `li`

#### Scenario: Rendered as a link
- **WHEN** `<Menu.Item as="a" href="/withdraw">Withdraw</Menu.Item>` is rendered
- **THEN** the row element is an `a` with `href="/withdraw"` and looks the same as a button row

### Requirement: Class name overrides
`Menu` and `Menu.Item` SHALL each accept an optional `className` that is added to the menu's list element and the row element respectively, after the component's own classes.

#### Scenario: Custom row class
- **WHEN** `<Menu.Item className="x">Swap</Menu.Item>` is rendered
- **THEN** the row element carries class `x` in addition to its built-in classes
