import LandingNav from '@/components/landing/LandingNav';
import Hero from '@/components/landing/Hero';
import Stats from '@/components/landing/Stats';
import TemplateShowcase from '@/components/landing/TemplateShowcase';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import FAQ from '@/components/landing/FAQ';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="relative">
      {/* Grid backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:'linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)',
          backgroundSize:'56px 56px',
          maskImage:'radial-gradient(ellipse 80% 60% at 50% 0%,#000 30%,transparent 80%)',
        }}/>
      <LandingNav />
      <Hero />
      <Stats />
      <TemplateShowcase />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
