import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ هذا السطر يُجبر Next.js على استخدام Webpack بدل Turbopack
  experimental: {
    turbo: false,
  },

  images: {
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
        urlPattern: /^\/data\/.*\.json$/,
        handler: "CacheFirst",
        options: {
          cacheName: "json-data",
          expiration: {
            maxEntries: 120,
            maxAgeSeconds: 60 * 60 * 24 * 365,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
};

export default withPWA({ dest: 'public' })(nextConfig);
