import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import HeroImage from '@/assets/hero-image.png';
import { ArrowRight } from 'lucide-react';

// TODO: Fix responsive in AspectRatio component

export function HeroSection() {
  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center lg:items-start lg:text-start lg:w-full lg:max-h-[70vh] lg:px-40 lg:flex-row">
      <div className="flex flex-col">
        <h1 className="font-bold text-4xl mt-16 mb-5 md:text-6xl">
          Understand customer feedback{' '}
          <span className="font-bold text-sky-700">in seconds.</span>
        </h1>
        <p className="text-2xl text-gray-500 mt-8 lg:mt-16 md:text-2xl md:max-w-5xl">
          FeedAI analyzes your customer reviews instantly. No more dedicating
          teams for weeks to understand what people are saying about your brand.
        </p>
        <Button className="hidden lg:flex mt-32 mb-10 h-16 rounded-xl bg-sky-700 font-bold text-2xl text-white w-8/9 hover:bg-sky-800 hover:cursor-pointer">
          Get Started{' '}
          <ArrowRight className="ml-2 mt-[1px] min-w-8 min-h-8 font-bold" />
        </Button>
      </div>

      <div className="flex flex-col w-full items-center gap-20">
        <AspectRatio
          ratio={16 / 9}
          className="lg:max-h-[70vh] w-full p-10 2xl:mt-0"
        >
          <img src={HeroImage} alt="Landing Page" className="rounded-lg" />
        </AspectRatio>

        <Button className="mt-16 mb-10 w-10/11 h-12 py-7 bg-sky-700 font-bold text-lg text-white lg:hidden">
          Get Started <ArrowRight className="w-5 h-5 font-bold mt-0.5" />
        </Button>
      </div>
    </div>
  );
}
