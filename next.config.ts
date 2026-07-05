import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  turbopack: {
    root: '../../',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
