# wallet-payment-method-option Specification

## Purpose


Defines the appearance of a single payment method row in the wallet's payment
method picker: its anatomy, its active and inactive states, and how a payment
method's API slug resolves to an icon and a human-readable label. The row is
supplied as the option label of the wallet's payment method `Select`.

## Requirements


### Requirement: Row anatomy
A payment method option SHALL render as a single horizontal row with two parts in
reading order: a leading payment method icon and the method's display label. The
parts SHALL be vertically centred on one another, and the label SHALL stay on a
single line.

#### Scenario: Row renders both parts
- **WHEN** a payment method option is rendered for a method
- **THEN** the payment method icon and the display label are both visible, in that order

#### Scenario: Label does not wrap
- **WHEN** a payment method's label is too long for the available width
- **THEN** the label stays on one line rather than wrapping to a second

### Requirement: Icon size and spacing
The payment method icon SHALL occupy a 30px square, and SHALL be separated from
the display label by 10px.

#### Scenario: Icon is rendered at the specified size
- **WHEN** a payment method option renders its icon
- **THEN** the icon occupies a 30px by 30px area

### Requirement: Label typography
The display label SHALL be set at 14px with a 20px line height.

#### Scenario: Label uses the specified type scale
- **WHEN** a payment method option is rendered, whether active or inactive
- **THEN** its label is set at 14px with a 20px line height

### Requirement: Inactive appearance
When a payment method option is not the selected method, its label SHALL be
rendered in regular weight.

#### Scenario: Inactive row label is not bold
- **WHEN** a payment method option is rendered for a method that is not selected
- **THEN** the label is rendered in regular weight

### Requirement: Active appearance
When a payment method option is the selected method, its label SHALL be rendered
in semibold weight.

#### Scenario: Active row label is bold
- **WHEN** a payment method option is rendered for the currently selected method
- **THEN** the label is rendered in semibold weight

### Requirement: Label colour follows the surrounding row
The display label SHALL take the text colour of the row that contains it rather
than setting its own, so that it stays consistent with the row's default,
hovered, and selected appearances.

#### Scenario: Label matches the surrounding row colour
- **WHEN** the containing row changes its text colour between its default, hovered, and selected appearances
- **THEN** the display label changes with it

#### Scenario: Hovering an unselected row lightens its label
- **WHEN** the pointer enters an unselected payment method row
- **THEN** that row's label takes the row's hovered text colour, and returns to the default colour when the pointer leaves

### Requirement: Icon resolution
A payment method option SHALL resolve its icon from the method's name as supplied
by the API, which is a slug such as `gift-cards-g2a` rather than an icon name.
The resolution SHALL be a lookup that covers only the slugs with a confident
icon match.

#### Scenario: Slug has a mapped icon
- **WHEN** a payment method option renders a method whose slug has a mapped icon, such as `metamask`
- **THEN** that method's icon is rendered

#### Scenario: Slug resolves through a reasoned mapping
- **WHEN** a payment method option renders `coins`, one of the `*_qr` bank variants, `payment-card-ru`, `ob_card`, `phone-megafon`, or `phone-beeline-ru`
- **THEN** a generic icon standing in for that method's category is rendered rather than a blank slot

### Requirement: Unmapped slug shows no icon rather than a wrong one
A payment method slug SHALL NOT be mapped to an icon belonging to a different
brand or institution. When no icon confidently represents a method, the option
SHALL render no icon.

#### Scenario: Near-miss brands stay unmapped
- **WHEN** a payment method option renders `vietcombank`, `o_pay`, or `asia_commercial_bank`
- **THEN** no icon is drawn, rather than the icon of Viet A Bank, PayOp, or any other similarly-named institution

### Requirement: Missing icon reserves its space
When a payment method has no icon available under any name, the option SHALL
render an empty 30px square in the icon's place so that the label stays aligned
with rows that do have an icon.

#### Scenario: Method without an icon keeps the row aligned
- **WHEN** a payment method option renders a method that has no icon, such as `pix`
- **THEN** no icon is drawn, and the label sits at the same horizontal position as in a row whose icon exists

### Requirement: Label resolution
A payment method option SHALL render a human-readable display label looked up
from the method's API slug, because the method data carries no title of its own.

#### Scenario: Slug has a mapped label
- **WHEN** a payment method option renders a method whose slug has a mapped label, such as `gift-cards-g2a`
- **THEN** the mapped label is rendered rather than the raw slug

#### Scenario: Unmapped slug falls back to the slug
- **WHEN** a payment method option renders a method whose slug has no mapped label
- **THEN** the raw slug is rendered, so the row stays identifiable rather than blank

### Requirement: Payment method picker uses the option row
The wallet's payment method picker SHALL render each of its options as a payment
method option, and SHALL render the selected method's option in its closed state
using the active appearance.

#### Scenario: Open picker marks the selected option active
- **WHEN** the payment method picker is open
- **THEN** exactly the option matching the selected method is rendered with the active appearance, and every other option with the inactive appearance

#### Scenario: Closed picker shows the active row
- **WHEN** the payment method picker is closed and a method is selected
- **THEN** the picker displays that method's payment method option with the active appearance

#### Scenario: Picker no longer shows raw slugs
- **WHEN** the payment method picker is opened on the deposit-crypto screen
- **THEN** no row displays a raw API slug for a method whose slug has a mapped label
