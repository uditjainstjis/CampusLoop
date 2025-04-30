// app/components/MentorCardShimmer.js
import React from 'react';

const MentorCardShimmer = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden px-6 py-8 text-center transition-all duration-300 h-full flex flex-col items-center justify-start min-h-[360px] border border-purple-100 relative animate-pulse">
      {/* Subtle floating animation (same as MentorCard) */}
      <div
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
      {/* Shimmer effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 shimmer-animation rounded-2xl"></div>

      {/* Circular Image placeholder */}
      <div className="relative w-40 h-40 mx-auto mb-5 rounded-full overflow-hidden border-4 border-purple-50 bg-gray-300 z-10">
        {/* Shimmer inside the image placeholder */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 shimmer-animation rounded-full"></div>
      </div>

      {/* Text placeholders */}
      <div className="flex flex-col flex-grow w-full z-10">
        {/* Name placeholder */}
        <div className="h-6 bg-gray-300 rounded-md w-3/4 mx-auto mb-3"></div>
        {/* Purple divider */}
        <div className="w-12 h-1 bg-purple-400 mx-auto mb-4"></div>
        {/* Achievement placeholder */}
        <div className="h-4 bg-gray-300 rounded-md w-1/2 mx-auto mt-auto"></div>
      </div>
    </div>
  );
};

export default MentorCardShimmer;