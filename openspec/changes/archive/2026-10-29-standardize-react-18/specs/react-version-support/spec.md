# Spec Delta

## Purpose

Defines the React version the workspace develops against and the range of React
majors the shared packages support, so a component library built here runs
unchanged in products on React 18 and products on React 19.

## ADDED Requirements

### Requirement: Single development React version
Every workspace package that declares `react` or `react-dom` SHALL declare the
same React 18 version range. No package SHALL develop against a React major
higher than the lowest major any consuming product runs.

#### Scenario: Package declares React
- **WHEN** a workspace package's manifest declares `react` or `react-dom` in
  `dependencies`, `devDependencies`, or `peerDependencies`
- **THEN** the declared range resolves to a React 18 release, and is the same
  range used by every other package in the workspace that declares it

#### Scenario: Package declares no React
- **WHEN** a workspace package declares neither `react` nor `react-dom`
- **THEN** the requirement does not apply and the manifest is left unchanged

#### Scenario: Installed tree
- **WHEN** workspace dependencies are installed
- **THEN** exactly one `react` version and one `react-dom` version are
  installed for all packages subject to this requirement

### Requirement: React type definitions match the React major
Every workspace package that declares React type definitions SHALL declare a
major matching the installed React major, so that packages compiled in one
TypeScript program never contribute conflicting copies of the React types.

#### Scenario: Types aligned with runtime
- **WHEN** a package declares `@types/react` or `@types/react-dom`
- **THEN** the declared major is 18, matching the installed `react` major

#### Scenario: One package's source compiled by another
- **WHEN** one workspace package imports another's TypeScript source and
  type-checks it as part of its own program
- **THEN** that program resolves a single `@types/react` major, and type
  checking reports no error caused by duplicate React type definitions

### Requirement: Shared package peer range spans both supported majors
A shared package that declares `react` or `react-dom` as a peer dependency
SHALL declare a range satisfied by both React 18 and React 19, so a consuming
product on either major can install it without overriding peer resolution.

#### Scenario: Consumer on React 18
- **WHEN** a product running React 18 installs the shared package
- **THEN** the peer dependency is satisfied and no peer-range warning or error
  is reported

#### Scenario: Consumer on React 19
- **WHEN** a product running React 19 installs the shared package
- **THEN** the peer dependency is satisfied and no peer-range warning or error
  is reported

#### Scenario: Consumer on an unsupported major
- **WHEN** a product running React 17 or earlier installs the shared package
- **THEN** the peer dependency is reported as unsatisfied

### Requirement: Built output resolves its compiler runtime on both majors
The shared package's built output SHALL import a React Compiler runtime module
that resolves and functions under both React 18 and React 19. It SHALL NOT
import a runtime module that exists in only one of the two majors.

#### Scenario: Built output loaded under React 18
- **WHEN** a product on React 18 loads the shared package's built output
- **THEN** every compiler runtime import resolves, and components render
  without a missing-module or undefined-export error

#### Scenario: Built output loaded under React 19
- **WHEN** a product on React 19 loads the shared package's built output
- **THEN** every compiler runtime import resolves, and components render
  without a missing-module or undefined-export error

#### Scenario: Compiler runtime reachable for consumers
- **WHEN** a product installs the shared package from its published manifest
- **THEN** the compiler runtime the built output imports is installed as part
  of that package's own dependency closure, rather than being left for the
  product to add

#### Scenario: Runtime module left external
- **WHEN** the shared package is built
- **THEN** the compiler runtime is referenced as an external import rather than
  inlined into the bundle, so the consuming product resolves a single copy

### Requirement: Shared package source stays within the React 18 API surface
The shared package's source SHALL NOT use any React API absent from React 18,
so that the lower supported major is a build-time constraint rather than a
runtime discovery in a consuming product.

#### Scenario: Source uses only APIs present in both majors
- **WHEN** the shared package is type-checked and built against React 18
- **THEN** the build succeeds with no error reporting a missing React export

#### Scenario: React 19-only API introduced
- **WHEN** a contributor adds a call to a React API introduced in React 19
- **THEN** the package's type check or build fails against the installed React
  18 version, before the code can reach a consuming product

#### Scenario: Forwarding a DOM ref
- **WHEN** a component needs to forward a DOM node ref to its consumer
- **THEN** it uses a mechanism available in React 18, and does not rely on a
  ref passed as an ordinary prop

### Requirement: Deviations are explicit
A workspace package that cannot meet the single development React version SHALL
be recorded as an explicit, justified exception. A package SHALL NOT silently
retain a different React version.

#### Scenario: Package blocked by a framework peer range
- **WHEN** a package depends on a framework whose peer range excludes React 18
  and no satisfying framework version exists
- **THEN** that package is recorded as a named exception with the blocking
  dependency and its peer range stated

#### Scenario: Exception removed
- **WHEN** a recorded exception's blocking dependency gains React 18 support
- **THEN** the package is realigned to the single development version and the
  exception record is removed
