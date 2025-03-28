import { cn } from '@/lib/utils';
import { createContext, useCallback, useContext, useState } from 'react';
import { Button } from './ui/button';
import { AnimatePresence, motion } from 'motion/react';

interface IStepperContext {
  previousStep: () => void;
  nextStep: () => void;
  direction: Direction;
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

type Direction = 'previous' | 'next';

export function Stepper({ steps, initialStep = 0 }: IStepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState<Direction>('next');

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setDirection('previous');
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
    setDirection('next');
  }, [steps]);

  return (
    <StepperContext.Provider value={{ previousStep, nextStep, direction }}>
      <div className="flex flex-col items-center justify-center gap-10">
        <ul className="flex items-center justify-center gap-20 relative">
          {steps.map((step, index) => (
            <motion.li
              key={step.label}
              className={cn(
                'relative inline-block text-sm p-2 rounded-lg overflow-hidden',
                index === currentStep && 'text-primary-foreground',
              )}
            >
              <AnimatePresence initial={false} custom={direction}>
                {index === currentStep && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={direction}
                    variants={{
                      hidden: (dir: Direction) => ({
                        x: dir === 'next' ? '-100%' : '100%',
                        opacity: 0,
                      }),
                      visible: {
                        x: 0,
                        opacity: 1,
                        transition: { duration: 0.3 },
                      },
                      exit: (dir: Direction) => ({
                        x: dir === 'next' ? '100%' : '-100%',
                        opacity: 0,
                        transition: { duration: 0.3 },
                      }),
                    }}
                    className="absolute inset-0 bg-sky-700 rounded-lg"
                  />
                )}
              </AnimatePresence>

              <span className="relative z-10">
                {String(index + 1).padStart(2, '0')}. {step.label}
              </span>
            </motion.li>
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
  const { nextStep } = useStepper();
  return (
    <Button type={type} size={size} onClick={onClick ?? nextStep} {...props}>
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
  const { previousStep } = useStepper();
  return (
    <Button
      type={type}
      size={size}
      onClick={onClick ?? previousStep}
      {...props}
    >
      Previous
    </Button>
  );
}
