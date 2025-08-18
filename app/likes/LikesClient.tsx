'use client';

import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import type { ContentItem } from '@/lib/types';
import { withBasePath } from '@/lib/paths';

export default function LikesClient({ items }: { items: ContentItem[] }) {
  const search = useSearchParams();
  const onlyStarred = (search.get('starred') || '') === '1';

  const filtered = items.filter(i => {
    if (!onlyStarred) return true;
    return (i.tags || []).some(t => t.toLowerCase() === 'starred');
  });

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

  if (filtered.length === 0) {
    return <p>No {onlyStarred ? 'starred ' : ''}likes yet.</p>;
  }

  return (
    <div>
      {filtered.map(i => {
        const fallbackMarkdownImg = firstImageFromMarkdown(i.markdown || '');
        const rightImage = i.image ? i.image : fallbackMarkdownImg;
        const rightImageSrc = rightImage ? normalizeSrc(rightImage) : '';
        return (
          <div key={i.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', margin: '1rem 0' }}>
            <div style={{ flex: 2 }}>
              <small>{new Date(i.date).toLocaleDateString()}</small>
              {i.description ? (
                <p style={{ margin: '0.25rem 0 0' }}>{i.description}</p>
              ) : (
                <div style={{ marginTop: '0.25rem' }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                    components={{ img: () => null }}
                  >
                    {i.markdown || ''}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              {rightImageSrc && (
                <img src={rightImageSrc} alt="" style={{ maxWidth: '100%', height: 'auto' }} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}


