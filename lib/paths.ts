export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH
  ? `/${process.env.NEXT_PUBLIC_BASE_PATH}`
  : '';

/** Prefix absolute site-relative paths (like /images/foo.png) with the basePath */
export function withBasePath(p?: string | null): string {
  if (!p) return '';
  if (!BASE_PATH) return p;
  if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('mailto:')) return p;
  if (p.startsWith('/')) return `${BASE_PATH}${p}`;
  return p;
}

/** Build an href for a content item using sections + slug. Do not prefix basePath (Next handles it). */
export function pathForItem(i: { sections?: string[]; section?: string; slug: string }): string {
  const parts = (i.sections && i.sections.length > 0) ? i.sections : (i as any).section ? [(i as any).section] : [];
  const path = `/${[...parts, i.slug].join('/')}`;
  return path.endsWith('/') ? path : `${path}/`;
}
