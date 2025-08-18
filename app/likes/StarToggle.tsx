'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function StarToggle() {
  const router = useRouter();
  const search = useSearchParams();
  const isOn = (search.get('starred') || '') === '1';

  function toggle() {
    const params = new URLSearchParams(window.location.search);
    if (isOn) {
      params.delete('starred');
    } else {
      params.set('starred', '1');
    }
    const query = params.toString();
    const next = query ? `${window.location.pathname}?${query}` : `${window.location.pathname}`;
    router.push(next as any);
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={isOn}
      title={isOn ? 'Showing only starred' : 'Show only starred'}
      style={{
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '1.5rem',
        lineHeight: 1,
        color: isOn ? '#FFC107' : '#000',
        padding: 0
      }}
    >
      ★
    </button>
  );
}


