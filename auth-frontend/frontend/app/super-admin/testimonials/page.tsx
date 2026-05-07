'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Testimonial { _id: string; quote: string; name: string; role: string; gradient: string; order: number; isVisible: boolean; }

const GRADIENTS = ['from-pink-400 to-pink-500','from-emerald-400 to-teal-500','from-amber-400 to-orange-500','from-indigo-400 to-violet-500','from-cyan-400 to-indigo-500','from-red-400 to-orange-500','from-blue-400 to-cyan-500','from-violet-400 to-purple-500'];
const emptyT = (): Omit<Testimonial,'_id'> => ({ quote:'', name:'', role:'', gradient: GRADIENTS[0], order:99, isVisible:true });

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function load() {
    const res = await fetch('/api/super-admin/testimonials');
    const d = await res.json();
    if (d.success) setItems(d.data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing) return;
    setSaving(true);
    const method = isNew ? 'POST' : 'PATCH';
    const url = isNew ? '/api/super-admin/testimonials' : `/api/super-admin/testimonials/${editing._id}`;
    const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(editing) });
    const d = await res.json();
    if (d.success) { toast({ title: isNew ? 'Testimonial added' : 'Saved' }); setEditing(null); load(); }
    else toast({ title:'Error', description: d.error, variant:'destructive' });
    setSaving(false);
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    await fetch(`/api/super-admin/testimonials/${id}`, { method:'DELETE' });
    toast({ title: 'Deleted' });
    load();
  }

  async function toggle(t: Testimonial) {
    await fetch(`/api/super-admin/testimonials/${t._id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ isVisible: !t.isVisible }) });
    load();
  }

  const inp = 'w-full h-9 rounded-lg border border-white/[0.12] bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500';

  if (editing) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setEditing(null)} className="text-sm text-white/40 hover:text-white transition-colors">← Back</button>
          <h1 className="text-xl font-bold">{isNew ? 'New testimonial' : 'Edit testimonial'}</h1>
        </div>
        <div className="space-y-4 card-panel p-6">
          <div>
            <label className="text-xs text-white/50 mb-1 block">Quote (use &lt;b&gt;bold text&lt;/b&gt; to highlight)</label>
            <textarea value={editing.quote} onChange={e => setEditing({...editing,quote:e.target.value})} rows={4}
              className="w-full rounded-lg border border-white/[0.12] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/50 mb-1 block">Name</label>
              <input value={editing.name} onChange={e => setEditing({...editing,name:e.target.value})} className={inp}/>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Role</label>
              <input value={editing.role} onChange={e => setEditing({...editing,role:e.target.value})} placeholder="eng · company" className={inp}/>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Display order</label>
              <input type="number" value={editing.order} onChange={e => setEditing({...editing,order:+e.target.value})} className={inp}/>
            </div>
          </div>
          <div>
            <label className="text-xs text-white/50 mb-2 block">Avatar gradient</label>
            <div className="flex gap-2 flex-wrap">
              {GRADIENTS.map(g => (
                <button key={g} onClick={() => setEditing({...editing,gradient:g})}
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${g} transition-all ${editing.gradient===g ? 'ring-2 ring-white ring-offset-2 ring-offset-[#11151F]' : 'opacity-60 hover:opacity-100'}`}/>
              ))}
            </div>
          </div>
          {editing.quote && editing.name && (
            <div className="card-panel p-4 rounded-xl">
              <p className="text-sm text-white mb-3" dangerouslySetInnerHTML={{__html: editing.quote.replace(/<b>(.*?)<\/b>/g,'<span class="text-cyan-400 font-semibold">$1</span>')}}/>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${editing.gradient}`}/>
                <div><div className="text-sm font-semibold">{editing.name}</div><div className="text-xs text-white/30">{editing.role}</div></div>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={() => setEditing(null)} className="btn-secondary-ff flex-1 py-2.5 text-sm">Cancel</button>
          <button onClick={save} disabled={!editing.quote||!editing.name||saving} className="btn-grad flex-1 py-2.5 text-sm disabled:opacity-50">{saving?'Saving…':'Save'}</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Testimonials</h1>
          <p className="text-sm text-white/40">Manage testimonials shown on the landing page.</p>
        </div>
        <button onClick={() => { setEditing(emptyT() as Testimonial); setIsNew(true); }} className="btn-grad flex items-center gap-2 px-4 py-2 text-sm">
          <Plus size={14}/> Add testimonial
        </button>
      </div>

      {loading ? <div className="text-center py-16 text-white/30 text-sm">Loading…</div> : (
        <div className="space-y-3">
          {items.map(t => (
            <div key={t._id} className="card-panel p-4 flex items-start gap-4">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} shrink-0`}/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm">{t.name}</span>
                  <span className="text-xs text-white/30 font-mono">{t.role}</span>
                  {!t.isVisible && <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.1] text-white/30">Hidden</span>}
                </div>
                <p className="text-sm text-white/50 line-clamp-2" dangerouslySetInnerHTML={{__html: t.quote.replace(/<\/?b>/g,'')}}/>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => toggle(t)} className="p-2 rounded-lg border border-white/[0.07] text-white/40 hover:text-white transition-all">
                  {t.isVisible ? <Eye size={14}/> : <EyeOff size={14}/>}
                </button>
                <button onClick={() => { setEditing({...t}); setIsNew(false); }} className="px-3 py-1.5 rounded-lg border border-white/[0.07] text-sm text-white/50 hover:text-white transition-all">Edit</button>
                <button onClick={() => deleteItem(t._id)} className="p-2 rounded-lg border border-white/[0.07] text-white/20 hover:text-red-400 hover:border-red-500/20 transition-all"><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
