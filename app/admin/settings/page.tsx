import { getAdminSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AdminShell } from '../AdminShell';
import { SettingsManager } from './SettingsManager';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) return null;

  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) map[s.key] = s.value;

  return (
    <AdminShell user={{ username: session.username, role: session.role }}>
      <SettingsManager initialSettings={map} />
    </AdminShell>
  );
}
