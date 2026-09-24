import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json({ error: 'غير مصرح — سجّل الدخول أولاً' }, { status: 401 });
}

/** GET /api/admin/projects — قائمة كل المشاريع (بما فيها غير المنشورة) */
export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return unauthorized();
  }
  const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json({ projects });
}

/** POST /api/admin/projects — إنشاء مشروع جديد */
export async function POST(req: NextRequest) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return unauthorized();
  }
  try {
    const body = await req.json();
    const project = await prisma.project.create({
      data: {
        titleAr: body.titleAr || '',
        titleEn: body.titleEn || '',
        descriptionAr: body.descriptionAr || '',
        descriptionEn: body.descriptionEn || '',
        image: body.image || '',
        component: body.component || '',
        demoUrl: body.demoUrl || null,
        liveUrl: body.liveUrl || null,
        repoUrl: body.repoUrl || null,
        technologies: JSON.stringify(body.technologies || []),
        order: body.order ?? 999,
        featured: !!body.featured,
        published: body.published !== false,
      },
    });
    await prisma.activityLog.create({
      data: { userId: session.userId, action: 'CREATE', entity: 'Project', entityId: String(project.id), details: project.titleAr },
    });
    return NextResponse.json({ project }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'فشل إنشاء المشروع' }, { status: 500 });
  }
}

/** PUT /api/admin/projects — تعديل مشروع (id في الجسم) */
export async function PUT(req: NextRequest) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return unauthorized();
  }
  try {
    const { id, ...body } = await req.json();
    if (!id) return NextResponse.json({ error: 'المعرف مفقود' }, { status: 400 });

    const data: Record<string, unknown> = {};
    const strFields = ['titleAr', 'titleEn', 'descriptionAr', 'descriptionEn', 'image', 'component', 'demoUrl', 'liveUrl', 'repoUrl'];
    for (const f of strFields) if (f in body) data[f] = body[f];
    if ('technologies' in body) data.technologies = JSON.stringify(body.technologies);
    if ('order' in body) data.order = Number(body.order);
    if ('featured' in body) data.featured = !!body.featured;
    if ('published' in body) data.published = !!body.published;

    const project = await prisma.project.update({ where: { id: Number(id) }, data });
    await prisma.activityLog.create({
      data: { userId: session.userId, action: 'UPDATE', entity: 'Project', entityId: String(id), details: 'updated fields: ' + Object.keys(data).join(',') },
    });
    return NextResponse.json({ project });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'فشل تعديل المشروع' }, { status: 500 });
  }
}

/** DELETE /api/admin/projects?id=NN — حذف مشروع */
export async function DELETE(req: NextRequest) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    return unauthorized();
  }
  const id = Number(req.nextUrl.searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'المعرف مفقود' }, { status: 400 });
  try {
    await prisma.project.delete({ where: { id } });
    await prisma.activityLog.create({
      data: { userId: session.userId, action: 'DELETE', entity: 'Project', entityId: String(id) },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'المشروع غير موجود' }, { status: 404 });
  }
}
