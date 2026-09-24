import { getAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AdminShell } from '../AdminShell';
import { MessagesInbox } from './MessagesInbox';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const session = await getAdminSession();
  if (!session) return null;

  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <AdminShell user={{ username: session.username, role: session.role }}>
      <MessagesInbox initialMessages={JSON.parse(JSON.stringify(messages))} />
    </AdminShell>
  );
}
