import { getAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AdminShell } from '../AdminShell';
import { ProjectsManager } from './ProjectsManager';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const session = await getAdminSession();
  if (!session) return null;

  const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });

  return (
    <AdminShell user={{ username: session.username, role: session.role }}>
      <ProjectsManager
        initialProjects={JSON.parse(JSON.stringify(projects))}
        isAdmin={session.role === 'ADMIN'}
      />
    </AdminShell>
  );
}
