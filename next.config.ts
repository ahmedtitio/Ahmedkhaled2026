import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // مهم: يجب إبقاء الحزم ذات الإضافات الأصلية (.node) خارج حزمة Next.js
  // وإلا تفشل الدوال على Vercel بخطأ FUNCTION_INVOCATION_FAILED
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-libsql',
    '@libsql/client',
  ],
  // تضمين ملف قاعدة البيانات SQLite + ملفات adapter-libsql/@libsql مع الدوال.
  // بدون ذلك لا يُتتبَّع require الديناميكي في lib/prisma.ts تلقائيًا إلى حزمة الدالة.
  outputFileTracingIncludes: {
    '/**': [
      './prisma/*.db*',
      './node_modules/@prisma/adapter-libsql/**',
      './node_modules/@libsql/**',
      './node_modules/.prisma/client/**',
    ],
  },
};

export default nextConfig;
