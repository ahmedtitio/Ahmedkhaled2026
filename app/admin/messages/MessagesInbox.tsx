'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Mail, MailOpen, Archive, Inbox as InboxIcon } from 'lucide-react';
import { toast } from 'sonner';

interface MsgRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
}

export function MessagesInbox({ initialMessages }: { initialMessages: MsgRow[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState<MsgRow[]>(initialMessages);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [open, setOpen] = useState<string | null>(null);

  const shown = filter === 'unread' ? messages.filter((m) => !m.read && !m.archived) : messages.filter((m) => !m.archived);

  async function patch(id: string, data: Partial<Pick<MsgRow, 'read' | 'archived'>>) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
    const res = await fetch('/api/admin/messages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) { toast.error('فشل التحديث'); router.refresh(); }
  }

  async function remove(id: string) {
    if (!confirm('حذف هذه الرسالة نهائيًا؟')) return;
    const res = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
    if (res.ok) { setMessages((p) => p.filter((m) => m.id !== id)); toast.success('تم الحذف'); }
    else toast.error('فشل الحذف');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><InboxIcon className="w-6 h-6 text-orange-500" /> صندوق الرسائل</h1>
          <p className="text-gray-500 text-sm mt-1">{messages.filter((m) => !m.read && !m.archived).length} رسالة غير مقروءة</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-sm border ${filter === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white'}`}>الكل</button>
          <button onClick={() => setFilter('unread')} className={`px-4 py-2 rounded-xl text-sm border ${filter === 'unread' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white'}`}>غير مقروءة</button>
        </div>
      </div>

      {shown.length === 0 && (
        <div className="bg-white rounded-2xl border p-12 text-center text-gray-400">لا توجد رسائل{filter === 'unread' ? ' غير مقروءة' : ''}.<br />
        <span className="text-xs">تُستقبل هنا رسائل نموذج التواصل في الموقع.</span></div>
      )}

      <div className="space-y-3">
        {shown.map((m) => {
          const isOpen = open === m.id;
          return (
            <div key={m.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${!m.read ? 'border-r-4 border-r-blue-500' : ''}`}>
              <button
                className="w-full flex items-center gap-4 px-5 py-4 text-right hover:bg-gray-50"
                onClick={() => { setOpen(isOpen ? null : m.id); if (!m.read) patch(m.id, { read: true }); }}
              >
                {m.read ? <MailOpen className="w-5 h-5 text-gray-400 shrink-0" /> : <Mail className="w-5 h-5 text-blue-600 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{m.subject || m.message.slice(0, 60)}</div>
                  <div className="text-xs text-gray-500">{m.name} • {m.email}{m.phone ? ` • ${m.phone}` : ''}</div>
                </div>
                <div className="text-xs text-gray-400 shrink-0">{new Date(m.createdAt).toLocaleString('ar-EG')}</div>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 border-t pt-4">
                  <p className="text-gray-700 whitespace-pre-wrap mb-4">{m.message}</p>
                  <div className="flex gap-2">
                    <a href={`mailto:${m.email}`} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100">رد عبر البريد</a>
                    {!m.read && <button onClick={() => patch(m.id, { read: false })} className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs hover:bg-gray-100">تعليم كغير مقروءة</button>}
                    <button onClick={() => patch(m.id, { archived: true })} className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs hover:bg-amber-100 inline-flex items-center gap-1"><Archive className="w-3.5 h-3.5" /> أرشفة</button>
                    <button onClick={() => remove(m.id)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs hover:bg-red-100 inline-flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> حذف</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
