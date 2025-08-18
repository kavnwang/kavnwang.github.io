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
    <div className="pill-group" style={{ margin: '1rem 0' }}>
      {allTags.map(t => (
        <button
          key={t}
          onClick={() => toggle(t)}
          className={`pill${selected.has(t) ? ' pill-active' : ''}`}
        >
          #{t}
        </button>
      ))}
    </div>
  );
}
