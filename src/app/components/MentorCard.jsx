'use client'
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function MentorCard({ mentor, showBookButton = true, variant = 'standard' }) {
  const router = useRouter();

  const handleBookSession = () => {
    router.push(`/book/${mentor.id}`);
  };

  // Newspaper style variant
  if (variant === 'newspaper') {
    return (
      <motion.div 
        className="relative bg-white border border-gray-200 overflow-hidden h-[280px] w-[400px]"
        whileHover={{ 
          borderColor: '#4F46E5',
          boxShadow: '0 4px 20px rgba(79, 70, 229, 0.15)',
          transition: { duration: 0.3 } 
        }}
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-600 z-10 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-16 h-16 transform rotate-45 bg-indigo-800 text-white flex items-center justify-center">
            <span className="text-xs font-mono mt-10 mr-10">${mentor.rate}/h</span>
          </div>
        </div>
        
        <div className="grid grid-cols-5 h-full">
          {/* Left column - name and title */}
          <div className="col-span-2 border-r border-gray-200 p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 tracking-tight leading-tight">
                {mentor.name}
              </h3>
              <p className="text-sm font-mono uppercase tracking-wider text-indigo-700 mt-1">
                {mentor.title}
              </p>
            </div>
            
            <div className="mt-4">
              {showBookButton && (
                <motion.button
                  onClick={handleBookSession}
                  className="w-full text-left p-0 border-b-2 border-indigo-600 text-indigo-700 font-medium hover:text-indigo-900 transition-colors bg-transparent text-sm uppercase tracking-wider"
                  whileTap={{ scale: 0.98 }}
                >
                  Book a Session →
                </motion.button>
              )}
            </div>
          </div>
          
          {/* Right column - content */}
          <div className="col-span-3 p-5 flex flex-col h-full justify-between">
            <div>
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 font-serif">
                {mentor.bio}
              </p>
              
              <div className="mt-4">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Expertise</h4>
                <div className="flex flex-wrap gap-1">
                  {mentor.expertise.slice(0, 3).map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-block border border-gray-300 px-2 py-0.5 text-gray-700 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {mentor.expertise.length > 3 && (
                    <span className="text-xs text-gray-500 ml-1 self-center">+{mentor.expertise.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-right">
              <span className="text-xs text-gray-500 font-mono">ID: {mentor.id.replace('mentor_', '')}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Standard/default variant
  return (
    <motion.div 
      className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            {mentor.name.charAt(0)}
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-semibold text-gray-800">{mentor.name}</h3>
            <p className="text-indigo-600">{mentor.title}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 line-clamp-3">{mentor.bio}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Expertise</h4>
          <div className="flex flex-wrap gap-2">
            {mentor.expertise.slice(0, 4).map((skill, index) => (
              <span 
                key={index}
                className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
            {mentor.expertise.length > 4 && (
              <span className="text-xs text-gray-500 self-center">+{mentor.expertise.length - 4}</span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-gray-700 font-medium">${mentor.rate}</span>
            <span className="text-gray-500 text-sm">/hour</span>
          </div>
          
          {showBookButton && (
            <motion.button
              onClick={handleBookSession}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Session
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
