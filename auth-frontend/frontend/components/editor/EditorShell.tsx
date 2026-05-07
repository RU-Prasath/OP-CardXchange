'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Section { key: string; label: string; }

interface Props {
  children: React.ReactNode;
  username?: string;
}

export default function EditorShell({ children, username }: Props) {
  const pathname = usePathname();
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    fetch('/api/portfolio/template-config')
      .then(r => r.json())
      .then(d => { if (d.success) setSections(d.data.sections); });
  }, []);

  return (
    <div className="-m-6 flex flex-col min-h-[calc(100vh-56px)]">
      {/* Horizontal section tabs — built from template config */}
      <div className="border-b border-white/[0.07] bg-black/20 px-4 flex items-center gap-1 shrink-0 overflow-x-auto">
        {sections.map(s => {
          const href = `/dashboard/editor/${s.key}`;
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={s.key} href={href}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all',
                active
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-white/40 hover:text-white/70 hover:border-white/20'
              )}
            >
              {s.label}
            </Link>
          );
        })}
        {username && (
          <a href={`/portfolio/${username}`} target="_blank"
            className="ml-auto flex items-center gap-1.5 px-3 py-2 text-xs text-white/30 hover:text-white/60 transition-colors shrink-0">
            <ExternalLink size={12}/> View live
          </a>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto" style={{ background: '#F0F2F5' }}>
        {children}
      </div>
    </div>
  );
}
