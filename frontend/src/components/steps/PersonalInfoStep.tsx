import { z } from 'zod';
import { StepperFooter, StepperNextButton, useStepper } from '../Stepper';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(1, { message: 'Please, provide your name' }),
  CPF: z.string().min(1, { message: 'Please, provide a valid CPF' }),
  birthdate: z.string().date(),
});
export function PersonalInfoStep() {
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
    <form onSubmit={handleSubmit}>
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
            {...form.register('name')}
          />
          {form.formState.errors.name && (
            <span className="text-red-500">
              {form.formState.errors.name?.message}
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
            {...form.register('CPF')}
          />
          {form.formState.errors.CPF && (
            <span className="text-red-500">
              {form.formState.errors.CPF?.message}
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
            {...form.register('birthdate')}
          />
          {form.formState.errors.birthdate && (
            <span className="text-red-500">
              {form.formState.errors.birthdate?.message}
            </span>
          )}
        </div>
        <StepperFooter>
          <StepperNextButton />
        </StepperFooter>
      </div>
    </form>
  );
}
