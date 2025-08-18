import { Metadata } from 'next';
import { Suspense } from 'react';
import { getIndex } from '@/lib/content';
import StarToggle from './StarToggle';
import LikesClient from './LikesClient';

export const metadata: Metadata = { title: 'Kevin Wang' };

export default function LikesIndex() {
  const idx = getIndex();
  const items = (idx.items || [])
    .filter(i => i.public && (i.tags || []).some(t => t.toLowerCase() === 'memory'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div style={{ position: 'relative' }}>
      <article>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '2.75rem', lineHeight: 1.1 }}>Some things I like :)</h1>
          <Suspense fallback={<span aria-hidden="true" style={{ display: 'inline-block', width: 24, height: 24 }} />}> 
            <StarToggle />
          </Suspense>
        </div>
        <div style={{ margin: '0.5rem 0' }} />
        <Suspense fallback={<div />}> 
          <LikesClient items={items} />
        </Suspense>
      </article>
    </div>
  );
}
