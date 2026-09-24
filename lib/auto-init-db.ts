/**
 * تهيئة تلقائية عند الإقلاع (يُستدعى من lib/prisma.ts)
 * يحل خطأ: Unable to open the database file / الجداول غير موجودة على Vercel
 * لأنه في كل مرة تُنشأ فيها قاعدة SQLite جديدة في /tmp تكون فارغة تمامًا.
 * ملاحظة: أسماء الحقول مطابقة لـ prisma migrate diff (المُولّد من schema.prisma).
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function autoInitDatabase(prisma: PrismaClient): Promise<void> {
  // 1) إنشاء الجداول إن لم تكن موجودة (آمن للتكرار)
  try {
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL, "username" TEXT NOT NULL, "password" TEXT NOT NULL, "role" TEXT NOT NULL DEFAULT 'ADMIN', "name" TEXT, "lastLogin" DATETIME, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL)`
    );
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username")`);
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "Project" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "titleAr" TEXT NOT NULL, "titleEn" TEXT NOT NULL, "descriptionAr" TEXT NOT NULL, "descriptionEn" TEXT NOT NULL, "image" TEXT NOT NULL, "component" TEXT NOT NULL DEFAULT '', "demoUrl" TEXT, "liveUrl" TEXT, "repoUrl" TEXT, "technologies" TEXT NOT NULL, "order" INTEGER NOT NULL DEFAULT 0, "featured" BOOLEAN NOT NULL DEFAULT false, "published" BOOLEAN NOT NULL DEFAULT true, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL)`
    );
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "Skill" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "name" TEXT NOT NULL, "percentage" INTEGER NOT NULL DEFAULT 50, "icon" TEXT NOT NULL DEFAULT 'code', "category" TEXT NOT NULL, "order" INTEGER NOT NULL DEFAULT 0, "published" BOOLEAN NOT NULL DEFAULT true, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL)`
    );
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "SiteSetting" ("key" TEXT NOT NULL PRIMARY KEY, "value" TEXT NOT NULL, "type" TEXT NOT NULL DEFAULT 'string', "updatedAt" DATETIME NOT NULL)`
    );
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "ContactMessage" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "phone" TEXT, "subject" TEXT, "message" TEXT NOT NULL, "read" BOOLEAN NOT NULL DEFAULT false, "archived" BOOLEAN NOT NULL DEFAULT false, "ip" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "PageView" ("id" TEXT NOT NULL PRIMARY KEY, "path" TEXT NOT NULL, "referrer" TEXT, "userAgent" TEXT, "ip" TEXT, "country" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "PageView_path_idx" ON "PageView"("path")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView"("createdAt")`);
    await prisma.$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "ActivityLog" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT, "action" TEXT NOT NULL, "entity" TEXT NOT NULL, "entityId" TEXT, "details" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt")`);
  } catch (e) {
    console.warn('[auto-init] could not create tables:', String((e as Error).message).slice(0, 160));
    return;
  }

  // 2) إنشاء مستخدم الأدمن الافتراضي إذا لم يكن هناك أي مستخدم
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
      const hashed = await bcrypt.hash(adminPassword, 12);
      await prisma.user.create({
        data: { email: adminEmail, username: 'admin', password: hashed, role: 'ADMIN', name: 'Administrator' },
      });
      console.log(`[auto-init] ✔ Admin user created: ${adminEmail}`);
    }
  } catch (e) {
    console.warn('[auto-init] admin user check failed:', String((e as Error).message).slice(0, 160));
  }
}

