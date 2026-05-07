'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditorIndex() {
  const router = useRouter();
  useEffect(() => {
    fetch('/api/portfolio/template-config')
      .then(r => r.json())
      .then(d => {
        const firstSection = d.success && d.data.sections?.[0]?.key;
        router.replace(`/dashboard/editor/${firstSection || 'hero'}`);
      });
  }, [router]);
  return null;
}
