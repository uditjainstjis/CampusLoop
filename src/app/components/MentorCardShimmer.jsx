import React from 'react';

const MentorCardShimmer = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden px-6 py-8 text-center transition-all duration-300 h-full flex flex-col items-center justify-start min-h-[360px] border border-purple-100 relative animate-pulse">
      {/* Subtle floating animation (same as MentorCard) - You can remove this too if you want it simpler */}
      {/* This part likely relies on a library like framer-motion, but is included in the original JSX */}
      {/* If you are using framer-motion, this div is needed. If not, it might cause errors or do nothing. */}
      {/* Assuming it's meant for visual indication similar to MentorCard */}
      <div
        className="absolute inset-0 z-0"
        /* The animate and transition props would typically be applied if using framer-motion directly on this div */
        /* As this is a shimmer, the floating is likely applied to the parent element or intended for the actual MentorCard */
        /* Keeping it as is, assuming it's part of the original structure reference */
      />
      {/* Shimmer effect background - Softened Colors */}
      {/* Changed from-gray-200 via-gray-300 to-gray-200 to from-gray-100 via-gray-200 to-gray-100 */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 shimmer-animation rounded-2xl"></div>

      {/* Circular Image placeholder */}
      <div className="relative w-40 h-40 mx-auto mb-5 rounded-full overflow-hidden border-4 border-purple-50 bg-gray-300 z-10">
        {/* Shimmer inside the image placeholder - Softened Colors */}
        {/* Changed from-gray-200 via-gray-300 to-gray-200 to from-gray-100 via-gray-200 to-gray-100 */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 shimmer-animation rounded-full"></div>
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