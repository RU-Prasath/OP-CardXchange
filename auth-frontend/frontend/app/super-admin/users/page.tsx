'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, ToggleLeft, ToggleRight, Trash2, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface User { _id: string; email: string; username: string; isActive: boolean; allocatedTemplate: { _id: string; name: string; category: string } | null; createdAt: string; }
interface Template { _id: string; name: string; slug: string; category: string; isPublished: boolean; }

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ email: '', username: '', templateId: '' });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/super-admin/users?search=${search}`);
    const data = await res.json();
    if (data.success) setUsers(data.data);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetch('/api/super-admin/templates').then(r => r.json()).then(d => { if (d.success) setTemplates(d.data); });
  }, []);

  async function createUser() {
    if (!form.email || !form.username) return;
    setSaving(true);
    const res = await fetch('/api/super-admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (data.success) {
      toast({ title: 'User created', variant: 'default' });
      setCreateOpen(false);
      setForm({ email: '', username: '', templateId: '' });
      fetchUsers();
    } else {
      toast({ title: 'Error', description: data.error, variant: 'destructive' });
    }
    setSaving(false);
  }

  async function toggleActive(id: string, current: boolean) {
    const res = await fetch(`/api/super-admin/users/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !current }) });
    if ((await res.json()).success) fetchUsers();
  }

  async function deleteUser(id: string) {
    if (!confirm('Delete this user and their portfolio? This cannot be undone.')) return;
    await fetch(`/api/super-admin/users/${id}`, { method: 'DELETE' });
    fetchUsers();
    toast({ title: 'User deleted' });
  }

  async function changeTemplate(id: string, templateId: string) {
    await fetch(`/api/super-admin/users/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ templateId }) });
    fetchUsers();
    toast({ title: 'Template updated' });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Users</h1>
          <p className="text-sm text-white/40">Manage user accounts, templates, and access.</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-grad flex items-center gap-2 px-4 py-2 text-sm">
          <Plus size={14}/> New user
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"/>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email…"
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-white/[0.07] bg-white/[0.03] text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all max-w-sm"/>
        <button onClick={fetchUsers} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white p-1 max-w-sm"><RefreshCw size={12}/></button>
      </div>

      {/* Table */}
      <div className="card-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07]">
              {['User','Username','Template','Status','Portfolio','Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/30 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12 text-white/30 text-sm">Loading…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-white/30 text-sm">No users yet. Create your first one.</td></tr>
            ) : users.map(u => (
              <tr key={u._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-[#0A0D14] shrink-0" style={{background:'linear-gradient(135deg,#22D3EE,#6366F1,#A855F7)'}}>{u.email[0].toUpperCase()}</div>
                    <span className="text-white/70 font-mono text-xs">{u.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-white/50">{u.username}</td>
                <td className="px-4 py-3.5">
                  <select value={u.allocatedTemplate?._id || ''} onChange={e => changeTemplate(u._id, e.target.value)}
                    className="bg-white/[0.04] border border-white/[0.07] rounded-lg px-2 py-1 text-xs text-white/70 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option value="">— None —</option>
                    {templates.filter(t => t.isPublished).map(t => (
                      <option key={t._id} value={t._id}>{t.name} ({t.category})</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={u.isActive ? 'success' : 'destructive'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                </td>
                <td className="px-4 py-3.5">
                  {u.allocatedTemplate ? (
                    <a href={`/portfolio/${u.username}`} target="_blank" className="flex items-center gap-1 text-xs text-cyan-400 hover:underline font-mono">
                      /{u.username} <ExternalLink size={11}/>
                    </a>
                  ) : <span className="text-white/20 text-xs">—</span>}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(u._id, u.isActive)} className={`text-xs transition-colors ${u.isActive ? 'text-emerald-400 hover:text-red-400' : 'text-red-400 hover:text-emerald-400'}`} title={u.isActive ? 'Deactivate' : 'Activate'}>
                      {u.isActive ? <ToggleRight size={18}/> : <ToggleLeft size={18}/>}
                    </button>
                    <button onClick={() => deleteUser(u._id)} className="text-white/20 hover:text-red-400 transition-colors" title="Delete">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create user modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new user</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm text-white/60 mb-1.5 block">Email address *</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="user@company.com"
                className="w-full h-10 rounded-xl border border-white/[0.12] bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1.5 block">Username * <span className="text-white/30">(used in portfolio URL)</span></label>
              <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,'')})} placeholder="john-doe"
                className="w-full h-10 rounded-xl border border-white/[0.12] bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"/>
              {form.username && <p className="text-xs text-white/30 mt-1 font-mono">Portfolio URL: /portfolio/{form.username}</p>}
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1.5 block">Allocate template</label>
              <select value={form.templateId} onChange={e => setForm({...form, templateId: e.target.value})}
                className="w-full h-10 rounded-xl border border-white/[0.12] bg-white/[0.03] px-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">— No template —</option>
                {templates.filter(t => t.isPublished).map(t => (
                  <option key={t._id} value={t._id}>{t.name} ({t.category})</option>
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
