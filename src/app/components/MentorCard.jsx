// src/app/components/MentorCard.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function MentorCard({ mentor, variant = 'standard' }) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Robust image URL validation
  const isValidImageUrl = mentor?.imageUrl &&
                          typeof mentor.imageUrl === 'string' &&
                          mentor.imageUrl.trim().length > 0;

  useEffect(() => {
    // Reset error state if the mentor or its valid URL status changes
    setImgError(false);
  }, [isValidImageUrl, mentor?.imageUrl]);

  const handleImageError = () => {
    if (isValidImageUrl) {
      console.warn(`Failed to load image for ${mentor?.name || 'Mentor'}: ${mentor.imageUrl}`);
    }
    setImgError(true);
  };

  const FallbackContent = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
      <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
        {mentor?.name ? mentor.name.charAt(0).toUpperCase() : '?'}
      </span>
    </div>
  );

  const imageAltText = mentor?.name
    ? `Profile picture of ${mentor.name}`
    : 'Mentor profile picture';

  if (!mentor) {
    return <div className="p-4 text-center text-red-500 border rounded">Mentor data missing!</div>;
  }

  // Newspaper Style Variant
  if (variant === 'newspaper') {
    return (
      <motion.div
        className="relative bg-white border border-gray-200 overflow-hidden h-[280px] w-[400px] flex group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{
          y: -5,
          scale: 1.02,
          borderColor: '#4F46E5',
          boxShadow: '0 12px 24px rgba(79, 70, 229, 0.2)',
          transition: { duration: 0.3, ease: 'easeOut' }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Column 1: Image with hover effects */}
        <div className="w-2/5 border-r border-gray-200 relative bg-gray-100 overflow-hidden">
          {isValidImageUrl && !imgError ? (
            <motion.div
              className="w-full h-full"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={mentor.imageUrl}
                alt={imageAltText}
                layout="fill"
                objectFit="cover"
                onError={handleImageError}
                priority={false}
                className="transition-all duration-500"
              />
            </motion.div>
          ) : (
            <FallbackContent />
          )}
        </div>

        {/* Column 2: Content with animated reveal */}
        <div className="w-3/5 p-5 flex flex-col justify-between relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-xl font-serif font-bold text-gray-900 tracking-tight leading-tight line-clamp-2">
              {mentor.name || 'Unnamed Mentor'}
            </h3>
            {mentor.achievement && (
              <p className="text-xs font-mono uppercase tracking-wider text-indigo-700 mt-1 line-clamp-1">
                {mentor.achievement}
              </p>
            )}
          </motion.div>
          
          {mentor.skills && mentor.skills.length > 0 && (
            <motion.div 
              className="my-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1.5">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {mentor.skills.slice(0, 3).map((skill, index) => (
                  <motion.span 
                    key={index} 
                    className="inline-block border border-indigo-200 px-2 py-0.5 text-indigo-700 text-xs rounded-full"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 + (index * 0.1) }}
                    whileHover={{ backgroundColor: "#EEF2FF", scale: 1.05 }}
                  >
                    {skill}
                  </motion.span>
                ))}
                {mentor.skills.length > 3 && (
                  <motion.span 
                    className="text-xs text-indigo-500 ml-1 self-center font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    +{mentor.skills.length - 3}
                  </motion.span>
                )}
              </div>
            </motion.div>
          )}
          
          {mentor.about && (
            <motion.p 
              className="text-gray-600 text-xs leading-relaxed line-clamp-3 font-serif mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {mentor.about}
            </motion.p>
          )}
          
          {/* Decorative element that appears on hover */}
          <motion.div 
            className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    );
  }

  // Standard/Default Variant with enhanced animations
  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        y: -8, 
        boxShadow: "0 15px 30px -5px rgba(79, 70, 229, 0.15), 0 8px 10px -6px rgba(79, 70, 229, 0.1)", 
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image Section with hover effect */}
      <div className="relative h-48 w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {isValidImageUrl && !imgError ? (
          <motion.div
            className="w-full h-full"
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={mentor.imageUrl}
              alt={imageAltText}
              layout="fill"
              objectFit="cover"
              onError={handleImageError}
              priority={false}
              className="transition-all duration-500"
            />
          </motion.div>
        ) : (
          <FallbackContent />
        )}
        
        {/* Animated gradient overlay on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.7 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Name that appears on hover over image */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300"
          animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-bold text-white drop-shadow-lg">{mentor.name || 'Unnamed Mentor'}</h3>
          {mentor.achievement && (
            <p className="text-sm text-white/90 font-medium truncate drop-shadow-md">{mentor.achievement}</p>
          )}
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <motion.div 
          className="mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 truncate">{mentor.name || 'Unnamed Mentor'}</h3>
          {mentor.achievement && (
            <p className="text-sm text-indigo-600 font-medium truncate">{mentor.achievement}</p>
          )}
        </motion.div>
        
        {mentor.about && (
          <motion.div 
            className="mb-4 text-sm text-gray-600 line-clamp-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {mentor.about}
          </motion.div>
        )}
        
        {mentor.skills && mentor.skills.length > 0 && (
          <motion.div 
            className="mt-auto pt-3 border-t border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {mentor.skills.slice(0, 4).map((skill, index) => (
                <motion.span 
                  key={index} 
                  className="inline-block px-2.5 py-0.5 bg-indigo-50 text-indigo-800 rounded-full text-xs font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.4 + (index * 0.1) }}
                  whileHover={{ backgroundColor: "#E0E7FF", scale: 1.05 }}
                >
                  {skill}
                </motion.span>
              ))}
              {mentor.skills.length > 4 && (
                <motion.span 
                  className="text-xs text-indigo-500 self-center ml-1 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  +{mentor.skills.length - 4}
                </motion.span>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}