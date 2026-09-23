import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE = 'portfolio_admin_token';

/**
 * حماية مسارات /admin على مستوى الـ routing (يعمل قبل Layouts).
 * - يستثني /admin/login تمامًا (لا إعادة توجيه للداخل) → يقطع أي حلقة توجيه.
 * - إذا لم توجد جلسة صالحة → 307 إلى /admin/login.
 * ملاحظة: هذا فحص وجود الكوكي فقط؛ التحقق الكامل من التوقيع وقاعدة البيانات
 * يتم داخل getAdminSession() في كل layout/page/API.
 */
export function adminMiddleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // صفحة تسجيل الدخول مفتوحة دائمًا للجميع
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    const loginUrl = new URL('/admin/login', req.url);
    // الاحتفاظ بالمسار الأصلي للعودة بعده بعد تسجيل الدخول
    loginUrl.searchParams.set('from', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
