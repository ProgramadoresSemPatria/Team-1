import { SignInCard } from '@/components/SignInCard';
import { WelcomeMessageSignIn } from '@/components/WelcomeMessageSignIn/index';

export function Login() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center lg:gap-80 lg:flex-row">
      <WelcomeMessageSignIn />
      <SignInCard />
    </div>
  );
}
