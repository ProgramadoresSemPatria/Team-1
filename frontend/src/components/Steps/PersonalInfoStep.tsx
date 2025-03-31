import { z } from 'zod';
import { useStepper } from '@/hooks/useStepper';
import { StepperFooter } from '../Stepper/StepperFooter';
import { StepperNextButton } from '../Stepper/StepperNextButton';
import { useFormContext } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { SignUpFormData } from '../SignUpCard';
import { TriangleAlert } from 'lucide-react';

export const personalInfoSchema = z.object({
  name: z.string().min(1, { message: 'Please, provide your name' }),
  CPF: z.string().min(1, { message: 'Please, provide a valid CPF' }),
  birthdate: z.string().date(),
});
export function PersonalInfoStep() {
  const { nextStep } = useStepper();
  const form = useFormContext<SignUpFormData>();

  async function handleNextStep() {
    const isValid = await form.trigger('personalInfo');

    if (isValid) {
      nextStep();
    }
  }

  return (
    <div className="flex flex-col items-start justify-start gap-4">
      <div className="flex flex-col gap-2 w-[42vh]">
        <Label htmlFor="name" className="font-bold text-xl lg:text-2xl">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          className="px-2 h-10 lg:h-12"
          placeholder="Your name"
          {...form.register('personalInfo.name')}
        />
        {form.formState.errors.personalInfo?.name && (
          <div className="flex items-center gap-2">
            <TriangleAlert className="text-red-500" />
            <span className="text-red-500">
              {form.formState.errors.personalInfo?.name?.message}
            </span>
          </div>
        )}
      </div>{' '}
      <div className="flex flex-col gap-2 w-[42vh]">
        <Label htmlFor="CPF" className="font-bold text-xl lg:text-2xl">
          CPF
        </Label>
        <Input
          id="CPF"
          type="text"
          className="px-2 h-10 lg:h-12"
          placeholder="000.000.000-00"
          {...form.register('personalInfo.CPF')}
        />
        {form.formState.errors.personalInfo?.CPF && (
          <div className="flex items-center gap-2">
            <TriangleAlert className="text-red-500" />
            <span className="text-red-500">
              {form.formState.errors.personalInfo?.CPF?.message}
            </span>
          </div>
        )}
      </div>{' '}
      <div className="flex flex-col gap-2 w-[42vh]">
        <Label htmlFor="birthdate" className="font-bold text-xl lg:text-2xl">
          Birthdate
        </Label>
        <Input
          id="birthdate"
          type="date"
          className="border px-2 h-10 lg:h-12"
          {...form.register('personalInfo.birthdate')}
        />
        {form.formState.errors.personalInfo?.birthdate && (
          <div className="flex items-center gap-2">
            <TriangleAlert className="text-red-500" />
            <span className="text-red-500">
              {form.formState.errors.personalInfo?.birthdate?.message}
            </span>
          </div>
        )}
      </div>
      <StepperFooter>
        <StepperNextButton onClick={handleNextStep} size="lg" />
      </StepperFooter>
    </div>
  );
}
