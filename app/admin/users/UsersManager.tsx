'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, KeyRound, X, Loader2, ShieldCheck, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

interface UserRow {
  id: string;
  email: string;
  username: string;
  name: string | null;
  role: string;
  lastLogin: string | null;
  createdAt: string;
}

const EMPTY = { email: '', username: '', name: '', password: '', role: 'EDITOR' };

export function UsersManager({ initialUsers, currentUserId, isAdmin }: { initialUsers: UserRow[]; currentUserId: string; isAdmin: boolean }) {
  const router = useRouter();
  const [users] = useState<UserRow[]>(initialUsers);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [pwFor, setPwFor] = useState<string | null>(null);
  const [newPw, setNewPw] = useState('');

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-2xl border p-12 text-center text-gray-500">
        <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        إدارة المستخدمين متاحة لحساب المدير العام فقط.
      </div>
    );
  }

  async function addUser() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('تمت إضافة المستخدم');
      setAdding(false); setForm(EMPTY); router.refresh();
    } catch (e) { toast.error(e instanceof Error ? e.message : 'فشل الإضافة'); }
    finally { setSaving(false); }
  }

  async function changePassword(id: string) {
    if (newPw.length < 8) { toast.error('كلمة المرور يجب ألا تقل عن 8 أحرف'); return; }
    const res = await fetch('/api/admin/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, password: newPw }) });
    if (res.ok) { toast.success('تم تغيير كلمة المرور'); setPwFor(null); setNewPw(''); }
    else toast.error('فشل التغيير');
  }

  async function toggleRole(u: UserRow) {
    const role = u.role === 'ADMIN' ? 'EDITOR' : 'ADMIN';
    const res = await fetch('/api/admin/users', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: u.id, role }) });
    if (res.ok) { toast.success(`تم تغيير الدور إلى ${role}`); router.refresh(); }
    else toast.error('فشل التغيير');
  }

  async function remove(id: string) {
    if (!confirm('حذف هذا المستخدم نهائيًا؟')) return;
    const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) { toast.success('تم الحذف'); router.refresh(); }
    else toast.error(data.error || 'فشل الحذف');
  }

  const inputCls = 'w-full px-3 py-2 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <p className="text-gray-500 text-sm mt-1">حسابات الوصول إلى لوحة التحكم</p>
        </div>
        <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow hover:opacity-90">
          <Plus className="w-4 h-4" /> مستخدم جديد
        </button>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-right px-4 py-3">المستخدم</th>
              <th className="text-right px-4 py-3 hidden md:table-cell">البريد</th>
              <th className="text-center px-4 py-3">الدور</th>
              <th className="text-right px-4 py-3 hidden lg:table-cell">آخر دخول</th>
              <th className="text-center px-4 py-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white"><UserIcon className="w-4 h-4" /></div>
                    <div><div className="font-medium">{u.username}</div><div className="text-xs text-gray-400">{u.name || ''}</div></div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-500" dir="ltr">{u.email}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleRole(u)} title="تبديل الدور">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role === 'ADMIN' ? 'مدير عام' : 'محرر'}
                    </span>
                  </button>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-gray-400 text-xs">{u.lastLogin ? new Date(u.lastLogin).toLocaleString('ar-EG') : '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => setPwFor(u.id)} className="p-2 rounded-lg hover:bg-amber-50 text-amber-600" title="تغيير كلمة المرور"><KeyRound className="w-4 h-4" /></button>
                    {u.id !== currentUserId && (
                      <button onClick={() => remove(u.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نافذة إضافة مستخدم */}
      {adding && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setAdding(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold">مستخدم جديد</h2>
              <button onClick={() => setAdding(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-3">
              <input className={inputCls} placeholder="اسم المستخدم" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              <input className={inputCls} dir="ltr" placeholder="البريد الإلكتروني" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className={inputCls} placeholder="الاسم الكامل (اختياري)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className={inputCls} dir="ltr" type="password" placeholder="كلمة المرور (8 أحرف فأكثر)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <select className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="EDITOR">محرر (EDITOR)</option>
                <option value="ADMIN">مدير عام (ADMIN)</option>
              </select>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button onClick={() => setAdding(false)} className="px-4 py-2 rounded-xl border text-sm">إلغاء</button>
              <button onClick={addUser} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold disabled:opacity-50">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} إضافة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تغيير كلمة المرور */}
      {pwFor && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setPwFor(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold mb-4">كلمة مرور جديدة</h2>
            <input type="password" dir="ltr" className={inputCls} placeholder="8 أحرف فأكثر" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setPwFor(null)} className="px-4 py-2 rounded-xl border text-sm">إلغاء</button>
              <button onClick={() => changePassword(pwFor)} className="px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold">تغيير</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
