## Ship checklist (what to do before pushing to `main`)

This repo statically exports a Next.js site to `out/` and deploys it via GitHub Pages (GitHub Actions). GitHub Actions will run the web build for you, but it does not have access to your local Obsidian vault. Therefore, when your vault changes you must regenerate and commit the derived data/assets.

### One‑time setup

- Ensure the Pages workflow exists at `.github/workflows/pages.yml` (already committed).
- In GitHub → Settings → Pages → Source: GitHub Actions.
- Optional: If you want CI to rebuild from a vault in the runner, add a secret `OBSIDIAN_VAULT_PATH` that points to a path you check out in the workflow. Otherwise, commit the generated files (recommended).

### When Obsidian content changed

1. Point config to your vault (only if needed): edit `site.config.mjs` → `vaultPaths: ["/absolute/path/to/Your Vault"]`.
2. Regenerate the content index (incremental, fast):
   - One‑off: `npm run build-content`
   - Or live while editing: `npm run watch-content`
3. Sync images/assets referenced by notes (incremental):
   - `npm run sync-assets`
4. Verify changes:
   - Inspect `data/content.json`
   - New/changed files will appear under `public/` (e.g., `public/Images/...`).
5. Commit only derived changes:
   - `git add data/content.json public/`
   - `git commit -m "content: update index/assets"`
6. (Optional) Local preview of the static export:
   - `npm run build` then `npx serve out -l 3000`
7. Push to `main`. GitHub Actions will build and deploy to Pages.

Notes:
- Only notes with `public: true` in frontmatter are included.
- Section inference uses tags; blog posts render at `/posts/*`.

### When code changed (TSX/CSS/config)

1. Develop locally:
   - Start watcher + dev server: `npm run dev`
   - The content watcher is debounced and incremental; only changed files are re‑indexed.
2. Sanity check a production build locally (optional but recommended):
   - `npm run build` (verifies static export works)
3. Commit code changes and push to `main`. CI builds and deploys.

### URLs and routing

- Posts live at `/posts` and `/posts/[slug]`.
- Legacy `/blog/*` URLs still render, but you can delete `app/blog/` if you no longer want them.
- This site is configured with `output: 'export'` (static export), so avoid server‑only features (server actions, route handlers, `next/headers`, ISR). All dynamic pages must be statically generated at build time.

### Troubleshooting

- Pages shows the old starter page:
  - Ensure the workflow file is at `.github/workflows/pages.yml` and a commit has been pushed to `main`.
- Links or images 404 on GitHub Pages project sites:
  - The workflow sets `NEXT_PUBLIC_BASE_PATH` for non‑`*.github.io` repos. For user/org sites (this repo), no base path is used.
- Dev feels slow:
  - Dev disables typed routes and ignores TS errors to speed up; builds are incremental for content/assets.


