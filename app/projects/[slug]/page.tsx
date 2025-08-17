import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import { getBySlug } from '@/lib/content';
import { withBasePath } from '@/lib/paths';
import index from '@/data/content.json';

export const dynamic = 'error';
export const revalidate = false;

export function generateStaticParams() {
  const items = (index.items || []).filter((i: any) => i.section === 'projects');
  return items.map((i: any) => ({ slug: i.slug }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const item = getBySlug('projects', params.slug);
  if (!item) return notFound();

  const normalizeSrc = (src?: string | null): string => {
    if (!src) return '';
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('mailto:')) return src;
    const absolute = src.startsWith('/') ? src : `/${src}`;
    return withBasePath(absolute);
  };
  return (
    <article>
      <h1>{item.title}</h1>
      <div style={{ margin: '0.5rem 0' }}>{(item.tags || []).map(t => <span key={t} className="tag">#{t}</span>)}</div>
      {item.image && <p><img src={normalizeSrc(item.image)} alt={item.title} style={{ maxWidth: '100%' }} /></p>}
      {item.description && <p>{item.description}</p>}
      {item.links && item.links.length > 0 && (
        <ul>
          {item.links.map(l => <li key={l.href}><a href={l.href} target="_blank" rel="noreferrer">{l.label}</a></li>)}
        </ul>
      )}
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={{
          img: (props: any) => (
            <img src={normalizeSrc(props.src)} alt={props.alt || ''} style={{ maxWidth: '100%' }} />
          )
        }}
      >
        {item.markdown || ''}
      </ReactMarkdown>
    </article>
  );
}
