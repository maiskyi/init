# Spec Delta

## Purpose

Provides the uikit's `Heading` component: the design system's four Title
levels, rendered as the matching HTML heading element, in four weights, with
the H1 level stepping down to its mobile size below the tablet breakpoint.

## ADDED Requirements

### Requirement: Heading level selects both element and type scale
`Heading` SHALL accept a required `as` prop of `'h1'`, `'h2'`, `'h3'` or
`'h4'`. It SHALL render that HTML element and apply that level's type scale.
There SHALL be no way to pair one level's element with another level's
appearance. Any other value, or omitting `as`, SHALL be a TypeScript error.

#### Scenario: Level 2 heading
- **WHEN** `<Heading as="h2">Recent activity</Heading>` is rendered
- **THEN** the rendered element is an `h2` containing the text "Recent activity", styled with the H2 type scale

#### Scenario: Level omitted
- **WHEN** a consumer writes `<Heading>Balance</Heading>`
- **THEN** type-checking fails on the missing `as` prop

#### Scenario: Unsupported level rejected
- **WHEN** a consumer writes `<Heading as="h5">Balance</Heading>`
- **THEN** type-checking fails on the `as` prop

#### Scenario: Unsupported element rejected
- **WHEN** a consumer writes `<Heading as="div">Balance</Heading>`
- **THEN** type-checking fails on the `as` prop

### Requirement: Fixed type scale for levels 2 to 4
`Heading` SHALL apply these font sizes and line heights at every viewport
width: H2 at 20px/28px, H3 at 18px/24px, H4 at 16px/22px. Letter spacing
SHALL be unchanged from normal.

#### Scenario: H2 metrics
- **WHEN** `<Heading as="h2">Title</Heading>` is rendered at any viewport width
- **THEN** its computed font size is 20px and its computed line height is 28px

#### Scenario: H3 metrics
- **WHEN** `<Heading as="h3">Title</Heading>` is rendered at any viewport width
- **THEN** its computed font size is 18px and its computed line height is 24px

#### Scenario: H4 metrics
- **WHEN** `<Heading as="h4">Title</Heading>` is rendered at any viewport width
- **THEN** its computed font size is 16px and its computed line height is 22px

### Requirement: Level 1 steps down below the tablet breakpoint
`Heading` with `as="h1"` SHALL render at 28px/38px when the viewport is at
least 1025px wide, and at 24px/28px below that width. No other level SHALL
change with viewport width.

#### Scenario: H1 on desktop
- **WHEN** `<Heading as="h1">Title</Heading>` is rendered at a 1280px viewport
- **THEN** its computed font size is 28px and its computed line height is 38px

#### Scenario: H1 at the breakpoint
- **WHEN** `<Heading as="h1">Title</Heading>` is rendered at a 1025px viewport
- **THEN** its computed font size is 28px and its computed line height is 38px

#### Scenario: H1 on tablet and below
- **WHEN** `<Heading as="h1">Title</Heading>` is rendered at a 1024px viewport
- **THEN** its computed font size is 24px and its computed line height is 28px

#### Scenario: Lower levels do not step
- **WHEN** `<Heading as="h2">Title</Heading>` is rendered at a 375px viewport and again at a 1280px viewport
- **THEN** its computed font size is 20px in both cases

### Requirement: Weight scale
`Heading` SHALL accept an optional `weight` prop of `'regular'`, `'medium'`,
`'semibold'` or `'bold'`, rendering font weights 400, 500, 600 and 700
respectively, and SHALL default to `'semibold'`. Any other value SHALL be a
TypeScript error.

#### Scenario: Default weight
- **WHEN** `<Heading as="h3">Title</Heading>` is rendered with no `weight`
- **THEN** its computed font weight is 600

#### Scenario: Explicit weight
- **WHEN** `<Heading as="h1" weight="bold">Title</Heading>` is rendered
- **THEN** its computed font weight is 700

#### Scenario: Unsupported weight rejected
- **WHEN** a consumer writes `<Heading as="h1" weight={700} />`
- **THEN** type-checking fails on the `weight` prop

### Requirement: Weight is independent of viewport
The `weight` prop SHALL resolve to the same font weight at every viewport
width, including for `as="h1"` below the tablet breakpoint where the design
specimen shows no regular-weight sample.

#### Scenario: Regular H1 on mobile
- **WHEN** `<Heading as="h1" weight="regular">Title</Heading>` is rendered at a 375px viewport
- **THEN** its computed font weight is 400, its font size is 24px and its line height is 28px

### Requirement: Heading face
`Heading` SHALL render in the Open Sans family at every level and weight,
falling back to the generic sans-serif face. The uikit SHALL NOT bundle or
declare that webfont; a consuming application supplies it.

#### Scenario: Font family applied
- **WHEN** any `Heading` is rendered
- **THEN** its computed font family is Open Sans followed by a generic sans-serif fallback

#### Scenario: Consumer has not loaded the webfont
- **WHEN** a `Heading` is rendered in an application that does not load Open Sans
- **THEN** it renders in the fallback sans-serif face at the correct size, line height and weight for its level

### Requirement: Title colour follows the theme
`Heading` SHALL take its text colour from the active theme's title colour,
the `--text-title` custom property, and SHALL set no background, margin or
padding of its own.

#### Scenario: Colour under the duckdice theme
- **WHEN** a `Heading` is rendered with the duckdice theme stylesheet applied
- **THEN** its computed colour resolves to the value of `--text-title`

#### Scenario: No built-in spacing
- **WHEN** a `Heading` is rendered between two blocks that have no margins
- **THEN** there is no gap above or below it beyond its own line box

### Requirement: Element props and class names pass through
`Heading` SHALL accept the props valid for the heading element it renders and
forward them to it. A `className` SHALL be applied in addition to the
component's own classes, and ordered so that consumer rules of equal
specificity win.

#### Scenario: Native prop forwarded
- **WHEN** `<Heading as="h2" id="section-title">Title</Heading>` is rendered
- **THEN** the rendered `h2` carries `id="section-title"`

#### Scenario: Consumer class applied
- **WHEN** `<Heading as="h2" className="custom">Title</Heading>` is rendered
- **THEN** the rendered `h2` carries the `custom` class alongside the component's own

#### Scenario: Invalid native prop rejected
- **WHEN** a consumer writes `<Heading as="h2" href="/x">Title</Heading>`
- **THEN** type-checking fails on the `href` prop

### Requirement: Public export
`Heading`, its props type, and the union types backing `as` and `weight`
SHALL be importable from the package root.

#### Scenario: Root barrel import
- **WHEN** a consumer writes `import { Heading, type HeadingProps, type HeadingTag, type HeadingWeight } from '@rockethash/uikit'`
- **THEN** the import type-checks and resolves
