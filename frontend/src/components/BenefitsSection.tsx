import { BenefitCard } from './BenefitCard';
import {
  BrainCircuit,
  Clock,
  DollarSign,
  Users,
  SquareCheckBig,
  NotebookText,
} from 'lucide-react';

export function BenefitsSection() {
  return (
    <div className="flex flex-col gap-6 my-16">
      <h2 className="text-2xl font-bold text-gray-800 md:text-4xl">
        Benefits of using our service
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <BenefitCard
          icon={
            <BrainCircuit className="w-8 h-8 text-sky-700 md:w-12 md:h-12" />
          }
          title="Best insights with AI"
          description="Use the power of AI to get the best insights about your brand"
        />
        <BenefitCard
          icon={<Clock className="w-8 h-8 text-sky-700 md:w-12 md:h-12" />}
          title="Save Time"
          description="With just a few clicks, you can get the latest reviews and feedback from your customers"
        />
        <BenefitCard
          icon={<DollarSign className="w-8 h-8 text-sky-700 md:w-12 md:h-12" />}
          title="Save Money"
          description="Instead of hiring a team of people to do it, we do it for you in seconds and for a fraction of the cost"
        />
        <BenefitCard
          icon={<Users className="w-8 h-8 text-sky-700 md:w-12 md:h-12" />}
          title="Connect with your customers"
          description="We connect you with your customers and you can see what they are saying about your brand"
        />
        <BenefitCard
          icon={
            <SquareCheckBig className="w-8 h-8 text-sky-700 md:w-12 md:h-12" />
          }
          title="Easy to Use and Understand"
          description="Our platform is designed to be easy to use and understand"
        />
        <BenefitCard
          icon={
            <NotebookText className="w-8 h-8 text-sky-700 md:w-12 md:h-12" />
          }
          title="Save your reviews"
          description="We save your reviews and you can see them in one place"
        />
      </div>
    </div>
  );
}
