import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import chokidar from 'chokidar';
import config from '../site.config.mjs';
import readingTime from 'reading-time';

const IMAGE_EXTS = new Set(['png','jpg','jpeg','gif','webp','svg','bmp','tiff','avif']);

function slugify(str) {
  return String(str || 'untitled')
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '');
}

function extractTags(content, fmTags) {
  const tags = new Set();
  if (Array.isArray(fmTags)) fmTags.forEach(t => t && tags.add(String(t).replace(/^#/, '').trim()));
  else if (typeof fmTags === 'string') {
    String(fmTags).split(/[\s,]+/).forEach(t => t && tags.add(t.replace(/^#/, '').trim()));
  }
  const withoutFences = content.replace(/```[\s\S]*?```/g, '');
  const tagRegex = /(^|\s)#([A-Za-z0-9/_-]+)/g;
  let m;
  while ((m = tagRegex.exec(withoutFences)) !== null) tags.add(m[2]);
  return Array.from(tags).sort((a,b) => a.localeCompare(b));
}

function inferSection(frontmatter, tags, sectionTags) {
  if (frontmatter?.section) return String(frontmatter.section);
  const has = (arr) => arr.some(t => tags.includes(t));
  if (has(sectionTags.blog)) return 'blog';
  if (has(sectionTags.likes)) return 'likes';
  if (has(sectionTags.projects)) return 'projects';
  return 'misc';
}

function extractTitle(content, fileName) {
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();
  return path.basename(fileName, path.extname(fileName));
}

function extractExcerpt(content) {
  const noFences = content.replace(/```[\s\S]*?```/g, '');
  const para = noFences.split(/\n\s*\n/).find(p => p.trim().length > 0) || '';
  return para.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/[*_`>#-]/g, '').trim().slice(0, 400);
}

function parseDate(frontmatter, absolutePath, stats) {
  if (frontmatter?.date) {
    const d = new Date(frontmatter.date);
    if (!isNaN(+d)) return d.toISOString();
  }
  const base = path.basename(absolutePath);
  const isoMatch = base.match(/(20\d{2}-\d{2}-\d{2})/);
  if (isoMatch) {
    const d = new Date(isoMatch[1]);
    if (!isNaN(+d)) return d.toISOString();
  }
  return (stats?.mtime?.toISOString?.() || new Date().toISOString());
}

function normalizeLinks(frontmatter) {
  const out = [];
  const raw = frontmatter?.links;
  if (Array.isArray(raw)) {
    raw.forEach(l => { if (l && l.href) out.push({ label: l.label || l.href, href: l.href }); });
  } else if (raw && typeof raw === 'object') {
    Object.entries(raw).forEach(([label, href]) => { if (href) out.push({ label, href }); });
  }
  return out;
}

function toPosix(p) { return String(p || '').replace(/\\/g, '/'); }

function normalizeResourcePath(rawInput, fileAbs, vaultRoot) {
  if (!rawInput) return null;
  const raw = String(rawInput).trim();
  if (/^(https?:|data:|mailto:)/i.test(raw)) return raw;

  const fileRel = toPosix(path.relative(vaultRoot, fileAbs));
  const dirRel = toPosix(path.dirname(fileRel));
  const asGiven = raw.startsWith('/') ? raw.slice(1) : toPosix(raw);

  const candidatesRel = [];
  if (raw.startsWith('/')) {
    candidatesRel.push(asGiven);
  } else {
    candidatesRel.push(toPosix(path.join(dirRel, raw)));
    candidatesRel.push(toPosix(path.join('Images', raw)));
    candidatesRel.push(toPosix(path.join(dirRel, 'Images', raw)));
    candidatesRel.push(asGiven);
  }

  for (const rel of candidatesRel) {
    const abs = path.join(vaultRoot, rel);
    try {
      if (fs.existsSync(abs)) return `/${toPosix(rel)}`;
    } catch {}
  }
  return `/${asGiven}`;
}

function normalizeImagePath(fmImage, fileAbs, vaultRoot) {
  if (!fmImage) return null;
  const sitePath = normalizeResourcePath(fmImage, fileAbs, vaultRoot);
  return sitePath;
}

function transformObsidianEmbeds(content, fileAbs, vaultRoot) {
  // Convert ![[target|alt]] to standard markdown image if target looks like an image
  return String(content || '').replace(/!\[\[([^\]]+)\]\]/g, (match, inner) => {
    const raw = String(inner).trim();
    const [targetPart, altPart] = raw.split('|');
    const target = (targetPart || '').trim();
    const ext = path.extname(target).toLowerCase().replace('.', '');
    if (!ext || !IMAGE_EXTS.has(ext)) return match; // leave non-images as-is
    const sitePath = normalizeResourcePath(target, fileAbs, vaultRoot);
    const alt = (altPart || path.basename(target, path.extname(target))).trim();
    return `![${alt}](${sitePath})`;
  });
}

function parseVaultArgs() {
  const vaultArgs = process.argv.filter(a => a.startsWith('--vault='));
  const vals = vaultArgs.map(a => a.slice('--vault='.length)).filter(Boolean);
  return vals;
}

async function buildIndex() {
  const sectionTags = config.sectionTags || { blog: ['blog'], likes: ['likes'], projects: ['projects'] };
  const allItems = [];
  // Load previous index and manifest for incremental rebuilds
  const prevIndexPath = path.join(process.cwd(), 'data', 'content.json');
  const prevManifestPath = path.join(process.cwd(), 'data', 'content.manifest.json');
  let prevIndex = null;
  let prevManifest = {};
  try { prevIndex = JSON.parse(fs.readFileSync(prevIndexPath, 'utf8')); } catch {}
  try { prevManifest = JSON.parse(fs.readFileSync(prevManifestPath, 'utf8')); } catch {}
  const prevByVaultPath = new Map();
  if (prevIndex?.items) {
    for (const it of prevIndex.items) {
      if (it?.vaultPath) prevByVaultPath.set(it.vaultPath, it);
    }
  }
  const nextManifest = {};
  const cliVaults = parseVaultArgs();
  const vaults = (cliVaults.length ? cliVaults : (config.vaultPaths || [])).filter(Boolean);
  const ignore = (config.ignorePatterns || []);

  if (!vaults.length) {
    console.warn('No vault paths configured. Set OBSIDIAN_VAULT_PATH, edit site.config.mjs, or pass --vault="/abs/path"');
  }
  console.log('Scanning vaults:', vaults);
  for (const vaultPath of vaults) {
    const pattern = path.join(vaultPath, '**/*.md').replace(/\\/g, '/');
    const entries = await fg([pattern], { ignore, dot: true });
    console.log(`[vault] ${vaultPath} → ${entries.length} markdown files (ignore: ${ignore.join(', ') || 'none'})`);

    let scanned = 0;
    let included = 0;
    let skippedNotPublic = 0;
    let parseFailed = 0;
    let reused = 0;

    for (const file of entries) {
      scanned += 1;
      try {
        const stats = fs.statSync(file);
        const relFromVault = path.relative(vaultPath, file).replace(/\\/g, '/');
        const manifestKey = `${vaultPath}::${relFromVault}`.replace(/\\/g, '/');
        nextManifest[manifestKey] = { mtimeMs: stats.mtimeMs, size: stats.size };
        const was = prevManifest[manifestKey];
        const isUnchanged = was && was.mtimeMs === stats.mtimeMs && was.size === stats.size;

        if (isUnchanged) {
          const prev = prevByVaultPath.get(relFromVault);
          if (prev) {
            allItems.push(prev);
            included += 1;
            reused += 1;
            continue;
          }
          // Fall through to re-parse if we don't have a previous item
        }

        const raw = fs.readFileSync(file, 'utf8');
        const { data: fm, content } = matter(raw);
        const isPublic = config.requirePublicFlag ? fm?.public === true : fm?.public !== false;
        if (!isPublic) { skippedNotPublic += 1; continue; }

        const tags = extractTags(content, fm?.tags);
        const section = inferSection(fm, tags, sectionTags);
        const rawSections = Array.isArray(fm?.sections)
          ? fm.sections
          : (fm?.sections ? String(fm.sections).split(/[\s,\/]+/).filter(Boolean) : []);
        const sections = rawSections.map(s => slugify(s)).filter(Boolean);
        const title = fm?.title || extractTitle(content, file);
        const slug = fm?.slug || slugify(title);
        const dateISO = parseDate(fm, file, stats);
        const displayUrl = fm?.url || null;
        const normalizedImage = normalizeImagePath(fm?.image, file, vaultPath);
        const description = fm?.description || null;
        const links = normalizeLinks(fm);
        const rt = readingTime(content || '');
        const transformedMarkdown = transformObsidianEmbeds(content, file, vaultPath);

        const item = {
          id: Buffer.from(file).toString('base64'),
          slug,
          section,
          sections,
          title,
          date: dateISO,
          tags,
          displayUrl,
          image: normalizedImage,
          description,
          links,
          markdown: transformedMarkdown,
          vaultPath: relFromVault,
          public: true,
          readingTime: rt?.text || null
        };
        allItems.push(item);
        included += 1;
      } catch (e) {
        parseFailed += 1;
        console.warn('Failed to parse', file, e?.message);
      }
    }
    console.log(`[vault] ${vaultPath} stats → scanned:${scanned} included:${included} reused:${reused} skippedNotPublic:${skippedNotPublic} parseFailed:${parseFailed}`);
  }

  const tagCounts = {};
  for (const it of allItems) for (const t of (it.tags || [])) tagCounts[t] = (tagCounts[t] || 0) + 1;
  allItems.sort((a, b) => new Date(b.date) - new Date(a.date));

  const output = { generatedAt: new Date().toISOString(), total: allItems.length, tags: Object.keys(tagCounts).sort((a,b)=>a.localeCompare(b)), items: allItems };
  const outPath = path.join(process.cwd(), 'data', 'content.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Wrote ${output.items.length} items to data/content.json at ${output.generatedAt}`);
  // Update manifest for incremental builds
  const manPath = path.join(process.cwd(), 'data', 'content.manifest.json');
  fs.writeFileSync(manPath, JSON.stringify(nextManifest, null, 2), 'utf8');
  if (output.items.length === 0) {
    console.warn('No items were included. Ensure your notes have frontmatter with `public: true` and that --vault points to the correct Obsidian vault.');
  }
}

const watchMode = process.argv.includes('--watch');
if (watchMode) {
  console.log('Watching vaults for changes...');
  const cliVaults = parseVaultArgs();
  const vaults = (cliVaults.length ? cliVaults : (config.vaultPaths || [])).filter(Boolean);
  const ignore = (config.ignorePatterns || []);
  const watcher = chokidar.watch(vaults.map(v => path.join(v, '**/*.md')), { ignored: ignore, ignoreInitial: true });

  let building = false;
  let pending = false;
  let debounceTimer = null;

  const scheduleBuild = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      if (building) { pending = true; return; }
      building = true;
      try {
        await buildIndex();
      } catch (err) {
        console.error(err);
      } finally {
        building = false;
        if (pending) { pending = false; scheduleBuild(); }
      }
    }, 200);
  };

  watcher.on('add', scheduleBuild).on('change', scheduleBuild).on('unlink', scheduleBuild);
  // Run one initial build
  buildIndex().catch(console.error);
} else {
  buildIndex().catch(err => { console.error(err); process.exit(1); });
}
