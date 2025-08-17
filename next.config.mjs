/** @type {import('next').NextConfig} */
const repoBase = process.env.NEXT_PUBLIC_BASE_PATH || '';
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  output: 'export',           // produce static ./out for GitHub Pages
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: repoBase ? `/${repoBase}` : undefined,
  assetPrefix: repoBase ? `/${repoBase}/` : undefined,
  // Typed routes and strict type checks slow down dev; keep them for prod builds
  experimental: { typedRoutes: isProd },
  typescript: { ignoreBuildErrors: !isProd },
  eslint: { ignoreDuringBuilds: true }
};
export default nextConfig;
