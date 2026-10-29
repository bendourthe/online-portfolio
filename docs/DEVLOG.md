# Development Log

## 2026-10-29 - Search metadata for the current domains

Version `1.0.3` pointed the site's search and sharing metadata at benjamindourthe.com, which now serves the portfolio together with dourthe-technologies.com, and removed the retired dourthe.tech domain.

### Delivered

- Added canonical addresses so both domains consolidate search ranking on benjamindourthe.com.
- Completed Open Graph and X/Twitter tags with absolute image URLs, and added schema.org Person and WebSite structured data.
- Added `robots.txt` and `sitemap.xml` and included them in the deployment package.
- Declared the home page's language and character set and refreshed its description.

## 2026-10-29 - Lumifold card and Nexus Hub guide

Version `1.0.2` added the Lumifold project to the Detailed Portfolio and published the Nexus Hub v4.13.10 guide with its Training page.

### Delivered

- Added a Lumifold card at the top of the Detailed Portfolio, linked to its GitHub repository, with the original icon artwork as its thumbnail and a Software Engineering filter.
- Published the Nexus Hub v4.13.10 guide (Home, Foundations, Cheatsheets) and the Training page with the Nexus Defenders game.
- Resolved the guide's relative references from its own folder in the deployment build.
- Verified the card in light and dark themes and in the Software Engineering filter on a clean build of the release candidate.

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
