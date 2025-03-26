import FeedAI_Logo from '@/assets/FeedAI_Logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';

export function Register() {
  const [step, setStep] = useState(1);

  const loginFormSchema = z.object({
    name: z.string().min(1, { message: 'Please, provide your name' }),
    CPF: z.string().min(1, { message: 'Please, provide a valid CPF' }),
    birthdate: z.string().date(),
    CNPJ: z.string().min(1, { message: 'Please, provide a valid CNPJ' }),
    enterpriseName: z
      .string()
      .min(1, { message: 'Please, provide the name of your enterprise' }),
    businessType: z
      .string()
      .min(1, { message: 'Please, provide the type of your business' }),
    email: z.string().email({ message: 'Please, provide a valid email' }),
    password: z
      .string()
      .min(1, { message: 'Please, provide a valid password' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'The two passwords do not match' }),
  });
  const personalInformationFormSchema = loginFormSchema.pick({
    name: true,
    CPF: true,
    birthdate: true,
  });
  const enterpriseInformationFormSchema = loginFormSchema.pick({
    enterpriseName: true,
    businessType: true,
    CNPJ: true,
  });
  const accountInformationFormSchema = loginFormSchema.pick({
    email: true,
    password: true,
    confirmPassword: true,
  });
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onTouched',
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    console.log(values);
  }

  function validateStep(step: number) {
    const values = getValues();
    let schema = null;
    if (step === 1) {
      schema = personalInformationFormSchema;
    }
    if (step === 2) {
      schema = enterpriseInformationFormSchema;
    }
    if (step === 3) {
      schema = accountInformationFormSchema;
    }

    if (!schema) {
      return false;
    }
    const result = schema.safeParse(values);
    if (!result?.success) {
      for (const error of result.error.errors) {
        console.log("error:", error)
        const field = error.path[0] as keyof z.infer<typeof loginFormSchema>;
        const message = error.message;
        setError(field, { message });
      }
      return false;
    }
    return true;
  }

  function handleGoBack() {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  function handleNext() {
    if (validateStep(step)) {
      clearErrors();
      if (step < 3) {
        setStep(step + 1);
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10 bg-gray-100 md:flex-row md:justify-around">
      <div className="flex flex-col items-center bg-white justify-center w-screen md:hidden">
        <img src={FeedAI_Logo} alt="FeedAI logo" className="h-40 w-40" />
        <h1 className="mt-10 text-5xl whitespace-nowrap">
          Hello, <span className="text-sky-400">Welcome!</span>
        </h1>
        <p className="my-5 text-xl">Create your account right now!</p>
      </div>
      <div className="flex flex-col items-center justify-center md:px-10">
        <Card className="md:w-[80vh]">
          <CardHeader>
            <CardTitle className="text-center">
              Create your FeedAI account
            </CardTitle>
          </CardHeader>
          <div className="flex text-center gap-2 justify-center items-center">
            <h2
              className={`${step === 1 ? 'text-blue-400' : 'text-gray-400'} cursor-pointer`}
              onClick={() => setStep(1)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setStep(1);
                }
              }}
            >
              Personal Information
            </h2>
            <h2
              className={`${step === 2 ? 'text-blue-400' : 'text-gray-400'} cursor-pointer`}
              onClick={() => setStep(2)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setStep(2);
                }
              }}
            >
              Enterprise Information
            </h2>
            <h2
              className={`${step === 3 ? 'text-blue-400' : 'text-gray-400'} cursor-pointer`}
              onClick={() => setStep(3)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setStep(3);
                }
              }}
            >
              Account Information
            </h2>
          </div>
          <CardContent>
            <form
              action=""
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              {step === 1 && (
                <>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-bold">
                      Name
                    </label>
                    <Input
                      type="text"
                      className="border px-1"
                      placeholder="Your name"
                      {...register('name')}
                    />
                    {errors.name && (
                      <span className="text-red-500">
                        {errors.name?.message}
                      </span>
                    )}
                  </div>{' '}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="CPF" className="font-bold">
                      CPF
                    </label>
                    <Input
                      type="text"
                      className="border px-1"
                      placeholder="000.000.000-00"
                      {...register('CPF')}
                    />
                    {errors.CPF && (
                      <span className="text-red-500">
                        {errors.CPF?.message}
                      </span>
                    )}
                  </div>{' '}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="birthdate" className="font-bold">
                      Birthdate
                    </label>
                    <Input
                      type="date"
                      className="border px-1"
                      {...register('birthdate')}
                    />
                    {errors.birthdate && (
                      <span className="text-red-500">
                        {errors.birthdate?.message}
                      </span>
                    )}
                  </div>{' '}
                </>
              )}
              {step === 2 && (
                <>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="enterpriseName" className="font-bold">
                      Enterprise name
                    </label>
                    <Input
                      type="text"
                      className="border px-1"
                      placeholder="Enterprise name"
                      {...register('enterpriseName')}
                    />
                    {errors.enterpriseName && (
                      <span className="text-red-500">
                        {errors.enterpriseName?.message}
                      </span>
                    )}
                  </div>{' '}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="businessType" className="font-bold">
                      Business type
                    </label>
                    <Input
                      type="text"
                      className="border px-1"
                      placeholder="Business type"
                      {...register('businessType')}
                    />
                    {errors.businessType && (
                      <span className="text-red-500">
                        {errors.businessType?.message}
                      </span>
                    )}
                  </div>{' '}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="businessType" className="font-bold">
                      CNPJ
                    </label>
                    <Input
                      type="text"
                      className="border px-1"
                      placeholder="00.000.000/0000-00"
                      {...register('CNPJ')}
                    />
                    {errors.CNPJ && (
                      <span className="text-red-500">
                        {errors.CNPJ?.message}
                      </span>
                    )}
                  </div>{' '}
                </>
              )}
              {step === 3 && (
                <>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-bold">
                      Enter your Email
                    </label>
                    <Input
                      type="email"
                      className="border px-1"
                      placeholder="youremail@email.com"
                      {...register('email')}
                    />
                    {errors.email && (
                      <span className="text-red-500">
                        {errors.email?.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="font-bold">
                      Enter your password
                    </label>
                    <Input
                      type="password"
                      className="border"
                      placeholder="••••••••"
                      {...register('password')}
                    />
                    {errors.password && (
                      <span className="text-red-500">
                        {errors.password?.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="confirmPassword" className="font-bold">
                      Confirm password
                    </label>
                    <Input
                      type="password"
                      className="border px-1"
                      placeholder="••••••••"
                      {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && (
                      <span className="text-red-500">
                        {errors.confirmPassword?.message}
                      </span>
                    )}
                  </div>
                </>
              )}
              <div className="flex flex-col items-center gap-0">
                {step !== 3 && (
                  <Button
                    type="button"
                    className="text-center bg-sky-300 rounded-md p-2 font-bold my-2 w-full"
                    onClick={handleNext}
                    disabled={step === 3}
                  >
                    Next
                  </Button>
                )}
                {step === 3 && (
                  <Button
                    type="submit"
                    className="text-center bg-sky-300 rounded-md p-2 font-bold my-2 w-full"
                    disabled={step !== 3}
                  >
                    Create account
                  </Button>
                )}
                <Button
                  variant="outline"
                  type="button"
                  className="text-center rounded-md p-2 font-bold my-2 w-full"
                  onClick={handleGoBack}
                  disabled={step === 1}
                >
                  Go back
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="hidden items-center bg-white justify-center w-screen md:w-full md:h-screen md:flex md:flex-col">
        <img src={FeedAI_Logo} alt="FeedAI logo" className="h-40 w-40" />
        <h1 className="mt-10 text-5xl whitespace-nowrap">
          Hello, <span className="text-sky-400">Welcome!</span>
        </h1>
        <p className="my-5 text-xl">Create your account right now!</p>
      </div>
    </div>
  );
}