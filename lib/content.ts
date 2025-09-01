import content from '@/data/content.json';
import type { ContentIndex, ContentItem } from './types';
import { pathForItem } from './paths';

export function getIndex(): ContentIndex {
  return content as unknown as ContentIndex;
}
export function getBySection(section: 'blog' | 'likes' | 'projects' | 'misc'): ContentItem[] {
  const idx = getIndex();
  return idx.items.filter(i => i.section === section);
}
export function getAllTags(): string[] { return getIndex().tags; }
export function getBySlug(section: 'blog' | 'likes' | 'projects', slug: string): ContentItem | undefined {
  return getBySection(section).find(i => i.slug === slug);
}
export function filterByTags(items: ContentItem[], selected: string[]): ContentItem[] {
  if (!selected?.length) return items;
  const set = new Set(selected.map(s => s.toLowerCase()));
  return items.filter(i => (i.tags || []).some(t => set.has(t.toLowerCase())));
}

export function getByPath(segments: string[]): ContentItem | undefined {
  if (!Array.isArray(segments) || segments.length < 1) return undefined;
  const slug = segments[segments.length - 1];
  const prefix = segments.slice(0, -1).map(s => String(s).toLowerCase());
  const idx = getIndex();
  return idx.items.find(i => {
    // Calculate expected path parts using same logic as pathForItem
    let expectedParts: string[] = [];
    if (Array.isArray(i.sections)) {
      if (i.sections.length > 0) {
        expectedParts = i.sections;
      }
      // If sections is empty array [], use no parts (no prefix)
    } else if (i.section === "projects") {
      // If no sections defined and section is "projects", use no prefix
      expectedParts = [];
    } else if (i.section) {
      // For other sections, use the section as prefix
      expectedParts = [i.section];
    }
    
    const expectedPrefix = expectedParts.map(s => s.toLowerCase()).join('/');
    return i.slug === slug && expectedPrefix === prefix.join('/');
  });
}

/** Normalize a name for fuzzy matching (case/spacing tolerant). */
function normalizeName(name?: string | null): string {
  if (!name) return '';
  return String(name)
    .toLowerCase()
    .trim()
    .replace(/\.md$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ');
}

/** Slugify heading IDs consistent with the renderer used in sections page. */
function slugifyHeading(txt: string): string {
  return String(txt)
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Try to find a content item by an Obsidian-style target (note title/filename/slug). */
function findItemByWikiTarget(target: string): ContentItem | undefined {
  const normTarget = normalizeName(target);
  const idx = getIndex();
  for (const i of idx.items) {
    const titleNorm = normalizeName(i.title);
    const slugNorm = normalizeName(i.slug);
    const baseNameNorm = normalizeName((i.vaultPath || '').replace(/.*\//, ''));
    if (normTarget === titleNorm || normTarget === slugNorm || normTarget === baseNameNorm) {
      return i;
    }
  }
  return undefined;
}

/**
 * Rewrite Obsidian wiki links like [[Page]], [[Page#Heading]], [[Page|Alias]], [[Page#Heading|Alias]]
 * into standard markdown links if the target item exists and is public.
 */
export function rewriteWikiLinks(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') return markdown;
  const WIKI_LINK_RE = /\[\[([^\]#|]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g;
  const replaced = markdown.replace(WIKI_LINK_RE, (full, page: string, heading?: string, alias?: string) => {
    const item = findItemByWikiTarget(page);
    if (!item || !item.public) return full; // leave untouched if not found/public
    const href = `${pathForItem(item)}${heading ? `#${slugifyHeading(heading)}` : ''}`;
    const text = alias || heading || item.title || page;
    return `[${text}](${href})`;
  });
  return replaced;
}
