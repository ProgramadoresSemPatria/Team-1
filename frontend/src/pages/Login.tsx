import FeedAI_Logo from '@/assets/FeedAI_Logo.png';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export function Login() {
  const loginFormSchema = z.object({
    email: z.string().email({ message: 'Please, provide a valid email' }),
    password: z
      .string()
      .min(1, { message: 'Please, provide a valid password' }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    console.log(values);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center md:gap-80 md:flex-row">
      <div className="flex flex-col items-center justify-center w-screen md:w-[40vh]">
        <img src={FeedAI_Logo} alt="FeedAI logo" className="h-40 w-40" />
        <h1 className="mt-10 text-5xl whitespace-nowrap">
          Hello, <span className="text-sky-400">Welcome!</span>
        </h1>
        <p className="my-5 text-xl">Access your account right now!</p>
      </div>
      <Card className="flex flex-col items-center justify-start px-6 md:w-[40vh] md:p-10">
        <h2 className="text-3xl mt-4 mb-2 text-sky-400 font-bold md:text-4xl">
          Sign in to your account
        </h2>

        <form action="" onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-bold text-xl md:text-2xl">
              Enter your Email
            </label>
            <Input
              type="email"
              className="border px-1 py-5"
              placeholder="youremail@email.com"
              {...register('email')}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email?.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <label htmlFor="password" className="font-bold text-xl md:text-2xl">
              Enter your password
            </label>
            <Input
              type="password"
              className="border px-1 py-5"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <span className="text-red-500">{errors.password?.message}</span>
            )}
          </div>
          <div className="flex flex-col items-center">
            <Button
              type="submit"
              className="text-center bg-sky-600 rounded-lg p-6 font-bold text-xl mt-5 mb-3 w-full hover:cursor-pointer hover:bg-sky-700 md:text-2xl"
            >
              Sign in
            </Button>
            <CardFooter>
              <p className="text-xl md:text-2xl">
                New to FeedAI?{' '}
                <Button
                  variant="link"
                  className="hover:cursor-pointer hover:text-blue-700 text-blue-600 mx-0 px-0 text-xl md:text-2xl"
                >
                  Create account
                </Button>
              </p>
            </CardFooter>
          </div>
        </form>
      </Card>
    </div>
  );
}
