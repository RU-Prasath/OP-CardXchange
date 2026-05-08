'use client';
import { ReactNode, useState, useEffect, useRef } from 'react';

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

// ── Color conversion helpers ──
function hsvToHex(h: number, s: number, v: number): string {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const m = hex.replace('#', '').match(/.{1,2}/g);
  if (!m || m.length < 3) return { h: 145, s: 0.5, v: 0.7 };
  const r = parseInt(m[0], 16) / 255;
  const g = parseInt(m[1], 16) / 255;
  const b = parseInt(m[2], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, v };
}
function hsvToRgb(h: number, s: number, v: number) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

// ── Custom color picker popover (consistent across browsers/OS) ──
function ColorPickerPopover({ value, onChange, onClose }: { value: string; onChange: (v: string) => void; onClose: () => void }) {
  const initialHex = value.startsWith('#') && /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#10b981';
  const [hsv, setHsv] = useState(() => hexToHsv(initialHex));
  const [hexInput, setHexInput] = useState(value || initialHex);
  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const currentHex = hsvToHex(hsv.h, hsv.s, hsv.v);
  const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  function commit(h: number, s: number, v: number) {
    setHsv({ h, s, v });
    const hex = hsvToHex(h, s, v);
    setHexInput(hex);
    onChange(hex);
  }

  function handleSVPointer(e: React.PointerEvent | PointerEvent) {
    if (!svRef.current) return;
    const rect = svRef.current.getBoundingClientRect();
    const s = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const v = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    commit(hsv.h, s, v);
  }
  function handleHuePointer(e: React.PointerEvent | PointerEvent) {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    commit((x / rect.width) * 360, hsv.s, hsv.v);
  }

  function startDrag(handler: (e: React.PointerEvent | PointerEvent) => void) {
    return (e: React.PointerEvent) => {
      e.preventDefault();
      handler(e);
      const move = (m: PointerEvent) => handler(m);
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    };
  }

  function onHexBlur() {
    const v = hexInput.trim();
    if (/^#?[0-9a-fA-F]{6}$/.test(v)) {
      const hex = v.startsWith('#') ? v : `#${v}`;
      const next = hexToHsv(hex);
      setHsv(next);
      setHexInput(hex);
      onChange(hex);
    } else {
      setHexInput(currentHex);
    }
  }

  return (
    <div ref={popoverRef}
      className="absolute top-12 left-0 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 w-[260px] select-none">
      {/* Saturation/Value picker */}
      <div ref={svRef}
        className="relative w-full h-[160px] rounded-lg overflow-hidden cursor-crosshair mb-3"
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hsv.h}, 100%, 50%))`,
        }}
        onPointerDown={startDrag(handleSVPointer)}
      >
        <div className="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow-md pointer-events-none ring-1 ring-black/30"
          style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>
      {/* Current color preview + hex input */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 rounded-md border border-gray-200 shrink-0" style={{ background: currentHex }} />
        <input
          type="text"
          value={hexInput}
          onChange={e => setHexInput(e.target.value)}
          onBlur={onHexBlur}
          onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
          className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-md font-mono text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      {/* Hue slider */}
      <div ref={hueRef}
        className="relative w-full h-3.5 rounded-full cursor-pointer mb-2"
        style={{ background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)' }}
        onPointerDown={startDrag(handleHuePointer)}
      >
        <div className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow pointer-events-none ring-1 ring-black/30"
          style={{ left: `${(hsv.h / 360) * 100}%`, transform: 'translate(-50%, -50%)', background: `hsl(${hsv.h}, 100%, 50%)` }}
        />
      </div>
      {/* RGB readout */}
      <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono text-gray-500">
        <div className="text-center"><div className="text-gray-700 font-semibold">{rgb.r}</div>R</div>
        <div className="text-center"><div className="text-gray-700 font-semibold">{rgb.g}</div>G</div>
        <div className="text-center"><div className="text-gray-700 font-semibold">{rgb.b}</div>B</div>
      </div>
    </div>
  );
}

export function ColorField({ label, description, value, onChange, placeholder }: { label: string; description?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  // Show actual value, else placeholder, else neutral fallback
  const swatchColor = value || placeholder || '#e5e7eb';

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">{label}</label>
      {description && <p className="text-[11px] text-gray-400 mb-1.5">{description}</p>}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-9 h-9 rounded-lg border border-gray-200 shrink-0 shadow-sm cursor-pointer hover:ring-2 hover:ring-emerald-300 transition-all"
          style={{ background: swatchColor }}
          aria-label="Open color picker"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputCls}
        />
      </div>
      {open && (
        <ColorPickerPopover
          value={value}
          onChange={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
