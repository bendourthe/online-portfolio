# Skill Authoring Sources

This directory contains material used to author and regenerate the seven skill-detail experiences. It is intentionally excluded from the deployed site package.

## Layout

- `pages/`: editable standalone HTML pages and their local authoring assets.
- `artwork/`: source images and standalone HTML/SVG artwork.
- `shared/css/`: retained source styles used during authoring.
- `references/icons/`: original icon references.
- `references/mockups/`: visual mockups and design references.
- `references/rebuild/`: historical inputs retained for future redesign work.

Run both generators after changing pages or embedded artwork:

```powershell
node js/generate-skills-detail-source.mjs
node js/generate-skills-source-artwork.mjs
```

The generated bundles under `js/` and the browser assets under `content/skills/assets/` form the runtime contract.
