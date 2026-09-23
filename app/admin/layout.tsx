import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';

/**
 * Middleware مخصص لمسارات /admin — يحمي لوحة التحكم بالكامل.
 * (Next 16 لا يدعم middleware.ts التقليدي، نستخدم layout-level protection)
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }
  return <>{children}</>;
}
