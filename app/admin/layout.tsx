import { getAdminSession } from '@/lib/auth';

/**
 * حماية لوحة التحكم تتم في طبقتين:
 * 1) middleware.ts — يفحص وجود كوكي الجلسة قبل الـ routing ويعيد التوجيه إلى /admin/login
 *    (باستثناء صفحة الدخول نفسها → لا حلقة توجيه).
 * 2) getAdminSession() داخل كل page/API — تحقق كامل من التوقيع وقاعدة البيانات.
 * لذلك لا نضع redirect هنا إطلاقًا حتى لا يتعارض مع مسار /admin/login.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
