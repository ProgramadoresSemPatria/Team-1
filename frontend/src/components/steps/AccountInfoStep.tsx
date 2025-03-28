import {
  StepperNextButton,
  StepperPreviousButton,
  StepperFooter,
} from '../Stepper';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  email: z.string().email({ message: 'Please, provide a valid email' }),
  password: z.string().min(1, { message: 'Please, provide a valid password' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'The two passwords do not match' }),
});

export function AccountInfoStep() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit(async (formData) => {
    console.log(formData);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigate('/login');
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="font-bold">
            Enter your Email
          </Label>
          <Input
            type="email"
            className="border px-1"
            placeholder="youremail@email.com"
            {...form.register('email')}
          />
          {form.formState.errors.email && (
            <span className="text-red-500">
              {form.formState.errors.email?.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="font-bold">
            Enter your password
          </Label>
          <Input
            type="password"
            className="border"
            placeholder="••••••••"
            {...form.register('password')}
          />
          {form.formState.errors.password && (
            <span className="text-red-500">
              {form.formState.errors.password?.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword" className="font-bold">
            Confirm password
          </Label>
          <Input
            type="password"
            className="border px-1"
            placeholder="••••••••"
            {...form.register('confirmPassword')}
          />
          {form.formState.errors.confirmPassword && (
            <span className="text-red-500">
              {form.formState.errors.confirmPassword?.message}
            </span>
          )}
        </div>
        <StepperFooter>
          <StepperPreviousButton />
          <StepperNextButton />
        </StepperFooter>
      </form>
    </>
  );
}
