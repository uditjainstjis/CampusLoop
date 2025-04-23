// File: app/mentors/page.js
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import MentorCard from '../components/MentorCard';
import { useRouter } from 'next/navigation';

// Default/Fallback Data
const DEFAULT_MENTORS = [
  {
    id: 'default-1',
    name: 'Default Mentor 1',
    achievement: 'Example Achievement',
    imageUrl: '/images/default-mentor-1.jpg',
    skills: ['React', 'JavaScript'],
  },
];

export default function MentorsListPage() {
  const [allMentors, setAllMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      }
    },
  };

  // Fetch mentors on component mount
  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true);
      setStatusMessage(null);
      try {
        const response = await fetch('/api/mentors');
        if (!response.ok) {
          if(response.status === 401){
            router.push('/signin');
            return;
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        const mentorsData = await response.json();

        if (!mentorsData || mentorsData.length === 0) {
          console.warn('API returned successfully but with no mentor data.');
          setAllMentors([]);
          setFilteredMentors([]);
          setStatusMessage('No mentors found.');
        } else {
          setAllMentors(mentorsData);
          setFilteredMentors(mentorsData);
        }
      } catch (e) {
        console.error('Error fetching mentors:', e);
        setStatusMessage('Failed to load mentors. Please try again later.');
        setAllMentors([]);
        setFilteredMentors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, [router]);

  // Filter mentors by search term
  useEffect(() => {
    let result = [...allMentors];

    if (searchTerm) {
      setHasSearched(true);
      const term = searchTerm.toLowerCase();
      result = result.filter(mentor =>
        mentor.name.toLowerCase().includes(term) ||
        (mentor.achievement && mentor.achievement.toLowerCase().includes(term)) ||
        mentor.skills.some(skill => skill.toLowerCase().includes(term))
      );
    } else {
      setHasSearched(false);
    }

    setFilteredMentors(result);
  }, [searchTerm, allMentors]);

  return (
    <>
      <Head>
        <title>Our Mentors | Mentor Match</title>
        <meta name="description" content="Discover experienced mentors ready to help you grow." />
      </Head>

      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-purple-50 text-gray-800 border-b border-gray-200">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-blue-500/5"></div>
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-purple-500/5"></div>
          <div className="absolute left-1/4 bottom-0 w-60 h-60 rounded-full bg-indigo-500/5"></div>
          
          {/* Animated dots */}
          {[...Array(6)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute w-2 h-2 rounded-full bg-indigo-500/20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, 10, 0],
                opacity: [0.7, 0.2, 0.7],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 5 + (i * 2),
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Find Your Mentor
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl max-w-3xl mx-auto mb-12 text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Connect with industry experts to accelerate your career growth.
          </motion.p>
          
          {/* Search bar with animated focus effects */}
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="Search by name, achievement or skill..."
                className="w-full px-6 py-4 rounded-full text-gray-800 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        placeholder-gray-400 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              {/* Animated search icon */}
              <motion.div 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                animate={{
                  scale: searchTerm ? 1.2 : 1,
                  color: searchTerm ? "#4F46E5" : "#9CA3AF",
                }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.div>
              
              {/* Clear search button - appears when search has content */}
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  onClick={() => setSearchTerm('')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-lg text-gray-500 mb-4">Loading mentors...</p>
                <motion.div 
                  className="inline-block h-12 w-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-600"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Message */}
          <AnimatePresence>
            {!isLoading && statusMessage && (
              <motion.div 
                className="text-center py-4 px-4 mb-6 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm font-medium">{statusMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mentor Grid */}
          <AnimatePresence>
            {!isLoading && (
              <>
                {filteredMentors.length === 0 && !statusMessage ? (
                  <motion.div 
                    className="text-center py-16 bg-white border border-gray-200 rounded-lg shadow-sm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8zm10 10l-4.35-4.35M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No Mentors Found</h3>
                    <p className="mt-2 text-sm text-gray-500">We couldn't find any mentors matching your search criteria.</p>
                    {hasSearched && (
                      <motion.button
                        onClick={() => setSearchTerm('')}
                        className="mt-6 px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Clear Search
                      </motion.button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    {filteredMentors.map((mentor, index) => (
                      <motion.div
                        key={mentor.id}
                        className="h-full"
                        variants={item}
                      >
                        <Link href={`/mentors/${mentor.id}`} className="block h-full">
                          <MentorCard mentor={mentor} />
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}