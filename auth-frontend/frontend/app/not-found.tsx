import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0D14] text-white px-6">
      <div className="text-center max-w-md">
        <div className="font-mono text-8xl font-bold grad-text mb-4">404</div>
        <h1 className="text-2xl font-bold mb-3">Portfolio not found</h1>
        <p className="text-white/40 mb-8">This portfolio doesn&apos;t exist or has been deactivated.</p>
        <Link href="/" className="btn-grad px-6 py-3 text-sm">← Back to Folioforge</Link>
      </div>
    </div>
  );
}
