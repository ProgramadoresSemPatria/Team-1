import { StepperFooter } from '../Stepper/StepperFooter';
import { StepperNextButton } from '../Stepper/StepperNextButton';
import { StepperPreviousButton } from '../Stepper/StepperPreviousButton';
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
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col gap-2 w-[42vh]">
        <Label htmlFor="email" className="font-bold text-xl lg:text-2xl">
          Email
        </Label>
        <Input
          type="email"
          className="border px-2 h-10 lg:h-12"
          placeholder="youremail@email.com"
          {...form.register('accountInfo.email')}
        />
        {form.formState.errors.accountInfo?.email && (
          <div className="flex items-center gap-2">
            <TriangleAlert className="text-red-500" />
            <span className="text-red-500 ">
              {form.formState.errors.accountInfo?.email?.message}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 w-[42vh]">
        <Label htmlFor="password" className="font-bold text-xl lg:text-2xl">
          Password
        </Label>
        <Input
          type="password"
          className="border px-2 h-10 lg:h-12"
          placeholder="••••••••"
          {...form.register('accountInfo.password')}
        />
        {form.formState.errors.accountInfo?.password && (
          <div className="flex items-center gap-2">
            <TriangleAlert className="text-red-500 lg:text-2xl" />
            <span className="text-red-500 lg:text-2xl">
              {form.formState.errors.accountInfo?.password?.message}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 w-[42vh]">
        <Label
          htmlFor="confirmPassword"
          className="font-bold text-xl lg:text-2xl"
        >
          Confirm password
        </Label>
        <Input
          type="password"
          className="border px-2 h-10 lg:h-12"
          placeholder="••••••••"
          {...form.register('accountInfo.confirmPassword')}
        />
        {form.formState.errors.accountInfo?.confirmPassword && (
          <div className="flex items-center gap-2">
            <TriangleAlert className="text-red-500" />
            <span className="text-red-500 ">
              {form.formState.errors.accountInfo?.confirmPassword?.message}
            </span>
          </div>
        )}
      </div>
      <StepperFooter>
        <StepperPreviousButton variant="outline" />
        <StepperNextButton
        
          disabled={form.formState.isSubmitting}
          type="submit"
          size="lg"
          text={form.formState.isSubmitting ? "Creating account..." : "Create account"}
        />
      </StepperFooter>
    </div>
  );
}
