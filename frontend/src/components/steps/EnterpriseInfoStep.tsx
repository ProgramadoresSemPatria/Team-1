import { useForm } from 'react-hook-form';
import {
  StepperFooter,
  StepperNextButton,
  StepperPreviousButton,
  useStepper,
} from '../Stepper';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

const schema = z.object({
  CNPJ: z.string().min(1, { message: 'Please, provide a valid CNPJ' }),
  enterpriseName: z
    .string()
    .min(1, { message: 'Please, provide the name of your enterprise' }),
  businessType: z
    .string()
    .min(1, { message: 'Please, provide the type of your business' }),
});
export function EnterpriseInfoStep() {
  const { handleNextStep } = useStepper();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit(async (formData) => {
    console.log(formData);
    await new Promise((resolve) => setTimeout(resolve, 600));
    handleNextStep();
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="enterpriseName" className="font-bold">
            Enterprise name
          </Label>
          <Input
            type="text"
            className="border px-1"
            placeholder="Enterprise name"
            {...form.register('enterpriseName')}
          />
          {form.formState.errors.enterpriseName && (
            <span className="text-red-500">
              {form.formState.errors.enterpriseName?.message}
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
            {...form.register('businessType')}
          />
          {form.formState.errors.businessType && (
            <span className="text-red-500">
              {form.formState.errors.businessType?.message}
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
            {...form.register('CNPJ')}
          />
          {form.formState.errors.CNPJ && (
            <span className="text-red-500">
              {form.formState.errors.CNPJ?.message}
            </span>
          )}
        </div>{' '}
        <StepperFooter>
          <StepperPreviousButton />
          <StepperNextButton />
        </StepperFooter>
      </form>
    </div>
  );
}
