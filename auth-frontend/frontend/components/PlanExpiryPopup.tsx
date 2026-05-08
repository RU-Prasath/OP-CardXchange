'use client';
import { useEffect, useState } from 'react';

interface Props { remaining: number; contactPhone: string; }

export default function PlanExpiryPopup({ remaining, contactPhone }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show once per day — key includes the date so it resets each day
    const key = `plan_expiry_dismissed_${new Date().toDateString()}`;
    if (!sessionStorage.getItem(key)) {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-amber-500/40 bg-[#0A0D14] shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-xl">⚠️</div>
          <div>
            <h2 className="font-bold text-base text-white">Portfolio expiring soon</h2>
            <p className="text-xs text-amber-400 font-mono">{remaining} day{remaining === 1 ? '' : 's'} remaining</p>
          </div>
        </div>
        <p className="text-sm text-white/60 leading-relaxed mb-5">
          Your portfolio plan expires in <span className="text-white font-semibold">{remaining} day{remaining === 1 ? '' : 's'}</span>.
          Please renew to keep your portfolio live.
          {contactPhone && (
            <> Contact admin at <a href={`tel:${contactPhone}`} className="text-cyan-400 font-mono hover:underline">{contactPhone}</a>.</>
          )}
        </p>
        <button
          onClick={() => {
            sessionStorage.setItem(`plan_expiry_dismissed_${new Date().toDateString()}`, '1');
            setOpen(false);
          }}
          className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-semibold hover:bg-amber-500/30 transition-colors"
        >
          I understand
        </button>
      </div>
    </div>
  );
}
