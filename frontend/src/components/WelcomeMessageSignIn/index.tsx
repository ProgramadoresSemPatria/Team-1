import { motion } from 'motion/react';
import FeedAI_Logo from '@/assets/FeedAI_Logo.png';
import useMobile from '@/hooks/useMobile';

export function WelcomeMessageSignIn() {
   const isMobile = useMobile()
   
  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? -100 : 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center w-screen md:w-[40vh]">
        <img
          src={FeedAI_Logo}
          alt="FeedAI logo"
          className="h-40 w-40 md:h-60 md:w-60  "
        />
        <h1 className="mt-10 text-5xl whitespace-nowrap md:text-6xl">
          Hello, <span className="text-sky-400">Welcome!</span>
        </h1>
        <p className="my-5 text-xl md:text-2xl">
          Access your account right now!
        </p>
      </div>
    </motion.div>
  );
}
