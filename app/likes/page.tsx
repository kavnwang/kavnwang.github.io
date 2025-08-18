import { Metadata } from 'next';
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
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
        <h1 style={{ margin: '0.5rem 0 0' }}>Some things I like :)</h1>
        <div style={{ justifySelf: 'end' }}>
          <StarToggle />
        </div>
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        <LikesClient items={items} />
      </div>
    </div>
  );
}
