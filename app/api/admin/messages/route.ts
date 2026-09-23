import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
}

/** GET /api/admin/messages — صندوق الرسائل */
export async function GET() {
  try { await requireAdmin(); } catch { return unauthorized(); }
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ messages });
}

/** PUT /api/admin/messages — تعليم كمقروءة/مؤرشفة {id, read?, archived?} */
export async function PUT(req: NextRequest) {
  try { await requireAdmin(); } catch { return unauthorized(); }
  const { id, read, archived } = await req.json();
  const message = await prisma.contactMessage.update({
    where: { id },
    data: { ...(read !== undefined && { read: !!read }), ...(archived !== undefined && { archived: !!archived }) },
  });
  return NextResponse.json({ message });
}

/** DELETE /api/admin/messages?id=XX */
export async function DELETE(req: NextRequest) {
  let session;
  try { session = await requireAdmin(); } catch { return unauthorized(); }
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'المعرف مفقود' }, { status: 400 });
  try {
    await prisma.contactMessage.delete({ where: { id } });
    await prisma.activityLog.create({
      data: { userId: session.userId, action: 'DELETE', entity: 'ContactMessage', entityId: id },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
  }
}
