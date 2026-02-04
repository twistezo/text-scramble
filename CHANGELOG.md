# Changelog

## [1.1.0] - 2026-02-04

### Changed

- Migrated from JavaScript to TypeScript
- Migrated from Babel to Bun bundler
- Package now exports both ESM and CJS formats
- Updated all dependencies to latest versions
- Replaced Jest with Bun test runner

### Added

- `destroy()` method to stop animation and cleanup intervals (prevents memory leaks)
- TypeScript type definitions (`dist/index.d.ts`)
- Input validation in constructor:
  - `domClass` must be a non-empty string
  - `sentences` must be a non-empty array
  - DOM element must exist
- Integration tests for ESM and CJS distributions
- Example HTML file in `/examples`

### Removed

- Babel configuration
- GitHub Packages registry configuration

### Fixed

- Memory leak from infinite loop without cleanup option

## [1.0.5] - 2020-08-03

- Text scramble effect with configurable timing
- Infinite loop through sentences
- Random symbol animation
