'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, ToggleLeft, ToggleRight, Trash2, ExternalLink, RefreshCw, Clock, AlertTriangle, Pencil, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface PricingPlan { _id: string; tier: string; monthlyPrice: number; yearlyPrice: number; }
interface User {
  _id: string; email: string; username: string; phone: string; isActive: boolean;
  allocatedTemplate: { _id: string; name: string; category: string; pricingType: string } | null;
  plan: 'free' | 'paid'; planBilling: 'monthly' | 'yearly'; planStartDate: string | null;
  pricingPlanId: PricingPlan | null; paidAmount: number;
  createdAt: string;
}
interface Template { _id: string; name: string; slug: string; category: string; isPublished: boolean; pricingType: 'free' | 'paid'; }

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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ email: '', username: '', phone: '', plan: 'free' as 'free'|'paid', planBilling: 'monthly' as 'monthly'|'yearly', templateId: '', pricingPlanId: '', paidAmount: '' });
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
    fetch('/api/super-admin/pricing').then(r => r.json()).then(d => { if (d.success) setPricingPlans(d.data); });
    fetch('/api/cron/deactivate-expired').catch(() => {});
  }, []);

  async function patch(id: string, body: Record<string, unknown>) {
    const res = await fetch(`/api/super-admin/users/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if ((await res.json()).success) fetchUsers();
  }

  async function createUser() {
    if (!form.email || !form.username) return;
    setSaving(true);
    const res = await fetch('/api/super-admin/users', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, paidAmount: parseFloat(form.paidAmount) || 0 }),
    });
    const data = await res.json();
    if (data.success) {
      toast({ title: 'User created', variant: 'default' });
      setCreateOpen(false);
      setForm({ email: '', username: '', phone: '', plan: 'free', planBilling: 'monthly', templateId: '', pricingPlanId: '', paidAmount: '' });
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

  const availableTemplates = templates.filter(t => t.isPublished && (form.plan === 'paid' ? true : t.pricingType === 'free'));

  // Plan expiry summary cards
  const paidUsers = users.filter(u => (u.plan || 'free') === 'paid' && u.planStartDate);
  const expiryData = paidUsers.map(u => ({ ...u, remaining: getRemainingDays(u.planStartDate, u.planBilling || 'monthly') })).sort((a, b) => a.remaining - b.remaining);

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

      {/* Plan expiry grid */}
      {expiryData.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold text-sm text-white/60 mb-3 flex items-center gap-2"><Clock size={14}/> Plan Expiry Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {expiryData.map(u => {
              const urgent = u.remaining <= 3;
              const warning = u.remaining <= 7 && u.remaining > 3;
              return (
                <div key={u._id} className={`card-panel p-4 border ${urgent ? 'border-red-500/40' : warning ? 'border-amber-500/30' : 'border-white/[0.07]'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {urgent && <AlertTriangle size={12} className="text-red-400 shrink-0"/>}
                    <span className="text-xs font-mono text-white/60 truncate">{u.email}</span>
                  </div>
                  <div className={`text-2xl font-bold mb-0.5 ${urgent ? 'text-red-400' : warning ? 'text-amber-400' : 'text-white'}`}>{u.remaining}d</div>
                  <div className="text-[10px] text-white/30 font-mono capitalize">{u.planBilling} · remaining</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"/>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email…"
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-white/[0.07] bg-white/[0.03] text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all max-w-sm"/>
        <button onClick={fetchUsers} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white p-1 max-w-sm"><RefreshCw size={12}/></button>
      </div>

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
            ) : users.map(u => {
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
                  {/* Pricing Plan — dropdown */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1.5">
                      <select
                        value={u.pricingPlanId?._id || ''}
                        onChange={e => patch(u._id, { pricingPlanId: e.target.value || null })}
                        className="bg-[#11151F] border border-white/[0.1] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 min-w-[140px]"
                        style={{colorScheme:'dark'}}
                      >
                        <option value="" className="bg-[#11151F] text-white/50">— Select plan —</option>
                        {pricingPlans.map(p => (
                          <option key={p._id} value={p._id} className="bg-[#11151F] text-white">
                            {p.tier} {p.monthlyPrice > 0 ? `· ₹${p.monthlyPrice}/mo` : '· Free'}
                          </option>
                        ))}
                      </select>
                      {u.pricingPlanId && (
                        <div className="flex gap-1">
                          {(['monthly', 'yearly'] as const).map(b => {
                            const price = b === 'monthly' ? u.pricingPlanId!.monthlyPrice : u.pricingPlanId!.yearlyPrice;
                            return (
                              <button key={b} onClick={() => patch(u._id, { planBilling: b })}
                                className={`text-[9px] font-mono px-1.5 py-0.5 rounded capitalize transition-all ${(u.planBilling || 'monthly') === b ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40' : 'text-white/30 border border-white/[0.07] hover:text-white'}`}>
                                {b} {price > 0 ? `₹${price}` : 'Free'}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
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
                    <select value={u.allocatedTemplate?._id || ''} onChange={e => patch(u._id, { templateId: e.target.value })}
                      className="bg-[#11151F] border border-white/[0.1] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 min-w-[130px]"
                      style={{colorScheme:'dark'}}>
                      <option value="" className="bg-[#11151F] text-white/50">— None —</option>
                      {templates.filter(t => t.isPublished).map(t => (
                        <option key={t._id} value={t._id} className="bg-[#11151F] text-white">{t.name} ({t.pricingType})</option>
                      ))}
                    </select>
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
            {/* Pricing Plan — card selector with billing toggle */}
            <div>
              <label className="text-sm text-white/60 mb-2 block">Pricing Plan *</label>
              <div className="space-y-2">
                {pricingPlans.length === 0 && <p className="text-xs text-white/30">No pricing plans configured yet.</p>}
                {pricingPlans.map(p => {
                  const isPaid = p.monthlyPrice > 0 || p.yearlyPrice > 0;
                  const selected = form.pricingPlanId === p._id;
                  const price = form.planBilling === 'yearly' ? p.yearlyPrice : p.monthlyPrice;
                  return (
                    <div key={p._id} onClick={() => setForm(f => ({ ...f, pricingPlanId: p._id, plan: isPaid ? 'paid' : 'free', templateId: '' }))}
                      className={`cursor-pointer rounded-xl border p-3 transition-all ${selected ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/[0.08] hover:border-white/20'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-indigo-400' : 'border-white/20'}`}>
                            {selected && <div className="w-2 h-2 rounded-full bg-indigo-400"/>}
                          </div>
                          <span className="text-sm font-semibold text-white">{p.tier}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${isPaid ? 'bg-violet-400/15 text-violet-300' : 'bg-emerald-400/15 text-emerald-300'}`}>
                            {isPaid ? 'PAID' : 'FREE'}
                          </span>
                        </div>
                        {isPaid && (
                          <span className="text-sm font-bold text-white">
                            {price > 0 ? `₹${price}` : 'Free'}<span className="text-xs text-white/40 font-normal">/{form.planBilling === 'yearly' ? 'yr' : 'mo'}</span>
                          </span>
                        )}
                      </div>
                      {/* Billing toggle shown inside selected plan */}
                      {selected && isPaid && (
                        <div className="flex gap-2 mt-2.5 ml-6">
                          {(['monthly', 'yearly'] as const).map(b => (
                            <button key={b} type="button" onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, planBilling: b })); }}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${form.planBilling === b ? 'border-indigo-500 bg-indigo-500/20 text-white' : 'border-white/[0.08] text-white/40 hover:text-white'}`}>
                              {b === 'monthly' ? `Monthly · ₹${p.monthlyPrice}` : `Yearly · ₹${p.yearlyPrice}`}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Paid Amount — shown when paid plan selected */}
            {form.plan === 'paid' && (
              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Amount Paid (₹)</label>
                <input type="number" value={form.paidAmount} onChange={e => setForm({...form, paidAmount: e.target.value})} placeholder="0"
                  className="w-full h-10 rounded-xl border border-white/[0.12] bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              </div>
            )}
            <hr className="border-white/[0.07]"/>
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
              <label className="text-sm text-white/60 mb-1.5 block">
                Allocate template
                {form.pricingPlanId && <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-white/30">{form.plan === 'free' ? 'Free only' : 'All templates'}</span>}
              </label>
              <select value={form.templateId} onChange={e => setForm({...form, templateId: e.target.value})}
                className="w-full h-10 rounded-xl border border-white/[0.12] bg-white/[0.03] px-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">— No template —</option>
                {availableTemplates.map(t => (
                  <option key={t._id} value={t._id}>{t.name} ({t.category}) · {t.pricingType}</option>
                ))}
              </select>
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
