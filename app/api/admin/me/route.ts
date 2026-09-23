import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

export const runtime = 'nodejs';

/** GET /api/admin/me — إرجاع بيانات المستخدم الحالي أو 401 */
export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user: session });
}
