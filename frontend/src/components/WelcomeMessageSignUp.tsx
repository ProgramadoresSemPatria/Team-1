import FeedAI_Logo from '@/assets/FeedAI_Logo.png';
import { motion } from 'motion/react';

export function WelcomeMessageSignUp() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center w-screen lg:w-[40vh]">
        <img
          src={FeedAI_Logo}
          alt="FeedAI logo"
          className="h-40 w-40 mx-auto lg:h-60 lg:w-60"
        />
        <h1 className="mt-10 text-5xl whitespace-nowrap text-center lg:text-6xl">
          Hello, <span className="text-sky-400">Welcome!</span>
        </h1>
        <p className="my-5 text-xl text-center lg:text-2xl">
          Create your account right now!
        </p>
      </div>
    </motion.div>
  );
}
