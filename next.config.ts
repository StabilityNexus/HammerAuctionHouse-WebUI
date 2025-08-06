import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: { unoptimized: true },
  output: 'export',
  distDir: 'out',
  basePath: '/HammerAuctionHouse-WebUI',
  assetPrefix: '/HammerAuctionHouse-WebUI',
};

export default nextConfig;
