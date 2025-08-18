import Link from 'next/link';
import type { ContentItem } from '@/lib/types';

export default function ItemCard({ item, hrefPrefix }: { item: ContentItem; hrefPrefix: string }) {
  return (
    <Link href={`${hrefPrefix}/${item.slug}` as any} className="card-link">
      <article className="card" style={{ cursor: 'pointer' }}>
        <header>
          <h2>{item.title}</h2>
          <small>{new Date(item.date).toLocaleDateString()} {item.readingTime ? `· ${item.readingTime}` : null}</small>
        </header>
        {item.description && <p>{item.description}</p>}
        <div>{(item.tags || []).map(t => <span key={t} className="tag">#{t}</span>)}</div>
        {item.displayUrl && (
          <p><a href={item.displayUrl} target="_blank" rel="noreferrer">{item.displayUrl}</a></p>
        )}
      </article>
    </Link>
  );
}
