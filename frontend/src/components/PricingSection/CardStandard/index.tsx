import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function CardStandard({ isYearly }: { isYearly: boolean }) {
  return (
    <Card className="border-amber-400 border-2 lg:min-w-[400px] flex flex-col items-start lg:w-full">
      <CardHeader>
        <CardTitle className="text-4xl text-start font-bold text-black md:mb-2">
          Standard
        </CardTitle>
        <CardDescription className="text-3xl text-start font-bold text-amber-400 md:text-4xl">
          {isYearly ? '$8' : '$10'}{' '}
          <span className="text-gray-500 text-lg">/ month</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside text-lg text-left space-y-4 md:text-xl">
          <li className="flex items-center gap-2">
            <CircleCheck className="w-5 h-5 text-green-500 md:w-7 md:h-7" />
            <span>Up to 1,000 reviews per month</span>
          </li>
          <li className="flex items-center gap-2">
            <CircleCheck className="w-5 h-5 text-green-500 md:w-7 md:h-7" />
            <span>CSV import functionality</span>
          </li>
          <li className="flex items-center gap-2">
            <CircleCheck className="w-5 h-5 text-green-500 md:w-7 md:h-7" />
            <span>Basic sentiment analysis</span>
          </li>
          <li className="flex items-center gap-2">
            <CircleCheck className="w-5 h-5 text-green-500 md:w-7 md:h-7" />
            <span>Email support</span>
          </li>
          <li className="flex items-center gap-2">
            <CircleCheck className="w-5 h-5 text-green-500 md:w-7 md:h-7" />
            <span>Basic customization options</span>
          </li>
        </ul>
      </CardContent>
      <Link to="/register" className="w-full">
        <Button className="shadow-md shadow-black/80 w-5/6 mx-auto my-4 font-bold text-lg bg-amber-400 text-white md:text-xl hover:scale-105 hover:cursor-pointer hover:bg-amber-500">
          Get Started
        </Button>
      </Link>
    </Card>
  );
}
