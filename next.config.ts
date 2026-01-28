import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  output: 'export',
  distDir: 'out',
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
    turbo: {
      resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
    }
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mock browser APIs on server side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Handle WalletConnect and other wallet libraries
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    return config;
  },
};

export default nextConfig;