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
        Benefits of using FeedAI
      </h2>
      <p className="text-gray-500 text-xl mb-10 lg:text-2xl lg:mt-2">
        Save time and money while getting deeper insights into your customer
        feedback
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-20">
        <BenefitCard
          icon={
            <BrainCircuit className="w-8 h-8 text-sky-700 md:w-12 md:h-12" />
          }
          title="AI-Powered Insights"
          description="Leverage advanced AI to extract meaningful patterns and insights from customer feedback"
        />
        <BenefitCard
          icon={<Clock className="w-8 h-8 text-sky-700 md:w-12 md:h-12" />}
          title="Save Time"
          description="Get comprehensive analysis in seconds instead of weeks of manual review"
        />
        <BenefitCard
          icon={<DollarSign className="w-8 h-8 text-sky-700 md:w-12 md:h-12" />}
          title="Save Money"
          description="Reduce costs by automating the analysis process that would otherwise require a dedicated team"
        />
        <BenefitCard
          icon={<Users className="w-8 h-8 text-sky-700 md:w-12 md:h-12" />}
          title="Connect with your customers"
          description="Understand customer needs and pain points to build stronger relationships"
        />
        <BenefitCard
          icon={
            <SquareCheckBig className="w-8 h-8 text-sky-700 md:w-12 md:h-12" />
          }
          title="Easy to Use"
          description="Intuitive interface with clear visualizations and actionable recommendations"
        />
        <BenefitCard
          icon={
            <NotebookText className="w-8 h-8 text-sky-700 md:w-12 md:h-12" />
          }
          title="Centralized Dashboard"
          description="Access all your reviews and insights in one organized, searchable platform"
        />
      </div>
    </div>
  );
}
