import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import { getIndex, getByPath } from '@/lib/content';
import { withBasePath } from '@/lib/paths';

export const dynamic = 'error';
export const revalidate = false;

export function generateStaticParams() {
	const idx = getIndex();
	const params = (idx.items || [])
		.map((i: any) => ({ sections: [...(Array.isArray(i.sections) && i.sections.length > 0 ? i.sections : [i.section]), i.slug] }));
	return params;
}

export function generateMetadata({ params }: { params: { sections: string[] } }): Metadata {
  const item = getByPath(params.sections);
  if (!item) return { title: 'Kevin Wang' };
  return { title: item.title };
}

export default function SectionsPage({ params }: { params: { sections: string[] } }) {
	const item = getByPath(params.sections);
	if (!item) return notFound();

	const normalizeSrc = (src?: string | null): string => {
		if (!src) return '';
		if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('mailto:')) return src;
		const absolute = src.startsWith('/') ? src : `/${src}`;
		return withBasePath(absolute);
	};

	const markdown = item.markdown || '';

	const slugify = (txt: string): string => String(txt)
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');

	// Extract ATX (#+) and Setext (===, ---) headings
	const headings: { level: number; text: string; id: string }[] = [];
	for (const m of markdown.matchAll(/^\s{0,3}(#{1,3})\s+(.+)$/gm)) {
		headings.push({ level: m[1].length, text: m[2].trim(), id: slugify(m[2]) });
	}
	for (const m of markdown.matchAll(/^([^\n]+)\n=+\s*$/gm)) {
		headings.push({ level: 1, text: m[1].trim(), id: slugify(m[1]) });
	}
	for (const m of markdown.matchAll(/^([^\n]+)\n-+\s*$/gm)) {
		headings.push({ level: 2, text: m[1].trim(), id: slugify(m[1]) });
	}

	return (
		<div style={{ position: 'relative' }}>
			<article>
				<h1 style={{ fontSize: '2.75rem', lineHeight: 1.1 }}>{item.title}</h1>
				<div style={{ margin: '0.5rem 0' }}>{(item.tags || []).map(t => <span key={t} className="tag">#{t}</span>)}</div>
				<ReactMarkdown
					remarkPlugins={[remarkGfm, remarkMath]}
					rehypePlugins={[rehypeRaw, rehypeKatex]}
					components={{
						h1: ({ children }) => {
							const text = String(children as any);
							const id = slugify(text);
							return <h1 id={id}>{children}</h1>;
						},
						h2: ({ children }) => {
							const text = String(children as any);
							const id = slugify(text.replace(/<[^>]+>/g, ''));
							return <h2 id={id}>{children}</h2>;
						},
						h3: ({ children }) => {
							const text = String(children as any);
							const id = slugify(text.replace(/<[^>]+>/g, ''));
							return <h3 id={id}>{children}</h3>;
						},
						img: (props: any) => (
							<img src={normalizeSrc(props.src)} alt={props.alt || ''} style={{ maxWidth: '100%' }} />
						)
					}}
				>
					{markdown}
				</ReactMarkdown>
			</article>
			<aside className="toc">
				<div className="toc-title">Table of contents</div>
				<ul>
					{headings.filter(h => h.level >= 1 && h.level <= 3).map(h => (
						<li key={h.id} data-level={h.level}><a href={`#${h.id}`}>{h.text}</a></li>
					))}
				</ul>
			</aside>
		</div>
	);
}
