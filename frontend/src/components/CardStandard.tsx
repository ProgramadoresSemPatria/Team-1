import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CardStandard({ isYearly }: { isYearly: boolean }) {
  return (
    <Card className="border-amber-400 border-2 flex flex-col items-start lg:w-full">
      <CardHeader>
        <CardTitle className="text-3xl text-start font-bold text-black md:text-4xl">
          Standard
        </CardTitle>
        <CardDescription className="text-2xl text-start font-bold text-amber-400 md:text-4xl">
          {isYearly ? '$8' : '$10'}{' '}
          <span className="text-gray-500 text-sm">/ month</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside text-left space-y-2 md:text-lg">
          <li className="flex items-center gap-2">
            <CircleCheck className="w-4 h-4 text-green-500 md:w-6 md:h-6" />
            <span>Up to 1,000 reviews per month</span>
          </li>
          <li className="flex items-center gap-2">
            <CircleCheck className="w-4 h-4 text-green-500 md:w-6 md:h-6" />
            <span>CSV import functionality</span>
          </li>
          <li className="flex items-center gap-2">
            <CircleCheck className="w-4 h-4 text-green-500 md:w-6 md:h-6" />
            <span>Basic sentiment analysis</span>
          </li>
          <li className="flex items-center gap-2">
            <CircleCheck className="w-4 h-4 text-green-500 md:w-6 md:h-6" />
            <span>Email support</span>
          </li>
          <li className="flex items-center gap-2">
            <CircleCheck className="w-4 h-4 text-green-500 md:w-6 md:h-6" />
            <span>Basic customization options</span>
          </li>
        </ul>
      </CardContent>
      <Button className="w-5/6 mx-auto mt-4 bg-amber-400 text-white md:text-xl hover:scale-105 hover:cursor-pointer hover:bg-amber-500">
        Get Started
      </Button>
    </Card>
  );
}
