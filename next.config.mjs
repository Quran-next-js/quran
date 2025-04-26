import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false,
  },

  images: {
    unoptimized: true, // ⬅️ مهم
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/hefz/quran/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/data/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /\/quran\/.*\.json$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'quran-json',
          expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
      {
        urlPattern: /^https:\/\/ik\.imagekit\.io\/hefz\/quran\//,
        handler: 'CacheFirst',
        options: {
          cacheName: 'quran-images',
          expiration: { maxEntries: 600, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
    ],
  },
};

export default withPWA({ dest: 'public' })(nextConfig);
