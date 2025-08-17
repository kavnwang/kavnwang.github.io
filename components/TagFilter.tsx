'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TagFilter({ allTags }: { allTags: string[] }) {
  const router = useRouter();
  const search = useSearchParams();
  const selected = new Set((search.get('tags') || '').split(',').filter(Boolean));

  function toggle(tag: string) {
    if (selected.has(tag)) selected.delete(tag); else selected.add(tag);
    const next = Array.from(selected).join(',');
    const q = next ? `?tags=${encodeURIComponent(next)}` : '';
    router.push(`${window.location.pathname}${q}` as any);
  }

  return (
    <div style={{ margin: '1rem 0', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {allTags.map(t => (
        <button
          key={t}
          onClick={() => toggle(t)}
          style={{
            border: '1px solid #ddd',
            padding: '4px 8px',
            borderRadius: 999,
            background: selected.has(t) ? '#f0f0f0' : 'white',
            cursor: 'pointer'
          }}
        >
          #{t}
        </button>
      ))}
    </div>
  );
}
