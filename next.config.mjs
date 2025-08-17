/** @type {import('next').NextConfig} */
const repoBase = process.env.NEXT_PUBLIC_BASE_PATH || '';
const nextConfig = {
  output: 'export',           // produce static ./out for GitHub Pages
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: repoBase ? `/${repoBase}` : undefined,
  assetPrefix: repoBase ? `/${repoBase}/` : undefined,
  experimental: { typedRoutes: true }
};
export default nextConfig;
