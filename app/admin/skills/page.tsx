import { getAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AdminShell } from '../AdminShell';
import { SkillsManager } from './SkillsManager';

export const dynamic = 'force-dynamic';

export default async function AdminSkillsPage() {
  const session = await getAdminSession();
  if (!session) return null;

  const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } });

  return (
    <AdminShell user={{ username: session.username, role: session.role }}>
      <SkillsManager initialSkills={JSON.parse(JSON.stringify(skills))} />
    </AdminShell>
  );
}
