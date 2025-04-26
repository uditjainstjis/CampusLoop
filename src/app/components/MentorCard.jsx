'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function MentorCard({ mentor }) {
  if (!mentor) {
    return null;
  }

  // Enhanced animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] // Custom easing for smoother motion
      }
    },
    hover: { 
      y: -10,
      scale: 1.03, 
      boxShadow: "0px 15px 25px rgba(88, 24, 169, 0.15)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        delay: 0.2,
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.08,
      transition: { duration: 0.3 }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: 0.3,
        duration: 0.4 
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      className="bg-white rounded-2xl shadow-md overflow-hidden px-6 py-8 text-center transition-all duration-300 h-full flex flex-col items-center justify-start min-h-[360px] border border-purple-100"
    >
      {/* Larger image with animation */}
      <motion.div 
        className="relative w-40 h-40 mx-auto mb-5 rounded-full overflow-hidden border-4 border-purple-50"
        variants={imageVariants}
      >
        <Image
          src={mentor.imageUrl}
          alt={mentor.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 160px"
        />
        
        {/* Purple gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-purple-500/0 to-purple-500/20 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
      
      {/* Text content with staggered animation */}
      <motion.div className="flex flex-col flex-grow w-full" variants={textVariants}>
        <h3 className="text-xl font-semibold text-purple-900 mb-3">{mentor.name}</h3>
        
        {/* Purple divider with animation */}
        <motion.div 
          className="w-12 h-1 bg-purple-400 mx-auto mb-4"
          initial={{ width: 0 }}
          animate={{ width: "3rem" }}
          transition={{ delay: 0.5, duration: 0.4 }}
        />
        
        <p className="text-sm text-neutral-600 mt-auto">{mentor.achievement}</p>
      </motion.div>
      
      {/* Subtle floating animation */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ 
          y: [0, 8, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}