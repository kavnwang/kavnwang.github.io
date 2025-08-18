"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { withBasePath } from '@/lib/paths';

export default function SiteNav() {
  const pathname = usePathname() || '';

  const isActive = (href: string): boolean => {
    const p = withBasePath(href);
    // Treat exact match or prefix match with trailing slash as active
    return pathname === p || pathname === `${p}/`;
  };

  return (
    <nav>
      <Link href="/" className={isActive('/') ? 'nav-active' : undefined}>Home</Link>
      <Link href="/posts" className={isActive('/posts') ? 'nav-active' : undefined} style={{ marginLeft: '2rem' }}>Posts</Link>
      <Link href="/likes" className={isActive('/likes') ? 'nav-active' : undefined} style={{ marginLeft: '2rem' }}>Likes</Link>
    </nav>
  );
}


