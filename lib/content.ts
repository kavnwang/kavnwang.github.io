import content from '@/data/content.json';
import type { ContentIndex, ContentItem } from './types';

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
  if (!Array.isArray(segments) || segments.length < 2) return undefined;
  const slug = segments[segments.length - 1];
  const prefix = segments.slice(0, -1).map(s => String(s).toLowerCase());
  const idx = getIndex();
  return idx.items.find(i => {
    const eff = (Array.isArray(i.sections) && i.sections.length > 0) ? i.sections : [i.section];
    return i.slug === slug && eff.map(s => s.toLowerCase()).join('/') === prefix.join('/');
  });
}
