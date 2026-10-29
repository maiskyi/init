# wallet-balance-option Specification

## Purpose


Defines the appearance of a single currency row in the wallet's currency picker:
its anatomy, its active and inactive states, and how a currency's symbol resolves
to a crypto icon. The row is supplied as the option label of the wallet's
currency `Select`.

## Requirements


### Requirement: Row anatomy
A balance option SHALL render as a single horizontal row spanning the full width
available to it, with three parts in reading order: a leading currency icon, a
group holding the currency symbol followed by the currency name, and a trailing
block holding the balance amount above its fiat equivalent. The leading group
SHALL absorb spare width so the trailing block sits at the row's trailing edge.

#### Scenario: Row renders all three parts
- **WHEN** a balance option is rendered for a currency
- **THEN** the currency icon, the symbol, the currency name, the balance amount, and the fiat equivalent are all visible in that order

#### Scenario: Trailing block stays at the edge
- **WHEN** the row is wider than its content needs
- **THEN** the extra width is taken up between the currency name and the balance amount, leaving the balance amount and fiat equivalent aligned to the row's trailing edge

#### Scenario: Long currency name does not displace the balance
- **WHEN** a currency's name is too long to fit the available width
- **THEN** the name is truncated rather than pushing the balance amount or fiat equivalent out of the row

### Requirement: Icon size and spacing
The currency icon SHALL be 20px square. The symbol SHALL be separated from the
currency name by 6px, and the balance amount SHALL sit directly above the fiat
equivalent with no gap between them.

#### Scenario: Icon is rendered at the specified size
- **WHEN** a balance option renders its currency icon
- **THEN** the icon occupies a 20px by 20px area

### Requirement: Symbol and name typography
The currency symbol SHALL be set at 14px with a 20px line height. The currency
name SHALL be set at 12px with a 16px line height in the theme's secondary text
colour, in both the active and the inactive state.

#### Scenario: Currency name is muted in either state
- **WHEN** a balance option is rendered, whether active or inactive
- **THEN** the currency name uses the theme's secondary text colour

### Requirement: Balance and fiat typography
The balance amount SHALL be set at 14px with a 20px line height in semibold
weight, and the fiat equivalent at 12px with a 16px line height in the theme's
secondary text colour. Both SHALL be aligned to the row's trailing edge.

#### Scenario: Balance amount is bold in either state
- **WHEN** a balance option is rendered, whether active or inactive
- **THEN** the balance amount is rendered in semibold weight

#### Scenario: Fiat equivalent is muted in either state
- **WHEN** a balance option is rendered, whether active or inactive
- **THEN** the fiat equivalent uses the theme's secondary text colour

### Requirement: Inactive appearance
When a balance option is not the selected currency, the currency symbol SHALL be
rendered in regular weight.

#### Scenario: Inactive row symbol is not bold
- **WHEN** a balance option is rendered for a currency that is not selected
- **THEN** the currency symbol is rendered in regular weight

### Requirement: Active appearance
When a balance option is the selected currency, the currency symbol SHALL be
rendered in semibold weight, matching the balance amount.

#### Scenario: Active row symbol is bold
- **WHEN** a balance option is rendered for the currently selected currency
- **THEN** the currency symbol is rendered in semibold weight

### Requirement: Symbol and amount colour follow the surrounding row
The currency symbol and the balance amount SHALL take the text colour of the row
that contains them rather than setting their own, so that they stay consistent
with the row's default, hovered, and selected appearances.

#### Scenario: Symbol and amount match the surrounding row colour
- **WHEN** the containing row changes its text colour between its default, hovered, and selected appearances
- **THEN** the currency symbol and the balance amount change with it, while the currency name and fiat equivalent stay in the theme's secondary text colour

### Requirement: Currency icon resolution
A balance option SHALL render the crypto icon published under its currency's
symbol.

#### Scenario: Symbol matches an icon name
- **WHEN** a balance option renders a currency whose symbol matches a published crypto icon name
- **THEN** that icon is rendered

### Requirement: Missing icon reserves its space
When a currency has no crypto icon available under any name, the balance option
SHALL render an empty 20px square in the icon's place so that the row's remaining
content stays aligned with rows that do have an icon.

#### Scenario: Currency without an icon keeps the row aligned
- **WHEN** a balance option renders a currency that has no crypto icon, such as `DECOY`
- **THEN** no icon is drawn, and the symbol, name, balance, and fiat equivalent sit at the same horizontal positions as in a row whose icon exists

### Requirement: Balance values are placeholders
The balance amount SHALL read `0.00` and the fiat equivalent SHALL read `$0.00`
for every currency. The balance option SHALL NOT read a balance from the currency
it is given or from any other source.

#### Scenario: Every row shows the same placeholder values
- **WHEN** balance options are rendered for several different currencies
- **THEN** every row shows `0.00` as its balance amount and `$0.00` as its fiat equivalent

### Requirement: Selected currency uses the active appearance in the closed picker
The currency picker SHALL render the selected currency's balance option in its
closed state using the active appearance.

#### Scenario: Closed picker shows the active row
- **WHEN** the currency picker is closed and a currency is selected
- **THEN** the picker displays that currency's balance option with the active appearance

#### Scenario: Open picker marks the selected option active
- **WHEN** the currency picker is open
- **THEN** exactly the option matching the selected currency is rendered with the active appearance, and every other option with the inactive appearance
