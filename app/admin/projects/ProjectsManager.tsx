'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, X, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectRow {
  id: number;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  component: string;
  demoUrl: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  technologies: string; // JSON string
  order: number;
  featured: boolean;
  published: boolean;
}

const EMPTY = {
  titleAr: '', titleEn: '', descriptionAr: '', descriptionEn: '',
  image: '', component: '', demoUrl: '', liveUrl: '', repoUrl: '',
  technologiesText: '', order: 999, featured: false, published: true,
};

type FormState = typeof EMPTY & { id?: number };

export function ProjectsManager({ initialProjects }: { initialProjects: ProjectRow[]; isAdmin: boolean }) {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectRow[]>(initialProjects);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  function openEdit(p?: ProjectRow) {
    if (p) {
      let techs: string[] = [];
      try { techs = JSON.parse(p.technologies); } catch { /* ignore */ }
      setEditing({
        id: p.id, titleAr: p.titleAr, titleEn: p.titleEn,
        descriptionAr: p.descriptionAr, descriptionEn: p.descriptionEn,
        image: p.image, component: p.component,
        demoUrl: p.demoUrl || '', liveUrl: p.liveUrl || '', repoUrl: p.repoUrl || '',
        technologiesText: techs.join(', '), order: p.order,
        featured: p.featured, published: p.published,
      });
    } else {
      setEditing({ ...EMPTY });
    }
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      const payload = {
        ...(editing.id ? { id: editing.id } : {}),
        titleAr: editing.titleAr, titleEn: editing.titleEn,
        descriptionAr: editing.descriptionAr, descriptionEn: editing.descriptionEn,
        image: editing.image, component: editing.component,
        demoUrl: editing.demoUrl || null, liveUrl: editing.liveUrl || null, repoUrl: editing.repoUrl || null,
        technologies: editing.technologiesText.split(',').map((s) => s.trim()).filter(Boolean),
        order: Number(editing.order), featured: editing.featured, published: editing.published,
      };
      const res = await fetch('/api/admin/projects', {
        method: editing.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(editing.id ? 'تم حفظ التعديلات' : 'تم إنشاء المشروع');
      setEditing(null);
      router.refresh();
      // تحديث محلي فوري
      setProjects((prev) => {
        if (editing.id) return prev.map((p) => (p.id === editing.id ? { ...p, ...payload, technologies: JSON.stringify(payload.technologies) } as ProjectRow : p));
        if (data.project) return [...prev, data.project];
        return prev;
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  }

  async function toggle(p: ProjectRow, field: 'featured' | 'published') {
    const next = !p[field];
    setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, [field]: next } : x)));
    const res = await fetch('/api/admin/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, [field]: next }),
    });
    if (!res.ok) { toast.error('فشل التحديث'); router.refresh(); }
  }

  async function remove(id: number) {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع.')) return;
    const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('تم حذف المشروع');
      setProjects((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } else toast.error('فشل الحذف');
  }

  const inputCls = 'w-full px-3 py-2 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المشاريع</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} مشروع في قاعدة البيانات</p>
        </div>
        <button onClick={() => openEdit()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 shadow">
          <Plus className="w-4 h-4" /> مشروع جديد
        </button>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-right px-4 py-3">#</th>
              <th className="text-right px-4 py-3">المشروع</th>
              <th className="text-right px-4 py-3 hidden md:table-cell">التقنيات</th>
              <th className="text-center px-4 py-3">ترتيب</th>
              <th className="text-center px-4 py-3">مميز</th>
              <th className="text-center px-4 py-3">منشور</th>
              <th className="text-center px-4 py-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              let techs: string[] = [];
              try { techs = JSON.parse(p.technologies); } catch { /* */ }
              return (
                <tr key={p.id} className="border-t hover:bg-gray-50/60">
                  <td className="px-4 py-3 text-gray-400">{p.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt="" className="w-12 h-8 object-cover rounded-md bg-gray-100" />
                      ) : (
                        <div className="w-12 h-8 rounded-md bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">بدون</div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{p.titleAr || p.titleEn}</div>
                        <div className="text-xs text-gray-400">{p.component}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {techs.slice(0, 3).map((t) => <span key={t} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs">{t}</span>)}
                      {techs.length > 3 && <span className="text-xs text-gray-400">+{techs.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500">{p.order}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggle(p, 'featured')} title="تمييز">
                      <Star className={`w-4 h-4 mx-auto ${p.featured ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggle(p, 'published')} title="نشر/إخفاء">
                      {p.published ? <Eye className="w-4 h-4 mx-auto text-green-600" /> : <EyeOff className="w-4 h-4 mx-auto text-gray-300" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => remove(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* نافذة التحرير */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-gray-900">{editing.id ? `تعديل المشروع #${editing.id}` : 'مشروع جديد'}</h2>
              <button onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              <div><label className="text-xs text-gray-500 mb-1 block">العنوان (عربي)</label><input className={inputCls} value={editing.titleAr} onChange={(e) => setEditing({ ...editing, titleAr: e.target.value })} /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">العنوان (إنجليزي)</label><input className={inputCls} dir="ltr" value={editing.titleEn} onChange={(e) => setEditing({ ...editing, titleEn: e.target.value })} /></div>
              <div className="md:col-span-2"><label className="text-xs text-gray-500 mb-1 block">الوصف (عربي)</label><textarea rows={2} className={inputCls} value={editing.descriptionAr} onChange={(e) => setEditing({ ...editing, descriptionAr: e.target.value })} /></div>
              <div className="md:col-span-2"><label className="text-xs text-gray-500 mb-1 block">الوصف (إنجليزي)</label><textarea rows={2} dir="ltr" className={inputCls} value={editing.descriptionEn} onChange={(e) => setEditing({ ...editing, descriptionEn: e.target.value })} /></div>
              <div className="md:col-span-2"><label className="text-xs text-gray-500 mb-1 block">رابط الصورة (URL)</label><input dir="ltr" className={inputCls} value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} placeholder="https://..." /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">مكوّن المعاينة (اختياري)</label>
                <select className={inputCls} value={editing.component} onChange={(e) => setEditing({ ...editing, component: e.target.value })}>
                  <option value="">— بدون —</option>
                  {Array.from({ length: 20 }, (_, i) => `Project${i + 1}`).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="text-xs text-gray-500 mb-1 block">ترتيب الظهور</label><input type="number" className={inputCls} value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></div>
              <div className="md:col-span-2"><label className="text-xs text-gray-500 mb-1 block">التقنيات (افصل بينها بفاصلة)</label><input dir="ltr" className={inputCls} value={editing.technologiesText} onChange={(e) => setEditing({ ...editing, technologiesText: e.target.value })} placeholder="React, Next.js, MySQL" /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">رابط Demo</label><input dir="ltr" className={inputCls} value={editing.demoUrl} onChange={(e) => setEditing({ ...editing, demoUrl: e.target.value })} /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">رابط الموقع الحي</label><input dir="ltr" className={inputCls} value={editing.liveUrl} onChange={(e) => setEditing({ ...editing, liveUrl: e.target.value })} /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">رابط المستودع (GitHub)</label><input dir="ltr" className={inputCls} value={editing.repoUrl} onChange={(e) => setEditing({ ...editing, repoUrl: e.target.value })} /></div>
              <div className="flex items-center gap-6 md:col-span-2">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="w-4 h-4 accent-amber-500" /> مشروع مميز</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="w-4 h-4 accent-green-600" /> منشور في الموقع</label>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl border text-sm hover:bg-gray-50">إلغاء</button>
              <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
