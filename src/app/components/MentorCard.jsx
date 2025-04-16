// src/app/components/MentorCard.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function MentorCard({ mentor, variant = 'standard' }) {
  const [imgError, setImgError] = useState(false);

  // --- Robust Check for a valid, non-empty string URL ---
  // Checks for null, undefined, non-string types, empty string, whitespace-only string
  const isValidImageUrl = mentor?.imageUrl &&
                          typeof mentor.imageUrl === 'string' &&
                          mentor.imageUrl.trim().length > 0;

  useEffect(() => {
    // Reset error state if the mentor or its valid URL status changes
    setImgError(false);
  }, [isValidImageUrl, mentor?.imageUrl]); // Dependency includes the validation result

  // --- Handler for Image Loading Errors ---
  const handleImageError = () => {
    // Avoid logging if the URL was invalid to begin with
    if (isValidImageUrl) {
        console.warn(`Failed to load image for ${mentor?.name || 'Mentor'}: ${mentor.imageUrl}`);
    }
    setImgError(true); // Set error state on failure
  };

  // --- Define Fallback Content (can be customized) ---
  const FallbackContent = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400">
       {/* Option 1: Initials */}
       <span className="text-3xl lg:text-4xl font-bold">
            {mentor?.name ? mentor.name.charAt(0).toUpperCase() : '?'}
       </span>
       {/* Option 2: SVG Icon */}
       {/* <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"> <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /> </svg> */}
    </div>
  );

  // --- Define Guaranteed Alt Text ---
  // Provides a descriptive default if name is missing
  const imageAltText = mentor?.name
    ? `Profile picture of ${mentor.name}`
    : 'Mentor profile picture';

  // --- Base check for mentor object ---
  if (!mentor) {
    return <div className="p-4 text-center text-red-500 border rounded">Mentor data missing!</div>;
  }


  // --- Newspaper Style Variant ---
  if (variant === 'newspaper') {
    return (
      <motion.div
        className="relative bg-white border border-gray-200 overflow-hidden h-[280px] w-[400px] flex"
        whileHover={{
          borderColor: '#4F46E5',
          boxShadow: '0 4px 20px rgba(79, 70, 229, 0.15)',
          transition: { duration: 0.3 }
        }}
      >
        {/* Column 1: Image */}
        <div className="w-2/5 border-r border-gray-200 relative bg-gray-100">
          {/* *** STRICT Conditional Rendering *** */}
          {isValidImageUrl && !imgError ? (
            <Image
              src={mentor.imageUrl} // Known to be valid string here
              alt="Mentor's Profile Picture"   // Use guaranteed alt text
              layout="fill"
              objectFit="contain"
              onError={handleImageError}
              priority={false}
              unoptimized={imgError} // Optional: might help prevent refetch attempts on error
            />
          ) : (
            <FallbackContent /> // Render fallback if no valid URL or if error occurred
          )}
        </div>

        {/* Column 2: Content */}
        <div className="w-3/5 p-5 flex flex-col justify-between">
            {/* ... (rest of newspaper content remains the same) ... */}
            <div>
              <h3 className="text-xl font-serif font-bold text-gray-900 tracking-tight leading-tight line-clamp-2">
                {mentor.name || 'Unnamed Mentor'}
              </h3>
              {mentor.achievement && (
                <p className="text-xs font-mono uppercase tracking-wider text-indigo-700 mt-1 line-clamp-1">
                  {mentor.achievement}
                </p>
              )}
            </div>
            {mentor.skills && mentor.skills.length > 0 && (
              <div className="my-3">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1.5">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {mentor.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="inline-block border border-gray-300 px-2 py-0.5 text-gray-700 text-xs">
                      {skill}
                    </span>
                  ))}
                  {mentor.skills.length > 3 && <span className="text-xs text-gray-500 ml-1 self-center">+{mentor.skills.length - 3}</span>}
                </div>
              </div>
            )}
            {mentor.about && (
              <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 font-serif mt-1">
                {mentor.about}
              </p>
            )}
        </div>
      </motion.div>
    );
  }

  // --- Standard/Default Variant ---
  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col"
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", transition: { duration: 0.2 } }}
    >
       {/* Image Section */}
       <div className="relative h-48 w-full bg-gray-100">
           {/* *** STRICT Conditional Rendering *** */}
           {isValidImageUrl && !imgError ? (
               <Image
                   src={mentor.imageUrl} // Known to be valid string here
                   alt="Mentor's Profile Picture"     // Use guaranteed alt text
                   layout="fill"
                   objectFit="contain"
                   onError={handleImageError}
                   priority={false}
                   className="transition-transform duration-300 group-hover:scale-105"
                   unoptimized={imgError} // Optional
               />
           ) : (
               <FallbackContent /> // Render fallback if no valid URL or if error occurred
           )}
       </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* ... (rest of standard variant content remains the same) ... */}
        <div className="mb-3">
            <h3 className="text-xl font-semibold text-gray-800 truncate">{mentor.name || 'Unnamed Mentor'}</h3>
            {mentor.achievement && (
               <p className="text-sm text-indigo-600 font-medium truncate">{mentor.achievement}</p>
            )}
        </div>
        {mentor.about && (
            <div className="mb-4 text-sm text-gray-600 line-clamp-3">
               {mentor.about}
            </div>
        )}
        {mentor.skills && mentor.skills.length > 0 && (
           <div className="mt-auto pt-3 border-t border-gray-100">
             <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Skills</h4>
             <div className="flex flex-wrap gap-1.5">
               {mentor.skills.slice(0, 4).map((skill, index) => (
                 <span key={index} className="inline-block px-2.5 py-0.5 bg-indigo-50 text-indigo-800 rounded-full text-xs font-medium">
                   {skill}
                 </span>
               ))}
               {mentor.skills.length > 4 && <span className="text-xs text-gray-500 self-center ml-1">+{mentor.skills.length - 4}</span>}
             </div>
           </div>
        )}
      </div>
    </motion.div>
  );
}