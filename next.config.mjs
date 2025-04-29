import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // صححنا هنا: turbo يجب أن يكون كائن أو نحذفه نهائيًا
    // turbo: false, ← ❌ خطأ: كان يسبب التحذير
  },

  images: {
    unoptimized: true,
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
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  navigateFallback: '/offline.html', // ✅ دعم عرض صفحة عند انقطاع الإنترنت
  runtimeCaching: [
    {
      urlPattern: /^\/$/, // الصفحة الرئيسية
      handler: 'NetworkFirst',
      options: {
        cacheName: 'start-page',
        expiration: { maxEntries: 1, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /^\/hafs$/, // صفحة المصحف
      handler: 'NetworkFirst',
      options: {
        cacheName: 'hafs-page',
        expiration: { maxEntries: 1, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\/quran\/.*\.json$/, // بيانات الآيات
      handler: 'CacheFirst',
      options: {
        cacheName: 'quran-json',
        expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /^https:\/\/ik\.imagekit\.io\/hefz\/quran\//, // صور المصحف
      handler: 'CacheFirst',
      options: {
        cacheName: 'quran-images',
        expiration: { maxEntries: 600, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
  ],
})(nextConfig);
