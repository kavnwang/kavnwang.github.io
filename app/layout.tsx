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
        <div className="site-bg" aria-hidden="true">
          <svg viewBox="0 0 1000 400" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sunGradient" x1="0" y1="0" x2="0" y2="1">
                <stop className="sun-stop-1" offset="0%" stopColor="#ffe7b3" stopOpacity="0.85" />
                <stop className="sun-stop-2" offset="100%" stopColor="#ffd7c2" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            {/* Sun behind mountains */}
            <circle cx="500" cy="270" r="140" fill="url(#sunGradient)" opacity="0.9" />
            {/* Two separate peaks, unified color scheme and overlapping center to avoid any gap */}
            {/* Left peak - base silhouette */}
            <polygon
              points="0,400 0,360 60,330 130,300 200,270 270,235 340,200 400,165 460,140 520,155 520,400 0,400"
              fill="#eef3f9"
            />
            {/* Right peak - base silhouette */}
            <polygon
              points="480,400 480,160 540,145 600,160 660,190 720,225 780,260 840,290 900,320 960,345 1000,360 1000,400 480,400"
              fill="#eef3f9"
            />
            {/* Left peak - midtone ridge band for texture */}
            <polygon
              points="0,344 80,318 150,292 220,266 290,238 360,210 430,184 500,176 520,178 520,198 500,196 430,200 360,214 290,242 220,270 150,296 80,322 0,346"
              fill="#e6eef7"
              opacity="0.55"
            />
            {/* Right peak - midtone ridge band for texture */}
            <polygon
              points="480,206 540,190 600,204 660,226 720,250 780,272 840,294 900,314 960,332 1000,346 1000,358 960,342 900,326 840,306 780,284 720,260 660,236 600,212 540,196 480,210"
              fill="#e6eef7"
              opacity="0.55"
            />
            {/* Left peak - highlight ridge band */}
            <polygon
              points="0,362 90,338 160,316 230,292 300,268 370,246 440,228 510,222 520,224 520,236 510,234 440,240 370,258 300,280 230,304 160,326 90,346 0,366"
              fill="#f6f9fc"
              opacity="0.7"
            />
            {/* Right peak - highlight ridge band */}
            <polygon
              points="480,232 540,218 600,230 660,250 720,270 780,290 840,308 900,324 960,338 1000,350 1000,358 960,344 900,330 840,312 780,294 720,274 660,254 600,234 540,222 480,236"
              fill="#f6f9fc"
              opacity="0.7"
            />
          </svg>
        </div>
        <header className="site-nav" style={{ padding: '0 1rem', borderBottom: 'none', maxWidth: 900, margin: '1rem auto 0' }}>
          <SiteNav />
        </header>
        <main style={{ maxWidth: 900, margin: '1rem auto 2rem', padding: '0 1rem', flex: 1 }}>
          {children}
        </main>
        <footer style={{ borderTop: 'none', padding: '1rem 0', marginTop: '2rem' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'center', gap: '1.25rem', alignItems: 'center' }}>
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
