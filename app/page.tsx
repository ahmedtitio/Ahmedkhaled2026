import { Suspense } from 'react';
import HomeShell from './HomeShell';

export const dynamic = 'force-dynamic';

/**
 * الصفحة الرئيسية — تجلب البيانات من قاعدة البيانات (Prisma)
 * وتمررها للواجهة التي كانت تعتمد سابقًا على ملفات ثابتة في app/data.
 */
export default async function HomePage() {
  let projects: unknown[] = [];
  let skills: unknown[] = [];
  let settings: Record<string, string> = {};

  try {
    // استيراد ديناميكي حتى لا ينكسر البناء إذا لم تكن قاعدة البيانات مُهيأة بعد
    const { prisma } = await import('@/lib/prisma');

    const [dbProjects, dbSkills, dbSettings] = await Promise.all([
      prisma.project.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
      prisma.skill.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
      prisma.siteSetting.findMany(),
    ]);

    projects = dbProjects.map((p) => ({
      id: p.id,
      title: { ar: p.titleAr, en: p.titleEn },
      description: { ar: p.descriptionAr, en: p.descriptionEn },
      image: p.image,
      component: p.component,
      technologies: (() => { try { return JSON.parse(p.technologies); } catch { return []; } })(),
    }));

    skills = dbSkills.map((s) => ({
      name: s.name,
      percentage: s.percentage,
      icon: s.icon,
      category: s.category,
    }));

    for (const s of dbSettings) settings[s.key] = s.value;
  } catch (e) {
    // fallback إلى الملفات الثابتة إذا تعذر الوصول لقاعدة البيانات
    const staticProjects = await import('./data/projects');
    const staticSkills = await import('./data/skills');
    projects = staticProjects.projects;
    skills = staticSkills.skills;
    console.error('DB unavailable, fell back to static data:', e);
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900" />}>
      <HomeShell projects={projects as never} skills={skills as never} settings={settings} />
    </Suspense>
  );
}
