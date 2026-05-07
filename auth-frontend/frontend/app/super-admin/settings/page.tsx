'use client';
import { useState, useEffect } from 'react';
import { Globe, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SiteSettings { developerCount: number; avgLighthouse: number; contactEmail: string; contactPhone: string; }

export default function SuperAdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({ developerCount:10, avgLighthouse:75, contactEmail:'', contactPhone:'' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/super-admin/settings').then(r => r.json()).then(d => { if (d.success) setSettings(d.data); setLoading(false); });
  }, []);

  async function save() {
    setSaving(true);
    const res = await fetch('/api/super-admin/settings', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(settings) });
    const d = await res.json();
    if (d.success) toast({ title: 'Settings saved' });
    else toast({ title: 'Error', description: d.error, variant: 'destructive' });
    setSaving(false);
  }

  const inp = 'w-full h-10 rounded-xl border border-white/[0.12] bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Site settings</h1>
        <p className="text-sm text-white/40">Control landing page stats and contact information.</p>
      </div>

      {loading ? <div className="text-white/30 text-sm">Loading…</div> : (
        <div className="space-y-5">
          <div className="card-panel p-6">
            <h2 className="font-semibold mb-1 flex items-center gap-2"><Globe size={15} className="text-cyan-400"/> Landing page stats</h2>
            <p className="text-sm text-white/40 mb-5">These values appear in the stats bar on the landing page.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/60 mb-1 block">Developer count</label>
                <input type="number" value={settings.developerCount} onChange={e => setSettings({...settings,developerCount:+e.target.value})} className={inp}/>
                <p className="text-xs text-white/30 mt-1">Displayed as &quot;X+&quot; or &quot;Xk+&quot; if ≥1000</p>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">Avg Lighthouse score</label>
                <input type="number" min={0} max={100} value={settings.avgLighthouse} onChange={e => setSettings({...settings,avgLighthouse:+e.target.value})} className={inp}/>
                <p className="text-xs text-white/30 mt-1">Displayed as &quot;X/100&quot;</p>
              </div>
            </div>
          </div>

          <div className="card-panel p-6">
            <h2 className="font-semibold mb-1 flex items-center gap-2"><Settings size={15} className="text-violet-400"/> Contact information</h2>
            <p className="text-sm text-white/40 mb-5">Shown in the &quot;Get this template&quot; popup for paid templates.</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-1 block">Contact email</label>
                <input type="email" value={settings.contactEmail} onChange={e => setSettings({...settings,contactEmail:e.target.value})} placeholder="contact@folioforge.com" className={inp}/>
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">Phone / WhatsApp</label>
                <input value={settings.contactPhone} onChange={e => setSettings({...settings,contactPhone:e.target.value})} placeholder="+91 98765 43210" className={inp}/>
              </div>
            </div>
          </div>

          <button onClick={save} disabled={saving} className="btn-grad w-full py-2.5 text-sm disabled:opacity-50">
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      )}
    </div>
  );
}
