// طبقة تحديد مصدر البيانات — تعمل محليًا وعلى Vercel Serverless بدون إعداد يدوي
import path from 'path';
import { ensureEnvLoaded } from './load-env';

ensureEnvLoaded();

export function isSqliteUrl(url: string): boolean {
  return url.startsWith('file:') || url.includes('.db');
}

/** تحويل مسار SQLite النسبي إلى مطلق (مجلد prisma) حتى لا يعتمد على cwd الخاص بالسيرفر */
export function resolveSqliteUrl(): string {
  const raw = (process.env.DATABASE_URL || '').trim();
  if (!raw || isSqliteUrl(raw)) {
    let file = raw.replace(/^file:/, '');
    if (!file) file = path.join(process.cwd(), 'prisma', 'dev.db');
    else if (!path.isAbsolute(file)) file = path.join(process.cwd(), 'prisma', file);
    // مجلدات Vercel المؤقتة — نكتب داخل /tmp لأنه الوحيد القابل للكتابة
    if (process.env.VERCEL === '1' && !file.startsWith('/tmp')) {
      file = path.join('/tmp', 'portfolio', path.basename(file));
    }
    return 'file:' + file;
  }
  return raw; // postgresql:// أو mysql:// كما هي
}
