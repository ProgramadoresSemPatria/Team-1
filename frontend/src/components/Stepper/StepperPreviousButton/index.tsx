import { Button } from '@/components/ui/button';
import { useStepper } from '@/hooks/useStepper';

export function StepperPreviousButton({
  size = 'default',
  type = 'button',
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  const { previousStep } = useStepper();
  return (
    <Button
      type={type}
      size={size}
      onClick={onClick ?? previousStep}
      {...props}
      className="w-full text-lg lg:text-2xl lg:h-12"
    >
      Previous
    </Button>
  );
}
