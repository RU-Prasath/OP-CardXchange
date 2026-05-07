'use client';
import { ReactNode } from 'react';

const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all";

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">{children}</h3>;
}

export function CardSubtitle({ children }: { children: ReactNode }) {
  return <p className="text-xs text-gray-400 mb-4">{children}</p>;
}

export function Label({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <label className={`block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ${className}`}>{children}</label>;
}

export function Input({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputCls}/>;
}

export function Textarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={`${inputCls} resize-y min-h-[80px]`}/>;
}

export function ColorField({ label, description, value, onChange, placeholder }: { label: string; description?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const hexVal = value.startsWith('#') ? value : '#10b981';
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">{label}</label>
      {description && <p className="text-[11px] text-gray-400 mb-1.5">{description}</p>}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg border border-gray-200 relative overflow-hidden shrink-0 shadow-sm" style={{ background: value || '#000' }}>
          <input type="color" value={hexVal} onChange={e => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
        </div>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={inputCls}/>
      </div>
    </div>
  );
}
