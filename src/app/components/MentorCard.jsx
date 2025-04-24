// File: app/components/MentorCard.js
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

// This component renders a single mentor card
export default function MentorCard({ mentor }) {
  // Ensure mentor object is provided
  if (!mentor) {
    return null; // Or a placeholder/error state
  }

  return (
    <motion.div
      // Key is handled by the parent component when mapping
      // Animation properties are coordinated with the parent's stagger
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03, boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' }}
      // Added min-h-[300px] for minimum height, px-4 py-6 for more vertical padding
      // h-full ensures it fills the Link container's height
      // flex flex-col items-center justify-start aligns content vertically
      className="bg-white rounded-xl shadow-md overflow-hidden px-4 py-6 text-center transition-all duration-300 hover:shadow-lg h-full flex flex-col items-center justify-start min-h-[300px]" // <-- MODIFIED CLASSES HERE
    >
      {/* Increased image size */}
      <div className="relative w-28 h-28 mx-auto mb-3 rounded-full overflow-hidden border-3 border-gray-100">
        <Image
          src={mentor.imageUrl}
          alt={mentor.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 112px" // Adjusted sizes based on new w/h (28*4=112)
        />
      </div>
      {/* Added flex-grow to push achievement down if name is short */}
      <h3 className="text-lg font-semibold text-neutral-800 truncate mb-2 flex-grow-0">{mentor.name}</h3>
      {/* Adjusted margin-top */}
      <p className="text-sm text-neutral-500 mt-auto truncate">{mentor.achievement}</p>
    </motion.div>
  );
}