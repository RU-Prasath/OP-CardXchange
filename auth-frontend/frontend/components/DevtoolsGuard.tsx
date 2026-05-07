'use client';
import { useEffect } from 'react';

export default function DevtoolsGuard() {
  useEffect(() => {
    const blocked = (e: KeyboardEvent) => {
      if (e.key === 'F12') { e.preventDefault(); return false; }
      if (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) { e.preventDefault(); return false; }
      if (e.ctrlKey && e.key === 'u') { e.preventDefault(); return false; }
    };
    const blockedContext = (e: MouseEvent) => { e.preventDefault(); };

    document.addEventListener('keydown', blocked);
    document.addEventListener('contextmenu', blockedContext);
    return () => {
      document.removeEventListener('keydown', blocked);
      document.removeEventListener('contextmenu', blockedContext);
    };
  }, []);

  return null;
}
