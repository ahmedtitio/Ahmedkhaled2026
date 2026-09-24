'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, X, Loader2, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface SkillRow {
  id: number;
  name: string;
  percentage: number;
  icon: string;
  category: string;
  order: number;
  published: boolean;
}

const CATEGORIES = [
  { value: 'frontend', label: 'واجهات أمامية' },
  { value: 'backend', label: 'خوادم (Backend)' },
  { value: 'tools', label: 'أدوات' },
  { value: 'design', label: 'تصميم' },
];

const EMPTY = { name: '', percentage: 80, icon: 'code', category: 'frontend', order: 999, published: true };
type FormState = typeof EMPTY & { id?: number };

export function SkillsManager({ initialSkills }: { initialSkills: SkillRow[] }) {
  const router = useRouter();
  const [skills, setSkills] = useState<SkillRow[]>(initialSkills);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!editing) return;
    if (!editing.name.trim()) { toast.error('اسم المهارة مطلوب'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/skills', {
        method: editing.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(editing.id ? 'تم الحفظ' : 'تمت الإضافة');
      setEditing(null);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(s: SkillRow) {
    setSkills((prev) => prev.map((x) => (x.id === s.id ? { ...x, published: !x.published } : x)));
    const res = await fetch('/api/admin/skills', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: s.id, published: !s.published }),
    });
    if (!res.ok) { toast.error('فشل التحديث'); router.refresh(); }
  }

  async function remove(id: number) {
    if (!confirm('حذف هذه المهارة؟')) return;
    const res = await fetch(`/api/admin/skills?id=${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('تم الحذف'); setSkills((p) => p.filter((s) => s.id !== id)); router.refresh(); }
    else toast.error('فشل الحذف');
  }

  const inputCls = 'w-full px-3 py-2 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المهارات</h1>
          <p className="text-gray-500 text-sm mt-1">{skills.length} مهارة — تظهر في قسم المهارات بالواجهة</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 shadow">
          <Plus className="w-4 h-4" /> مهارة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((s) => (
          <div key={s.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${!s.published ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-bold text-gray-900">{s.name}</div>
                <div className="text-xs text-gray-400">{CATEGORIES.find((c) => c.value === s.category)?.label || s.category} • ترتيب {s.order}</div>
              </div>
              <span className="text-lg font-bold text-blue-600">{s.percentage}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${s.percentage}%` }} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing({ ...s })} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100"><Pencil className="w-3.5 h-3.5" /> تعديل</button>
              <button onClick={() => togglePublish(s)} className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100" title="نشر/إخفاء">
                {s.published ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
              </button>
              <button onClick={() => remove(s.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold">{editing.id ? 'تعديل المهارة' : 'مهارة جديدة'}</h2>
              <button onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="text-xs text-gray-500 mb-1 block">الاسم</label><input className={inputCls} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">النسبة المئوية: {editing.percentage}%</label>
                <input type="range" min={0} max={100} value={editing.percentage} onChange={(e) => setEditing({ ...editing, percentage: Number(e.target.value) })} className="w-full accent-blue-600" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-gray-500 mb-1 block">الفئة</label>
                  <select className={inputCls} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div><label className="text-xs text-gray-500 mb-1 block">الترتيب</label><input type="number" className={inputCls} value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></div>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="w-4 h-4 accent-green-600" /> منشورة</label>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl border text-sm hover:bg-gray-50">إلغاء</button>
              <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
