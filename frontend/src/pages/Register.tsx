import { SignUpCard } from '@/components/SignUpCard';
import { WelcomeMessageSignUp } from '@/components/WelcomeMessageSignUp';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useEffect } from 'react';
export function Register() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    setIsMounted(true);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMounted) return null;

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
