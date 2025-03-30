import { AnimatePresence, type HTMLMotionProps, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface WordCascadeProps {
  words: string[];
  className?: string;
  duration?: number;
  framerProps?: HTMLMotionProps<'span'>;
}

export function WordCascade({
  words,
  duration = 1500,
  framerProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  className,
}: WordCascadeProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={words[index]}
        className={cn(className)}
        {...framerProps}
      >
        {words[index]}
      </motion.span>
    </AnimatePresence>
  );
}

// Esse arquivo teve auxílio de IA