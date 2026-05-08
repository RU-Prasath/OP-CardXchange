'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Plus, Eye, EyeOff, Trash2, DollarSign, Gift, ExternalLink, Pencil, Upload, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Template { _id: string; name: string; slug: string; category: string; thumbnail: string; isPublished: boolean; pricingType: 'free' | 'paid'; frontendPath: string; createdAt: string; adminConfig?: { defaultContent?: Record<string, string> }; }

const CATEGORIES = ['developer','designer','photographer','writer','minimal'];
const TEMPLATE_PATHS = ['developer/AuroraTemplate','maren/MarenTemplate','designer/BonjourTemplate'];

const inputCls = "w-full h-10 rounded-xl border border-white/[0.12] bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono";
const textareaCls = "w-full rounded-xl border border-white/[0.12] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono resize-y min-h-[80px]";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', category: 'developer', pricingType: 'free', frontendPath: 'developer/AuroraTemplate', thumbnail: '' });
  const [editDefaultContent, setEditDefaultContent] = useState('');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [thumbUploading, setThumbUploading] = useState(false);
  const thumbRef = useRef<HTMLInputElement>(null);
  const editThumbRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  async function fetchTemplates() {
    setLoading(true);
    const res = await fetch('/api/super-admin/templates');
    const data = await res.json();
    if (data.success) setTemplates(data.data);
    setLoading(false);
  }

  useEffect(() => { fetchTemplates(); }, []);

  async function uploadThumb(file: File, forEdit = false) {
    setThumbUploading(true);
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.success) {
      if (forEdit) setEditingTemplate(t => t ? { ...t, thumbnail: data.url } : t);
      else setForm(f => ({ ...f, thumbnail: data.url }));
    }
    setThumbUploading(false);
  }

  async function createTemplate() {
    if (!form.name || !form.slug) return;
    setSaving(true);
    const res = await fetch('/api/super-admin/templates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (data.success) { toast({ title: 'Template created' }); setCreateOpen(false); setForm({ name: '', slug: '', category: 'developer', pricingType: 'free', frontendPath: 'developer/AuroraTemplate', thumbnail: '' }); fetchTemplates(); }
    else toast({ title: 'Error', description: data.error, variant: 'destructive' });
    setSaving(false);
  }

  function openEdit(t: Template) {
    setEditingTemplate(t);
    try { setEditDefaultContent(JSON.stringify(t.adminConfig?.defaultContent || {}, null, 2)); } catch { setEditDefaultContent('{}'); }
    setEditOpen(true);
  }

  async function saveEdit() {
    if (!editingTemplate) return;
    setSaving(true);
    let defaultContent: Record<string, string> = {};
    try { defaultContent = JSON.parse(editDefaultContent); } catch { toast({ title: 'Invalid JSON', variant: 'destructive' }); setSaving(false); return; }
    const res = await fetch(`/api/super-admin/templates/${editingTemplate._id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingTemplate.name, thumbnail: editingTemplate.thumbnail, frontendPath: editingTemplate.frontendPath, adminConfig: { defaultContent } }),
    });
    const data = await res.json();
    if (data.success) { toast({ title: 'Template updated' }); setEditOpen(false); fetchTemplates(); }
    else toast({ title: 'Error', description: data.error, variant: 'destructive' });
    setSaving(false);
  }

  async function togglePublish(id: string, current: boolean) {
    await fetch(`/api/super-admin/templates/${id}`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ isPublished: !current }) });
    fetchTemplates();
    toast({ title: current ? 'Unpublished' : 'Published' });
  }

  async function togglePricing(id: string, current: 'free' | 'paid') {
    const next = current === 'free' ? 'paid' : 'free';
    await fetch(`/api/super-admin/templates/${id}`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ pricingType: next }) });
    fetchTemplates();
  }

  async function deleteTemplate(id: string) {
    if (!confirm('Delete this template?')) return;
    await fetch(`/api/super-admin/templates/${id}`, { method: 'DELETE' });
    fetchTemplates();
    toast({ title: 'Deleted' });
  }

  const filtered = templates.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Templates</h1>
          <p className="text-sm text-white/40">Manage the template library users can be allocated.</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-grad flex items-center gap-2 px-4 py-2 text-sm">
          <Plus size={14}/> Add template
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"/>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, slug, category…"
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-white/[0.07] bg-white/[0.03] text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-16 text-white/30 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-3 card-panel p-12 text-center text-white/30 text-sm">{templates.length === 0 ? 'No templates yet.' : 'No templates match your search.'}</div>
        ) : filtered.map(t => (
          <div key={t._id} className="card-panel overflow-hidden hover:border-white/[0.12] transition-colors">
            <div className="aspect-[4/3] border-b border-white/[0.07] relative overflow-hidden" style={{background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(168,85,247,0.15))'}}>
              {t.thumbnail ? <img src={t.thumbnail} alt={t.name} className="w-full h-full object-cover"/> :
                <div className="w-full h-full flex items-center justify-center text-white/10 font-mono text-xs">{t.slug}</div>}
              <div className="absolute top-2 left-2 flex gap-1.5">
                <Badge variant={t.isPublished ? 'success' : 'default'}>{t.isPublished ? 'Live' : 'Draft'}</Badge>
                <Badge variant={t.pricingType === 'free' ? 'success' : 'warning'}>{t.pricingType}</Badge>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-[11px] text-white/30 font-mono mt-0.5">{t.category} · {t.slug}</div>
                </div>
              </div>
              <div className="text-[11px] text-white/30 font-mono mb-4">{t.frontendPath}</div>

              <div className="flex gap-1.5 flex-wrap">
                <Link href={`/preview/${t.slug}`} target="_blank" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 transition-all">
                  <ExternalLink size={11}/>Preview
                </Link>
                <button onClick={() => openEdit(t)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-violet-500/20 text-violet-400 hover:bg-violet-500/10 transition-all">
                  <Pencil size={11}/>Edit
                </button>
                <button onClick={() => togglePublish(t._id, t.isPublished)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-all ${t.isPublished ? 'border-red-500/20 text-red-400 hover:bg-red-500/10' : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'}`}>
                  {t.isPublished ? <><EyeOff size={11}/>Unpublish</> : <><Eye size={11}/>Publish</>}
                </button>
                <button onClick={() => togglePricing(t._id, t.pricingType)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-white/[0.07] text-white/50 hover:text-white hover:border-white/[0.15] transition-all">
                  {t.pricingType === 'free' ? <><DollarSign size={11}/>Make paid</> : <><Gift size={11}/>Make free</>}
                </button>
                <button onClick={() => deleteTemplate(t._id)} className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border border-white/[0.07] text-white/20 hover:text-red-400 hover:border-red-500/20 transition-all">
                  <Trash2 size={11}/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add template</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            {/* Thumbnail upload */}
            <div>
              <label className="text-sm text-white/60 mb-1 block">Thumbnail</label>
              <div className="flex items-center gap-3">
                <div onClick={() => thumbRef.current?.click()}
                  className="w-24 h-16 rounded-xl border-2 border-dashed border-white/[0.12] flex items-center justify-center cursor-pointer hover:border-white/25 transition-colors overflow-hidden relative shrink-0">
                  {form.thumbnail ? <img src={form.thumbnail} className="w-full h-full object-cover"/> : <Upload size={16} className="text-white/20"/>}
                </div>
                <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadThumb(f); }}/>
                <div className="flex-1">
                  <input value={form.thumbnail} onChange={e => setForm({...form, thumbnail: e.target.value})} placeholder="Or paste image URL" className={inputCls}/>
                  {thumbUploading && <p className="text-xs text-white/30 mt-1 font-mono">Uploading…</p>}
                </div>
              </div>
            </div>

            {[
              { label: 'Name *', key: 'name', placeholder: 'Maren' },
              { label: 'Slug *', key: 'slug', placeholder: 'maren' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-sm text-white/60 mb-1 block">{f.label}</label>
                <input value={(form as Record<string,string>)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} placeholder={f.placeholder} className={inputCls}/>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-white/60 mb-1 block">Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-10 rounded-xl border border-white/[0.12] bg-[#11151F] px-3 text-sm text-white/70 focus:outline-none">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">Pricing</label>
                <select value={form.pricingType} onChange={e => setForm({...form, pricingType: e.target.value})} className="w-full h-10 rounded-xl border border-white/[0.12] bg-[#11151F] px-3 text-sm text-white/70 focus:outline-none">
                  <option value="free">Free</option><option value="paid">Paid</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1 block">Frontend component path</label>
              <select value={form.frontendPath} onChange={e => setForm({...form, frontendPath: e.target.value})} className="w-full h-10 rounded-xl border border-white/[0.12] bg-[#11151F] px-3 text-sm text-white/70 focus:outline-none">
                {TEMPLATE_PATHS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter className="mt-4 flex gap-2">
            <button onClick={() => setCreateOpen(false)} className="btn-secondary-ff flex-1 py-2.5 text-sm">Cancel</button>
            <button onClick={createTemplate} disabled={!form.name || !form.slug || saving} className="btn-grad flex-1 py-2.5 text-sm disabled:opacity-50">
              {saving ? 'Creating…' : 'Create template'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit template — {editingTemplate?.name}</DialogTitle></DialogHeader>
          {editingTemplate && (
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm text-white/60 mb-1 block">Name</label>
                <input value={editingTemplate.name} onChange={e => setEditingTemplate(t => t ? { ...t, name: e.target.value } : t)} className={inputCls}/>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">Thumbnail</label>
                <div className="flex items-center gap-3">
                  <div onClick={() => editThumbRef.current?.click()}
                    className="w-24 h-16 rounded-xl border-2 border-dashed border-white/[0.12] flex items-center justify-center cursor-pointer hover:border-white/25 transition-colors overflow-hidden shrink-0">
                    {editingTemplate.thumbnail ? <img src={editingTemplate.thumbnail} className="w-full h-full object-cover"/> : <Upload size={16} className="text-white/20"/>}
                  </div>
                  <input ref={editThumbRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadThumb(f, true); }}/>
                  <input value={editingTemplate.thumbnail} onChange={e => setEditingTemplate(t => t ? { ...t, thumbnail: e.target.value } : t)} placeholder="Image URL" className={`${inputCls} flex-1`}/>
                </div>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">Frontend path</label>
                <select value={editingTemplate.frontendPath} onChange={e => setEditingTemplate(t => t ? { ...t, frontendPath: e.target.value } : t)} className="w-full h-10 rounded-xl border border-white/[0.12] bg-[#11151F] px-3 text-sm text-white/70 focus:outline-none">
                  {TEMPLATE_PATHS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">Default Content (JSON)</label>
                <p className="text-xs text-white/30 mb-2 font-mono">This content is shown on the preview page and used as default for new users.</p>
                <textarea
                  value={editDefaultContent}
                  onChange={e => setEditDefaultContent(e.target.value)}
                  rows={16}
                  className={textareaCls}
                  spellCheck={false}
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-4 flex gap-2">
            <button onClick={() => setEditOpen(false)} className="btn-secondary-ff flex-1 py-2.5 text-sm">Cancel</button>
            <button onClick={saveEdit} disabled={saving} className="btn-grad flex-1 py-2.5 text-sm disabled:opacity-50">
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
