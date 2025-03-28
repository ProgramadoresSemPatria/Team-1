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
    <div className="flex flex-col items-center justify-center min-h-screen gap-10 bg-gray-100 md:flex-row md:justify-around">
      <div className="flex flex-col items-center justify-center w-screen md:hidden">
        <WelcomeMessageSignUp />
      </div>

      <motion.div
        initial={{ opacity: 0, y: isMobile ? 100 : -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SignUpCard />
      </motion.div>

      <div className="hidden items-center justify-center w-screen md:w-full md:h-screen md:flex md:flex-col">
        <WelcomeMessageSignUp />
      </div>
    </div>
  );
}
