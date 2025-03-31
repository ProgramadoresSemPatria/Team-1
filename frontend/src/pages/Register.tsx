import { SignUpCard } from '@/components/SignUpCard';
import { WelcomeMessageSignUp } from '@/components/WelcomeMessageSignUp/index';
import useMobile from '@/hooks/useMobile';
import { motion } from 'framer-motion';
export function Register() {
  const isMobile = useMobile();

  return (
    <div className="flex flex-col items-center min-h-screen justify-center gap-10 bg-gray-100 lg:flex-row lg:gap-30">
      <div className="flex flex-col items-center justify-center w-screen lg:hidden">
        <WelcomeMessageSignUp />
      </div>

      <motion.div
        initial={{ opacity: 0, y: isMobile ? 100 : -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center lg:ml-60 justify-center w-screen lg:w-full lg:h-screen"
      >
        <SignUpCard />
      </motion.div>

      <div className="hidden items-start justify-center  lg:w-full lg:h-screen lg:flex lg:flex-col">
        <WelcomeMessageSignUp />
      </div>
    </div>
  );
}
