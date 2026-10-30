# uikit-select Specification

## Purpose

Covers the contract between a uikit `Select`'s option-value accessor, its
current-value prop, and the value it reports on change — so that consumers
get one value type across all three, determined by their own options and
checked at compile time rather than widened to a catch-all.

## Requirements

### Requirement: The selected value type follows the option accessor
A select's value type SHALL be the type returned by the accessor the
consumer supplies to read a value off an option. The current-value prop and
the value reported on change SHALL both be that type, so a consumer never
has to reconcile two different value types for one control.

#### Scenario: Accessor returns a string
- **WHEN** a consumer's option accessor returns a `string`
- **THEN** the current-value prop accepts a `string`, and the change
  notification reports a `string`

#### Scenario: Accessor returns a number
- **WHEN** a consumer's option accessor returns a `number`
- **THEN** the current-value prop accepts a `number`, and the change
  notification reports a `number`

#### Scenario: Accessor returns a narrower union
- **WHEN** a consumer's option accessor returns a union of string literals
- **THEN** the change notification reports that union, not a widened
  `string`

### Requirement: The value type is inferred without annotation
A consumer SHALL NOT have to write type arguments on the select to obtain
the value type described above. Supplying options, an accessor, and a
current value SHALL be enough to determine it.

#### Scenario: No type arguments written
- **WHEN** a consumer renders a select supplying only options, an option
  accessor, a current value, and a change handler
- **THEN** the value type is determined from those props alone, and is not
  widened to an unknown or catch-all type

#### Scenario: Change handler passed by reference
- **WHEN** the change handler is a previously declared function referred to
  by name, rather than written inline at the select
- **THEN** the value type is still determined from the other props, and the
  named handler is checked against it

#### Scenario: Type arguments written explicitly
- **WHEN** a consumer does write the option and value types explicitly
- **THEN** those types are used as given, and the accessor, current value,
  and change handler are all checked against them

### Requirement: Disagreement among the value props is rejected
When a consumer's option accessor, current value, and change handler do not
agree on one value type, the select SHALL fail to compile. Agreement SHALL
NOT be obtained by silently widening the value type to accommodate all
three.

#### Scenario: Current value disagrees with the accessor
- **WHEN** the option accessor returns a `string` and the current-value prop
  is given a `number`
- **THEN** compilation fails

#### Scenario: Change handler disagrees with the accessor
- **WHEN** the option accessor returns a `string` and the change handler
  declares its parameter as `number`
- **THEN** compilation fails

#### Scenario: Change handler accepts more than the value type
- **WHEN** the value type is `string` and the change handler declares a
  parameter it can receive a `string` as, such as `string | number`
- **THEN** compilation succeeds, because such a handler can safely receive
  every value the select will report

### Requirement: A select with no current value is string-valued by default
A select is usable without a current-value prop. Where the value type cannot
otherwise be determined in that case, it SHALL default to `string` rather
than becoming unknown, so the common case of string-keyed options needs no
annotation.

#### Scenario: No current value, string accessor
- **WHEN** a consumer renders a select with no current-value prop and an
  option accessor returning a `string`
- **THEN** the value type is `string`, and a `string` change handler is
  accepted

#### Scenario: No current value and no change handler
- **WHEN** a consumer renders a select with neither a current-value prop nor
  a change handler
- **THEN** the value type is still taken from the option accessor, whatever
  that accessor returns

#### Scenario: No current value, non-string accessor, named change handler
- **WHEN** a consumer renders a select with no current-value prop, a change
  handler referred to by name rather than written inline, and an option
  accessor returning something other than a `string`
- **THEN** compilation fails, and writing the value type explicitly on the
  select resolves it

#### Scenario: Current value overrides the default
- **WHEN** a consumer supplies a current-value prop that is not a `string`
- **THEN** that value's type is used, not the `string` default

### Requirement: Option values are not restricted to primitives
The select SHALL place no constraint on what an option accessor may return,
and SHALL give each rendered option a list identity distinct from its
siblings without requiring the value to be usable as one.

#### Scenario: Accessor returns a non-primitive
- **WHEN** a consumer's option accessor returns a value that cannot itself
  serve as a list identity
- **THEN** the select still compiles, and each rendered option carries an
  identity distinct from its siblings

#### Scenario: Two options carry equal values
- **WHEN** two options yield values that are equal to one another
- **THEN** each still carries a distinct list identity, because identity is
  derived from the option's position rather than from its value

### Requirement: The selected option reflects the current value
The select SHALL show the option whose value matches the current value, and
SHALL compare values structurally so that a non-primitive value matches an
equal value rather than only the identical one.

#### Scenario: Current value equals an option's value
- **WHEN** the current value is structurally equal to one option's value
- **THEN** that option is shown as the selected one and marked active, and
  the placeholder is not shown

#### Scenario: Non-primitive value, equal but not identical
- **WHEN** the current value is a non-primitive structurally equal to an
  option's value but not the same instance
- **THEN** that option is still shown as the selected one and marked active

### Requirement: Form-bound selects carry string values
A select rendered through the form layer SHALL have a `string` value type,
matching the value type the form layer stores for a control, and SHALL
reject an option accessor that returns anything else.

#### Scenario: Form-bound select with a string accessor
- **WHEN** a consumer renders a form-bound select whose option accessor
  returns a `string`
- **THEN** it compiles, and the option and value types are determined
  without the consumer writing any type arguments

#### Scenario: Form-bound select with a non-string accessor
- **WHEN** a consumer renders a form-bound select whose option accessor
  returns a `number`
- **THEN** compilation fails

### Requirement: Existing single-type-argument references keep compiling
Naming the select's prop type with only its option type SHALL remain valid,
so consumers written against the control before it gained a separate value
type are not broken by this contract.

#### Scenario: Prop type named with one type argument
- **WHEN** existing code refers to the select's prop type supplying only the
  option type
- **THEN** it compiles, and the value type is the `string` default
