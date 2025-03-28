import { z } from 'zod';
import { StepperFooter, StepperNextButton, useStepper } from '../Stepper';
import { useFormContext } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { SignUpFormData } from '../SignUpCard';

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
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="font-bold">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          className="border px-1"
          placeholder="Your name"
          {...form.register('personalInfo.name')}
        />
        {form.formState.errors.personalInfo?.name && (
          <span className="text-red-500">
            {form.formState.errors.personalInfo?.name?.message}
          </span>
        )}
      </div>{' '}
      <div className="flex flex-col gap-2">
        <Label htmlFor="CPF" className="font-bold">
          CPF
        </Label>
        <Input
          id="CPF"
          type="text"
          className="border px-1"
          placeholder="000.000.000-00"
          {...form.register('personalInfo.CPF')}
        />
        {form.formState.errors.personalInfo?.CPF && (
          <span className="text-red-500">
            {form.formState.errors.personalInfo?.CPF?.message}
          </span>
        )}
      </div>{' '}
      <div className="flex flex-col gap-2">
        <Label htmlFor="birthdate" className="font-bold">
          Birthdate
        </Label>
        <Input
          id="birthdate"
          type="date"
          className="border px-1"
          {...form.register('personalInfo.birthdate')}
        />
        {form.formState.errors.personalInfo?.birthdate && (
          <span className="text-red-500">
            {form.formState.errors.personalInfo?.birthdate?.message}
          </span>
        )}
      </div>
      <StepperFooter>
        <StepperNextButton onClick={handleNextStep} />
      </StepperFooter>
    </div>
  );
}
