import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
} from '@/components/ui/card';

export function BenefitCard({
  icon,
  title,
  description,
}: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-6 md:w-80 md:h-96">
      <CardHeader>
        <div className="flex flex-col items-center justify-center gap-2">
          {icon}
          <CardTitle>
            <h3 className="text-xl font-bold md:text-2xl">{title}</h3>
          </CardTitle>
        </div>
        <CardDescription className="text-sm md:text-lg">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
