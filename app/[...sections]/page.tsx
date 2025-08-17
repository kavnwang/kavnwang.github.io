import { notFound } from 'next/navigation';
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

export default function SectionsPage({ params }: { params: { sections: string[] } }) {
	const item = getByPath(params.sections);
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
			{item.description && <p>{item.description}</p>}
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
