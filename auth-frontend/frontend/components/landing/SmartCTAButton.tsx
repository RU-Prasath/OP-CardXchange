'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SmartCTAButton({ label, className }: { label: string; className?: string }) {
  const [href, setHref] = useState('/login');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => { if (d.authenticated) setHref(d.role === 'superadmin' ? '/super-admin' : '/dashboard'); })
      .catch(() => {});
  }, []);

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
