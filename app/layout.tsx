import type { Metadata } from 'next';
import './globals.css';
import { withBasePath } from '@/lib/paths';
import SiteNav from '@/components/SiteNav';

export const metadata: Metadata = {
  title: 'Kevin Wang',
  description: 'Built from an Obsidian vault',
  icons: {
    icon: withBasePath('/logo.png'),
    shortcut: withBasePath('/logo.png'),
    apple: withBasePath('/logo.png')
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="site-header">
          <div className="page-content">
            <SiteNav />
          </div>
        </header>
        <main className="page-content" style={{ flex: 1, padding: '1rem 0 2rem' }}>
          {children}
        </main>
        <footer style={{ borderTop: 'none', padding: '1rem 0', marginTop: '2rem', position: 'relative' }}>
          <div className="site-bg" aria-hidden="true">
            <svg viewBox="0 0 1000 400" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sunGradient" x1="0" y1="0" x2="0" y2="1">
                <stop className="sun-stop-1" offset="0%" stopColor="#ffe7b3" stopOpacity="0.85" />
                <stop className="sun-stop-2" offset="100%" stopColor="#ffd7c2" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            {/* Rings now handled by CSS repeating-radial-gradient background for adaptive tiling */}
            {/* Sun behind mountains */}
            <circle cx="500" cy="270" r="98" fill="url(#sunGradient)" opacity="0.9" />
            {/* Two separate peaks, unified color scheme and overlapping center to avoid any gap */}
            {/* Left peak - base silhouette */}
            <polygon
              points="-140,400 -140,372 -80,348 -10,324 60,300 130,275 200,250 260,230 320,212 400,220 460,234 520,252 520,400 -140,400"
              fill="#eef3f9"
            />
            {/* Right peak - base silhouette (peak farther right, deeper valley) */}
            <polygon
              points="500,400 500,250 660,200 720,216 780,234 840,258 900,282 960,302 1000,322 1000,400 500,400"
              fill="#eef3f9"
            />
            {/* Left peak - midtone ridge band for texture */}
            <polygon
              points="-140,368 -60,348 10,330 80,310 150,290 220,272 290,256 480,266 520,270 520,282 480,278 290,270 220,284 150,300 80,318 10,334 -60,352 -140,370"
              fill="#e6eef7"
              opacity="0.55"
            />
            {/* Right peak - midtone ridge band for texture (aligned to new position) */}
            <polygon
              points="500,276 560,238 620,252 680,270 740,288 800,304 860,318 920,330 960,340 1000,350 1000,358 960,350 900,336 840,320 780,302 720,284 660,266 600,248 540,234 500,244"
              fill="#e6eef7"
              opacity="0.55"
            />
            {/* Left peak - highlight ridge band */}
            <polygon
              points="-140,382 -50,362 20,344 90,326 160,308 230,292 300,278 500,288 520,290 520,300 500,298 300,290 230,306 160,324 90,342 20,356 -50,368 -140,386"
              fill="#f6f9fc"
              opacity="0.7"
            />
            {/* Right peak - highlight ridge band (aligned to new position) */}
            <polygon
              points="500,296 560,262 620,274 680,292 740,310 800,326 860,340 920,352 960,360 1000,366 1000,374 960,366 900,352 840,336 780,318 720,300 660,282 600,264 540,250 500,260"
              fill="#f6f9fc"
              opacity="0.7"
            />
            </svg>
          </div>
          <div className="page-content" style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', alignItems: 'center' }}>
            <a href="mailto:kevinhw@mit.edu" title="Email"><img src={withBasePath('/icons/gmail.svg')} alt="Email" style={{ width: 20, height: 20 }} /></a>
            <a href="https://github.com/kavnwang" target="_blank" rel="noopener noreferrer" title="GitHub"><img src={withBasePath('/icons/github.svg')} alt="GitHub" style={{ width: 20, height: 20 }} /></a>
            <a href="https://www.linkedin.com/in/kevinhaoyuwang" target="_blank" rel="noopener noreferrer" title="LinkedIn"><img src={withBasePath('/icons/linkedin.svg')} alt="LinkedIn" style={{ width: 20, height: 20 }} /></a>
            <a href="https://goodreads.com/kevinwang" target="_blank" rel="noopener noreferrer" title="Goodreads"><img src={withBasePath('/icons/goodreads.svg')} alt="Goodreads" style={{ width: 20, height: 20 }} /></a>
            <a href="https://wangk.substack.com" target="_blank" rel="noopener noreferrer" title="Substack"><img src={withBasePath('/icons/substack.svg')} alt="Substack" style={{ width: 20, height: 20 }} /></a>
          </div>
          <div className="copyright">© Kevin Wang 2025</div>
        </footer>
      </body>
    </html>
  );
}
