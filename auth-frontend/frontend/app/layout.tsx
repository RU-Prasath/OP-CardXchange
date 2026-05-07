import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import DevtoolsGuard from '@/components/DevtoolsGuard';

export const metadata: Metadata = {
  title: 'Folioforge — Build a premium developer portfolio in minutes',
  description: 'Choose from 40+ hand-crafted templates, customize every section in a no-code editor, and ship to your own domain.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#0A0D14] text-white antialiased">
        <DevtoolsGuard/>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
