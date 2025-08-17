import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import { getBySlug } from '@/lib/content';
import index from '@/data/content.json';

export const dynamic = 'error';
export const revalidate = false;
export const dynamicParams = false;

export function generateStaticParams() {
  const items = (index.items || []).filter((i: any) => i.section === 'blog');
  return items.map((i: any) => ({ slug: i.slug }));
}

export default function LegacyBlogPostPage({ params }: { params: { slug: string } }) {
  const item = getBySlug('blog', params.slug);
  if (!item) return notFound();
  return (
    <article>
      <h1>{item.title}</h1>
      <small>{new Date(item.date).toLocaleString()}</small>
      <div style={{ margin: '0.5rem 0' }}>{(item.tags || []).map(t => <span key={t} className="tag">#{t}</span>)}</div>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex]}>
        {item.markdown || ''}
      </ReactMarkdown>
    </article>
  );
}


