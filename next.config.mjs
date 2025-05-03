import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},

  // إعدادات الصور
  images: {
    unoptimized: true, // تعطيل تحسين الصور
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/hefz/quran/**", // السماح بصور المصحف
      },
    ],
  },

  // إعدادات الـ headers
  async headers() {
    return [
      {
        source: "/data/:path*", // بيانات JSON
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable", // تخزين لمدة سنة
          },
        ],
      },
    ];
  },
};

export default withPWA({
  dest: "public", // مجلد الخدمة العامل
  register: true, // التسجيل التلقائي
  skipWaiting: true, // تخطي مرحلة الانتظار
  navigateFallback: null, // تعطيل مؤقتًا لحل مشكلة offline.html
  //navigateFallback: '/offline.html', // تفعيل الصفحة الاحتياطية
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB لملفات JSON

  // تعطيل PWA في وضع التطوير
  disable: process.env.NODE_ENV !== "production",

  // قواعد التخزين المؤقت
  runtimeCaching: [
    {
      urlPattern: /\/offline\.html/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'offline-page',
        expiration: { maxEntries: 1 }
      }
    },
    // الحل الجذري لأخطاء الملفات الغير موجودة
    {
      urlPattern: /\/_next\/.*(manifest|client-reference|loadable)\.(js|json)$/,
      handler: 'NetworkOnly'
    },
    {
      urlPattern: /^\/$/, // الصفحة الرئيسية
      handler: "NetworkFirst",
      options: {
        cacheName: "start-page",
        expiration: { maxEntries: 1, maxAgeSeconds: 604800 }, // 7 أيام
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /^\/hafs$/, // صفحة المصحف
      handler: "NetworkFirst",
      options: {
        cacheName: "hafs-page",
        expiration: { maxEntries: 1, maxAgeSeconds: 604800 },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /\/data\/.*\.json$/, // بيانات المصحف
      handler: "CacheFirst",
      options: {
        cacheName: "quran-json",
        expiration: { maxEntries: 200, maxAgeSeconds: 2592000 }, // 30 يومًا
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /^https:\/\/ik\.imagekit\.io\/hefz\/quran\//, // الصور الخارجية
      handler: "CacheFirst",
      options: {
        cacheName: "quran-images",
        expiration: { maxEntries: 700, maxAgeSeconds: 2592000 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],

  // استبعاد الملفات المسببة للمشاكل
  buildExcludes: [
    /(build-manifest|app-build-manifest|react-loadable-manifest|middleware-manifest|client-reference-manifest)\.(js|json)$/,
    /chunks\/.*\.js$/,
  ],

  // إعدادات إضافية
  additionalManifestEntries: [],
  exclude: [
    /.*-manifest\.(js|json)$/,
  ],
  clientsClaim: true, // المطالبة بالتحكم فورًا
  cleanupOutdatedCaches: true, // تنظيف الكاش القديم
  dontCacheBustURLsMatching: /^\/_next\//,
  ignoreURLParametersMatching: [/.*/],
  modifyURLPrefix: {
    "/_next": "/_next",
  },
  manifestTransforms: [
    (manifestEntries) => ({
      manifest: manifestEntries.filter(
        (entry) =>
          !entry.url.includes("build-manifest") &&
          !entry.url.includes("app-build-manifest")
      ),
      warnings: [],
    }),
  ],
})(nextConfig);
