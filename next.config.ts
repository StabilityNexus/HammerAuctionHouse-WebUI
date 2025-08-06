import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: { unoptimized: true },
  output: 'export',
  distDir: 'out',
  basePath: '',
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

export default nextConfig;
