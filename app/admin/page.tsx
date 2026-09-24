import { getAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AdminShell } from './AdminShell';
import { DashboardClient } from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) return null; // الـ layout يتكفل بإعادة التوجيه

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [projects, publishedProjects, skills, messages, unread, viewsWeek, viewsTotal, topPages, recentLogs] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.skill.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false, archived: false } }),
      prisma.pageView.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.pageView.count(),
      prisma.pageView.groupBy({ by: ['path'], _count: { _all: true }, orderBy: { _count: { path: 'desc' } }, take: 8 }),
      prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
    ]);

  return (
    <AdminShell user={{ username: session.username, role: session.role }}>
      <DashboardClient
        stats={{
          projects,
          publishedProjects,
          skills,
          messages,
          unread,
          viewsWeek,
          viewsTotal,
          topPages: topPages.map((t) => ({ path: t.path, count: t._count._all })),
        }}
        logs={recentLogs.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() }))}
      />
    </AdminShell>
  );
}
