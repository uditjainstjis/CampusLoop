'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function MentorCard({ mentor }) {
  // Shimmer fallback if mentor is not provided
  if (!mentor) {
    return (
      <div className="rounded-lg overflow-hidden shadow-lg p-6 bg-white relative animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 shimmer-animation"></div>
        <div className="relative z-10 flex items-center">
          <div className="w-20 h-20 rounded-full bg-gray-300 flex-shrink-0"></div>
          <div className="ml-6 flex-grow">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="rounded-lg overflow-hidden shadow-lg p-6 bg-white relative"
    >
      <div className="flex items-center">
        <div className="w-20 h-20 relative rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={mentor.imageUrl}
            alt={mentor.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="ml-6">
          <h3 className="text-lg font-semibold">{mentor.name}</h3>
          <p className="text-sm text-gray-600">{mentor.achievement}</p>
        </div>
      </div>
    </motion.div>
  );
}
