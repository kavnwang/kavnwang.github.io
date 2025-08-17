import Link from 'next/link';
import { getIndex } from '@/lib/content';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Posts' };

export default function PostsIndex() {
  const idx = getIndex();
  const items = (idx.items || [])
    .filter(i => i.public && i.section === 'blog')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <h1>Posts</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map(i => (
          <li key={i.id} style={{ margin: '0.75rem 0' }}>
            <div>
              <Link href={`/posts/${i.slug}` as any}>{i.title}</Link>
            </div>
            <small>
              {new Date(i.date).toLocaleDateString()} {i.readingTime ? `· ${i.readingTime}` : null}
            </small>
            {i.description && <p style={{ margin: '0.25rem 0 0' }}>{i.description}</p>}
          </li>
        ))}
      </ul>
      {items.length === 0 && <p>No posts yet.</p>}
    </div>
  );
}

 