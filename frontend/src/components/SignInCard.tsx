import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { CardFooter, Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { TriangleAlert } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export function SignInCard() {
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
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-start px-6 md:w-[40vh] md:px-10 md:pt-6"
    >
      <Card className="flex flex-col items-center justify-start px-3.5 md:w-[40vh] md:px-10 md:pt-6">
        <h2 className="text-3xl mt-4 mb-2 text-sky-400 font-bold md:text-4xl">
          Sign in to your account
        </h2>

        <form action="" onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="font-bold text-xl md:text-2xl">
              Enter your Email
            </Label>
            <Input
              type="email"
              className="border px-1 py-5"
              placeholder="youremail@email.com"
              {...register('email')}
            />
            {errors.email && (
              <div className="flex items-center gap-2">
                <TriangleAlert className="w-4 h-4 text-red-500" />
                <span className="text-red-500">{errors.email?.message}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Label htmlFor="password" className="font-bold text-xl md:text-2xl">
              Enter your password
            </Label>
            <Input
              type="password"
              className="border px-1 py-5"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <div className="flex items-center gap-2">
                <TriangleAlert className="w-4 h-4 text-red-500" />
                <span className="text-red-500">{errors.password?.message}</span>
              </div>
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
              <p className="text-lg md:text-xl md:mt-4">
                New to FeedAI?{' '}
                <Button
                  asChild
                  variant="link"
                  className="text-blue-600 hover:text-blue-700 text-lg md:text-xl px-0"
                >
                  <Link to="/register">Create account</Link>
                </Button>
              </p>
            </CardFooter>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
