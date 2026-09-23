/**
 * حل مشكلة إعادة التوجيه اللانهائية في Next.js 16:
 * عند وجود redirect() داخل layout مشترك (app/admin/layout.tsx) فإن الإطار
 * قد يعيد توجيه صفحة /admin/login إلى نفسها. هذا الملف يحوّل الحماية إلى
 * middleware صريح يعمل قبل الـ routing — مع استثناء /admin/login من الحماية.
 */
export { adminMiddleware as middleware } from './lib/admin-middleware';

export const config = {
  matcher: ['/admin/:path*'],
};
