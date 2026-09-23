import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken, AUTH_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';

/** POST /api/admin/login — تسجيل دخول لوحة الأدمن */
export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'أدخل البريد الإلكتروني وكلمة المرور' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: String(identifier).toLowerCase() }, { username: String(identifier) }],
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    await prisma.activityLog.create({
      data: { userId: user.id, action: 'LOGIN', entity: 'User', entityId: user.id, details: `${user.username} logged in` },
    });

    const token = signToken({ userId: user.id, username: user.username, role: user.role });

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, username: user.username, role: user.role, name: user.name },
    });
    res.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    console.error('login error', e);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}
