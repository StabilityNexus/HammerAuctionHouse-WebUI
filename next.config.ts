import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false, // Disable build activity indicator
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.devServer = config.devServer || {}
      config.devServer.client = config.devServer.client || {}
      config.devServer.client.overlay = false // Disable error overlay
    }
    return config
  },
}

export default nextConfig
