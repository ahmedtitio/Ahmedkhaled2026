'use client';

import Link from 'next/link';
import { FolderGit2, Sparkles, Inbox, Eye, FileCheck2, MailOpen, ArrowLeft } from 'lucide-react';

interface Stats {
  projects: number;
  publishedProjects: number;
  skills: number;
  messages: number;
  unread: number;
  viewsWeek: number;
  viewsTotal: number;
  topPages: { path: string; count: number }[];
}

const ACTION_LABELS: Record<string, string> = {
  CREATE: 'إنشاء',
  UPDATE: 'تعديل',
  DELETE: 'حذف',
  LOGIN: 'دخول',
  LOGOUT: 'خروج',
};

export function DashboardClient({
  stats,
  logs,
}: {
  stats: Stats;
  logs: { id: string; action: string; entity: string; details: string | null; createdAt: string }[];
}) {
  const cards = [
    { label: 'إجمالي المشاريع', value: stats.projects, sub: `${stats.publishedProjects} منشور`, icon: FolderGit2, color: 'from-blue-500 to-cyan-500', href: '/admin/projects' },
    { label: 'المهارات', value: stats.skills, sub: 'في الواجهة', icon: Sparkles, color: 'from-purple-500 to-pink-500', href: '/admin/skills' },
    { label: 'الرسائل', value: stats.messages, sub: `${stats.unread} غير مقروءة`, icon: Inbox, color: 'from-orange-500 to-red-500', href: '/admin/messages' },
    { label: 'الزيارات (أسبوع)', value: stats.viewsWeek, sub: `الإجمالي ${stats.viewsTotal}`, icon: Eye, color: 'from-green-500 to-teal-500', href: '#' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">مرحبًا بك 👋</h1>
          <p className="text-gray-500 mt-1">نظرة عامة على حالة موقعك</p>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border shadow-sm text-sm hover:bg-gray-50">
          <ArrowLeft className="w-4 h-4" /> الموقع العام
        </Link>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition">
            <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${c.color} mb-3`}>
              <c.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{c.value}</div>
            <div className="text-sm text-gray-500 mt-1">{c.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{c.sub}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* أكثر الصفحات زيارة */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <FileCheck2 className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900">أكثر الصفحات زيارة</h2>
          </div>
          {stats.topPages.length === 0 ? (
            <p className="text-sm text-gray-400">لا توجد بيانات زيارات بعد — سيبدأ التتبع تلقائيًا من الواجهة العامة.</p>
          ) : (
            <ul className="space-y-2">
              {stats.topPages.map((p) => (
                <li key={p.path} className="flex justify-between text-sm border-b border-dashed pb-2">
                  <code className="text-gray-700">{p.path}</code>
                  <span className="text-gray-400">{p.count} زيارة</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* آخر النشاطات */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <MailOpen className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-gray-900">آخر النشاطات</h2>
          </div>
          {logs.length === 0 ? (
            <p className="text-sm text-gray-400">لا يوجد نشاط بعد.</p>
          ) : (
            <ul className="space-y-3">
              {logs.map((l) => (
                <li key={l.id} className="text-sm flex items-start gap-2">
                  <span className={`mt-0.5 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    l.action === 'DELETE' ? 'bg-red-100 text-red-700' :
                    l.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                    l.action === 'LOGIN' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {ACTION_LABELS[l.action] || l.action}
                  </span>
                  <div>
                    <span className="text-gray-800">{l.entity}</span>
                    {l.details && <span className="text-gray-400"> — {l.details}</span>}
                    <div className="text-xs text-gray-400">{new Date(l.createdAt).toLocaleString('ar-EG')}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
