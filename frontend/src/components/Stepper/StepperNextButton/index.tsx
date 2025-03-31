import { Button } from '@/components/ui/button';
import { useStepper } from '@/hooks/useStepper';

export function StepperNextButton({
  size = 'default',
  type = 'button',
  onClick,
  text,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button> & { text?: string }) {
  const { nextStep } = useStepper();
  return (
    <Button
      type={type}
      size={size}
      onClick={onClick ?? nextStep}
      {...props}
      className="w-full bg-sky-700 font-bold text-lg lg:text-2xl lg:h-12 hover:bg-sky-800"
    >
      {text ?? 'Next'}
    </Button>
  );
}
