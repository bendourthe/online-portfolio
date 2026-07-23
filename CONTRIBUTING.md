# Contributing

## Branching model

This repository uses a `develop + main` branching model:

- `main` is the protected release branch and should always represent a deployable release.
- `develop` is the integration branch for completed development work.
- `feat/<slug>` branches add user-facing capabilities.
- `fix/<slug>` branches correct defects.
- `refactor/<slug>` branches improve structure, maintainability, design, or delivery without changing the product's intended purpose.

Create work branches from the latest `develop` branch. Keep branch names lowercase and hyphenated, and do not use tool or agent names as prefixes.

## Integration flow

1. Implement and verify work on a `feat/`, `fix/`, or `refactor/` branch.
2. Merge the completed branch into `develop` with a non-fast-forward merge so the work remains a distinct, revertible unit.
3. Run the full build and verification gates on `develop`.
4. For a release, merge `develop` into `main` with a non-fast-forward merge.
5. Tag the release commit on `main` and publish the matching GitHub Release.

GitHub Pages deploys the validated `dist/` package only when `main` is updated.
