import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardStandard } from './CardStandard';
import { CardPro } from './CardPro';

export function PricingSection() {
  return (
    <div className="flex flex-col gap-6 my-16">
      <h2 className="text-2xl font-bold text-gray-800 lg:text-5xl">
        Our Pricing
      </h2>

      <Tabs defaultValue="monthly" className="w-full flex flex-col items-center max-w-3xl mx-auto mt-8">
        <TabsList className="flex w-full justify-center mb-8">
          <TabsTrigger value="monthly" className="hover:cursor-pointer">
            Monthly
          </TabsTrigger>
          <TabsTrigger value="yearly" className="hover:cursor-pointer">
            Yearly (save 20%)
          </TabsTrigger>
        </TabsList>
        <TabsContent value="monthly">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-20 md:min-w-[1000px]">
            <CardStandard isYearly={false} />
            <CardPro isYearly={false}/>
          </div>
        </TabsContent>
        <TabsContent value="yearly">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-20 md:w-full md:min-w-[1000px]">
            <CardStandard isYearly={true} />
            <CardPro isYearly={true} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
