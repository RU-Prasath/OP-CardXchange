'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, ToggleLeft, ToggleRight, Trash2, ExternalLink, RefreshCw, Clock, AlertTriangle, Pencil, Check, X, SlidersHorizontal, Filter, LayoutTemplate, CheckCircle2, Circle, AtSign, Phone, DollarSign } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface User {
  _id: string; email: string; username: string; phone: string; isActive: boolean;
  allocatedTemplate: { _id: string; name: string; category: string; pricingType: string } | null;
  plan: 'free' | 'paid'; planBilling: 'monthly' | 'yearly'; planStartDate: string | null;
  pricingPlanId: { _id: string; tier: string; monthlyPrice: number; yearlyPrice: number } | null; paidAmount: number;
  createdAt: string;
}
interface Template { _id: string; name: string; slug: string; category: string; isPublished: boolean; pricingType: 'free' | 'paid'; monthlyPrice: number; yearlyPrice: number; }

function getRemainingDays(planStartDate: string | null, planBilling: 'monthly' | 'yearly'): number {
  if (!planStartDate) return 0;
  const start = new Date(planStartDate);
  const durationDays = planBilling === 'yearly' ? 365 : 30;
  const end = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);
  return Math.max(0, Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

// Inline editable cell
function InlineEdit({ value, onSave, type = 'text', prefix }: { value: string; onSave: (v: string) => void; type?: string; prefix?: string }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  if (!editing) return (
    <div className="flex items-center gap-1.5 group/cell">
      <span className="text-xs font-mono text-white/60">{prefix}{value || '—'}</span>
      <button onClick={() => { setVal(value); setEditing(true); }} className="opacity-0 group-hover/cell:opacity-100 text-white/30 hover:text-cyan-400 transition-all"><Pencil size={11}/></button>
    </div>
  );
  return (
    <div className="flex items-center gap-1">
      <input autoFocus type={type} value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { onSave(val); setEditing(false); } if (e.key === 'Escape') setEditing(false); }}
        className="w-24 h-7 rounded-md border border-indigo-500/60 bg-[#0A0D14] px-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"/>
      <button onClick={() => { onSave(val); setEditing(false); }} className="text-emerald-400 hover:text-emerald-300"><Check size={12}/></button>
      <button onClick={() => setEditing(false)} className="text-white/30 hover:text-white"><X size={12}/></button>
    </div>
  );
}

// Users with <= this many days left appear in the "Plan Expiry Status" panel.
const EXPIRY_WARNING_DAYS = 14;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState('');
  const [usernameSearch, setUsernameSearch] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [filterTemplate, setFilterTemplate] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterPlan, setFilterPlan] = useState<'all' | 'free' | 'paid'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ email: '', username: '', phone: '', planBilling: 'monthly' as 'monthly'|'yearly', templateId: '' });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/super-admin/users?search=${search}`);
    const data = await res.json();
    if (data.success) setUsers(data.data);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => {
    fetch('/api/super-admin/templates').then(r => r.json()).then(d => { if (d.success) setTemplates(d.data); });
    fetch('/api/cron/deactivate-expired').catch(() => {});
  }, []);

  async function patch(id: string, body: Record<string, unknown>) {
    const res = await fetch(`/api/super-admin/users/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if ((await res.json()).success) fetchUsers();
  }

  async function createUser() {
    if (!form.email || !form.username) return;
    setSaving(true);
    const selectedTemplate = templates.find(t => t._id === form.templateId);
    const plan = selectedTemplate?.pricingType === 'paid' ? 'paid' : 'free';
    const res = await fetch('/api/super-admin/users', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, plan, paidAmount: 0 }),
    });
    const data = await res.json();
    if (data.success) {
      toast({ title: 'User created', variant: 'default' });
      setCreateOpen(false);
      setForm({ email: '', username: '', phone: '', planBilling: 'monthly', templateId: '' });
      fetchUsers();
    } else {
      toast({ title: 'Error', description: data.error, variant: 'destructive' });
    }
    setSaving(false);
  }

  async function deleteUser(id: string) {
    if (!confirm('Delete this user and their portfolio? This cannot be undone.')) return;
    await fetch(`/api/super-admin/users/${id}`, { method: 'DELETE' });
    fetchUsers();
    toast({ title: 'User deleted' });
  }

  const selectedTemplate = templates.find(t => t._id === form.templateId);
  const availableTemplates = templates.filter(t => t.isPublished);

  // ── Plan expiry: only users whose plan is going to expire soon (or already expired) ──
  const expiryData = useMemo(() => {
    return users
      .filter(u => (u.plan || 'free') === 'paid' && u.planStartDate)
      .map(u => ({ ...u, remaining: getRemainingDays(u.planStartDate, u.planBilling || 'monthly') }))
      .filter(u => u.remaining <= EXPIRY_WARNING_DAYS)
      .sort((a, b) => a.remaining - b.remaining);
  }, [users]);

  // ── Client-side filtering ──
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (usernameSearch && !u.username?.toLowerCase().includes(usernameSearch.toLowerCase())) return false;
      if (phoneSearch && !(u.phone || '').toLowerCase().includes(phoneSearch.toLowerCase())) return false;
      if (filterTemplate !== 'all') {
        if (filterTemplate === 'none') {
          if (u.allocatedTemplate) return false;
        } else if (u.allocatedTemplate?._id !== filterTemplate) return false;
      }
      if (filterStatus !== 'all' && (filterStatus === 'active' ? !u.isActive : u.isActive)) return false;
      if (filterPlan !== 'all' && (u.plan || 'free') !== filterPlan) return false;
      return true;
    });
  }, [users, usernameSearch, phoneSearch, filterTemplate, filterStatus, filterPlan]);

  const planCounts = useMemo(() => ({
    free: users.filter(u => (u.plan || 'free') === 'free').length,
    paid: users.filter(u => (u.plan || 'free') === 'paid').length,
  }), [users]);
  const statusCounts = useMemo(() => ({
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
  }), [users]);

  const activeFilterCount =
    (usernameSearch ? 1 : 0) +
    (phoneSearch ? 1 : 0) +
    (filterTemplate !== 'all' ? 1 : 0) +
    (filterStatus !== 'all' ? 1 : 0) +
    (filterPlan !== 'all' ? 1 : 0);

  function clearFilters() {
    setUsernameSearch(''); setPhoneSearch('');
    setFilterTemplate('all'); setFilterStatus('all'); setFilterPlan('all');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Users</h1>
          <p className="text-sm text-white/40">Manage user accounts, plans, templates, and access.</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-grad flex items-center gap-2 px-4 py-2 text-sm">
          <Plus size={14}/> New user
        </button>
      </div>

      {/* Plan expiry grid — only users whose plan is going to expire (or already expired) */}
      {expiryData.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold text-sm text-white/60 mb-3 flex items-center gap-2">
            <Clock size={14}/> Plan Expiry Status
            <span className="text-[10px] font-mono text-white/30 normal-case font-normal">
              · {expiryData.length} expiring within {EXPIRY_WARNING_DAYS} days
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {expiryData.map(u => {
              const expired = u.remaining <= 0;
              const urgent = u.remaining > 0 && u.remaining <= 3;
              const warning = u.remaining > 3 && u.remaining <= 7;
              return (
                <div key={u._id} className={`card-panel p-4 border ${expired ? 'border-red-500/60 bg-red-500/[0.04]' : urgent ? 'border-red-500/40' : warning ? 'border-amber-500/30' : 'border-white/[0.07]'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {(expired || urgent) && <AlertTriangle size={12} className="text-red-400 shrink-0"/>}
                    <span className="text-xs font-mono text-white/60 truncate">{u.email}</span>
                  </div>
                  <div className={`text-2xl font-bold mb-0.5 ${expired ? 'text-red-500' : urgent ? 'text-red-400' : warning ? 'text-amber-400' : 'text-white'}`}>
                    {expired ? 'Expired' : `${u.remaining}d`}
                  </div>
                  <div className="text-[10px] text-white/30 font-mono capitalize">{u.planBilling} · {expired ? 'past due' : 'remaining'}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Search + Filter Toolbar ── */}
      <div className="card-panel p-3 mb-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email…"
            className="w-full h-10 pl-9 pr-9 rounded-lg border border-white/[0.07] bg-white/[0.02] text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"/>
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white/70">
              <X size={13}/>
            </button>
          )}
          <button onClick={fetchUsers} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white p-1" title="Refresh"><RefreshCw size={12}/></button>
        </div>

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
      </div>

      {/* ── Filter Panel ── */}
      {showFilters && (
        <div className="card-panel p-4 mb-4 animate-in fade-in slide-in-from-top-1 duration-200 space-y-4">
          {/* Username + Phone search row */}
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-2 flex items-center gap-1.5">
                <AtSign size={11}/> Username
              </label>
              <div className="relative">
                <input value={usernameSearch} onChange={e => setUsernameSearch(e.target.value)} placeholder="Filter by username…"
                  className="w-full h-9 pl-3 pr-9 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"/>
                {usernameSearch && (
                  <button onClick={() => setUsernameSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white/70">
                    <X size={12}/>
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-2 flex items-center gap-1.5">
                <Phone size={11}/> Phone
              </label>
              <div className="relative">
                <input value={phoneSearch} onChange={e => setPhoneSearch(e.target.value)} placeholder="Filter by phone…"
                  className="w-full h-9 pl-3 pr-9 rounded-lg border border-white/[0.08] bg-white/[0.02] text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"/>
                {phoneSearch && (
                  <button onClick={() => setPhoneSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white/70">
                    <X size={12}/>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Template Filter */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-2 flex items-center gap-1.5">
                <LayoutTemplate size={11}/> Template
              </label>
              <select value={filterTemplate} onChange={e => setFilterTemplate(e.target.value)} className="w-full h-9 rounded-lg border border-white/[0.08] bg-[#11151F] px-3 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500" style={{colorScheme:'dark'}}>
                <option value="all">All templates</option>
                <option value="none">— None (unallocated) —</option>
                {templates.map(t => <option key={t._id} value={t._id}>{t.name} ({t.category})</option>)}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-2 flex items-center gap-1.5">
                <CheckCircle2 size={11}/> Status
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { v: 'all', label: 'All', icon: null, count: users.length },
                  { v: 'active', label: 'Active', icon: <CheckCircle2 size={11}/>, count: statusCounts.active },
                  { v: 'inactive', label: 'Inactive', icon: <Circle size={11}/>, count: statusCounts.inactive },
                ].map(opt => (
                  <button key={opt.v} onClick={() => setFilterStatus(opt.v as 'all' | 'active' | 'inactive')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filterStatus === opt.v ? (opt.v === 'active' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : opt.v === 'inactive' ? 'bg-red-500/15 border-red-500/40 text-red-300' : 'bg-indigo-500/15 border-indigo-500/40 text-indigo-200') : 'border-white/[0.08] text-white/50 hover:text-white hover:border-white/[0.15]'}`}>
                    {opt.icon}{opt.label}
                    {opt.v !== 'all' && <span className="ml-1 text-[10px] font-mono opacity-60">{opt.count}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Plan Filter */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-2 flex items-center gap-1.5">
                <DollarSign size={11}/> Pricing plan
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { v: 'all', label: 'All', count: users.length },
                  { v: 'free', label: 'Free', count: planCounts.free },
                  { v: 'paid', label: 'Paid', count: planCounts.paid },
                ].map(opt => (
                  <button key={opt.v} onClick={() => setFilterPlan(opt.v as 'all' | 'free' | 'paid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filterPlan === opt.v ? (opt.v === 'free' ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' : opt.v === 'paid' ? 'bg-violet-500/15 border-violet-500/40 text-violet-300' : 'bg-indigo-500/15 border-indigo-500/40 text-indigo-200') : 'border-white/[0.08] text-white/50 hover:text-white hover:border-white/[0.15]'}`}>
                    {opt.label}
                    {opt.v !== 'all' && <span className="ml-1 text-[10px] font-mono opacity-60">{opt.count}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {(activeFilterCount > 0 || search) && (
            <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
              <div className="text-xs text-white/40 font-mono">
                Showing <span className="text-white/80 font-semibold">{filteredUsers.length}</span> of {users.length} users
              </div>
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-white/50 hover:text-red-400 transition-colors">
                <X size={12}/> Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="card-panel overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07]">
              {['User','Username','Phone','Pricing Plan','Paid Amount','Expiry','Template','Status','Portfolio','Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/30 font-normal whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} className="text-center py-12 text-white/30 text-sm">Loading…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={10} className="text-center py-12 text-white/30 text-sm">No users yet.</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={10} className="text-center py-12 text-white/30 text-sm">
                No users match your filters.
                {(activeFilterCount > 0 || search) && (
                  <button onClick={() => { clearFilters(); setSearch(''); }} className="ml-2 text-indigo-400 hover:text-indigo-300">Clear filters</button>
                )}
              </td></tr>
            ) : filteredUsers.map(u => {
              const planType = u.plan || 'free';
              const remaining = planType === 'paid' ? getRemainingDays(u.planStartDate, u.planBilling || 'monthly') : null;
              return (
                <tr key={u._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  {/* User */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-[#0A0D14] shrink-0" style={{background:'linear-gradient(135deg,#22D3EE,#6366F1,#A855F7)'}}>{u.email[0].toUpperCase()}</div>
                      <span className="text-white/70 font-mono text-xs">{u.email}</span>
                    </div>
                  </td>
                  {/* Username */}
                  <td className="px-4 py-3.5 font-mono text-xs text-white/50">{u.username}</td>
                  {/* Phone — inline editable */}
                  <td className="px-4 py-3.5">
                    <InlineEdit value={u.phone || ''} onSave={v => patch(u._id, { phone: v })} type="tel"/>
                  </td>
                  {/* Pricing Plan — read-only display derived from template */}
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full capitalize ${(u.plan || 'free') === 'paid' ? 'bg-violet-400/15 text-violet-300' : 'bg-emerald-400/15 text-emerald-300'}`}>
                      {u.plan || 'free'}
                    </span>
                    {(u.plan || 'free') === 'paid' && (
                      <div className="text-[10px] text-white/40 font-mono mt-0.5 capitalize">{u.planBilling || 'monthly'}</div>
                    )}
                  </td>
                  {/* Paid Amount — inline editable */}
                  <td className="px-4 py-3.5">
                    <InlineEdit value={u.paidAmount != null ? String(u.paidAmount) : '0'} onSave={v => patch(u._id, { paidAmount: parseFloat(v) || 0 })} type="number" prefix="₹"/>
                  </td>
                  {/* Expiry */}
                  <td className="px-4 py-3.5">
                    {remaining !== null
                      ? <span className={`text-xs font-mono font-semibold ${remaining <= 3 ? 'text-red-400' : remaining <= 7 ? 'text-amber-400' : 'text-emerald-400'}`}>{remaining}d left</span>
                      : <span className="text-white/20 text-xs">—</span>}
                  </td>
                  {/* Template */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1">
                      <select value={u.allocatedTemplate?._id || ''} onChange={e => patch(u._id, { templateId: e.target.value })}
                        className="bg-[#11151F] border border-white/[0.1] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 min-w-[150px]"
                        style={{colorScheme:'dark'}}>
                        <option value="" style={{background:'#11151F', color:'#ffffff80'}}>— None —</option>
                        {templates.filter(t => t.isPublished).map(t => (
                          <option key={t._id} value={t._id} style={{background:'#11151F', color:'#ffffff'}}>
                            {t.name} · {t.pricingType === 'paid' ? `₹${t.monthlyPrice}/mo` : 'Free'}
                          </option>
                        ))}
                      </select>
                      {u.allocatedTemplate && (() => {
                        const tpl = templates.find(t => t._id === u.allocatedTemplate!._id);
                        if (!tpl || tpl.pricingType !== 'paid') return null;
                        return <span className="text-[10px] font-mono text-violet-300">₹{tpl.monthlyPrice}/mo · ₹{tpl.yearlyPrice}/yr</span>;
                      })()}
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <Badge variant={u.isActive ? 'success' : 'destructive'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                  </td>
                  {/* Portfolio */}
                  <td className="px-4 py-3.5">
                    {u.allocatedTemplate
                      ? <a href={`/portfolio/${u.username}`} target="_blank" className="flex items-center gap-1 text-xs text-cyan-400 hover:underline font-mono">/{u.username} <ExternalLink size={11}/></a>
                      : <span className="text-white/20 text-xs">—</span>}
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => patch(u._id, { isActive: !u.isActive })} className={`transition-colors ${u.isActive ? 'text-emerald-400 hover:text-red-400' : 'text-red-400 hover:text-emerald-400'}`} title={u.isActive ? 'Deactivate' : 'Activate'}>
                        {u.isActive ? <ToggleRight size={18}/> : <ToggleLeft size={18}/>}
                      </button>
                      <button onClick={() => deleteUser(u._id)} className="text-white/20 hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create user modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create new user</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm text-white/60 mb-1.5 block">Email address *</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="user@company.com"
                className="w-full h-10 rounded-xl border border-white/[0.12] bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1.5 block">Phone number</label>
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 99999 99999"
                className="w-full h-10 rounded-xl border border-white/[0.12] bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1.5 block">Username * <span className="text-white/30">(portfolio URL)</span></label>
              <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'')})} placeholder="john-doe"
                className="w-full h-10 rounded-xl border border-white/[0.12] bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"/>
              {form.username && <p className="text-xs text-white/30 mt-1 font-mono">URL: /portfolio/{form.username}</p>}
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1.5 block">Allocate template</label>
              <select value={form.templateId} onChange={e => setForm({...form, templateId: e.target.value, planBilling: 'monthly'})}
                className="w-full h-10 rounded-xl border border-white/[0.12] bg-[#11151F] px-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                style={{colorScheme:'dark'}}>
                <option value="" style={{background:'#11151F', color:'#ffffff80'}}>— No template —</option>
                {availableTemplates.map(t => (
                  <option key={t._id} value={t._id} style={{background:'#11151F', color:'#ffffff'}}>
                    {t.name} ({t.category}) · {t.pricingType === 'paid' ? `₹${t.monthlyPrice}/mo` : 'Free'}
                  </option>
                ))}
              </select>
              {/* Billing picker — only shown when a paid template is selected */}
              {selectedTemplate?.pricingType === 'paid' && (
                <div className="flex gap-2 mt-2.5">
                  {(['monthly', 'yearly'] as const).map(b => (
                    <button key={b} type="button" onClick={() => setForm(f => ({ ...f, planBilling: b }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${form.planBilling === b ? 'border-indigo-500 bg-indigo-500/20 text-white' : 'border-white/[0.08] text-white/40 hover:text-white hover:border-white/20'}`}>
                      {b === 'monthly'
                        ? `Monthly · ₹${selectedTemplate.monthlyPrice || 0}/mo`
                        : `Yearly · ₹${selectedTemplate.yearlyPrice || 0}/yr`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4 flex gap-2">
            <button onClick={() => setCreateOpen(false)} className="btn-secondary-ff flex-1 py-2.5 text-sm">Cancel</button>
            <button onClick={createUser} disabled={!form.email || !form.username || saving} className="btn-grad flex-1 py-2.5 text-sm disabled:opacity-50">
              {saving ? 'Creating…' : 'Create user'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
