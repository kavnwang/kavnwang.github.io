# Obsidian → Personal Site (Starter) — GH Pages

This starter sets up a **Next.js** site that reads from your **local Obsidian vault**,
scans for metadata & tags, and generates a JSON index that the frontend renders with tag filters.

- Dev reads directly from your local vault (no export needed).
- Deploy is a **static export** for GitHub Pages (no server, no filesystem access).

---

## Quick Start (Local)

1. **Point to your vault**

   ```bash
   export OBSIDIAN_VAULT_PATH="/absolute/path/to/Your Obsidian Vault"
   ```

   Or edit `site.config.mjs` and set `vaultPaths`.

2. **Install & build index**

   ```bash
   npm install
   npm run build-content   # scans your vault into ./data/content.json
   ```

   Use `npm run watch-content` during development.

3. **Run the site**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000

---

## Deploying to GitHub Pages (Static Export)

GitHub Pages serves static files only, so this project uses `output: 'export'` (builds into `./out`).
It also supports subpath hosting via `NEXT_PUBLIC_BASE_PATH` (set to your repo name).

### Two ways to supply content

**A) Commit the generated `data/content.json` (simplest)**  
- Locally run `npm run build-content` with your vault path set.
- Commit `data/content.json` to the repo.
- Push to `main`: the workflow builds and deploys.

**B) Rebuild content in CI from a mirrored vault** (optional)  
- Mirror your vault to a **private repo** (e.g., via Obsidian Git plugin).
- Check it out in the workflow and set `OBSIDIAN_VAULT_PATH` to that path.
- The workflow will regenerate `data/content.json` before the static export.

### Build & export locally

```bash
# Build index (once)
export OBSIDIAN_VAULT_PATH="/absolute/path/to/Your Obsidian Vault"
npm run build-content

# Export static site to ./out
npm run build
npx http-server ./out   # to preview locally
```

### Images

- Frontmatter `image: /images/foo.png` is prefixed with the base path at runtime.
- Put images under `public/images/...` or use absolute `https://...` URLs.

---

## Content Model Summary

- **Visibility**: `public: true` required (configurable).
- **Sections** (by `section:` or tags):
  - Blog → `#blog`, `#post`
  - Likes → `#like`, `#likes`, `#fav`, `#favorite`
  - Projects → `#project`, `#projects`
- **Tags**: from frontmatter and inline `#tags` (ignores code fences).
- **Title**: frontmatter → first `# Heading` → filename.
- **Date**: frontmatter → `YYYY-MM-DD` in filename → file mtime.
- **Display URL**: `url:` in frontmatter.
- **Projects** (optionally): `image`, `description`, `links` (array or object).

---

## What was generated (20250817-180147 UTC)

```
obsidian-site-ghpages-20250817-180147/
├─ app/                      # Next app router pages
├─ components/               # UI components (cards, tag filter)
├─ data/content.json         # generated index (commit or rebuild in CI)
├─ lib/                      # helpers & types
├─ public/                   # static assets
├─ scripts/build-content.mjs # vault scanner
├─ .github/workflows/pages.yml
└─ next.config.mjs
```
