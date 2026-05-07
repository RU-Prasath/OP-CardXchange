import DevtoolsGuard from '@/components/DevtoolsGuard';

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DevtoolsGuard />
      {children}
    </>
  );
}
