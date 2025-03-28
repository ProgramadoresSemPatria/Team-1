import { cn } from '@/lib/utils';
import { createContext, useCallback, useContext, useState } from 'react';
import { Button } from './ui/button';

interface IStepperContext {
  handlePreviousStep: () => void;
  handleNextStep: () => void;
}

export const StepperContext = createContext({} as IStepperContext);

export function useStepper() {
  return useContext(StepperContext);
}

interface IStepperProps {
  initialStep?: number;
  steps: {
    label: string;
    content: React.ReactNode;
  }[];
}

export function Stepper({ steps, initialStep = 0 }: IStepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const handlePreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
  }, [steps]);

  return (
    <StepperContext.Provider value={{ handlePreviousStep, handleNextStep }}>
      <div className="flex flex-col items-center justify-center gap-10">
        <ul className="flex items-center justify-center gap-20">
          {steps.map((step, index) => (
            <li
              key={step.label}
              className={cn(
                'inline-block text-sm p-2 rounded-lg',
                index === currentStep && 'bg-sky-700 text-primary-foreground',
              )}
            >
              <span>
                {String(index + 1).padStart(2, '0')}. {step.label}
              </span>
            </li>
          ))}
        </ul>

        <div>{steps[currentStep].content}</div>
      </div>
    </StepperContext.Provider>
  );
}

export const StepperFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <footer className="flex flex-col items-center justify-center gap-2 mt-6">
      {children}
    </footer>
  );
};
export function StepperNextButton({
  size = 'default',
  type = 'button',
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  const { handleNextStep } = useStepper();
  return (
    <Button
      type={type}
      size={size}
      onClick={onClick ?? handleNextStep}
      {...props}
    >
      Next
    </Button>
  );
}

export function StepperPreviousButton({
  size = 'default',
  type = 'button',
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  const { handlePreviousStep } = useStepper();
  return (
    <Button
      type={type}
      size={size}
      onClick={onClick ?? handlePreviousStep}
      {...props}
    >
      Previous
    </Button>
  );
}
