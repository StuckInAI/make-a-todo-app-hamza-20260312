import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('better-sqlite3');
      }
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['typeorm', 'better-sqlite3', 'reflect-metadata'],
  },
};

export default nextConfig;
