# Online Portfolio

[Dourthe Technologies](https://www.dourthe.tech) is a responsive, theme-aware portfolio presenting engineering, software, data science, artificial intelligence, agentic DevOps, communication, and leadership work. The site is built as static HTML, CSS, and JavaScript with generated skill-detail bundles and an explicit deployment boundary.

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

## Branching and releases

Development follows a `develop + main` model. Work branches start from `develop` and use `feat/`, `fix/`, or `refactor/` prefixes; completed work is merged into `develop`, while `main` receives release merges only. See `CONTRIBUTING.md` for the integration and release sequence.

## Content boundaries

Files under `content/skills/assets/` are part of the runtime contract and may be uploaded. Editable source HTML, standalone artwork documents, icon references, mockups, and historical rebuild inputs live under `source/skills/` and are intentionally excluded from deployment.
