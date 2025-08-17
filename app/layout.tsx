import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Personal Site',
  description: 'Built from an Obsidian vault',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', gap: '1rem' }}>
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/likes">Likes</Link>
        </header>
        <main style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
