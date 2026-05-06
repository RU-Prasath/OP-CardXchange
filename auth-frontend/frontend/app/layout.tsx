import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Prasath R U — Junior Software Developer',
  description:
    'Junior Software Developer with experience building scalable web applications using React.js, Next.js, Node.js, and MongoDB.',
  keywords: ['software developer', 'React', 'Next.js', 'Node.js', 'MongoDB', 'full-stack'],
  authors: [{ name: 'Prasath R U' }],
  openGraph: {
    title: 'Prasath R U — Junior Software Developer',
    description: 'Building scalable web applications. Based in Chennai, India.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Set theme before paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('portfolio-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
