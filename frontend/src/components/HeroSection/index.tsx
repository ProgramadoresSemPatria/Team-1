import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { WordCascade } from '../WordCascade';

import DemoVideo from '@/assets/DemoVideo.mp4';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 flex flex-col items-center justify-center lg:items-start lg:text-start lg:w-full lg:max-h-[70vh] lg:px-40 lg:flex-row"
    >
      <div className="flex flex-col">
        <h1 className="font-bold text-4xl mt-10 mb-5 md:text-6xl">
          Understand customer feedback{' '}
          <WordCascade
            words={['in seconds', 'very fast', 'at once', 'quickly', 'shortly']}
            className="flex items-center justify-center lg:justify-start mt-4 font-bold text-sky-700"
          />
        </h1>

        <p className="text-2xl text-gray-500 mt-8 lg:mt-16 md:text-2xl md:max-w-5xl">
          FeedAI analyzes your customer reviews instantly. No more dedicating
          teams for weeks to understand what people are saying about your brand.
        </p>
        <Link to="/register">
          <Button className="shadow-lg shadow-black/80 hidden mt-32 mb-10 h-16 rounded-xl bg-sky-700 font-bold text-2xl text-white w-8/9 hover:scale-105 hover:bg-sky-800 hover:cursor-pointer lg:flex">
            Get Started{' '}
            <ArrowRight className="ml-2 mt-[1px] min-w-8 min-h-8 font-bold" />
          </Button>
        </Link>
      </div>

      <div className="flex flex-col w-full items-center">
        <AspectRatio
          ratio={16 / 9}
          className="lg:max-h-[70vh] w-full px-4 mt-10 lg:mt-20 lg:ml-20 lg:min-h-[48vh]"
        >
          <video
            src={DemoVideo}
            autoPlay
            loop
            muted
            playsInline
            className="rounded-lg shadow-sm shadow-black/80 w-full h-full object-cover"
          />
        </AspectRatio>
        <Link to="/register" className='w-full'>
          <Button className="shadow-lg shadow-black/80 mt-16 mb-10 w-10/11 h-12 py-7 bg-sky-700 font-bold text-lg text-white lg:hidden hover:scale-105 hover:bg-sky-800 hover:cursor-pointer">
            Get Started <ArrowRight className="w-5 h-5 font-bold mt-0.5" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
