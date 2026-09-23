import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
}

/** GET /api/admin/users — قائمة المستخدمين (ADMIN فقط) */
export async function GET() {
  let session;
  try { session = await requireAdmin(); } catch { return unauthorized(); }
  if (session.role !== 'ADMIN') return NextResponse.json({ error: 'صلاحيات غير كافية' }, { status: 403 });
  const users = await prisma.user.findMany({ select: { id: true, email: true, username: true, name: true, role: true, lastLogin: true, createdAt: true } });
  return NextResponse.json({ users });
}

/** POST /api/admin/users — إنشاء مستخدم جديد (ADMIN فقط) */
export async function POST(req: NextRequest) {
  let session;
  try { session = await requireAdmin(); } catch { return unauthorized(); }
  if (session.role !== 'ADMIN') return NextResponse.json({ error: 'صلاحيات غير كافية' }, { status: 403 });
  try {
    const b = await req.json();
    if (!b.email || !b.username || !b.password) {
      return NextResponse.json({ error: 'كل الحقول مطلوبة' }, { status: 400 });
    }
    if (String(b.password).length < 8) {
      return NextResponse.json({ error: 'كلمة المرور يجب ألا تقل عن 8 أحرف' }, { status: 400 });
    }
    const user = await prisma.user.create({
      data: {
        email: String(b.email).toLowerCase(),
        username: b.username,
        password: await bcrypt.hash(b.password, 12),
        role: b.role === 'EDITOR' ? 'EDITOR' : 'ADMIN',
        name: b.name || null,
      },
      select: { id: true, email: true, username: true, role: true },
    });
    await prisma.activityLog.create({
      data: { userId: session.userId, action: 'CREATE', entity: 'User', entityId: user.id, details: user.username },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error && e.message.includes('Unique') ? 'البريد أو اسم المستخدم مستخدم بالفعل' : 'فشل الإنشاء';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

/** PUT /api/admin/users — تعديل مستخدم (تغيير كلمة المرور/الدور) */
export async function PUT(req: NextRequest) {
  let session;
  try { session = await requireAdmin(); } catch { return unauthorized(); }
  if (session.role !== 'ADMIN') return NextResponse.json({ error: 'صلاحيات غير كافية' }, { status: 403 });
  try {
    const { id, email, username, name, role, password } = await req.json();
    const data: Record<string, unknown> = {};
    if (email) data.email = String(email).toLowerCase();
    if (username) data.username = username;
    if (name !== undefined) data.name = name;
    if (role === 'ADMIN' || role === 'EDITOR') data.role = role;
    if (password) {
      if (String(password).length < 8) return NextResponse.json({ error: 'كلمة المرور قصيرة جدًا' }, { status: 400 });
      data.password = await bcrypt.hash(password, 12);
    }
    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, username: true, name: true, role: true },
    });
    await prisma.activityLog.create({
      data: { userId: session.userId, action: 'UPDATE', entity: 'User', entityId: id, details: user.username },
    });
    return NextResponse.json({ user });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'فشل التعديل' }, { status: 500 });
  }
}

/** DELETE /api/admin/users?id=XX — حذف مستخدم */
export async function DELETE(req: NextRequest) {
  let session;
  try { session = await requireAdmin(); } catch { return unauthorized(); }
  if (session.role !== 'ADMIN') return NextResponse.json({ error: 'صلاحيات غير كافية' }, { status: 403 });
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'المعرف مفقود' }, { status: 400 });
  if (id === session.userId) return NextResponse.json({ error: 'لا يمكنك حذف حسابك الحالي' }, { status: 400 });
  try {
    await prisma.user.delete({ where: { id } });
    await prisma.activityLog.create({
      data: { userId: session.userId, action: 'DELETE', entity: 'User', entityId: id },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
  }
}
