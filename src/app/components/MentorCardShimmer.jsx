// app/components/MentorCardShimmer.js
import React from 'react';

const MentorCardShimmer = () => {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg p-6 bg-white relative animate-pulse">
      {/* Shimmer effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 shimmer-animation"></div>

      {/* Content placeholders */}
      <div className="relative z-10 flex items-center">
        {/* Image placeholder */}
        <div className="w-20 h-20 rounded-full bg-gray-300 flex-shrink-0"></div>
        <div className="ml-6 flex-grow">
          {/* Name placeholder */}
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          {/* Achievement placeholder */}
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>

      {/* You can add more placeholders here if your MentorCard has more elements */}
      {/* <div className="relative z-10 mt-4">
          <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      </div> */}
    </div>
  );
};

export default MentorCardShimmer;