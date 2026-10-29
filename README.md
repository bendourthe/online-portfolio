# Online Portfolio

[Dourthe Technologies](https://benjamindourthe.com) is a responsive, theme-aware portfolio presenting engineering, software, data science, artificial intelligence, agentic DevOps, communication, and leadership work. The site is built as static HTML, CSS, and JavaScript with generated skill-detail bundles and an explicit deployment boundary.

Current release: `v1.0.4`

## What's new in v1.0.4

- Refreshed the Nexus Hub v4.13.10 guide and Training page: a skip-to-content link, a figure status label that no longer overlaps its text, and a two-by-two phone layout for the context window figure.
- A redirect file that sends dourthe-technologies.com to benjamindourthe.com.

See [CHANGELOG.md](CHANGELOG.md) for the complete release history.

## Repository layout

- `index.html`, `skills.html`: browser entry points.
- `assets/`, `content/`, `css/`, `favicon/`, `js/`, `nexus-hub/`: files required by the deployed site.
- `content/skills/assets/`: browser-required skill media only.
- `source/skills/`: editable skill pages, source artwork, design references, mockups, and archived rebuild inputs.
- `scripts/build-site.mjs`: deterministic builder that creates and validates the upload-only `dist/` package.
- `docs/`: release records, progress tracking, and content-boundary documentation.

## Local development

Serve the repository root with any static web server. For example:

```powershell
python -m http.server 8000
```

Open `http://localhost:8000`.

After editing a skill source page or its embedded artwork, regenerate the browser bundles:

```powershell
node js/generate-skills-detail-source.mjs
node js/generate-skills-source-artwork.mjs
```

Build and validate the deployment package:

```powershell
node scripts/build-site.mjs
```

Only `dist/` is intended for upload to a static host. GitHub Pages builds this package automatically from `main`.

## Production hosting

The production site is [benjamindourthe.com](https://benjamindourthe.com), served over HTTPS with and without `www`. It is updated by uploading the changed files from `dist/` with WinSCP. dourthe-technologies.com redirects every address to benjamindourthe.com with the `.htaccess` file in `deploy/dourthe-technologies.com/`, placed in that domain's root folder. GitHub Pages publishes the same package at [bendourthe.github.io/online-portfolio](https://bendourthe.github.io/online-portfolio/).

## Branching and releases

Development follows a `develop + main` model. Work branches start from `develop` and use `feat/`, `fix/`, or `refactor/` prefixes; completed work is merged into `develop`, while `main` receives release merges only. See `CONTRIBUTING.md` for the integration and release sequence.

## Content boundaries

Files under `content/skills/assets/` are part of the runtime contract and may be uploaded. Editable source HTML, standalone artwork documents, icon references, mockups, and historical rebuild inputs live under `source/skills/` and are intentionally excluded from deployment.
