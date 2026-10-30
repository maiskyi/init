# uikit-text Specification

## Purpose
Provides the uikit's `Text` component: the design system's Paragraph type
scale in five sizes and four weights, rendered as a consumer-chosen non-heading
text element, with an optional uppercase transform, faced and coloured from the
active theme's body tokens.

## Requirements

### Requirement: Element is chosen independently of appearance
`Text` SHALL accept an optional `as` prop of `'p'`, `'span'`, `'div'`,
`'label'`, `'strong'` or `'em'`, defaulting to `'p'`, and SHALL render that
element. The element SHALL NOT influence the type scale: `size`, `weight` and
`transform` resolve identically for every permitted element. Any other value
SHALL be a TypeScript error.

#### Scenario: Default element
- **WHEN** `<Text>Available balance</Text>` is rendered with no `as`
- **THEN** the rendered element is a `p` containing the text "Available balance"

#### Scenario: Explicit element
- **WHEN** `<Text as="span">0.00</Text>` is rendered
- **THEN** the rendered element is a `span` containing the text "0.00"

#### Scenario: Appearance does not depend on the element
- **WHEN** `<Text as="p" size="small" weight="bold">x</Text>` and `<Text as="span" size="small" weight="bold">x</Text>` are both rendered
- **THEN** both have the same computed font size, line height and font weight

#### Scenario: Heading element rejected
- **WHEN** a consumer writes `<Text as="h2">Balance</Text>`
- **THEN** type-checking fails on the `as` prop

#### Scenario: Unsupported element rejected
- **WHEN** a consumer writes `<Text as="section">Balance</Text>`
- **THEN** type-checking fails on the `as` prop

### Requirement: Attributes valid for the chosen element are accepted
`Text` SHALL accept the props valid for the specific element named by `as`,
and SHALL reject props that element does not take. Narrowing SHALL be per
element rather than reduced to the attributes all permitted elements share, so
that `as="label"` accepts `htmlFor` and `form`.

#### Scenario: Label association attribute accepted
- **WHEN** `<Text as="label" htmlFor="amount">Amount</Text>` is rendered
- **THEN** the import type-checks and the rendered `label` carries `for="amount"`

#### Scenario: Attribute not valid for the chosen element rejected
- **WHEN** a consumer writes `<Text as="p" htmlFor="amount">Amount</Text>`
- **THEN** type-checking fails on the `htmlFor` prop

#### Scenario: Attribute of an excluded element rejected
- **WHEN** a consumer writes `<Text as="span" href="/x">link</Text>`
- **THEN** type-checking fails on the `href` prop

### Requirement: Paragraph size scale
`Text` SHALL accept an optional `size` prop of `'medium'`, `'regular'`,
`'small'`, `'mini'` or `'micro'`, defaulting to `'regular'`, applying these
font sizes and line heights: medium 15px/20px, regular 14px/20px, small
13px/18px, mini 12px/16px, micro 10px/12px. Letter spacing SHALL be unchanged
from normal. Any other value SHALL be a TypeScript error.

#### Scenario: Default size
- **WHEN** `<Text>Body copy</Text>` is rendered with no `size`
- **THEN** its computed font size is 14px and its computed line height is 20px

#### Scenario: Medium metrics
- **WHEN** `<Text size="medium">Body copy</Text>` is rendered
- **THEN** its computed font size is 15px and its computed line height is 20px

#### Scenario: Small metrics
- **WHEN** `<Text size="small">Body copy</Text>` is rendered
- **THEN** its computed font size is 13px and its computed line height is 18px

#### Scenario: Mini metrics
- **WHEN** `<Text size="mini">Body copy</Text>` is rendered
- **THEN** its computed font size is 12px and its computed line height is 16px

#### Scenario: Micro metrics
- **WHEN** `<Text size="micro">Body copy</Text>` is rendered
- **THEN** its computed font size is 10px and its computed line height is 12px

#### Scenario: Unsupported size rejected
- **WHEN** a consumer writes `<Text size="large">Body copy</Text>`
- **THEN** type-checking fails on the `size` prop

### Requirement: The Paragraph scale does not respond to viewport width
Every `Text` size SHALL resolve to the same font size and line height at every
viewport width. Unlike the Title scale's level 1, no Paragraph size SHALL step
down below any breakpoint.

#### Scenario: Size is stable across viewports
- **WHEN** `<Text size="medium">Body copy</Text>` is rendered at a 375px viewport and again at a 1280px viewport
- **THEN** its computed font size is 15px and its computed line height is 20px in both cases

#### Scenario: Smallest size is stable across viewports
- **WHEN** `<Text size="micro">Body copy</Text>` is rendered at a 375px viewport and again at a 1280px viewport
- **THEN** its computed font size is 10px in both cases

### Requirement: Weight scale
`Text` SHALL accept an optional `weight` prop of `'regular'`, `'semibold'`,
`'bold'` or `'extrabold'`, rendering font weights 400, 600, 700 and 800
respectively, and SHALL default to `'regular'`. The Paragraph scale defines no
500 weight, so `'medium'` SHALL NOT be accepted even though the Title scale's
`Heading` accepts it. Any other value SHALL be a TypeScript error.

#### Scenario: Default weight
- **WHEN** `<Text>Body copy</Text>` is rendered with no `weight`
- **THEN** its computed font weight is 400

#### Scenario: Explicit weight
- **WHEN** `<Text weight="extrabold">Body copy</Text>` is rendered
- **THEN** its computed font weight is 800

#### Scenario: Semibold weight
- **WHEN** `<Text weight="semibold">Body copy</Text>` is rendered
- **THEN** its computed font weight is 600

#### Scenario: Title-only weight rejected
- **WHEN** a consumer writes `<Text weight="medium">Body copy</Text>`
- **THEN** type-checking fails on the `weight` prop

#### Scenario: Numeric weight rejected
- **WHEN** a consumer writes `<Text weight={700}>Body copy</Text>`
- **THEN** type-checking fails on the `weight` prop

### Requirement: Every size pairs with every weight
`Text` SHALL accept all twenty combinations of its five sizes and four
weights. This SHALL include `size="micro"` with `weight="regular"`, which the
design specimen omits: the omission is treated as the specimen not sampling
that pair rather than as a prohibition, matching how the Title scale's level 1
accepts a regular weight its own specimen does not sample.

#### Scenario: Combination absent from the specimen
- **WHEN** `<Text size="micro" weight="regular">Body copy</Text>` is rendered
- **THEN** type-checking succeeds, its computed font size is 10px, its line height is 12px and its font weight is 400

#### Scenario: Heaviest weight at the largest size
- **WHEN** `<Text size="medium" weight="extrabold">Body copy</Text>` is rendered
- **THEN** its computed font size is 15px and its computed font weight is 800

### Requirement: Uppercase rendering
`Text` SHALL accept an optional `uppercase` boolean prop, applying
`text-transform: uppercase` when true and defaulting to `false`. It SHALL be
available at every size and weight, and SHALL change neither font size nor
line height.

#### Scenario: Uppercase applied
- **WHEN** `<Text size="small" uppercase>deposit</Text>` is rendered
- **THEN** it displays as "DEPOSIT" and its computed font size is 13px and line height is 18px

#### Scenario: Metrics unchanged at the mini size
- **WHEN** `<Text size="mini" uppercase>deposit</Text>` is rendered
- **THEN** its computed font size is 12px and its computed line height is 16px, the same as mini without the prop

#### Scenario: Default casing
- **WHEN** `<Text size="small">Deposit</Text>` is rendered with no `uppercase`
- **THEN** it displays as "Deposit" with no applied text transform

#### Scenario: Non-boolean value rejected
- **WHEN** a consumer writes `<Text uppercase="yes">deposit</Text>`
- **THEN** type-checking fails on the `uppercase` prop

### Requirement: Paragraph face follows the theme
`Text` SHALL take its font family from the active theme's main body family
token, `--fonts-family-main`, falling back to the generic sans-serif face. The
uikit SHALL NOT bundle or declare that webfont; a consuming application
supplies it.

#### Scenario: Family resolved from the token
- **WHEN** any `Text` is rendered with the duckdice theme stylesheet applied
- **THEN** its computed font family resolves to the value of `--fonts-family-main` followed by a generic sans-serif fallback

#### Scenario: Consumer has not loaded the webfont
- **WHEN** a `Text` is rendered in an application that does not load the body webfont
- **THEN** it renders in the fallback sans-serif face at the correct size, line height and weight for its props

### Requirement: Body colour follows the theme
`Text` SHALL take its text colour from the active theme's primary body text
colour, the `--text-primary` custom property, and SHALL set no background,
margin or padding of its own.

#### Scenario: Colour under the duckdice theme
- **WHEN** a `Text` is rendered with the duckdice theme stylesheet applied
- **THEN** its computed colour resolves to the value of `--text-primary`

#### Scenario: No built-in spacing
- **WHEN** a `Text` is rendered between two blocks that have no margins
- **THEN** there is no gap above or below it beyond its own line box

### Requirement: Element props and class names pass through
`Text` SHALL forward the props valid for the element it renders to that
element. A `className` SHALL be applied in addition to the component's own
classes, and ordered so that consumer rules of equal specificity win.

#### Scenario: Native prop forwarded
- **WHEN** `<Text as="span" id="balance-value">0.00</Text>` is rendered
- **THEN** the rendered `span` carries `id="balance-value"`

#### Scenario: Consumer class applied
- **WHEN** `<Text className="custom">Body copy</Text>` is rendered
- **THEN** the rendered `p` carries the `custom` class alongside the component's own

### Requirement: Public export
`Text`, its props type, and the union types backing `as`, `size` and
`weight` SHALL be importable from the package root.

#### Scenario: Root barrel import
- **WHEN** a consumer writes `import { Text, type TextProps, type TextTag, type TextSize, type TextWeight } from '@rockethash/uikit'`
- **THEN** the import type-checks and resolves
