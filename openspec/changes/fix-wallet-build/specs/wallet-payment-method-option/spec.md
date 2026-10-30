# Spec Delta

## ADDED Requirements

### Requirement: The picker supplies the option row the method record as the API provides it
The payment method picker SHALL supply each option row with the payment method
record in the shape the API provides, with no reshaped or derived form
interposed between the two. The row's declared option type and the data the
picker holds SHALL be the same shape.

#### Scenario: Row resolves its icon and label from the supplied record
- **WHEN** the picker renders an option row for a method
- **THEN** the row reads that method's API slug from the record it was given, and
  resolves its icon and display label from that slug

#### Scenario: Shapes disagree
- **WHEN** the data the picker holds for a method is not assignable to the shape
  the option row declares for its option
- **THEN** type-checking fails, rather than the mismatch being bridged by a cast
  or suppressed at the call site

#### Scenario: A field the row does not read
- **WHEN** the method record carries a field the option row never reads, such as
  its list of supported currencies
- **THEN** the record is still passed through whole, and the row is not given a
  narrowed or rebuilt substitute

### Requirement: The picker offers only methods supporting the selected balance
The deposit-crypto payment method picker SHALL offer only those payment methods
whose supported currencies include the currently selected balance currency. A
method that does not support that currency SHALL NOT appear as an option.

#### Scenario: Method supports the selected currency
- **WHEN** the selected balance currency is listed among a method's supported
  currencies
- **THEN** that method appears as an option in the picker

#### Scenario: Method does not support the selected currency
- **WHEN** the selected balance currency is absent from a method's supported
  currencies
- **THEN** that method does not appear as an option in the picker

#### Scenario: Default selection comes from the offered methods
- **WHEN** the deposit-crypto form opens with no previously saved payment method
- **THEN** the method selected by default is the first one the picker offers for
  the selected balance currency, not a method filtered out of the list

#### Scenario: Currency support is read from the method record
- **WHEN** the picker determines whether a method supports the selected balance
- **THEN** it answers from the supported-currency list the API supplies on that
  method, and the answer is the same regardless of how that list is stored
