# Spec Delta

## Purpose

Provides the uikit's responsive layout primitive: a 12-column Flexbox `Grid` container whose `Grid.Cell` children span a configurable number of columns per breakpoint, separated by spacing derived from the active theme's base spacing.

## ADDED Requirements

### Requirement: Twelve-column wrapping layout
`Grid` SHALL lay out its `Grid.Cell` children in a horizontal row divided into 12 equal columns. Cells whose combined spans exceed 12 SHALL wrap onto a new row.

#### Scenario: Cells fill one row
- **WHEN** a `Grid` contains three cells with `span={4}`
- **THEN** all three render side by side on one row, each one third of the row's width minus its share of the column spacing

#### Scenario: Cells wrap
- **WHEN** a `Grid` contains cells with `span={8}` and `span={6}`
- **THEN** the second cell starts a new row

### Requirement: Column width accounts for spacing
A cell spanning N columns SHALL be exactly as wide as N single-column cells plus the N−1 column gaps between them, so that cells on a row with spans summing to 12 fill the row width with no overflow.

#### Scenario: Full row with spacing
- **WHEN** a `Grid` with `spacing={4}` contains cells with `span={6}` and `span={6}`
- **THEN** both cells fit on one row, the gap between them equals 4 × the theme base spacing, and the row does not overflow the grid

#### Scenario: Spans align across rows
- **WHEN** row one has a `span={6}` cell and row two has two `span={3}` cells
- **THEN** the right edge of the `span={6}` cell aligns with the right edge of the second `span={3}` cell

### Requirement: Base cell span
`Grid.Cell` SHALL accept a `span` prop with an integer from 1 to 12, or `'hidden'`, applied at every viewport width unless overridden by a breakpoint prop. A cell with no `span` and no breakpoint prop matching the viewport SHALL span all 12 columns.

#### Scenario: Default span
- **WHEN** a `Grid.Cell` is rendered with no span props
- **THEN** it occupies the full row width

#### Scenario: Base span
- **WHEN** a `Grid.Cell` is rendered with `span={3}`
- **THEN** it occupies 3 of 12 columns at every viewport width

### Requirement: Per-breakpoint cell span
`Grid.Cell` SHALL accept one optional prop per breakpoint token defined in the uikit SCSS breakpoint map (`xss`, `xs`, `sm_max`, `sm`, `md_max`, `md`, `ld`, `ld_max`, `ld_xl`, `ld_xxl`, `ld_xxxl`), each taking an integer 1–12 or `'hidden'`. A breakpoint prop SHALL apply when the viewport is at least that token's width.

#### Scenario: Breakpoint overrides base
- **WHEN** a cell has `span={12}` and `md={6}`, and the viewport is 1025px wide or wider
- **THEN** the cell occupies 6 columns

#### Scenario: Below breakpoint
- **WHEN** a cell has `span={12}` and `md={6}`, and the viewport is 1024px wide
- **THEN** the cell occupies 12 columns

### Requirement: Breakpoint cascade by width
When several breakpoint props match the viewport, the prop for the widest matching breakpoint SHALL win, regardless of prop order or token name. A breakpoint prop SHALL stay in effect at all wider viewports until a wider breakpoint prop is set.

#### Scenario: Widest matching breakpoint wins
- **WHEN** a cell has `sm={6}` and `ld={4}`, and the viewport is 1300px wide
- **THEN** the cell occupies 4 columns

#### Scenario: Value carries upward
- **WHEN** a cell has `sm={6}` and no wider breakpoint props, and the viewport is 1900px wide
- **THEN** the cell occupies 6 columns

#### Scenario: Ordering follows pixel values, not names
- **WHEN** a cell has `md_max={6}` (960px) and `md={4}` (1025px), and the viewport is 1000px wide
- **THEN** the cell occupies 6 columns

### Requirement: Hiding a cell per breakpoint
A span value of `'hidden'` SHALL remove the cell from the layout (not rendered visibly and taking no space or gap) from that breakpoint upward. A wider breakpoint prop with a numeric span SHALL show the cell again.

#### Scenario: Hidden on small screens
- **WHEN** a cell has `span="hidden"` and `md={4}`, and the viewport is 800px wide
- **THEN** the cell is not visible and the remaining cells lay out as if it were absent

#### Scenario: Shown again at a wider breakpoint
- **WHEN** a cell has `span="hidden"` and `md={4}`, and the viewport is 1100px wide
- **THEN** the cell is visible and occupies 4 columns

#### Scenario: Hidden on large screens
- **WHEN** a cell has `span={12}` and `ld="hidden"`, and the viewport is 1250px wide or wider
- **THEN** the cell is not visible

### Requirement: Uniform spacing multiplier
`Grid` SHALL accept a `spacing` prop: a non-negative number multiplied by the active theme's base spacing to give both the horizontal gap between columns and the vertical gap between rows. Without any spacing prop, both gaps SHALL be zero.

#### Scenario: Spacing applied to both axes
- **WHEN** a `Grid` with `spacing={2}` is rendered under the `duckdice` theme (base spacing 4px)
- **THEN** the gap between adjacent cells on a row is 8px and the gap between rows is 8px

#### Scenario: No spacing
- **WHEN** a `Grid` is rendered without `spacing`, `colSpacing` or `rowSpacing`
- **THEN** cells touch horizontally and rows touch vertically

### Requirement: Per-axis spacing override
`Grid` SHALL accept `colSpacing` and `rowSpacing` props, each a non-negative base-spacing multiplier for one axis only. When set, each SHALL override `spacing` for its axis; the other axis SHALL keep `spacing` (or zero).

#### Scenario: Separate axes
- **WHEN** a `Grid` has `colSpacing={4}` and `rowSpacing={1}` under `duckdice`
- **THEN** the column gap is 16px and the row gap is 4px

#### Scenario: Override one axis
- **WHEN** a `Grid` has `spacing={2}` and `rowSpacing={0}` under `duckdice`
- **THEN** the column gap is 8px and the row gap is 0

### Requirement: Theme-derived spacing and breakpoints
Grid spacing and breakpoint widths SHALL come from the active theme's SCSS variables map. Grid styles SHALL be defined once and generated for every theme that has such a map, and SHALL apply only under a theme that has one.

#### Scenario: Duckdice theme
- **WHEN** the library is built
- **THEN** `dist/themes/duckdice.css` contains the grid styles using a 4px base spacing and the duckdice breakpoint widths

#### Scenario: Theme without a variables map
- **WHEN** the library is built and the `tower` theme has no SCSS variables map
- **THEN** no grid styles are emitted for `tower`

### Requirement: Polymorphic elements and passthrough props
`Grid` and `Grid.Cell` SHALL render a `div` by default, SHALL accept an `as` prop to render a different element or component, and SHALL forward other props of that element. A consumer `className` SHALL be merged with, not replace, the grid classes.

#### Scenario: Custom element
- **WHEN** a `Grid` is rendered with `as="section"` and a `Grid.Cell` with `as="article"`
- **THEN** the DOM contains a `section` with the grid layout and an `article` with the cell layout

#### Scenario: Custom className
- **WHEN** a `Grid.Cell` is rendered with `className="foo"` and `span={6}`
- **THEN** the element has the `foo` class and still spans 6 columns
