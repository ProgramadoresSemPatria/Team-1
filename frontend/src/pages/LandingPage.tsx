import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import HeroImage from '@/assets/hero-image.png';
import { BenefitCard } from '@/components/BenefitCard';
import { BrainCircuit, Clock, DollarSign, SquareCheckBig, Users, NotebookText } from 'lucide-react';
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
        <Button className="mt-16 w-1/2 bg-sky-700 text-white md:mt-32">
          Get Started
        </Button>
      </div>
      <div className="flex flex-col gap-6 my-16">
        <h2 className="text-2xl font-bold text-gray-800">
          Benefits of using our service
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <BenefitCard
            icon={<BrainCircuit className="w-8 h-8 text-sky-700" />}
            title="Best insights with AI"
            description="Use the power of AI to get the best insights about your brand"
          />
          <BenefitCard
            icon={<Clock className="w-8 h-8 text-sky-700" />}
            title="Save Time"
            description="With just a few clicks, you can get the latest reviews and feedback from your customers"
          />
          <BenefitCard
            icon={<DollarSign className="w-8 h-8 text-sky-700" />}
            title="Save Money"
            description="Instead of hiring a team of people to do it, we do it for you in seconds and for a fraction of the cost"
          />
          <BenefitCard
            icon={<Users className="w-8 h-8 text-sky-700" />}
            title="Connect with your customers"
            description="We connect you with your customers and you can see what they are saying about your brand"
          />
          <BenefitCard
            icon={<SquareCheckBig className="w-8 h-8 text-sky-700" />}
            title="Easy to Use and Understand"
            description="Our platform is designed to be easy to use and understand"
          />
          <BenefitCard
            icon={<NotebookText className="w-8 h-8 text-sky-700" />}
            title="Save your reviews" 
            description="We save your reviews and you can see them in one place"
          />
        </div>
      </div>
    </div>
  );
}
