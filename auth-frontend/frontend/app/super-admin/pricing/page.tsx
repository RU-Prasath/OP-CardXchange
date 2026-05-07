'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Check, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Feature { text: string; highlighted: boolean; missing: boolean; }
interface Plan { _id: string; tier: string; desc: string; monthlyPrice: number; yearlyPrice: number; billNote: string; cta: string; isFeatured: boolean; features: Feature[]; order: number; isVisible: boolean; }

const emptyPlan = (): Omit<Plan,'_id'> => ({ tier:'', desc:'', monthlyPrice:0, yearlyPrice:0, billNote:'', cta:'Get started', isFeatured:false, features:[], order:99, isVisible:true });

export default function PricingAdminPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const { toast } = useToast();

  async function load() {
    const res = await fetch('/api/super-admin/pricing');
    const d = await res.json();
    if (d.success) setPlans(d.data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing) return;
    setSaving(true);
    const method = isNew ? 'POST' : 'PATCH';
    const url = isNew ? '/api/super-admin/pricing' : `/api/super-admin/pricing/${editing._id}`;
    const res = await fetch(url, { method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(editing) });
    const d = await res.json();
    if (d.success) { toast({ title: isNew ? 'Plan created' : 'Plan saved' }); setEditing(null); load(); }
    else toast({ title: 'Error', description: d.error, variant: 'destructive' });
    setSaving(false);
  }

  async function deletePlan(id: string) {
    if (!confirm('Delete this pricing plan?')) return;
    await fetch(`/api/super-admin/pricing/${id}`, { method: 'DELETE' });
    toast({ title: 'Plan deleted' });
    load();
  }

  async function toggle(plan: Plan, field: 'isVisible' | 'isFeatured') {
    await fetch(`/api/super-admin/pricing/${plan._id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ [field]: !plan[field] }) });
    load();
  }

  const inp = 'w-full h-9 rounded-lg border border-white/[0.12] bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500';

  if (editing) {
    return (
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setEditing(null)} className="text-sm text-white/40 hover:text-white transition-colors">← Back</button>
          <h1 className="text-xl font-bold">{isNew ? 'New plan' : `Edit ${editing.tier}`}</h1>
        </div>
        <div className="space-y-4 card-panel p-6">
          <div className="grid grid-cols-2 gap-4">
            {([['tier','Tier name'],['desc','Description'],['billNote','Bill note'],['cta','CTA button text']] as [keyof Plan, string][]).map(([k,l]) => (
              <div key={k} className={k==='desc'||k==='billNote' ? 'col-span-2' : ''}>
                <label className="text-xs text-white/50 mb-1 block">{l}</label>
                <input value={(editing[k] as string)||''} onChange={e => setEditing({...editing,[k]:e.target.value})} className={inp}/>
              </div>
            ))}
            <div>
              <label className="text-xs text-white/50 mb-1 block">Monthly price ($)</label>
              <input type="number" value={editing.monthlyPrice} onChange={e => setEditing({...editing,monthlyPrice:+e.target.value})} className={inp}/>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Yearly price ($)</label>
              <input type="number" value={editing.yearlyPrice} onChange={e => setEditing({...editing,yearlyPrice:+e.target.value})} className={inp}/>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Display order</label>
              <input type="number" value={editing.order} onChange={e => setEditing({...editing,order:+e.target.value})} className={inp}/>
            </div>
            <div className="flex items-center gap-4 pt-5">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={editing.isFeatured} onChange={e => setEditing({...editing,isFeatured:e.target.checked})} className="rounded"/>
                Featured (most popular)
              </label>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Features</div>
            <div className="space-y-2 mb-3">
              {editing.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-white/[0.07] bg-white/[0.02]">
                  <input value={f.text} onChange={e => { const ff=[...editing.features]; ff[i]={...ff[i],text:e.target.value}; setEditing({...editing,features:ff}); }} className="flex-1 bg-transparent text-sm outline-none text-white/80"/>
                  <label className="flex items-center gap-1 text-xs text-white/50 cursor-pointer">
                    <input type="checkbox" checked={f.highlighted} onChange={e => { const ff=[...editing.features]; ff[i]={...ff[i],highlighted:e.target.checked}; setEditing({...editing,features:ff}); }}/>Bold
                  </label>
                  <label className="flex items-center gap-1 text-xs text-white/50 cursor-pointer">
                    <input type="checkbox" checked={f.missing} onChange={e => { const ff=[...editing.features]; ff[i]={...ff[i],missing:e.target.checked}; setEditing({...editing,features:ff}); }}/>Dimmed
                  </label>
                  <button onClick={() => { const ff=editing.features.filter((_,j)=>j!==i); setEditing({...editing,features:ff}); }} className="text-red-400 hover:text-red-300 text-xs px-2">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newFeature} onChange={e => setNewFeature(e.target.value)} placeholder="Add feature…" className={`${inp} flex-1`} onKeyDown={e => { if(e.key==='Enter'&&newFeature.trim()){setEditing({...editing,features:[...editing.features,{text:newFeature.trim(),highlighted:false,missing:false}]});setNewFeature('');}}}/>
              <button onClick={() => { if(newFeature.trim()){setEditing({...editing,features:[...editing.features,{text:newFeature.trim(),highlighted:false,missing:false}]});setNewFeature('');} }} className="btn-grad px-3 py-2 text-xs">Add</button>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={() => setEditing(null)} className="btn-secondary-ff flex-1 py-2.5 text-sm">Cancel</button>
          <button onClick={save} disabled={!editing.tier||saving} className="btn-grad flex-1 py-2.5 text-sm disabled:opacity-50">{saving?'Saving…':'Save plan'}</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Pricing plans</h1>
          <p className="text-sm text-white/40">Manage the pricing plans shown on the landing page.</p>
        </div>
        <button onClick={() => { setEditing(emptyPlan() as Plan); setIsNew(true); }} className="btn-grad flex items-center gap-2 px-4 py-2 text-sm">
          <Plus size={14}/> Add plan
        </button>
      </div>

      {loading ? <div className="text-center py-16 text-white/30 text-sm">Loading…</div> : (
        <div className="space-y-3">
          {plans.map(p => (
            <div key={p._id} className="card-panel p-5 flex items-center gap-4">
              <GripVertical size={16} className="text-white/20 shrink-0"/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold">{p.tier}</span>
                  {p.isFeatured && <span className="text-[10px] px-2 py-0.5 rounded-full text-[#0A0D14] font-bold" style={{background:'linear-gradient(135deg,#22D3EE,#A855F7)'}}>Featured</span>}
                  {!p.isVisible && <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.1] text-white/30">Hidden</span>}
                </div>
                <div className="text-sm text-white/40">${p.monthlyPrice}/mo · ${p.yearlyPrice}/mo yearly · {p.features.length} features</div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => toggle(p,'isVisible')} className="p-2 rounded-lg border border-white/[0.07] text-white/40 hover:text-white hover:border-white/[0.15] transition-all">
                  {p.isVisible ? <Eye size={14}/> : <EyeOff size={14}/>}
                </button>
                <button onClick={() => { setEditing({...p}); setIsNew(false); }} className="px-3 py-1.5 rounded-lg border border-white/[0.07] text-sm text-white/50 hover:text-white transition-all">Edit</button>
                <button onClick={() => deletePlan(p._id)} className="p-2 rounded-lg border border-white/[0.07] text-white/20 hover:text-red-400 hover:border-red-500/20 transition-all"><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
