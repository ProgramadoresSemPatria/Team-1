import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CircleCheck } from 'lucide-react';

interface IFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

export function FeatureCard({
  icon,
  title,
  description,
  features,
}: IFeatureCardProps) {
  return (
    <Card className="hover:shadow-md transition-all hover:shadow-sky-700 lg:min-w-[50vh] lg:min-h-[30vh] lg:p-8 lg:gap-10">
      <CardHeader className="gap-5">
        <CardTitle className="flex items-center gap-2 text-2xl lg:text-3xl lg:gap-4">
          {icon} {title}
        </CardTitle>
        <CardDescription className="text-start mt-2 lg:text-xl">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="text-start text-sm space-y-1 lg:text-xl lg:space-y-6 ">
          {features.map((feature) => (
            <li
              key={`feature-${feature}`}
              className="flex items-center gap-2 lg:gap-4 "
            >
              <CircleCheck className="text-sky-700 w-4 h-4 lg:w-8 lg:h-8" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
