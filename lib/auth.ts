import jwt, { SignOptions } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-fallback-secret-2026-stable';
export const AUTH_COOKIE = 'portfolio_admin_token';

export interface TokenPayload {
  userId: string;
  username: string;
  role: string; // ADMIN | EDITOR
}

export function signToken(payload: TokenPayload): string {
  const options: SignOptions = { expiresIn: '7d' };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/** التحقق من جلسة الأدمن (يُستخدم داخل Server Components و Route Handlers) */
export async function getAdminSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  // التأكد أن المستخدم ما زال موجودًا في قاعدة البيانات
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) return null;

  return { userId: user.id, username: user.username, role: user.role };
}

/** يطرح استثناءً إذا لم تكن هناك جلسة صالحة — لحماية كل مسارات /api/admin/* */
export async function requireAdmin(): Promise<TokenPayload> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}
