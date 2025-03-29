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
    <Card className="p-6 transition-all hover:shadow-md mx-10 hover:border-sky-700 lg:w-80 lg:h-72">
      <CardHeader>
        <div className="flex flex-col items-center justify-center gap-2">
          {icon}
          <CardTitle>
            <h3 className="text-xl font-bold md:text-2xl">{title}</h3>
          </CardTitle>
        </div>
        <CardDescription className="text-sm md:text-lg text-center">
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
