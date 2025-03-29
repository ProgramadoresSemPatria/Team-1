import { BarChart3, BrainCircuit, FileSpreadsheet } from 'lucide-react';

export function ProductFlow() {
  return (
    <div className="flex flex-col items-center justify-center lg:w-full lg:max-h-[70vh] lg:px-40 lg:mt-20">
      <h3 className="text-2xl font-bold text-gray-800 md:text-4xl">
        How FeedAI works
      </h3>
      <p className="text-gray-500 text-xl mb-10 lg:text-2xl lg:mt-2">
        Get valuabe insights about in three steps
      </p>

      <div className="flex flex-col items-center justify-center gap-10 lg:flex-row lg:gap-20 lg:my-20">
        <div className="flex flex-col items-center justify-center gap-4">
          <FileSpreadsheet className="w-12 h-12 text-sky-700 md:w-16 md:h-16 bg-sky-100 rounded-full p-2" />
          <h3 className="text-2xl font-bold text-gray-800 md:text-4xl">
            1. Import Data
          </h3>
          <p>
            Upload your CSV file with customer reviews or let us scrape reviews
            from the web
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <BrainCircuit className="w-12 h-12 text-sky-700 md:w-16 md:h-16 bg-sky-100 rounded-full p-2" />
          <h3 className="text-2xl font-bold text-gray-800 md:text-4xl">
            2. AI Analysis
          </h3>
          <p>
            Our AI processes the data, identifying patterns, sentiment, and key
            insights
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <BarChart3 className="w-12 h-12 text-sky-700 md:w-16 md:h-16 bg-sky-100 rounded-full p-2" />
          <h3 className="text-2xl font-bold text-gray-800 md:text-4xl">
            3. Get Insights
          </h3>
          <p>
            View comprehensive reports with actionable recommendations for your
            business
          </p>
        </div>
      </div>
    </div>
  );
}
