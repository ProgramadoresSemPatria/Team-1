import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CardsMonthly } from './CardsMonthly';
import { CardsYearly } from './CardsYearly';

export function PricingSection() {
  return (
    <div className="flex flex-col gap-6 my-16">
      <h2 className="text-2xl font-bold text-gray-800 lg:text-5xl">
        Our Pricing
      </h2>

      <Tabs defaultValue="monthly" className="w-full max-w-3xl mx-auto mt-8">
        <TabsList className="flex w-full justify-center mb-8">
          <TabsTrigger value="monthly" className="hover:cursor-pointer">
            Monthly
          </TabsTrigger>
          <TabsTrigger value="yearly" className="hover:cursor-pointer">
            Yearly (save 20%)
          </TabsTrigger>
        </TabsList>
        <TabsContent value="monthly">
          <CardsMonthly />
        </TabsContent>
        <TabsContent value="yearly">
          <CardsYearly />
        </TabsContent>
      </Tabs>
    </div>
  );
}
