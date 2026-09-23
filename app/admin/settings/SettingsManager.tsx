'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, Globe, Smartphone, Share2, Wrench } from 'lucide-react';
import { toast } from 'sonner';

const GROUPS = [
  {
    title: 'معلومات الموقع',
    icon: Globe,
    fields: [
      { key: 'siteTitle', label: 'عنوان الموقع (عربي)' },
      { key: 'siteTitleEn', label: 'عنوان الموقع (إنجليزي)', ltr: true },
      { key: 'emailContact', label: 'بريد التواصل', ltr: true },
    ],
  },
  {
    title: 'القسم الرئيسي (Hero)',
    icon: Smartphone,
    fields: [
      { key: 'heroTitleAr', label: 'العنوان الرئيسي (عربي)' },
      { key: 'heroTitleEn', label: 'العنوان الرئيسي (إنجليزي)', ltr: true },
      { key: 'heroSubtitleAr', label: 'الوصف الفرعي (عربي)' },
      { key: 'heroSubtitleEn', label: 'الوصف الفرعي (إنجليزي)', ltr: true },
    ],
  },
  {
    title: 'التواصل الاجتماعي والواتساب',
    icon: Share2,
    fields: [
      { key: 'whatsappNumber', label: 'رقم الواتساب (بدون +)', ltr: true },
      { key: 'socialFacebook', label: 'Facebook URL', ltr: true },
      { key: 'socialGithub', label: 'GitHub URL', ltr: true },
      { key: 'socialLinkedin', label: 'LinkedIn URL', ltr: true },
      { key: 'socialTwitter', label: 'Twitter/X URL', ltr: true },
      { key: 'socialInstagram', label: 'Instagram URL', ltr: true },
    ],
  },
];

export function SettingsManager({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(initialSettings);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('تم حفظ الإعدادات');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'فشل الحفظ');
    } finally {
      setSaving(false);
    }
  }

  async function toggleMaintenance() {
    const next = values.maintenanceMode === 'true' ? 'false' : 'true';
    setValues((v) => ({ ...v, maintenanceMode: next }));
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maintenanceMode: next }),
    });
    toast.success(next === 'true' ? 'تم تفعيل وضع الصيانة' : 'تم إيقاف وضع الصيانة');
  }

  const inputCls = 'w-full px-3 py-2.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إعدادات الموقع</h1>
          <p className="text-gray-500 text-sm mt-1">تُحفظ مباشرة في قاعدة البيانات وتطبّق على الواجهة</p>
        </div>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 shadow">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} حفظ التغييرات
        </button>
      </div>

      {/* وضع الصيانة */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100"><Wrench className="w-5 h-5 text-amber-600" /></div>
          <div>
            <div className="font-bold text-gray-900">وضع الصيانة</div>
            <div className="text-xs text-gray-500">إظهار صفحة صيانة للزوار بدل الموقع (لوحة الأدمن تعمل كالمعتاد)</div>
          </div>
        </div>
        <button
          onClick={toggleMaintenance}
          className={`relative w-14 h-7 rounded-full transition ${values.maintenanceMode === 'true' ? 'bg-amber-500' : 'bg-gray-200'}`}
        >
          <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${values.maintenanceMode === 'true' ? 'right-1' : 'right-8'}`} />
        </button>
      </div>

      {GROUPS.map((g) => (
        <div key={g.title} className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <g.icon className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900">{g.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {g.fields.map((f) => (
              <div key={f.key} className={f.key.startsWith('hero') || f.key.startsWith('social') ? '' : ''}>
                <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
                <input
                  dir={f.ltr ? 'ltr' : undefined}
                  className={inputCls}
                  value={values[f.key] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
