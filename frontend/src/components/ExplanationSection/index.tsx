import { FileSpreadsheet, Globe } from 'lucide-react';
import { FeatureCard } from '../FeatureCard';

export function ExplanationSection() {
  return (
    <div className="flex flex-col items-center justify-center lg:w-full lg:max-h-[70vh] lg:px-40 lg:mt-20">
      <div className="flex flex-col p-10">
        <h2 className="text-3xl font-bold text-gray-800 lg:text-5xl">
          Two powerful ways to analyze feedback
        </h2>
        <p className="text-gray-500 mt-4 text-xl mb-10 lg:text-2xl lg:mt-8">
          Import your own data or let us collect it for you
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 p-4">
        <FeatureCard
          icon={
            <FileSpreadsheet className="text-sky-700 w-8 h-8 lg:w-12 lg:h-12" />
          }
          title="File Upload"
          description="Upload your customer reviews in CSV format and get instant AI-powered analysis and insights."
          features={[
            'Upload your own data',
            'AI-powered analysis',
            'Ready-to-use insights and recommendations',
          ]}
        />
        <div className="relative">
          <FeatureCard
            icon={<Globe className="text-sky-700 w-8 h-8 lg:w-12 lg:h-12" />}
            title="Web Scraping"
            description="Let us collect reviews from popular plataforms and analyze what customers are saying about your brand."
            features={[
              'Automatic collection from review sites',
              'AI-powered analysis',
              'Ready-to-use insights and recommendations',
            ]}
          />
          <span className="absolute top-0 right-0 bg-yellow-500 text-white text-lg px-2 py-1lg:text-2xl font-bold lg:px-5 lg:py-2 rounded-bl-lg rounded-tr-lg">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
}
