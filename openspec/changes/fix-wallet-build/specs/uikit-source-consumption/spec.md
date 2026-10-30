# Spec Delta

## Purpose

Defines what the uikit's TypeScript source must honour as a source-consumed
package. Because the package's root entry point resolves to its source rather
than to built output, every consuming product compiles uikit's own `.ts`/`.tsx`
files inside its own TypeScript program. This capability constrains that source
so it type-checks there without the consumer configuring anything on uikit's
behalf.

## ADDED Requirements

### Requirement: Source type-checks inside a consuming program
The uikit's source SHALL type-check without error when compiled as part of a
consuming product's TypeScript program, reached through the package's root entry
point. No error arising from uikit's own source SHALL be reported in that
program.

#### Scenario: Consumer compiles uikit through the package root
- **WHEN** a consuming product imports from the uikit's package root and runs its
  own type check over its sources
- **THEN** the type check reports no error located in a uikit source file

#### Scenario: Consumer type check gates its build
- **WHEN** a consuming product's build runs its type check before producing
  bundled output
- **THEN** the type check completes, so the build proceeds to its bundling step
  rather than stopping on a uikit source error

### Requirement: A consuming product needs no uikit-specific compiler configuration
A consuming product SHALL NOT be required to name uikit's build-time ambient
type packages in its own compiler configuration, nor to add its sources to its
own include set, in order for uikit's source to type-check. Whatever uikit's
source depends on SHALL travel with that source.

#### Scenario: Consumer declares only its own ambient types
- **WHEN** a consuming product's compiler configuration lists only the ambient
  type packages its own code needs
- **THEN** uikit's source still type-checks in that program

#### Scenario: Several products consume the package
- **WHEN** more than one product consumes the uikit's source
- **THEN** none of them carries a configuration entry added on uikit's behalf,
  and a fix applied once inside uikit serves all of them

### Requirement: Non-standard import specifiers carry their own declarations
When a uikit source file imports a module specifier that the TypeScript
compiler cannot resolve by its standard rules — such as an asset path with a
build-tool query suffix — the declaration that gives that specifier a type SHALL
be reachable from the importing file itself. It SHALL NOT depend on a file that
only uikit's own compiler configuration pulls into the program.

#### Scenario: Asset import with a query suffix
- **WHEN** a uikit source file imports an SVG asset through a specifier carrying
  a build-tool query suffix, such as `./duckdice/AAVE.svg?react`
- **THEN** that import resolves to a type in a consuming product's program, and
  no unresolved-module error is reported for it

#### Scenario: Declaration reachable only from uikit's own include set
- **WHEN** the only declaration for such a specifier sits in a file that uikit's
  own compiler configuration includes but nothing in the source imports
- **THEN** that is insufficient, because a consuming program does not pull that
  file in

#### Scenario: A new non-standard import is added
- **WHEN** a contributor adds a uikit source import whose specifier standard
  resolution cannot resolve
- **THEN** the declaration accompanies the importing file, so the import works in
  a consuming program and not only in uikit's own build

### Requirement: Carrying the declarations changes no behaviour
Making these declarations reachable SHALL be type-only. It SHALL NOT change
emitted output, the assets any component renders, or the package's exported API.

#### Scenario: Icons render unchanged
- **WHEN** a component that imports asset modules is rendered after the
  declarations are made reachable
- **THEN** it renders the same artwork at the same size as before

#### Scenario: Bundled output unaffected
- **WHEN** the uikit or a consuming product is bundled
- **THEN** the bundling step resolves the same asset modules and produces the
  same output as before, because the declarations are erased at compile time

### Requirement: The workspace consumer detects regressions before external products
The workspace product that consumes uikit's source SHALL type-check that source
as part of its own build, so a uikit change that breaks source consumption fails
inside this repository rather than in an external product.

#### Scenario: Regression introduced in uikit source
- **WHEN** a change to uikit's source makes it fail to type-check in a consuming
  program
- **THEN** the workspace consumer's build fails, before the change can reach a
  product outside this repository

#### Scenario: Baseline stays empty
- **WHEN** the workspace consumer's type check is run on an unmodified checkout
- **THEN** it reports no error, so any error it later reports is attributable to
  the change that introduced it rather than hidden in a standing backlog
