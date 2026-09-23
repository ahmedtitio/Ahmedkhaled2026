import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/public/projects — المشاريع المنشورة للواجهة العامة */
export async function GET() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });
  // تحويل technologies من JSON string إلى مصفوفة ومطابقة شكل نوع Project الحالي
  const mapped = projects.map((p) => ({
    id: p.id,
    title: { ar: p.titleAr, en: p.titleEn },
    description: { ar: p.descriptionAr, en: p.descriptionEn },
    image: p.image,
    component: p.component,
    technologies: (() => {
      try { return JSON.parse(p.technologies) as string[]; } catch { return []; }
    })(),
  }));
  return NextResponse.json({ projects: mapped });
}
