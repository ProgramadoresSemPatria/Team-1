import { HeroSection } from '@/components/HeroSection';
import { FaqSection } from '@/components/FaqSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { PricingSection } from '@/components/PricingSection';

export function LandingPage() {
  return (
    <div className="flex flex-col justify-center items-center text-center">
      <HeroSection />
      <BenefitsSection />
      <PricingSection />
      <FaqSection />
    </div>
  );
}
