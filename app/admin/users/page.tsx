import { getAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AdminShell } from '../AdminShell';
import { UsersManager } from './UsersManager';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const session = await getAdminSession();
  if (!session) return null;

  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });

  return (
    <AdminShell user={{ username: session.username, role: session.role }}>
      <UsersManager
        initialUsers={JSON.parse(
          JSON.stringify(users.map((u) => ({ ...u, lastLogin: u.lastLogin?.toISOString() || null, createdAt: u.createdAt.toISOString() })))
        )}
        currentUserId={session.userId}
        isAdmin={session.role === 'ADMIN'}
      />
    </AdminShell>
  );
}
