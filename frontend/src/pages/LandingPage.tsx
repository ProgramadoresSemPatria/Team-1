import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import HeroImage from '@/assets/hero-image.png';

export function LandingPage() {
  return (
    <div className="flex flex-col justify-center items-center text-center">
      <div>
        <h1 className="font-bold text-2xl mt-16 text-gray-800 mb-5">
          Find out what people are saying about your brand{' '}
          <span className="font-bold text-sky-700">in seconds.</span>
        </h1>
        <p className="text-gray-500">
          Now you don't need to dedicate a team for weeks to find out what
          people are saying about your brand, we do it for you in seconds.
        </p>

        <AspectRatio ratio={16 / 9} className="w-full p-10">
          <img src={HeroImage} alt="Landing Page" className="rounded-lg" />
        </AspectRatio>
        <Button className="mt-16 w-1/2 bg-sky-700 text-white">
          Get Started
        </Button>
      </div>
    </div>
  );
}
