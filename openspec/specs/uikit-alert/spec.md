# uikit-alert Specification

## Purpose

Provides the uikit's `Alert` component: a themed inline banner that shows a status icon and a message in one of five variants, and can optionally act as a clickable link-like row.

## Requirements

### Requirement: Variants
`Alert` SHALL accept an optional `variant` prop of `'warning'`, `'success'`, `'error'`, `'default'` or `'info'`, and SHALL default to `'default'`. Any other value SHALL be a TypeScript type error.

#### Scenario: No variant given
- **WHEN** `<Alert>Saved</Alert>` is rendered
- **THEN** it renders with the `default` variant's colors and icon

#### Scenario: Unsupported variant rejected
- **WHEN** a consumer writes `<Alert variant="danger">x</Alert>`
- **THEN** type-checking fails on the `variant` prop

### Requirement: Message content
`Alert` SHALL render its `children` as the message, to the right of the leading icon. Message text that does not fit on one line SHALL wrap; it SHALL NOT be truncated.

#### Scenario: Multi-line message
- **WHEN** an `Alert` 470px wide is rendered with a message longer than one line
- **THEN** the message wraps onto further lines and the alert grows in height to fit it

### Requirement: Default icon per variant
When no `icon` prop is given, `Alert` SHALL render a leading icon from the icon font chosen by its variant: `warning` → `alert`, `success` → `check-circle`, `error` → `cancel`, `default` → `face`, `info` → `support`.

#### Scenario: Error default icon
- **WHEN** `<Alert variant="error">Failed</Alert>` is rendered
- **THEN** the leading icon is the `cancel` icon

#### Scenario: Info default icon
- **WHEN** `<Alert variant="info">Need help?</Alert>` is rendered
- **THEN** the leading icon is the `support` icon

### Requirement: Icon override
`Alert` SHALL accept an optional `icon` prop typed as the icon font's `IconName`. When given, `Alert` SHALL render that icon instead of the variant's default icon, keeping the variant's icon color. A name that is not an `IconName` SHALL be a TypeScript type error.

#### Scenario: Custom icon
- **WHEN** `<Alert variant="success" icon="safe">Funds secured</Alert>` is rendered
- **THEN** the leading icon is `safe`, not `check-circle`, and it uses the success icon color

#### Scenario: Unknown icon rejected
- **WHEN** a consumer writes `<Alert icon="not-an-icon">x</Alert>`
- **THEN** type-checking fails on the `icon` prop

### Requirement: Static alert
When no `onClick` prop is given, `Alert` SHALL render as a non-interactive element: it SHALL NOT be focusable, SHALL NOT show a pointer cursor or hover change, and SHALL NOT render the trailing chevron.

#### Scenario: No onClick
- **WHEN** `<Alert variant="warning">Low balance</Alert>` is rendered
- **THEN** no chevron is shown, the alert cannot be reached with the Tab key, and hovering it does not change its appearance

### Requirement: Clickable alert
When an `onClick` prop is given, for any variant, `Alert` SHALL render as a button that calls `onClick` when clicked or activated with Enter or Space, is reachable with Tab, shows a pointer cursor and a hover background, and renders a `chevron-right` icon at its right edge.

#### Scenario: Click
- **WHEN** `<Alert onClick={handler}>Open</Alert>` is clicked
- **THEN** `handler` is called once

#### Scenario: Keyboard activation
- **WHEN** a clickable `Alert` is focused with Tab and Enter is pressed
- **THEN** `onClick` is called once

#### Scenario: Chevron shown
- **WHEN** `<Alert variant="error" onClick={handler}>Retry</Alert>` is rendered
- **THEN** a `chevron-right` icon is shown at the right edge, vertically centered

#### Scenario: Not a form submit
- **WHEN** a clickable `Alert` is rendered inside a `<form>` and clicked
- **THEN** the form is not submitted

### Requirement: Variant theming
`Alert` SHALL take its colors from the active theme's semantic tokens: background `panel-bg-<c>-10`, message and leading icon `<c>` accent, where `<c>` is orange (`warning`), green (`success`), red (`error`), light/primary (`default`), blue/blue-300 (`info`). `warning`, `success` and `error` SHALL have a 1px border in the matching `-20` border token; `default` and `info` SHALL have none.

#### Scenario: Warning colors
- **WHEN** `<Alert variant="warning">x</Alert>` is rendered under `data-theme="duckdice"`
- **THEN** its background is `--surface-panels-panel-bg-orange-10`, its border is 1px `--borders-border-orange-20`, and its text and icon are `--text-accent-orange` / `--icon-orange`

#### Scenario: Info has no border
- **WHEN** `<Alert variant="info">x</Alert>` is rendered under `data-theme="duckdice"`
- **THEN** its background is `--surface-panels-panel-bg-blue-10` and it shows no border

#### Scenario: All variants same size
- **WHEN** a `warning` and an `info` alert with the same message are rendered at the same width
- **THEN** both have the same height

### Requirement: Layout
`Alert` SHALL fill its container's width, use 12px padding, 6px corner radius and 14px/20px body text. The leading 16px icon SHALL align with the first line of the message, 10px before it; the chevron SHALL be 16px, 8px after the message.

#### Scenario: Icon aligned to first line
- **WHEN** an `Alert` renders a two-line message
- **THEN** the leading icon is vertically centered on the first line, not on the whole block

### Requirement: Custom class name
`Alert` SHALL accept an optional `className`, applied to its root element in addition to its own classes.

#### Scenario: Extra class
- **WHEN** `<Alert className="mb-4">x</Alert>` is rendered
- **THEN** the root element has the `mb-4` class as well as the alert's own classes

### Requirement: Public exports
The uikit root entry SHALL export `Alert`, the `AlertProps` type and the `AlertVariant` type, and SHALL export the `IconName` type so consumers can type the `icon` prop without a deep import.

#### Scenario: Import from root
- **WHEN** a consumer writes `import { Alert, type AlertVariant, type IconName } from '@rockethash/uikit'`
- **THEN** the import type-checks and resolves
