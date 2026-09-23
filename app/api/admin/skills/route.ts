import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
}

/** GET /api/admin/skills */
export async function GET() {
  try { await requireAdmin(); } catch { return unauthorized(); }
  const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ skills });
}

/** POST /api/admin/skills — مهارة جديدة */
export async function POST(req: NextRequest) {
  let session;
  try { session = await requireAdmin(); } catch { return unauthorized(); }
  try {
    const b = await req.json();
    const skill = await prisma.skill.create({
      data: {
        name: b.name || '',
        percentage: Number(b.percentage) || 50,
        icon: b.icon || 'code',
        category: b.category || 'frontend',
        order: Number(b.order) ?? 999,
        published: b.published !== false,
      },
    });
    await prisma.activityLog.create({
      data: { userId: session.userId, action: 'CREATE', entity: 'Skill', entityId: String(skill.id), details: skill.name },
    });
    return NextResponse.json({ skill }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'فشل الإنشاء' }, { status: 500 });
  }
}

/** PUT /api/admin/skills — تعديل مهارة */
export async function PUT(req: NextRequest) {
  let session;
  try { session = await requireAdmin(); } catch { return unauthorized(); }
  try {
    const { id, ...b } = await req.json();
    const skill = await prisma.skill.update({
      where: { id: Number(id) },
      data: {
        ...(b.name !== undefined && { name: b.name }),
        ...(b.percentage !== undefined && { percentage: Number(b.percentage) }),
        ...(b.icon !== undefined && { icon: b.icon }),
        ...(b.category !== undefined && { category: b.category }),
        ...(b.order !== undefined && { order: Number(b.order) }),
        ...(b.published !== undefined && { published: !!b.published }),
      },
    });
    await prisma.activityLog.create({
      data: { userId: session.userId, action: 'UPDATE', entity: 'Skill', entityId: String(id), details: skill.name },
    });
    return NextResponse.json({ skill });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'فشل التعديل' }, { status: 500 });
  }
}

/** DELETE /api/admin/skills?id=NN */
export async function DELETE(req: NextRequest) {
  let session;
  try { session = await requireAdmin(); } catch { return unauthorized(); }
  const id = Number(req.nextUrl.searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'المعرف مفقود' }, { status: 400 });
  try {
    await prisma.skill.delete({ where: { id } });
    await prisma.activityLog.create({
      data: { userId: session.userId, action: 'DELETE', entity: 'Skill', entityId: String(id) },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
  }
}
