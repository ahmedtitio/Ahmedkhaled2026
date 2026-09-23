// تحميل ملف .env يدويًا لضمان توفر DATABASE_URL في كل البيئات
// (Next.js يحمّل .env تلقائيًا، لكن بعض الأدوات/البيئات لا تفعل ذلك)
import fs from 'fs';
import path from 'path';

let loaded = false;

export function ensureEnvLoaded(): void {
  if (loaded) return;
  loaded = true;

  try {
    const candidates = [
      path.join(process.cwd(), '.env'),
      path.join(process.cwd(), '..', '.env'),
    ];
    for (const file of candidates) {
      if (!fs.existsSync(file)) continue;
      const content = fs.readFileSync(file, 'utf8');
      for (const rawLine of content.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;
        const eq = line.indexOf('=');
        if (eq === -1) continue;
        const key = line.slice(0, eq).trim();
        let value = line.slice(eq + 1).trim();
        // إزالة علامات الاقتباس إن وجدت
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        // القيم الموجودة مسبقًا (مثل متغيرات Vercel) لها الأولوية
        if (!(key in process.env)) {
          process.env[key] = value;
        }
      }
      break; // نكتفي بأول ملف نجده
    }
  } catch {
    // تجاهل الأخطاء — سنُظهر رسالة أوضح لاحقًا عند الحاجة
  }
}

// ضمان وجود DATABASE_URL بقيمة صالحة بدل الفشل برسالة غامضة
export function getDatabaseUrl(): string {
  ensureEnvLoaded();
  const url = process.env.DATABASE_URL;
  if (url && url.trim().length > 0) return url.trim();
  // Fallback افتراضي لبيئة التطوير المحلية (SQLite)
  const fallback = 'file:' + path.join(process.cwd(), 'prisma', 'dev.db');
  process.env.DATABASE_URL = fallback;
  return fallback;
}
