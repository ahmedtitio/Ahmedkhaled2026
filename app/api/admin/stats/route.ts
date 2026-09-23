import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

/** GET /api/admin/stats — إحصائيات لوحة التحكم */
export async function GET() {
  try { await requireAdmin(); } catch {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [projects, publishedProjects, featured, skills, messages, unread, viewsWeek, viewsTotal, recentViews] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.project.count({ where: { featured: true } }),
      prisma.skill.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false, archived: false } }),
      prisma.pageView.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.pageView.count(),
      prisma.pageView.groupBy({ by: ['path'], _count: { _all: true }, orderBy: { _count: { path: 'desc' } }, take: 8 }),
    ]);

  return NextResponse.json({
    stats: {
      projects,
      publishedProjects,
      featured,
      skills,
      messages,
      unread,
      viewsWeek,
      viewsTotal,
      topPages: recentViews.map((r) => ({ path: r.path, count: r._count._all })),
    },
  });
}
