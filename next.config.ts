import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  output: 'export',
  distDir: 'out',
  basePath: '/HammerAuctionHouse-WebUI',
  assetPrefix: '/HammerAuctionHouse-WebUI/',
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};


export default nextConfig;