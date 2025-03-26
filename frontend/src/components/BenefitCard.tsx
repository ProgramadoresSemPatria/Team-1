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
    <Card className="p-6 md:w-60">
      <CardHeader>
        <div className="flex flex-col items-center justify-center gap-2">
          {icon}
          <CardTitle>
            <h3 className="text-xl font-bold">{title}</h3>
          </CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
