import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getBySlug } from '@/lib/content';
import index from '@/data/content.json';

export const dynamic = 'error';
export const revalidate = false;

export function generateStaticParams() {
  const items = (index.items || []).filter((i: any) => i.section === 'likes');
  return items.map((i: any) => ({ slug: i.slug }));
}

export default function LikeItem({ params }: { params: { slug: string } }) {
  const item = getBySlug('likes', params.slug);
  if (!item) return notFound();
  return (
    <article>
      <h1>{item.title}</h1>
      <small>{new Date(item.date).toLocaleString()}</small>
      <div style={{ margin: '0.5rem 0' }}>{(item.tags || []).map(t => <span key={t} className="tag">#{t}</span>)}</div>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {item.markdown || ''}
      </ReactMarkdown>
    </article>
  );
}
