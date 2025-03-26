import FeedAI_Logo from '@/assets/FeedAI_Logo.png';
import { Button } from '@/components/ui/button';
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
      <div className="min-h-[60vh] flex flex-col items-center justify-start md:mt-28">
        <h2 className="text-2xl mt-4 mb-2 text-sky-600 font-bold">
          Sign in to your account
        </h2>

        <form action="" onSubmit={handleSubmit(onSubmit)}>
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
              <span className="text-red-500">{errors.email?.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-4">
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
              <span className="text-red-500">{errors.password?.message}</span>
            )}
          </div>
          <div className="flex flex-col items-center">
            <Button
              type="submit"
              className="text-center bg-sky-300 rounded-md p-2 font-bold mt-5 mb-3 w-full"
            >
              Sign in
            </Button>
            <p>
              New to FeedAI?{' '}
              <Button
                variant="link"
                className="hover:cursor-pointer hover:text-blue-600 text-blue-400 mx-0 px-0"
              >
                Create account
              </Button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
