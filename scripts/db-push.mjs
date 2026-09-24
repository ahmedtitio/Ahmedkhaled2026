// تهيئة قاعدة البيانات تلقائيًا عند البناء (postinstall) — آمن للتكرار
import { execSync } from 'child_process';
try {
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
  console.log('[db-push] schema applied OK');
} catch (e) {
  console.warn('[db-push] could not initialize database:', String(e.message).slice(0, 200));
}
