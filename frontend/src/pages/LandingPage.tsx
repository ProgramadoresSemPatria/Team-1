import { HeroSection } from '@/components/HeroSection';
import { FaqSection } from '@/components/FaqSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { PricingSection } from '@/components/PricingSection';
import { ExplanationSection } from '@/components/ExplanationSection';
import { ProductFlow } from '@/components/ProductFlow';

export function LandingPage() {
  return (
    <div className="flex flex-col justify-center items-center text-center">
      <HeroSection />
      <ExplanationSection />
      <BenefitsSection />
      <ProductFlow />
      <PricingSection />
      <FaqSection />
    </div>
  );
}
