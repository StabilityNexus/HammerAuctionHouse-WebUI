import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: { unoptimized: true },
  output: 'export',
  distDir: 'out',
  basePath: '',
};

export default nextConfig;
