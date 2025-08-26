import index from '@/data/content.json';

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH
  ? `/${process.env.NEXT_PUBLIC_BASE_PATH}`
  : '';

// Use content index generation time as a cache-busting version for static assets
const GENERATED_AT = (index as any)?.generatedAt;
const BUILD_VERSION = (() => {
  try { return String(Date.parse(GENERATED_AT)); } catch { return undefined; }
})();

/** Prefix absolute site-relative paths (like /images/foo.png) with the basePath */
export function withBasePath(p?: string | null): string {
  if (!p) return '';
  if (!BASE_PATH) return p;
  if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('mailto:')) return p;
  let pathWithBase = p.startsWith('/') ? `${BASE_PATH}${p}` : p;
  // Append a version query for common site assets if none present
  if (BUILD_VERSION && /^(\/?Images\/|\/?icons\/|\/logo\.png)/i.test(p) && !/[?&]v=/.test(p)) {
    const hasQuery = p.includes('?');
    const sep = hasQuery ? '&' : '?';
    pathWithBase = `${pathWithBase}${sep}v=${BUILD_VERSION}`;
  }
  return pathWithBase;
}

/** Build an href for a content item using sections + slug. Do not prefix basePath (Next handles it). */
export function pathForItem(i: { sections?: string[]; section?: string; slug: string }): string {
  const parts = (i.sections && i.sections.length > 0) ? i.sections : (i as any).section ? [(i as any).section] : [];
  return `/${[...parts, i.slug].join('/')}`;
}
