# uikit-img-icon Specification

## Purpose

Provides the uikit's `ImgIcon` component for rendering bundled brand/logo SVGs of any aspect ratio by name, with the caller controlling width and height independently.

## Requirements

### Requirement: Render icon by filename-derived name
`ImgIcon` SHALL accept a required `name` prop and render the bundled SVG whose filename, without the `.svg` extension, equals `name` exactly, including case and hyphens. Every bundled image-icon SVG SHALL be renderable by its filename-derived name.

#### Scenario: Kebab-case name
- **WHEN** `ImgIcon` is rendered with `name="apple-pay"`
- **THEN** it renders the artwork from `apple-pay.svg` as an inline SVG element

#### Scenario: Single-word name
- **WHEN** `ImgIcon` is rendered with `name="visa"`
- **THEN** it renders the artwork from `visa.svg`

### Requirement: Name type matches bundled icons
The exported `ImgIconName` type SHALL be the union of exactly the names `ImgIcon` can render, so that any other string passed as `name` is a TypeScript type error.

#### Scenario: Unknown name rejected at compile time
- **WHEN** a consumer writes `<ImgIcon name="paypal" />` and no `paypal.svg` is bundled
- **THEN** type-checking fails on the `name` prop

#### Scenario: Name list and icon registry stay in sync
- **WHEN** a name is in `ImgIconName` with no matching registered SVG, or an SVG is registered under a name missing from `ImgIconName`
- **THEN** type-checking fails

### Requirement: Width and height pass through unchanged
`ImgIcon` SHALL accept optional `width` and `height` props, each a number or a CSS length string, and SHALL set them on the rendered SVG element unchanged. Setting one SHALL NOT change the other.

#### Scenario: Both dimensions given
- **WHEN** `ImgIcon` is rendered with `name="visa"`, `width={60}` and `height={28}`
- **THEN** the rendered SVG has `width="60"` and `height="28"`

#### Scenario: String dimension
- **WHEN** `ImgIcon` is rendered with `width="100%"`
- **THEN** the rendered SVG has `width="100%"`

#### Scenario: Only one dimension given
- **WHEN** `ImgIcon` is rendered with `name="visa"` and `width={60}` only
- **THEN** the rendered SVG has `width="60"` and keeps the height declared in `visa.svg`

### Requirement: Intrinsic size by default
When `width` and `height` are omitted, `ImgIcon` SHALL render the SVG at the width and height declared in its source file, with no default size applied by the component.

#### Scenario: No dimensions given
- **WHEN** `ImgIcon` is rendered with `name="mastercard"` and no `width` or `height`
- **THEN** the rendered SVG has the width and height declared in `mastercard.svg` (20 × 14)

### Requirement: Class name forwarding
`ImgIcon` SHALL accept an optional `className` prop and apply it to the rendered SVG element.

#### Scenario: Class name applied
- **WHEN** `ImgIcon` is rendered with `className="logo"`
- **THEN** the rendered SVG element has the class `logo`
