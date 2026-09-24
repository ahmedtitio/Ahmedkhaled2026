import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
import { ensureEnvLoaded } from './load-env';
import { resolveSqliteUrl, isSqliteUrl } from './db-driver';

// تأكد من تحميل .env قبل إنشاء العميل (يحل خطأ: Environment variable not found: DATABASE_URL)
ensureEnvLoaded();

const url = resolveSqliteUrl();
process.env.DATABASE_URL = url;

// require حقيقي عبر createRequire — لا يحوّله bundler إلى import ثابت (يتفادى أخطاء collect page data)
const nodeRequire = createRequire(path.join(process.cwd(), 'noop.js'));

/** تجهيز ملف SQLite في المسار الهدف:
 *  1) نسخة من الملف المرفوع مع البناء إن وُجد (بيانات البذر الأولية)
 *  2) أو إنشاء ملف فارغ — SQLite يعتبره قاعدة جديدة (يحل Error code 14)
 *  3) التأكد أن الملف قابل للكتابة (Vercel يسمح بالكتابة في /tmp فقط)
 */
function ensureTmpDb(targetFile: string): void {
  try {
    fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    if (!fs.existsSync(targetFile)) {
      const bundled = path.join(process.cwd(), 'prisma', path.basename(targetFile));
      if (bundled !== targetFile && fs.existsSync(bundled)) {
        fs.copyFileSync(bundled, targetFile);
      } else {
        fs.writeFileSync(targetFile, ''); // ملف فارغ → SQLite ينشئ قاعدة جديدة تلقائيًا
      }
    }
    fs.accessSync(targetFile, fs.constants.R_OK | fs.constants.W_OK);
  } catch {
    /* مسار غير قابل للكتابة — نحتفظ بمسار نسبي داخل prisma بدلًا منه */
  }
}

function createClient(): PrismaClient {
  if (isSqliteUrl(url)) {
    // SQLite عبر driver adapter (libsql) — يعمل بدون Native Binaries على Serverless
    const file = url.replace(/^file:/, '');
    ensureTmpDb(file);
    // التأكد أن الدليل الأب موجود (يحل Error code 14: Unable to open the database file)
    try { fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true }); } catch { /* ignore */ }
    // PrismaBetterSqlite3 (v7) يعمل مع @prisma/client v6 عبر واجهة driver-adapter المستقرة.
    // بديل موثوق لـ adapter-libsql الذي يفشل بـ "Error code 14" مع Prisma 6.19.3.
    const { PrismaBetterSqlite3 } = nodeRequire('@prisma/adapter-better-sqlite3');
    return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: 'file:' + file }) } as any);
  }
  // PostgreSQL / MySQL — يتصل Prisma مباشرة عبر DATABASE_URL
  return new PrismaClient({ datasources: { db: { url } } });
}

// Singleton للـ Prisma Client لتجنب إنشاء اتصالات متعددة أثناء التطوير
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; prismaInit?: Promise<void> };

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// تهيئة تلقائية (إنشاء الجداول + مستخدم الأدمن) عند أول استخدام — مهمة على Vercel/tmp
if (!globalForPrisma.prismaInit) {
  globalForPrisma.prismaInit = import('./auto-init-db')
    .then(({ autoInitDatabase }) => autoInitDatabase(prisma))
    .catch((e) => console.warn('[prisma] auto-init failed:', String((e as Error).message).slice(0, 160)));
}
/** انتظر اكتمال التهيئة قبل أي استعلام حساس (يُستخدم في مسار تسجيل الدخول) */
export function ready(): Promise<void> {
  return globalForPrisma.prismaInit ?? Promise.resolve();
}

export default prisma;
