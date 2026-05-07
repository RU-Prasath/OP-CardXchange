'use client';
import { useState, useEffect } from 'react';

export function usePortfolioContent() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetch('/api/portfolio/content').then(r => r.json()).then(d => {
      if (d.success) {
        setContent(d.data.content || {});
        setUsername(d.data.user?.username || '');
      }
      setLoading(false);
    });
  }, []);

  async function save(patch: Record<string, string>) {
    setSaving(true);
    const merged = { ...content, ...patch };
    setContent(merged);
    const res = await fetch('/api/portfolio/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: merged }),
    });
    setSaving(false);
    return res.json();
  }

  return { content, setContent, loading, saving, save, username };
}
