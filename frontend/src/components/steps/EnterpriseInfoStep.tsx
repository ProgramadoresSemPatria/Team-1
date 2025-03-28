import { useFormContext } from 'react-hook-form';
import {
  StepperFooter,
  StepperNextButton,
  StepperPreviousButton,
  useStepper,
} from '../Stepper';
import { z } from 'zod';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import type { SignUpFormData } from '../SignUpCard';

export const enterpriseInfoSchema = z.object({
  CNPJ: z.string().min(1, { message: 'Please, provide a valid CNPJ' }),
  enterpriseName: z
    .string()
    .min(1, { message: 'Please, provide the name of your enterprise' }),
  businessType: z
    .string()
    .min(1, { message: 'Please, provide the type of your business' }),
});
export function EnterpriseInfoStep() {
  const { nextStep } = useStepper();
  const form = useFormContext<SignUpFormData>();

  async function handleNextStep() {
    const isValid = await form.trigger('enterpriseInfo');

    if (isValid) {
      nextStep();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col gap-2">
        <Label htmlFor="enterpriseName" className="font-bold">
          Enterprise name
        </Label>
        <Input
          type="text"
          className="border px-1"
          placeholder="Enterprise name"
          {...form.register('enterpriseInfo.enterpriseName')}
        />
        {form.formState.errors.enterpriseInfo?.enterpriseName && (
          <span className="text-red-500">
            {form.formState.errors.enterpriseInfo?.enterpriseName?.message}
          </span>
        )}
      </div>{' '}
      <div className="flex flex-col gap-2">
        <Label htmlFor="businessType" className="font-bold">
          Business type
        </Label>
        <Input
          type="text"
          className="border px-1"
          placeholder="Business type"
          {...form.register('enterpriseInfo.businessType')}
        />
        {form.formState.errors.enterpriseInfo?.businessType && (
          <span className="text-red-500">
            {form.formState.errors.enterpriseInfo?.businessType?.message}
          </span>
        )}
      </div>{' '}
      <div className="flex flex-col gap-2">
        <Label htmlFor="CNPJ" className="font-bold">
          CNPJ
        </Label>
        <Input
          type="text"
          className="border px-1"
          placeholder="00.000.000/0000-00"
          {...form.register('enterpriseInfo.CNPJ')}
        />
        {form.formState.errors.enterpriseInfo?.CNPJ && (
          <span className="text-red-500">
            {form.formState.errors.enterpriseInfo?.CNPJ?.message}
          </span>
        )}
      </div>{' '}
      <StepperFooter>
        <StepperPreviousButton />
        <StepperNextButton onClick={handleNextStep} />
      </StepperFooter>
    </div>
  );
}
