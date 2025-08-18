import Link from 'next/link';
import type { ContentItem } from '@/lib/types';
import { withBasePath, pathForItem } from '@/lib/paths';

export default function ProjectCard({ item }: { item: ContentItem }) {
  const normalizeSrc = (src?: string | null): string => {
    if (!src) return '';
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('mailto:')) return src;
    const absolute = src.startsWith('/') ? src : `/${src}`;
    return withBasePath(absolute);
  };
  const firstImageFromMarkdown = (md?: string | null): string | null => {
    if (!md) return null;
    const mdImg = md.match(/!\[[^\]]*\]\(([^)]+)\)/);
    if (mdImg && mdImg[1]) return mdImg[1].trim();
    const htmlImg = md.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);
    if (htmlImg && htmlImg[1]) return htmlImg[1].trim();
    return null;
  };
  const chosenImage = item.image || firstImageFromMarkdown(item.markdown || '');

  return (
    <Link href={pathForItem(item) as any} className="card-link">
      <article className="card" style={{ cursor: 'pointer' }}>
        <header>
          <h2>{item.title}</h2>
        </header>
        {chosenImage && <div><img src={normalizeSrc(chosenImage)} alt={item.title} style={{ maxWidth: '100%' }} /></div>}
        {item.description && <p>{item.description}</p>}
        <div>{(item.tags || []).map(t => <span key={t} className="tag">#{t}</span>)}</div>
        {item.links && item.links.length > 0 && (
          <ul>
            {item.links.map(l => <li key={l.href}><a href={l.href} target="_blank" rel="noreferrer">{l.label}</a></li>)}
          </ul>
        )}
      </article>
    </Link>
  );
}
