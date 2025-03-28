import FeedAI_Logo from '@/assets/FeedAI_Logo.png';
import { motion } from 'motion/react';

export function WelcomeMessageSignUp() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={FeedAI_Logo}
        alt="FeedAI logo"
        className="h-40 w-40 mx-auto"
      />
      <h1 className="mt-10 text-5xl whitespace-nowrap text-center">
        Hello, <span className="text-sky-400">Welcome!</span>
      </h1>
      <p className="my-5 text-xl text-center">Create your account right now!</p>
    </motion.div>
  );
}
