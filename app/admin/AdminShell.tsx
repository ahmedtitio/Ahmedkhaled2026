'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FolderGit2, Sparkles, Settings, Inbox, Users, ScrollText, LogOut, ExternalLink } from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'المشاريع', icon: FolderGit2 },
  { href: '/admin/skills', label: 'المهارات', icon: Sparkles },
  { href: '/admin/messages', label: 'الرسائل', icon: Inbox },
  { href: '/admin/settings', label: 'إعدادات الموقع', icon: Settings },
  { href: '/admin/users', label: 'المستخدمون', icon: Users },
  { href: '/admin/logs', label: 'سجل النشاطات', icon: ScrollText },
];

export function AdminShell({ children, user }: { children: React.ReactNode; user: { username: string; role: string } }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100 dark:bg-gray-950 flex">
      {/* الشريط الجانبي */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-white p-4 gap-1 sticky top-0 h-screen">
        <div className="px-3 py-4">
          <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            لوحة التحكم
          </div>
          <div className="text-xs text-gray-400 mt-1">{user.username} • {user.role === 'ADMIN' ? 'مدير عام' : 'محرر'}</div>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                  active ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow' : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-white/10 pt-3">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/10">
            <ExternalLink className="w-4 h-4" /> عرض الموقع
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-300 hover:bg-red-500/10">
            <LogOut className="w-4 h-4" /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* المحتوى */}
      <main className="flex-1 min-w-0">
        {/* شريط تنقل سفلي للجوال */}
        <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-slate-900 flex overflow-x-auto">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] ${active ? 'text-blue-400' : 'text-gray-400'}`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
