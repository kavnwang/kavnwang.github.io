"use client";

import { useEffect, useLayoutEffect, useState } from 'react';

function getInitial(): boolean {
  if (typeof window === 'undefined') return false;
  const saved = window.localStorage.getItem('theme:dark');
  if (saved === 'true') return true;
  if (saved === 'false') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(getInitial);

  useLayoutEffect(() => {
    const body = document.body;
    if (dark) body.classList.add('dark'); else body.classList.remove('dark');
    window.localStorage.setItem('theme:dark', String(dark));
  }, [dark]);

  return (
    <button
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      onClick={() => setDark(d => !d)}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 6px',
        marginLeft: 'auto',
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      {/* crescent moon that inverts fill by theme */}
      <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path className="theme-moon" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" stroke="none" fill={dark ? '#ffffff' : '#111111'} />
      </svg>
    </button>
  );
}


