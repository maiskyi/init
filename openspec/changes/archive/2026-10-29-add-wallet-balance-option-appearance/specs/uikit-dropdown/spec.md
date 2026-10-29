# Spec Delta

## Purpose

Covers how the uikit `Dropdown`'s floating content panel is sized relative to the
toggle that opens it, so that consumers can choose between a panel that hugs its
own content and one that lines up with the control beneath it.

## ADDED Requirements

### Requirement: Content panel matches the toggle width on request

When a dropdown's content is asked to match its toggle's width, the panel SHALL
be exactly as wide as the toggle — neither narrower nor wider — so that content
which would otherwise be wider is constrained to that width instead of expanding
the panel.

#### Scenario: Content narrower than the toggle

- **WHEN** a dropdown's content is asked to match its toggle's width and its content's natural width is less than the toggle's
- **THEN** the panel is rendered at the toggle's width

#### Scenario: Content wider than the toggle

- **WHEN** a dropdown's content is asked to match its toggle's width and its content's natural width is greater than the toggle's
- **THEN** the panel is still rendered at the toggle's width, and the content is laid out within it rather than widening the panel

#### Scenario: Width matching not requested

- **WHEN** a dropdown's content is not asked to match its toggle's width
- **THEN** the panel is sized to its own content, subject to the panel's own minimum width
