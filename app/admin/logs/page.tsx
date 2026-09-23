import { getAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AdminShell } from '../AdminShell';

export const dynamic = 'force-dynamic';

const ACTION_LABELS: Record<string, string> = {
  CREATE: 'إنشاء', UPDATE: 'تعديل', DELETE: 'حذف', LOGIN: 'تسجيل دخول', LOGOUT: 'تسجيل خروج',
};

export default async function AdminLogsPage() {
  const session = await getAdminSession();
  if (!session) return null;

  const logs = await prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });

  return (
    <AdminShell user={{ username: session.username, role: session.role }}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">سجل النشاطات</h1>
          <p className="text-gray-500 text-sm mt-1">آخر 200 عملية تمت في لوحة التحكم (Audit Log)</p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-right px-4 py-3">العملية</th>
                <th className="text-right px-4 py-3">الكيان</th>
                <th className="text-right px-4 py-3 hidden md:table-cell">التفاصيل</th>
                <th className="text-right px-4 py-3">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-t hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      l.action === 'DELETE' ? 'bg-red-100 text-red-700' :
                      l.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                      l.action === 'LOGIN' || l.action === 'LOGOUT' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {ACTION_LABELS[l.action] || l.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{l.entity}{l.entityId ? ` #${l.entityId}` : ''}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-xs truncate" dir="ltr">{l.details || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{l.createdAt.toLocaleString('ar-EG')}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-12 text-center text-gray-400">لا يوجد نشاط بعد.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
