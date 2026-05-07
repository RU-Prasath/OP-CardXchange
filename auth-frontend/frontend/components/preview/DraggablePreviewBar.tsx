'use client';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

export default function DraggablePreviewBar({ templateName }: { templateName: string }) {
  const barRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 16 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    // Centre horizontally on mount
    setPos({ x: window.innerWidth / 2 - bar.offsetWidth / 2, y: 16 });
  }, []);

  function onMouseDown(e: React.MouseEvent) {
    const bar = barRef.current;
    if (!bar) return;
    offset.current = { x: e.clientX - bar.getBoundingClientRect().left, y: e.clientY - bar.getBoundingClientRect().top };
    setDragging(true);
  }

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging]);

  return (
    <div
      ref={barRef}
      onMouseDown={onMouseDown}
      style={{
        position: 'fixed', left: pos.x, top: pos.y, zIndex: 9999,
        cursor: dragging ? 'grabbing' : 'grab',
        background: 'rgba(10,13,20,0.92)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.15)', borderRadius: 9999,
        padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 10,
        color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'monospace',
        userSelect: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22D3EE', boxShadow: '0 0 6px #22D3EE', flexShrink: 0 }} className="animate-pulse"/>
      Preview — {templateName} template
      <Link href="/templates" onClick={e => e.stopPropagation()}
        style={{ color: '#22D3EE', marginLeft: 6, textDecoration: 'none' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.color = '#22D3EE')}
      >← Back</Link>
    </div>
  );
}
