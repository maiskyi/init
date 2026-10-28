# Spec Delta

## Purpose

Provides the uikit's `Divider` component: a themed separator line, horizontal or vertical, 1px or 2px thick, that can render as any element.

## ADDED Requirements

### Requirement: Horizontal orientation by default
`Divider` SHALL accept an optional `orientation` prop of `'horizontal'` or `'vertical'`, and SHALL default to `'horizontal'`. A horizontal divider SHALL span the full width of its container, and its height SHALL equal its thickness.

#### Scenario: No orientation given
- **WHEN** `Divider` is rendered with no `orientation` inside a 300px-wide block container
- **THEN** it renders a line 300px wide and 1px tall

#### Scenario: Explicit horizontal
- **WHEN** `Divider` is rendered with `orientation="horizontal"` and `thickness={2}`
- **THEN** it renders a line spanning its container's width and 2px tall

### Requirement: Vertical orientation
When `orientation` is `'vertical'`, `Divider` SHALL render a line whose width equals its thickness. Inside a flex row container, it SHALL stretch to the container's cross-axis height.

#### Scenario: Vertical inside a flex row
- **WHEN** `<Divider orientation="vertical" />` is placed in a 40px-tall `display: flex` row between two items
- **THEN** it renders a line 1px wide and 40px tall, and it does not shrink to 0 width

### Requirement: Thickness
`Divider` SHALL accept an optional `thickness` prop of `1` or `2`, meaning pixels, and SHALL default to `1`. Any other value SHALL be a TypeScript type error.

#### Scenario: Default thickness
- **WHEN** `Divider` is rendered without `thickness`
- **THEN** the line is 1px thick

#### Scenario: Thick divider
- **WHEN** `Divider` is rendered with `thickness={2}`
- **THEN** the line is 2px thick

#### Scenario: Unsupported thickness rejected
- **WHEN** a consumer writes `<Divider thickness={3} />`
- **THEN** type-checking fails on the `thickness` prop

### Requirement: Border grey color
The divider line SHALL be painted with the active theme's `Borders Border Grey` color, the `--borders-border-gray` custom property. It SHALL have no other visible border, and no margin of its own.

#### Scenario: Color under the duckdice theme
- **WHEN** `Divider` is rendered with the duckdice theme stylesheet applied
- **THEN** the line's color resolves to the value of `--borders-border-gray`

#### Scenario: No built-in spacing
- **WHEN** `Divider` is rendered between two blocks that have no margins
- **THEN** there is no gap between the divider and either block

### Requirement: Polymorphic element
`Divider` SHALL accept an optional `as` prop naming the element or component to render, and SHALL default to a `div`. Props valid for the chosen element SHALL be accepted and forwarded to it. Orientation, thickness and color SHALL look the same whatever element is chosen, including `hr`.

#### Scenario: Default element
- **WHEN** `Divider` is rendered with no `as`
- **THEN** the rendered element is a `div`

#### Scenario: Rendered as a list item
- **WHEN** `Divider` is rendered with `as="li"` inside a `ul`
- **THEN** the rendered element is an `li` showing the same 1px horizontal line

#### Scenario: Rendered as hr
- **WHEN** `Divider` is rendered with `as="hr"`
- **THEN** the rendered element is an `hr`, with none of the browser's default `hr` border or margin visible, and with the same thickness and color as the `div` version

#### Scenario: Element-specific props forwarded
- **WHEN** `Divider` is rendered with `as="li"` and `id="sep"`
- **THEN** the rendered `li` has `id="sep"`

### Requirement: Separator semantics
`Divider` SHALL expose `role="separator"` on the rendered element. When vertical, it SHALL also set `aria-orientation="vertical"`. A consumer-provided `role` or `aria-orientation` SHALL take precedence.

#### Scenario: Horizontal semantics
- **WHEN** `Divider` is rendered with default props
- **THEN** the element has `role="separator"` and no `aria-orientation` attribute

#### Scenario: Vertical semantics
- **WHEN** `Divider` is rendered with `orientation="vertical"`
- **THEN** the element has `role="separator"` and `aria-orientation="vertical"`

#### Scenario: Consumer overrides role
- **WHEN** `Divider` is rendered with `role="presentation"`
- **THEN** the element has `role="presentation"`

### Requirement: Class name forwarding
`Divider` SHALL accept an optional `className` and apply it to the rendered element in addition to its own classes, so that consumer styles can override the defaults.

#### Scenario: Class name applied
- **WHEN** `Divider` is rendered with `className="section-divider"`
- **THEN** the rendered element has the class `section-divider`

### Requirement: Public exports
The package root SHALL export `Divider` and the types `DividerProps`, `DividerOrientation` and `DividerThickness`.

#### Scenario: Import from package root
- **WHEN** a consumer writes `import { Divider, type DividerProps, type DividerOrientation, type DividerThickness } from '@rockethash/uikit'`
- **THEN** type-checking succeeds
