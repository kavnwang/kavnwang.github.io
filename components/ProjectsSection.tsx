"use client";

import { useMemo, useState } from 'react';
import type { ContentItem } from '@/lib/types';
import ProjectCard from '@/components/ProjectCard';

interface ProjectsSectionProps {
  items: ContentItem[];
}

// Easily editable filter list
const FILTERS: { key: string; label: string; tags?: string[] }[] = [
  { key: 'all', label: 'All' },
  { key: 'research', label: 'Research', tags: ['research'] },
  { key: 'science', label: 'Science', tags: ['science'] },
  { key: 'hardware', label: 'Hardware', tags: ['hardware'] },
  { key: 'software', label: 'Software', tags: ['software'] },
  { key: 'math', label: 'Math', tags: ['math'] },
  { key: 'art', label: 'Art', tags: ['art'] },
  { key: 'writing', label: 'Writing', tags: ['writing'] },
  { key: 'reviews', label: 'Reviews', tags: ['reviews', 'review'] },
  { key: 'teaching', label: 'Teaching', tags: ['teaching', 'teach'] }
];

function normalizeTag(tag?: string): string {
  return String(tag || '').trim().toLowerCase();
}

export default function ProjectsSection({ items }: ProjectsSectionProps) {
  const [activeKey, setActiveKey] = useState<string>('all');

  const filtered = useMemo(() => {
    const filter = FILTERS.find(f => f.key === activeKey);
    if (!filter || !filter.tags || filter.tags.length === 0) return items;
    const wanted = new Set((filter.tags || []).map(normalizeTag));
    return items.filter(i => (i.tags || []).some(t => wanted.has(normalizeTag(t))));
  }, [activeKey, items]);

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActiveKey(f.key)}
            style={{
              padding: '6px 10px',
              borderRadius: 999,
              border: '1px solid #ddd',
              background: activeKey === f.key ? '#000' : '#fff',
              color: activeKey === f.key ? '#fff' : '#000',
              cursor: 'pointer'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid">
        {filtered.map(p => <ProjectCard key={p.id} item={p} />)}
      </div>
      {filtered.length === 0 && <p>No projects yet.</p>}
    </div>
  );
}
