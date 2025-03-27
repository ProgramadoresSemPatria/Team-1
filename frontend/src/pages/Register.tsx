import { SignUpCard } from '@/components/SignUpCard';
import { WelcomeMessageSignUp } from '@/components/WelcomeMessageSignUp';

export function Register() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10 bg-gray-100 md:flex-row md:justify-around">
      <div className="flex flex-col items-center bg-white justify-center w-screen md:hidden">
        <WelcomeMessageSignUp />
      </div>
      <SignUpCard />
      <div className="hidden items-center bg-white justify-center w-screen md:w-full md:h-screen md:flex md:flex-col">
        <WelcomeMessageSignUp />
      </div>
    </div>
  );
}
