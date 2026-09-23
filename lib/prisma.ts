import { PrismaClient } from '@prisma/client';
import { ensureEnvLoaded } from './load-env';

// تأكد من تحميل .env قبل إنشاء العميل (يحل خطأ: Environment variable not found: DATABASE_URL)
ensureEnvLoaded();

// Singleton للـ Prisma Client لتجنب إنشاء اتصالات متعددة أثناء التطوير
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
