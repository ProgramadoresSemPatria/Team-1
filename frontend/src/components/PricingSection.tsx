import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PricingSection() {
  return (
    <div className="flex flex-col gap-6 my-16">
      <h2 className="text-2xl font-bold text-gray-800 md:text-5xl">
        Our Pricing
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="mx-6 border-amber-400 border-2">
          <CardHeader>
            <CardTitle className="text-2xl md:text-4xl">FeedAI</CardTitle>
            <CardDescription className="text-3xl font-bold text-black md:text-4xl">
              Montly
            </CardDescription>
            <CardDescription className="text-2xl font-bold text-amber-400 md:text-4xl">
              $10 <span className="text-gray-500 text-sm">/ month</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-left space-y-2 md:text-lg">
              <li className="flex items-center gap-2">
                <CircleCheck
                  className="w-4 h-4 text-green-400 md:w-6 md:h-6"
                  fill="green"
                />
                All the benefits of the monthly plan
              </li>{' '}
              <li className="flex items-center gap-2">
                <CircleCheck
                  className="w-4 h-4 text-green-400 md:w-6 md:h-6"
                  fill="green"
                />
                All the benefits of the monthly plan
              </li>{' '}
              <li className="flex items-center gap-2">
                <CircleCheck
                  className="w-4 h-4 text-green-400 md:w-6 md:h-6"
                  fill="green"
                />
                All the benefits of the monthly plan
              </li>
            </ul>
          </CardContent>
          <Button className="w-5/6 mx-auto mt-4 bg-amber-400 text-white md:text-xl">
            Get Started
          </Button>
        </Card>
        <Card className="mx-6 border-sky-700 border-2">
          <CardHeader>
            <CardTitle className="text-2xl md:text-4xl">FeedAI</CardTitle>
            <CardDescription className="text-3xl font-bold text-black md:text-4xl">
              Yearly
            </CardDescription>
            <CardDescription className="text-2xl font-bold text-sky-700 md:text-4xl">
              $8 <span className="text-gray-500 text-sm">/ month</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-left space-y-2 md:text-lg">
              <li className="flex items-center gap-2">
                <CircleCheck
                  className="w-4 h-4 text-green-400 md:w-6 md:h-6"
                  fill="green"
                />
                All the benefits of the monthly plan
              </li>
              <li className="flex items-center gap-2">
                <CircleCheck
                  className="w-4 h-4 text-green-400 md:w-6 md:h-6"
                  fill="green"
                />
                All the benefits of the monthly plan
              </li>
              <li className="flex items-center gap-2">
                <CircleCheck
                  className="w-4 h-4 text-green-400 md:w-6 md:h-6"
                  fill="green"
                />
                All the benefits of the monthly plan
              </li>
            </ul>
          </CardContent>
          <Button className="w-5/6 mx-auto mt-4 bg-sky-700 text-white md:text-xl">
            Get Started
          </Button>
        </Card>
      </div>
    </div>
  );
}
