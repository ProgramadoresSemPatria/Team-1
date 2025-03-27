import { SignInCard } from '@/components/SignInCard';
import { WelcomeMessageSignIn } from '@/components/WelcomeMessageSignIn';

export function Login() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center md:gap-80 md:flex-row">
      <WelcomeMessageSignIn />
      <SignInCard />
    </div>
  );
}
