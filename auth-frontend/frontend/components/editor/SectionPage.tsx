'use client';
import { ReactNode } from 'react';

interface Props {
  section: string;
  title: string;
  description: string;
  children: ReactNode;
  onSave: () => void;
  saving: boolean;
  extraActions?: ReactNode;
}

export default function SectionPage({ section, title, description, children, onSave, saving, extraActions }: Props) {
  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-400 mb-2 font-mono">Admin › {title}</div>
      <div className="border-l-4 border-emerald-500 pl-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>

      <div className="space-y-6">{children}</div>

      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {extraActions}
      </div>
    </div>
  );
}
