import { PrismaClient } from '@prisma/client';

// Singleton للـ Prisma Client لتجنب إنشاء اتصالات متعددة أثناء التطوير
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
