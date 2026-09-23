import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

function unauthorized() {
  return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
}

/** GET /api/admin/settings — كل إعدادات الموقع */
export async function GET() {
  try { await requireAdmin(); } catch { return unauthorized(); }
  const settings = await prisma.siteSetting.findMany();
  return NextResponse.json({ settings });
}

/** PUT /api/admin/settings — تحديث مجموعة إعدادات {key:value,...} */
export async function PUT(req: NextRequest) {
  let session;
  try { session = await requireAdmin(); } catch { return unauthorized(); }
  try {
    const body = await req.json(); // { key: value, ... }
    const entries = Object.entries(body as Record<string, string>);
    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      )
    );
    await prisma.activityLog.create({
      data: { userId: session.userId, action: 'UPDATE', entity: 'Setting', details: entries.map(([k]) => k).join(',') },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'فشل الحفظ' }, { status: 500 });
  }
}
