// إنشاء ملف SQLite عند أول تشغيل (postinstall) — آمن للتكرار
// يحل خطأ: Error code 14: Unable to open the database file
import fs from 'fs';
import path from 'path';

try {
  fs.mkdirSync(path.join(process.cwd(), 'prisma'), { recursive: true });
} catch { /* موجود مسبقًا */ }

let raw = '';
try {
  const envFile = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
  const m = envFile.match(/^DATABASE_URL\s*=\s*"?([^"\n]+)"?/m);
  if (m) raw = m[1].trim();
} catch { /* لا يوجد .env */ }
raw = (process.env.DATABASE_URL || raw || '').trim();

const isSqlite = !raw || raw.startsWith('file:') || raw.includes('.db');
if (!isSqlite) {
  console.log('[ensure-db-file] datasource is not SQLite — skipping');
  process.exit(0);
}

let file = raw.replace(/^file:/, '');
if (!file) file = 'dev.db';
if (!path.isAbsolute(file)) file = path.join(process.cwd(), 'prisma', file);

try {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, ''); // ملف فارغ → SQLite يعتبره قاعدة جديدة عند أول اتصال
    console.log('[ensure-db-file] created empty database at', file);
  } else {
    console.log('[ensure-db-file] database file exists:', file);
  }
} catch (e) {
  console.warn('[ensure-db-file] could not create db file:', String(e.message).slice(0, 160));
}
