import { useFormContext } from 'react-hook-form';
import { useStepper } from '@/hooks/useStepper';
import { StepperFooter } from '../Stepper/StepperFooter';
import { StepperNextButton } from '../Stepper/StepperNextButton';
import { StepperPreviousButton } from '../Stepper/StepperPreviousButton';
import { z } from 'zod';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import type { SignUpFormData } from '../SignUpCard';
import { TriangleAlert } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col gap-2 w-[42vh]">
        <Label
          htmlFor="enterpriseName"
          className="font-bold text-xl lg:text-2xl"
        >
          Enterprise name
        </Label>
        <Input
          type="text"
          className="border px-2 h-10 lg:h-12"
          placeholder="Enterprise name"
          {...form.register('enterpriseInfo.enterpriseName')}
        />
        {form.formState.errors.enterpriseInfo?.enterpriseName && (
          <div className="flex items-center gap-2">
            <TriangleAlert className="text-red-500" />
            <span className="text-red-500">
              {form.formState.errors.enterpriseInfo?.enterpriseName?.message}
            </span>
          </div>
        )}
      </div>{' '}
      <div className="flex flex-col gap-2 w-[42vh]">
        <Label htmlFor="businessType" className="font-bold text-xl lg:text-2xl">
          Business type
        </Label>
        <Input
          type="text"
          className="border px-2 h-10 lg:h-12"
          placeholder="Business type"
          {...form.register('enterpriseInfo.businessType')}
        />
        {form.formState.errors.enterpriseInfo?.businessType && (
          <div className="flex items-center gap-2">
            <TriangleAlert className="text-red-500" />
            <span className="text-red-500">
              {form.formState.errors.enterpriseInfo?.businessType?.message}
            </span>
          </div>
        )}
      </div>{' '}
      <div className="flex flex-col gap-2 w-[42vh]">
        <Label htmlFor="CNPJ" className="font-bold text-xl lg:text-2xl">
          CNPJ
        </Label>
        <Input
          type="text"
          className="border px-2 h-10 lg:h-12"
          placeholder="00.000.000/0000-00"
          {...form.register('enterpriseInfo.CNPJ')}
        />
        {form.formState.errors.enterpriseInfo?.CNPJ && (
          <div className="flex items-center gap-2">
            <TriangleAlert className="text-red-500" />
            <span className="text-red-500">
              {form.formState.errors.enterpriseInfo?.CNPJ?.message}
            </span>
          </div>
        )}
      </div>{' '}
      <StepperFooter>
        <StepperPreviousButton variant="outline" />
        <StepperNextButton onClick={handleNextStep} size="lg" />
      </StepperFooter>
    </div>
  );
}
