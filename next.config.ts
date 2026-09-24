import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // مهم: يجب إبقاء الحزم ذات الإضافات الأصلية (.node) خارج حزمة Next.js
  // وإلا تفشل الدوال على Vercel بخطأ FUNCTION_INVOCATION_FAILED
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-better-sqlite3',
    'better-sqlite3',
    '@prisma/adapter-libsql',
    '@libsql/client',
  ],
  // تضمين ملف قاعدة البيانات SQLite + ملفات native (better-sqlite3) مع الدوال.
  // بدون السطر الخاص بـ better-sqlite3 يحدث خطأ FUNCTION_INVOCATION_FAILED على
  // Vercel لأن require الديناميكي في lib/prisma.ts لا يُتتبَّع تلقائيًا إلى حزمة الدالة.
  outputFileTracingIncludes: {
    '/**': [
      './prisma/*.db*',
      './node_modules/better-sqlite3/**',
      './node_modules/@prisma/adapter-better-sqlite3/**',
      './node_modules/.prisma/client/**',
    ],
  },
};

export default nextConfig;
