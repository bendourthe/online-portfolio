# Skills Content Refactor Audit

**Generated**: 2026-07-23
**Branch**: `refactor/visual-interactive-portfolio`
**Release baseline**: no existing version file, changelog, or git tag
**Recommended initial release**: `v1.0.0`

## Objective

Separate browser-required portfolio assets from authoring sources, mockups, obsolete revisions, and duplicate files so the hosted artifact contains only what the website needs to render.

## Current Runtime Model

- `index.html` and `skills.html` are the public entry points.
- `js/skills-detail-source.js` contains generated skill-page markup.
- `js/skills-source-artwork.js` contains embedded HTML artwork generated from source files.
- The browser loads images and other media through literal paths in HTML, CSS, JavaScript, and JSON.
- Source skill pages, mockups, intermediate artwork, and generator inputs are currently mixed with deployable assets under `content/skills`.

## Inventory

| Scope | Files | Size | Classification |
|---|---:|---:|---|
| `content/skills/content` | 285 | 197.19 MB | Mixed runtime and authoring content |
| Conservatively referenced by public HTML, CSS, JavaScript, or JSON | 157 | 106.64 MB | Keep in the deployable site package |
| No public runtime reference found | 128 | 90.55 MB | Move to source/archive or delete after approval |
| `content/skills/rebuild` | 30 | 20.36 MB | Authoring and reconstruction references |
| Referenced exact duplicates | 7 files in 3 groups | 1.56 MB reclaimable | Consolidate to one canonical runtime copy |

The reference scan is intentionally conservative: a literal path in generated metadata counts as referenced even when the browser does not fetch it. Every move or deletion will be followed by a fresh reference scan and browser verification.

## Largest Non-Runtime Groups

| Current group | Files | Size | Recommended action |
|---|---:|---:|---|
| `content/skills/content/html/engineering-expertise_html/engineering_expertise_html_v2` | 9 | 20.04 MB | Delete eight byte-identical asset copies; retain the unique HTML source under `source/skills/archive` |
| `content/skills/content/mockups` | 7 | 14.23 MB | Move to `source/skills/references/mockups` |
| `content/skills/content/images/engineering-expertise` | 9 | 12.36 MB | Move unreferenced originals to `source/skills/archive` |
| `content/skills/content/html/engineering-expertise_html/assets` | 7 | 11.38 MB | Move unreferenced superseded assets to `source/skills/archive` |
| `content/skills/content/html/data-science_html/assets` | 5 | 10.99 MB | Move unreferenced superseded assets to `source/skills/archive` |
| `content/skills/content/images/data-science` | 7 | 9.77 MB | Move unreferenced originals to `source/skills/archive` |
| Remaining unreferenced skill images, snippets, CSS, and source artifacts | 84 | 11.78 MB | Classify individually, preserving unique authoring inputs under `source/skills` |
| `content/skills/rebuild` | 30 | 20.36 MB | Move to `source/skills/references/rebuild` |

## Implemented Target Layout

```text
content/
  skills/
    assets/                   # browser-required assets only
source/
  skills/
    pages/                    # editable source HTML used to regenerate bundles
    artwork/                  # HTML artwork inputs embedded into generated JavaScript
    references/
      icons/                  # original supplied SVG references
      mockups/                # visual design and review mockups
      rebuild/                # reconstruction source material
scripts/
  build-site.mjs              # deterministic dist/ package builder
dist/                         # generated deployable site, ignored by git
```

## Implemented Refactor

### 1. Establish a Deployment Boundary

- Add a deterministic build command that creates `dist/`.
- Copy only public entry points, runtime scripts and styles, Nexus-Hub assets, favicon assets, and referenced `content/` files.
- Fail the build when a referenced asset is missing.
- Add a GitHub Pages workflow that uploads `dist/` rather than the repository root.
- Ignore generated `dist/` locally.

### 2. Move Authoring Material Outside the Hosted Tree

- Move `content/skills/rebuild` to `source/skills/references/rebuild`.
- Move `content/skills/content/mockups` to `source/skills/references/mockups`.
- Move the unused title-icon source libraries to `source/skills/references/icons`.
- Move standalone editable artwork and skill-page source inputs to `source/skills/pages` and `source/skills/artwork`, then update generator paths.
- Preserve unique authoring media in its original relative organization under `source/skills/artwork` and `source/skills/pages`.

### 3. Remove Proven Duplicates

- Delete the eight byte-identical images inside `engineering_expertise_html_v2/assets` after the unique v2 HTML file is archived.
- Consolidate the three referenced duplicate groups to one canonical runtime file and repair all references.
- Delete empty directories only after a final explicit confirmation.

### 4. Regenerate and Verify

- Regenerate `js/skills-detail-source.js` and `js/skills-source-artwork.js`.
- Build `dist/` from a clean output directory.
- Verify every local URL in public HTML, CSS, JavaScript, and JSON resolves.
- Serve `dist/` locally and verify the home page plus all seven skill pages in light and dark themes at desktop and phone widths.
- Compare source and `dist/` file counts and sizes.

## Verified Static Outcome

| Measure | Before | After refactor |
|---|---:|---:|
| Mixed `content/skills/content` payload | 197.19 MB | Removed and replaced by 144 referenced runtime files |
| Non-runtime material inside hosted skills tree | At least 110.91 MB including rebuild assets | 0 MB identified by the final runtime-path scan |
| Deployment source | Repository root | Generated `dist/` only |
| Referenced exact duplicate waste | 1.56 MB | 0 MB |
| Authoring/reference preservation | Mixed with runtime | Version-controlled under `source/skills` |

The deterministic build currently produces 231 files totaling 163.95 MB across the complete portfolio, including non-skills pages, PDFs, thumbnails, favicons, and Nexus-Hub content. Every local URL in the generated package resolves, and all 144 files under `content/skills/assets` are referenced by a live entry point or generated skill bundle.

## Browser Verification

- The home page passed at 1440 x 1000 and 390 x 844 in both light and dark themes with zero broken images and zero horizontal overflow.
- All seven skill pages passed at 1440 x 1000 and 390 x 844 in both light and dark themes, covering 28 page-theme-viewport combinations.
- The active skill tab, visible detail panel, theme state, image loading, and responsive width were verified in every combination.
- Browser console errors, page errors, failed requests, broken visible images, and document overflow were all zero.

## Release Gate

The content refactor and browser verification are complete. The remaining gate is a separate confirmation before the release commit, tag, push, and GitHub Release.
