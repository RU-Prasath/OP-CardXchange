'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Globe, Lock, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/portfolio/content').then(r => r.json()).then(d => {
      if (d.success) setPublished(d.data.isPublished ?? true);
      setLoading(false);
    });
  }, []);

  async function togglePublished() {
    setSaving(true);
    const res = await fetch('/api/portfolio/visibility', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !published }),
    });
    const data = await res.json();
    if (data.success) {
      setPublished(!published);
      toast({ title: published ? 'Portfolio hidden' : 'Portfolio is now live' });
    } else {
      toast({ title: 'Error', description: data.error, variant: 'destructive' });
    }
    setSaving(false);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Settings</h1>
        <p className="text-sm text-white/40">Portfolio visibility and preferences.</p>
      </div>

      <div className="space-y-4">
        {/* Visibility */}
        <div className="card-panel p-6">
          <h2 className="font-semibold mb-1 flex items-center gap-2"><Globe size={15} className="text-cyan-400"/> Portfolio visibility</h2>
          <p className="text-sm text-white/40 mb-5">Control whether your portfolio is publicly accessible.</p>

          <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
            <div className="flex items-center gap-3">
              {published
                ? <Eye size={16} className="text-emerald-400"/>
                : <EyeOff size={16} className="text-white/30"/>}
              <div>
                <div className="text-sm font-medium">{published ? 'Public — anyone can view' : 'Hidden — not accessible'}</div>
                <div className="text-xs text-white/30 font-mono mt-0.5">{published ? 'Your portfolio is live' : 'Visitors will see a 404'}</div>
              </div>
            </div>
            <button
              onClick={togglePublished}
              disabled={saving || loading}
              className={`relative w-11 h-6 rounded-full transition-all disabled:opacity-50 ${published ? 'bg-emerald-500' : 'bg-white/[0.12]'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${published ? 'translate-x-5' : 'translate-x-0'}`}/>
            </button>
          </div>
        </div>

        {/* Security info */}
        <div className="card-panel p-6">
          <h2 className="font-semibold mb-1 flex items-center gap-2"><Lock size={15} className="text-violet-400"/> Security</h2>
          <p className="text-sm text-white/40 mb-4">Your account uses passwordless OTP authentication.</p>
          <div className="space-y-2.5">
            {[
              { label: 'Authentication method', value: 'Email OTP (6-digit code)' },
              { label: 'Session duration', value: '7 days' },
              { label: 'Code expiry', value: '5 minutes per code' },
            ].map(r => (
              <div key={r.label} className="flex justify-between text-sm px-4 py-3 rounded-lg border border-white/[0.05] bg-white/[0.02]">
                <span className="text-white/40">{r.label}</span>
                <span className="font-mono text-white/60">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
