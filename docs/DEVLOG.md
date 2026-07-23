# Development Log

## 2026-07-23 - Theme configuration patch

Version `1.0.1` moved home-page text and icon color roles into a dedicated light/dark theme configuration and corrected the contact-section cascade so the subtitle remains readable in light mode.

### Delivered

- Added explicit light and dark values for site-wide text, inverse text, icon, and embedded-frame roles.
- Replaced direct home-page `color` and SVG `fill` literals with semantic theme variables.
- Corrected legacy theme aliases so body-level dark-mode overrides propagate to components.
- Added the theme configuration to the deterministic deployment package.
- Verified the contact subtitle at 5.06:1 contrast in light mode and 18.18:1 in dark mode.

## 2026-07-23 - Initial release preparation

The portfolio was prepared for its first versioned release after a multi-stage design and content rebuild.

### Delivered

- Rebuilt all seven skill-detail experiences around a shared responsive and theme-aware design system.
- Added dedicated light and dark visual assets where a single illustration could not preserve contrast.
- Integrated generated HTML artwork for communication and leadership workflows.
- Consolidated runtime skill media under `content/skills/assets/`.
- Moved editable pages, artwork sources, icon references, mockups, and rebuild inputs under `source/skills/`.
- Added a deterministic `dist/` builder with local-reference validation.
- Added GitHub Pages automation that regenerates bundles, checks JavaScript, builds the upload package, and deploys only that package.

### Release outcome

Version `1.0.0` establishes the static-site runtime contract and a maintainable boundary between deployable assets and authoring material.
