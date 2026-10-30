# Spec Delta

## Purpose

Defines the payment method icon component published by the uikit: the set of
brand icons it ships, the name type consumers address those icons by, and how a
name resolves to a rendered asset. The name type is the component's public
contract, so it must admit the published names and nothing else.

## ADDED Requirements

### Requirement: Icon name type admits only published names

The payment method icon name type SHALL be a union of exactly the names the
component publishes. Assigning any other string to it SHALL be a compile-time
error.

#### Scenario: A published name is accepted

- **WHEN** a published icon name such as `METAMASK` is assigned to the payment method icon name type
- **THEN** it compiles

#### Scenario: An unpublished name is rejected

- **WHEN** a string that is not a published icon name, such as `METAMSK`, is assigned to the payment method icon name type
- **THEN** compilation fails

### Requirement: Icon name type is derived independently of the icon map

The icon name type SHALL be declared independently of the map from names to
assets, and the map SHALL be typed against it. The type SHALL NOT be computed
from the map, because a map typed by its own computed key type constrains
nothing.

#### Scenario: The map is checked against the type

- **WHEN** the icon map is declared
- **THEN** its keys are constrained by the icon name type rather than supplying it

### Requirement: Every published name has an asset

The icon map SHALL contain an entry for every name in the icon name type.
Omitting one SHALL be a compile-time error.

#### Scenario: A missing entry fails the build

- **WHEN** a name is present in the icon name type but has no entry in the icon map
- **THEN** compilation fails

### Requirement: No asset exists outside the published names

The icon map SHALL NOT contain an entry whose key is absent from the icon name
type. Adding one SHALL be a compile-time error.

#### Scenario: An extra entry fails the build

- **WHEN** an entry is added to the icon map under a key that is not in the icon name type
- **THEN** compilation fails

### Requirement: The component's name prop uses the icon name type

The payment method icon component SHALL type its name prop as the icon name
type, so a call site passing an unpublished name fails to compile.

#### Scenario: Call site with an unpublished name is rejected

- **WHEN** the component is rendered with a name that is not a published icon name
- **THEN** compilation fails

### Requirement: The icon name type is exported for consumers

The icon name type SHALL be exported from both the component's folder barrel and
the package root barrel, so a consumer can declare its own values as that type
without reaching into the component's internals.

#### Scenario: Consumer imports the type from the package root

- **WHEN** a consuming application imports the payment method icon name type from the package root
- **THEN** the import resolves, and the consumer can annotate its own name values with it

#### Scenario: Consumer's hand-authored icon names are checked

- **WHEN** a consumer declares a mapping whose values are annotated with the payment method icon name type and one value is not a published name
- **THEN** compilation fails rather than silently resolving to no icon at render time

### Requirement: Typing the names changes no runtime behaviour

Constraining the icon name type SHALL NOT alter what the component renders for
any name it already rendered, and SHALL NOT add, remove or rename any icon
asset.

#### Scenario: Rendering is unchanged

- **WHEN** the component is rendered with a published icon name
- **THEN** it renders the same asset at the same size as before the name type was constrained
