import {
  StepperNextButton,
  StepperPreviousButton,
  StepperFooter,
} from '../Stepper';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import type { SignUpFormData } from '../SignUpCard';
import { TriangleAlert } from 'lucide-react';

export const accountInfoSchema = z.object({
  email: z.string().email({ message: 'Please, provide a valid email' }),
  password: z.string().min(1, { message: 'Please, provide a valid password' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'The two passwords do not match' }),
});

export function AccountInfoStep() {
  const form = useFormContext<SignUpFormData>();
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="font-bold">
          Enter your Email
        </Label>
        <Input
          type="email"
          className="border px-1"
          placeholder="youremail@email.com"
          {...form.register('accountInfo.email')}
        />
        {form.formState.errors.accountInfo?.email && (
          <div className="flex items-center gap-2">
            <TriangleAlert className="text-red-500" />
            <span className="text-red-500">
              {form.formState.errors.accountInfo?.email?.message}
            </span>
          </div>
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
          {...form.register('accountInfo.password')}
        />
        {form.formState.errors.accountInfo?.password && (
          <div className="flex items-center gap-2">
            <TriangleAlert className="text-red-500" />
            <span className="text-red-500">
              {form.formState.errors.accountInfo?.password?.message}
            </span>
          </div>
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
          {...form.register('accountInfo.confirmPassword')}
        />
        {form.formState.errors.accountInfo?.confirmPassword && (
          <div className="flex items-center gap-2">
            <TriangleAlert className="text-red-500" />
            <span className="text-red-500">
              {form.formState.errors.accountInfo?.confirmPassword?.message}
            </span>
          </div>
        )}
      </div>
      <StepperFooter>
        <StepperPreviousButton />
        <StepperNextButton
          disabled={form.formState.isSubmitting}
          type="submit"
        />
      </StepperFooter>
    </>
  );
}
