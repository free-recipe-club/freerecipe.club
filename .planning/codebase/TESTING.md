# Testing

## Current State

**No tests exist.** The `@types/jest` package is installed as a dev dependency, but no test files, test configuration, or test scripts are present.

## Test Infrastructure

| Aspect | Status |
|--------|--------|
| Test framework | Jest types installed, no framework configured |
| Test files | None |
| Test script | Not defined in package.json |
| CI/CD | No configuration found |
| Coverage | Not configured |

## Build Verification

The `build` script (`astro check && tsc --noEmit && astro build`) provides:
- **`astro check`:** Validates Astro component syntax
- **`tsc --noEmit`:** TypeScript type-checking without output
- **`astro build`:** Full static site build

This serves as the only form of automated verification — if types or Astro syntax are broken, the build fails.
