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

export function CardPro({ isYearly }: { isYearly: boolean }) {
  return (
    <Card className="relative border-sky-700 border-2 flex flex-col items-start lg:min-w-[400px] lg:w-full">
      <span className="absolute top-0 right-0 -translate-y-[1px] bg-sky-700 text-white text-lg px-2 py-1 lg:text-2xl font-bold lg:px-5 lg:py-1 rounded-bl-lg rounded-tr-lg">
        Popular
      </span>
      <CardHeader>
        <CardTitle className="text-4xl text-start font-bold text-black min-w-[20vh] md:mb-2">
          Professional
        </CardTitle>
        <CardDescription className="text-3xl text-start font-bold text-sky-700 min-w-[20vh] lg:text-4xl">
          {isYearly ? '$23' : '$29'}{' '}
          <span className="text-gray-500 text-lg">/ month</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside text-lg text-left space-y-4 md:text-xl">
          <li className="flex items-center gap-2">
            <CircleCheck className="w-5 h-5 text-green-500 md:w-7 md:h-7" />
            <span>Unlimited reviews</span>
          </li>
          <li className="flex items-center gap-2">
            <CircleCheck className="w-5 h-5 text-green-500 md:w-7 md:h-7" />
            <span>CSV import + Web scraping</span>
          </li>
          <li className="flex items-center gap-2">
            <CircleCheck className="w-5 h-5 text-green-500 md:w-7 md:h-7" />
            <span>Advanced AI insights</span>
          </li>
          <li className="flex items-center gap-2">
            <CircleCheck className="w-5 h-5 text-green-500 md:w-7 md:h-7" />
            <span>Priority support</span>
          </li>
          <li className="flex items-center gap-2">
            <CircleCheck className="w-5 h-5 text-green-500 md:w-7 md:h-7" />
            <span>Custom reporting</span>
          </li>
        </ul>
      </CardContent>
      <Link to="/register" className="w-full">
        <Button className="shadow-md shadow-black/80 w-5/6 mx-auto my-4 text-lg font-bold bg-sky-700 text-white hover:scale-105 hover:cursor-pointer hover:bg-sky-800 md:text-xl">
          Get Started
        </Button>
      </Link>
    </Card>
  );
}
