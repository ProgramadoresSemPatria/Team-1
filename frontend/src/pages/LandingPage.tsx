import { HeroSection } from '@/components/HeroSection';
import { FaqSection } from '@/components/FaqSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { PricingSection } from '@/components/PricingSection';
import { ExplanationSection } from '@/components/ExplanationSection';
import { ProductFlow } from '@/components/ProductFlow';
import { Header } from '@/layouts/Header';
import { Footer } from '@/components/Footer/index';

export function LandingPage() {
  return (
    <>
      <Header />
      <div className="flex flex-col justify-center items-center text-center">
        <HeroSection />
        <ExplanationSection />
        <BenefitsSection />
        <ProductFlow />
        <PricingSection />
        <FaqSection />
        <Footer />
      </div>
    </>
  );
}
