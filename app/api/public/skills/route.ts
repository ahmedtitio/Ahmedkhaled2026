import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/public/skills — المهارات المنشورة للواجهة العامة */
export async function GET() {
  const skills = await prisma.skill.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });
  return NextResponse.json({
    skills: skills.map((s) => ({
      name: s.name,
      percentage: s.percentage,
      icon: s.icon,
      category: s.category as 'frontend' | 'backend' | 'tools' | 'design',
    })),
  });
}
