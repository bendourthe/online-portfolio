# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2026-10-29

### Added

- `deploy/dourthe-technologies.com/.htaccess`: a permanent redirect from dourthe-technologies.com to benjamindourthe.com.

### Changed

- Refreshed the Nexus Hub v4.13.10 guide and Training page: a skip-to-content link, a figure status label that wraps instead of overlapping, and a two-by-two phone layout for the context window figure. The site favicons and the Training page's links to the guide are kept.
- The README documents the production hosting on benjamindourthe.com.

## [1.0.3] - 2026-10-29

### Added

- Canonical addresses on benjamindourthe.com, complete Open Graph and X/Twitter tags with absolute image URLs, and schema.org structured data for the author and the website on the home and skills pages.
- `robots.txt` and `sitemap.xml` at the site root, included in the deployment package.

### Changed

- The home page declares its language and character set, mentions agentic AI and Android apps in its description, and replaces the obsolete `noodp` robots value.
- The README links to benjamindourthe.com instead of the retired dourthe.tech domain.

## [1.0.2] - 2026-10-29

### Added

- Lumifold portfolio card: a hinge-driven live wallpaper app for book-style Android foldables, linked to its GitHub repository and filed under Software Engineering.
- Nexus Hub v4.13.10 guide (Home, Foundations, Cheatsheets) and a new Training page with the Nexus Defenders game.

### Changed

- The deployment build resolves the Nexus Hub guide's relative references from the guide's own folder and no longer treats `data-src=` or `toDataURL(` as file references.

### Removed

- The Nexus Hub trivia quiz zip file.

## [1.0.1] - 2026-07-23

### Changed

- Centralized home-page text and icon colors in a dedicated light/dark theme configuration.

### Fixed

- Restored readable, full-opacity contact-section text in light mode.
- Corrected theme aliases so dark-mode values propagate consistently.

## [1.0.0] - 2026-07-23

### Added

- Responsive portfolio experience with theme-aware presentation and accessible navigation.
- Featured projects and the hosted Nexus-Hub interactive guide.
- Seven detailed skill pages spanning engineering, software, data, AI, agentic DevOps, communication, and leadership.
- Theme-aware illustrations, workflow diagrams, and light/dark media variants.
- Deterministic static-site packaging and GitHub Pages deployment automation.

### Changed

- Consolidated skill content into a browser-only asset tree and a separate editable source tree.
- Rebuilt the AI, Agentic Engineering, Writing and Communication, and Leadership pages with deeper content and responsive layouts.
- Centralized skill typography, spacing, icon, and theme behavior.
- Improved accessibility, text contrast, responsive density, and image presentation across the site.

### Fixed

- Corrected missing media paths, favicon behavior, light-theme contrast, responsive overflow, and image cropping.
- Restored theme-aware icons and diagrams across all skill pages.
- Resolved layout inconsistencies between desktop and mobile skill views.

### Removed

- Removed obsolete page revisions, design mockups, rebuild inputs, and duplicate media from the hosted website payload.
- Excluded authoring-only HTML, reference icons, and source artwork from production deployment.

[1.0.1]: https://github.com/bendourthe/online-portfolio/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/bendourthe/online-portfolio/releases/tag/v1.0.0
