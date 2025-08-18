import Link from 'next/link';
import { getIndex } from '@/lib/content';
import { pathForItem } from '@/lib/paths';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Kevin Wang' };

export default function PostsIndex() {
  const idx = getIndex();
  const items = (idx.items || [])
    .filter(i => i.public && i.section === 'blog')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <h1>Writing</h1>
      <p>Here is a collection of my learnings and thoughts throughout my short time living. My personal blog is on <a href="https://wangk.substack.com" target="_blank" rel="noopener noreferrer">Substack</a>. </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map(i => (
          <li key={i.id} style={{ margin: '1.25rem 0' }}>
            <div>
              <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.6rem', fontFamily: '"Untitled Sans", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif' }}>
                {i.link ? (
                  <a href={i.link} target="_blank" rel="noopener noreferrer">{i.title}</a>
                ) : (
                  <Link href={pathForItem(i) as any}>{i.title}</Link>
                )}
              </h2>
            </div>
            <small>
              {new Date(i.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} {i.readingTime ? `· ${i.readingTime}` : null}
            </small>
            {i.description && <p style={{ margin: '0.5rem 0 0', fontSize: '0.95rem' }}>{i.description}</p>}
          </li>
        ))}
      </ul>
      {items.length === 0 && <p>No posts yet.</p>}
    </div>
  );
}

 