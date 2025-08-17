import { Metadata } from 'next';
import { getIndex } from '@/lib/content';
import { withBasePath } from '@/lib/paths';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';

export const metadata: Metadata = { title: 'Likes' };

export default function LikesIndex() {
  const idx = getIndex();
  const items = (idx.items || [])
    .filter(i => i.public && (i.tags || []).some(t => t.toLowerCase() === 'memory'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const normalizeSrc = (src?: string | null): string => {
    if (!src) return '';
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('mailto:')) return src;
    const absolute = src.startsWith('/') ? src : `/${src}`;
    return withBasePath(absolute);
  };

  const firstImageFromMarkdown = (md?: string | null): string | null => {
    if (!md) return null;
    // Markdown image syntax: ![alt](url)
    const mdImg = md.match(/!\[[^\]]*\]\(([^)]+)\)/);
    if (mdImg && mdImg[1]) return mdImg[1].trim();
    // HTML <img src="...">
    const htmlImg = md.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);
    if (htmlImg && htmlImg[1]) return htmlImg[1].trim();
    return null;
  };

  return (
    <div>
      <h1>Likes</h1>
      {items.map(i => {
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
                    components={{
                      // Hide inline/markdown images to avoid duplicates; image is shown on the right instead
                      img: () => null
                    }}
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
      {items.length === 0 && <p>No likes yet.</p>}
    </div>
  );
}
