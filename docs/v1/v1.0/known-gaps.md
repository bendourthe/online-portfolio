# Version 1.0 Known Gaps

Status: finalized for `v1.0.5`

## Release blockers

No unresolved blockers for v1.0.5. The user approved a one-time exception to the integration PR and CI gate on 2026-10-29 after the local build and browser checks passed. This exception applies only to this content release.

## Deferred improvements

- Automated screenshot-diff coverage remains deferred because the Pages workflow currently checks generation, JavaScript syntax, packaging, and deployment. Next step: add focused screenshot comparisons through a separate workflow change.
- Further media compression remains deferred because it affects existing portfolio assets beyond this release's new thumbnail. Next step: measure transfer sizes and compare visual quality before replacing media.
- The full-page visual detector reports 17 findings on both the unchanged page and the launcher candidate, including existing navigation overlap, section overflow, fixed text width, and small labels. The new card introduced zero findings. Next step: investigate the affected existing sections in a separate layout fix.
- The current workflow runs on main and has no integration PR checks. Next step: add build-only validation for integration changes before future releases, without triggering deployment from develop.
- Release records still use the legacy docs/v1/v1.0 layout, and DEVLOG retains historical narrative entries alongside the new release index line. Next step: approve a documentation migration that preserves the old narrative before converting the whole file to an index and moving release records to docs/releases/v1/v1.0.
- The ignore audit identifies pre-existing tracked rule files and resume text that now match .gitignore. They are excluded from the deployment package and were left intact. Next step: review ownership before changing the tracked index.
