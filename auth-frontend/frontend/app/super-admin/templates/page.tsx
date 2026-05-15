'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Eye, EyeOff, Trash2, DollarSign, Gift, ExternalLink, Pencil, Upload, Search, Filter, X, LayoutGrid, List, ArrowUpDown, SlidersHorizontal, Code2, Palette, CheckCircle2, Circle, Briefcase, GraduationCap, TrendingUp, Video, Building2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Template { _id: string; name: string; slug: string; category: string; thumbnail: string; isPublished: boolean; pricingType: 'free' | 'paid'; monthlyPrice: number; yearlyPrice: number; frontendPath: string; createdAt: string; adminConfig?: { defaultContent?: Record<string, string> }; }

const CATEGORIES = ['developer','designer','freelancer','student','marketer','content-creator','agency'];
const TEMPLATE_PATHS = [
  'developer/MarenTemplate','developer/MintSlateTemplate','developer/ApexTemplate','developer/QuartzTemplate','developer/NexusTemplate','developer/HelixTemplate',
  'designer/AtelierTemplate','designer/PrismTemplate','designer/MosaicTemplate','designer/DebutTemplate','designer/VellumTemplate',
  'freelancer/SolaceTemplate',
  'student/CampusTemplate',
  'marketer/PulseTemplate',
  'content-creator/LumenTemplate',
  'agency/ForgeTemplate',
];

const CATEGORY_META: Record<string, { label: string; icon: React.ReactNode; gradient: string }> = {
  'developer':       { label: 'Developer',       icon: <Code2 size={11}/>,         gradient: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(168,85,247,0.15))' },
  'designer':        { label: 'Designer',        icon: <Palette size={11}/>,       gradient: 'linear-gradient(135deg,rgba(244,114,182,0.18),rgba(251,146,60,0.15))' },
  'freelancer':      { label: 'Freelancer',      icon: <Briefcase size={11}/>,     gradient: 'linear-gradient(135deg,rgba(251,146,60,0.18),rgba(34,197,94,0.15))' },
  'student':         { label: 'Student',         icon: <GraduationCap size={11}/>, gradient: 'linear-gradient(135deg,rgba(250,204,21,0.18),rgba(59,130,246,0.15))' },
  'marketer':        { label: 'Marketer',        icon: <TrendingUp size={11}/>,    gradient: 'linear-gradient(135deg,rgba(217,249,79,0.18),rgba(236,72,153,0.15))' },
  'content-creator': { label: 'Content Creator', icon: <Video size={11}/>,         gradient: 'linear-gradient(135deg,rgba(168,85,247,0.18),rgba(56,189,248,0.15))' },
  'agency':          { label: 'Agency',          icon: <Building2 size={11}/>,     gradient: 'linear-gradient(135deg,rgba(255,94,31,0.18),rgba(255,255,255,0.05))' },
};

type SortKey = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

const inputCls = "w-full h-10 rounded-xl border border-white/[0.12] bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono";
const textareaCls = "w-full rounded-xl border border-white/[0.12] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono resize-y min-h-[80px]";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', category: 'developer', pricingType: 'free', monthlyPrice: '', yearlyPrice: '', frontendPath: 'developer/MarenTemplate', thumbnail: '' });
  const [editDefaultContent, setEditDefaultContent] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPricing, setFilterPricing] = useState<'all' | 'free' | 'paid'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);

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
    const payload = { ...form, monthlyPrice: parseFloat(form.monthlyPrice) || 0, yearlyPrice: parseFloat(form.yearlyPrice) || 0 };
    const res = await fetch('/api/super-admin/templates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.success) { toast({ title: 'Template created' }); setCreateOpen(false); setForm({ name: '', slug: '', category: 'developer', pricingType: 'free', monthlyPrice: '', yearlyPrice: '', frontendPath: 'developer/HelixTemplate', thumbnail: '' }); fetchTemplates(); }
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
      body: JSON.stringify({
        name: editingTemplate.name,
        slug: editingTemplate.slug,
        category: editingTemplate.category,
        pricingType: editingTemplate.pricingType,
        monthlyPrice: editingTemplate.monthlyPrice || 0,
        yearlyPrice: editingTemplate.yearlyPrice || 0,
        thumbnail: editingTemplate.thumbnail,
        frontendPath: editingTemplate.frontendPath,
        adminConfig: { defaultContent },
      }),
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

  // ── Filtering + Sorting ──
  const filtered = useMemo(() => {
    let list = [...templates];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.frontendPath.toLowerCase().includes(q)
      );
    }
    if (filterCategory !== 'all') list = list.filter(t => t.category === filterCategory);
    if (filterPricing !== 'all') list = list.filter(t => t.pricingType === filterPricing);
    if (filterStatus !== 'all') list = list.filter(t => filterStatus === 'published' ? t.isPublished : !t.isPublished);

    switch (sortBy) {
      case 'newest': list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'oldest': list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      case 'name-asc': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': list.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'price-asc': list.sort((a, b) => (a.monthlyPrice || 0) - (b.monthlyPrice || 0)); break;
      case 'price-desc': list.sort((a, b) => (b.monthlyPrice || 0) - (a.monthlyPrice || 0)); break;
    }
    return list;
  }, [templates, search, filterCategory, filterPricing, filterStatus, sortBy]);

  // ── Stats ──
  const stats = useMemo(() => {
    const byCategory: Record<string, number> = {};
    CATEGORIES.forEach(c => { byCategory[c] = templates.filter(t => t.category === c).length; });
    return {
      total: templates.length,
      published: templates.filter(t => t.isPublished).length,
      draft: templates.filter(t => !t.isPublished).length,
      free: templates.filter(t => t.pricingType === 'free').length,
      paid: templates.filter(t => t.pricingType === 'paid').length,
      byCategory,
    };
  }, [templates]);

  const activeFilterCount = (filterCategory !== 'all' ? 1 : 0) + (filterPricing !== 'all' ? 1 : 0) + (filterStatus !== 'all' ? 1 : 0);

  function clearFilters() {
    setFilterCategory('all'); setFilterPricing('all'); setFilterStatus('all'); setSearch(''); setSortBy('newest');
  }

  return (
    <div>
      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-indigo-500/[0.08] via-violet-500/[0.05] to-cyan-500/[0.08] p-6 mb-6">
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(99,102,241,0.18), transparent 40%), radial-gradient(circle at 80% 70%, rgba(168,85,247,0.18), transparent 40%)' }} />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-indigo-300/80 px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">Library</span>
              <span className="text-[10px] font-mono text-white/30">/super-admin/templates</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-1 bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">Templates</h1>
            <p className="text-sm text-white/50 max-w-md">Curate the template library available to users. Publish, price, and tailor default content per template.</p>
          </div>
          <button onClick={() => setCreateOpen(true)} className="btn-grad flex items-center gap-2 px-4 py-2.5 text-sm shrink-0">
            <Plus size={15}/> Add template
          </button>
        </div>

        {/* Quick stat strip */}
        <div className="relative mt-6 grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: 'Total', value: stats.total, accent: 'from-white/10 to-white/[0.02]', text: 'text-white' },
            { label: 'Published', value: stats.published, accent: 'from-emerald-500/15 to-emerald-500/[0.02]', text: 'text-emerald-300' },
            { label: 'Drafts', value: stats.draft, accent: 'from-amber-500/15 to-amber-500/[0.02]', text: 'text-amber-300' },
            { label: 'Paid', value: stats.paid, accent: 'from-violet-500/15 to-violet-500/[0.02]', text: 'text-violet-300' },
          ].map(s => (
            <div key={s.label} className={`bg-gradient-to-br ${s.accent} border border-white/[0.06] rounded-xl px-4 py-3`}>
              <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">{s.label}</div>
              <div className={`text-2xl font-bold mt-1 ${s.text}`}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="card-panel p-3 mb-4 flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"/>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, slug, category, path…"
            className="w-full h-10 pl-9 pr-9 rounded-lg border border-white/[0.07] bg-white/[0.02] text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white/70">
              <X size={13}/>
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(s => !s)}
          className={`relative flex items-center gap-2 h-10 px-3.5 rounded-lg border text-sm transition-all ${showFilters ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' : 'border-white/[0.08] text-white/60 hover:text-white hover:border-white/[0.15]'}`}
        >
          <SlidersHorizontal size={14}/> Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-500 text-white text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort */}
        <div className="flex items-center gap-2 h-10 px-3 rounded-lg border border-white/[0.08] bg-white/[0.02]">
          <ArrowUpDown size={13} className="text-white/40"/>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)} className="bg-transparent text-sm text-white/80 focus:outline-none cursor-pointer">
            <option value="newest" className="bg-[#11151F]">Newest first</option>
            <option value="oldest" className="bg-[#11151F]">Oldest first</option>
            <option value="name-asc" className="bg-[#11151F]">Name A-Z</option>
            <option value="name-desc" className="bg-[#11151F]">Name Z-A</option>
            <option value="price-asc" className="bg-[#11151F]">Price low → high</option>
            <option value="price-desc" className="bg-[#11151F]">Price high → low</option>
          </select>
        </div>

        {/* View toggle */}
        <div className="flex h-10 rounded-lg border border-white/[0.08] bg-white/[0.02] p-0.5">
          <button onClick={() => setView('grid')} className={`px-2.5 rounded-md flex items-center gap-1.5 text-xs font-medium transition-all ${view === 'grid' ? 'bg-white/[0.06] text-white' : 'text-white/40 hover:text-white/70'}`}>
            <LayoutGrid size={13}/> Grid
          </button>
          <button onClick={() => setView('list')} className={`px-2.5 rounded-md flex items-center gap-1.5 text-xs font-medium transition-all ${view === 'list' ? 'bg-white/[0.06] text-white' : 'text-white/40 hover:text-white/70'}`}>
            <List size={13}/> List
          </button>
        </div>
      </div>

      {/* ── Filter Panel ── */}
      {showFilters && (
        <div className="card-panel p-4 mb-4 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div className="md:col-span-3">
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-2 flex items-center gap-1.5">
                <Filter size={11}/> Category
              </label>
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filterCategory === 'all' ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-200' : 'border-white/[0.08] text-white/50 hover:text-white hover:border-white/[0.15]'}`}
                >
                  All
                </button>
                {CATEGORIES.map(cat => {
                  const meta = CATEGORY_META[cat];
                  const count = stats.byCategory[cat] || 0;
                  return (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filterCategory === cat ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-200' : 'border-white/[0.08] text-white/50 hover:text-white hover:border-white/[0.15]'}`}
                    >
                      {meta?.icon}{meta?.label || cat}
                      <span className="ml-1 text-[10px] font-mono opacity-60">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pricing Filter */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-2 flex items-center gap-1.5">
                <DollarSign size={11}/> Pricing
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { v: 'all', label: 'All', count: stats.total },
                  { v: 'free', label: 'Free', count: stats.free },
                  { v: 'paid', label: 'Paid', count: stats.paid },
                ].map(opt => (
                  <button
                    key={opt.v}
                    onClick={() => setFilterPricing(opt.v as 'all' | 'free' | 'paid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filterPricing === opt.v ? (opt.v === 'free' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : opt.v === 'paid' ? 'bg-violet-500/15 border-violet-500/40 text-violet-300' : 'bg-indigo-500/15 border-indigo-500/40 text-indigo-200') : 'border-white/[0.08] text-white/50 hover:text-white hover:border-white/[0.15]'}`}
                  >
                    {opt.label}
                    {opt.v !== 'all' && (
                      <span className="ml-1 text-[10px] font-mono opacity-60">{opt.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-2 flex items-center gap-1.5">
                <CheckCircle2 size={11}/> Status
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { v: 'all', label: 'All', icon: null, count: stats.total },
                  { v: 'published', label: 'Live', icon: <CheckCircle2 size={11}/>, count: stats.published },
                  { v: 'draft', label: 'Draft', icon: <Circle size={11}/>, count: stats.draft },
                ].map(opt => (
                  <button
                    key={opt.v}
                    onClick={() => setFilterStatus(opt.v as 'all' | 'published' | 'draft')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filterStatus === opt.v ? (opt.v === 'published' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : opt.v === 'draft' ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-indigo-500/15 border-indigo-500/40 text-indigo-200') : 'border-white/[0.08] text-white/50 hover:text-white hover:border-white/[0.15]'}`}
                  >
                    {opt.icon}{opt.label}
                    {opt.v !== 'all' && (
                      <span className="ml-1 text-[10px] font-mono opacity-60">{opt.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {(activeFilterCount > 0 || search) && (
            <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
              <div className="text-xs text-white/40 font-mono">
                Showing <span className="text-white/80 font-semibold">{filtered.length}</span> of {templates.length} templates
              </div>
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-white/50 hover:text-red-400 transition-colors">
                <X size={12}/> Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Templates Display ── */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-panel overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-white/[0.03]"/>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-white/[0.05] rounded w-2/3"/>
                <div className="h-3 bg-white/[0.03] rounded w-1/2"/>
                <div className="h-8 bg-white/[0.03] rounded"/>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-panel p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <Search size={20} className="text-white/20"/>
          </div>
          <p className="text-sm text-white/40 mb-3">
            {templates.length === 0 ? 'No templates yet.' : 'No templates match your filters.'}
          </p>
          {(activeFilterCount > 0 || search) && (
            <button onClick={clearFilters} className="text-xs text-indigo-400 hover:text-indigo-300">Clear filters</button>
          )}
        </div>
      ) : view === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => (
            <div key={t._id} className="card-panel overflow-hidden hover:border-white/[0.18] transition-all group">
              <div className="aspect-[4/3] border-b border-white/[0.07] relative overflow-hidden" style={{background: CATEGORY_META[t.category]?.gradient || 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(168,85,247,0.15))'}}>
                {t.thumbnail ? <img src={t.thumbnail} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/> :
                  <div className="w-full h-full flex items-center justify-center text-white/10 font-mono text-xs">{t.slug}</div>}

                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>

                {/* badges - top */}
                <div className="absolute top-2 left-2 flex gap-1.5">
                  <Badge variant={t.isPublished ? 'success' : 'default'}>{t.isPublished ? '● Live' : '○ Draft'}</Badge>
                  <Badge variant={t.pricingType === 'free' ? 'success' : 'warning'}>{t.pricingType}</Badge>
                </div>

                {/* category badge - top right */}
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="backdrop-blur-md bg-black/30">
                    <span className="mr-1 inline-flex items-center">{CATEGORY_META[t.category]?.icon}</span>
                    {CATEGORY_META[t.category]?.label || t.category}
                  </Badge>
                </div>

                {/* quick preview button on hover */}
                <Link href={`/preview/${t.slug}`} target="_blank" className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-black text-xs font-medium hover:bg-white">
                  <ExternalLink size={11}/> Preview
                </Link>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm truncate">{t.name}</div>
                    <div className="text-[11px] text-white/30 font-mono mt-0.5 truncate">{t.slug}</div>
                    {t.pricingType === 'paid' && (
                      <div className="text-[11px] text-violet-300 font-mono mt-1 flex items-center gap-2">
                        <span>₹{t.monthlyPrice || 0}<span className="opacity-60">/mo</span></span>
                        <span className="opacity-30">·</span>
                        <span>₹{t.yearlyPrice || 0}<span className="opacity-60">/yr</span></span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-[11px] text-white/30 font-mono mb-4 truncate">{t.frontendPath}</div>

                <div className="flex gap-1.5 flex-wrap">
                  <button onClick={() => openEdit(t)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-violet-500/20 text-violet-400 hover:bg-violet-500/10 transition-all">
                    <Pencil size={11}/>Edit
                  </button>
                  <button onClick={() => togglePublish(t._id, t.isPublished)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-all ${t.isPublished ? 'border-red-500/20 text-red-400 hover:bg-red-500/10' : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'}`}>
                    {t.isPublished ? <><EyeOff size={11}/>Unpublish</> : <><Eye size={11}/>Publish</>}
                  </button>
                  <button onClick={() => togglePricing(t._id, t.pricingType)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-white/[0.07] text-white/50 hover:text-white hover:border-white/[0.15] transition-all">
                    {t.pricingType === 'free' ? <><DollarSign size={11}/>Paid</> : <><Gift size={11}/>Free</>}
                  </button>
                  <button onClick={() => deleteTemplate(t._id)} className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border border-white/[0.07] text-white/20 hover:text-red-400 hover:border-red-500/20 transition-all">
                    <Trash2 size={11}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // ── List View ──
        <div className="card-panel overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-white/[0.05] text-[10px] font-mono uppercase tracking-wider text-white/40">
            <div className="col-span-5">Template</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Pricing</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          {filtered.map(t => (
            <div key={t._id} className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors items-center">
              <div className="col-span-5 flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/[0.07] shrink-0" style={{background: CATEGORY_META[t.category]?.gradient || 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(168,85,247,0.15))'}}>
                  {t.thumbnail && <img src={t.thumbnail} alt={t.name} className="w-full h-full object-cover"/>}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{t.name}</div>
                  <div className="text-[11px] text-white/30 font-mono truncate">{t.slug}</div>
                </div>
              </div>
              <div className="col-span-2">
                <Badge variant="outline">
                  <span className="mr-1 inline-flex items-center">{CATEGORY_META[t.category]?.icon}</span>
                  {CATEGORY_META[t.category]?.label || t.category}
                </Badge>
              </div>
              <div className="col-span-1">
                <Badge variant={t.isPublished ? 'success' : 'default'}>{t.isPublished ? 'Live' : 'Draft'}</Badge>
              </div>
              <div className="col-span-2">
                {t.pricingType === 'free' ? (
                  <Badge variant="success">Free</Badge>
                ) : (
                  <div>
                    <Badge variant="warning">Paid</Badge>
                    <div className="text-[10px] text-violet-300 font-mono mt-1">₹{t.monthlyPrice}/mo · ₹{t.yearlyPrice}/yr</div>
                  </div>
                )}
              </div>
              <div className="col-span-2 flex justify-end gap-1.5">
                <Link href={`/preview/${t.slug}`} target="_blank" className="p-1.5 rounded-md border border-white/[0.07] text-white/50 hover:text-cyan-400 hover:border-cyan-500/30 transition-all" title="Preview">
                  <ExternalLink size={12}/>
                </Link>
                <button onClick={() => openEdit(t)} className="p-1.5 rounded-md border border-white/[0.07] text-white/50 hover:text-violet-400 hover:border-violet-500/30 transition-all" title="Edit">
                  <Pencil size={12}/>
                </button>
                <button onClick={() => togglePublish(t._id, t.isPublished)} className="p-1.5 rounded-md border border-white/[0.07] text-white/50 hover:text-emerald-400 hover:border-emerald-500/30 transition-all" title={t.isPublished ? 'Unpublish' : 'Publish'}>
                  {t.isPublished ? <EyeOff size={12}/> : <Eye size={12}/>}
                </button>
                <button onClick={() => deleteTemplate(t._id)} className="p-1.5 rounded-md border border-white/[0.07] text-white/50 hover:text-red-400 hover:border-red-500/30 transition-all" title="Delete">
                  <Trash2 size={12}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
                  {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_META[c]?.label || c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">Pricing</label>
                <select value={form.pricingType} onChange={e => setForm({...form, pricingType: e.target.value, monthlyPrice: '', yearlyPrice: ''})} className="w-full h-10 rounded-xl border border-white/[0.12] bg-[#11151F] px-3 text-sm text-white/70 focus:outline-none">
                  <option value="free">Free</option><option value="paid">Paid</option>
                </select>
              </div>
            </div>
            {form.pricingType === 'paid' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Monthly price (₹)</label>
                  <input type="number" value={form.monthlyPrice} onChange={e => setForm({...form, monthlyPrice: e.target.value})} placeholder="0" className={inputCls}/>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Yearly price (₹)</label>
                  <input type="number" value={form.yearlyPrice} onChange={e => setForm({...form, yearlyPrice: e.target.value})} placeholder="0" className={inputCls}/>
                </div>
              </div>
            )}
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
              {/* Thumbnail */}
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
              {/* Name */}
              <div>
                <label className="text-sm text-white/60 mb-1 block">Name</label>
                <input value={editingTemplate.name} onChange={e => setEditingTemplate(t => t ? { ...t, name: e.target.value } : t)} className={inputCls}/>
              </div>
              {/* Slug */}
              <div>
                <label className="text-sm text-white/60 mb-1 block">Slug</label>
                <input value={editingTemplate.slug} onChange={e => setEditingTemplate(t => t ? { ...t, slug: e.target.value.toLowerCase().replace(/\s+/g,'-') } : t)} className={inputCls}/>
              </div>
              {/* Category + Pricing type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Category</label>
                  <select value={editingTemplate.category} onChange={e => setEditingTemplate(t => t ? { ...t, category: e.target.value } : t)} className="w-full h-10 rounded-xl border border-white/[0.12] bg-[#11151F] px-3 text-sm text-white/70 focus:outline-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_META[c]?.label || c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-1 block">Pricing</label>
                  <select value={editingTemplate.pricingType} onChange={e => setEditingTemplate(t => t ? { ...t, pricingType: e.target.value as 'free'|'paid', monthlyPrice: 0, yearlyPrice: 0 } : t)} className="w-full h-10 rounded-xl border border-white/[0.12] bg-[#11151F] px-3 text-sm text-white/70 focus:outline-none">
                    <option value="free">Free</option><option value="paid">Paid</option>
                  </select>
                </div>
              </div>
              {/* Monthly + Yearly price — only when paid */}
              {editingTemplate.pricingType === 'paid' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">Monthly price (₹)</label>
                    <input type="number" value={editingTemplate.monthlyPrice || 0} onChange={e => setEditingTemplate(t => t ? { ...t, monthlyPrice: parseFloat(e.target.value) || 0 } : t)} placeholder="0" className={inputCls}/>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-1 block">Yearly price (₹)</label>
                    <input type="number" value={editingTemplate.yearlyPrice || 0} onChange={e => setEditingTemplate(t => t ? { ...t, yearlyPrice: parseFloat(e.target.value) || 0 } : t)} placeholder="0" className={inputCls}/>
                  </div>
                </div>
              )}
              {/* Frontend path */}
              <div>
                <label className="text-sm text-white/60 mb-1 block">Frontend path</label>
                <select value={editingTemplate.frontendPath} onChange={e => setEditingTemplate(t => t ? { ...t, frontendPath: e.target.value } : t)} className="w-full h-10 rounded-xl border border-white/[0.12] bg-[#11151F] px-3 text-sm text-white/70 focus:outline-none">
                  {TEMPLATE_PATHS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              {/* Default Content JSON */}
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
