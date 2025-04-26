// File: app/mentors/page.js
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import MentorCard from '../components/MentorCard';

// Predefined star positions
const STAR_POSITIONS = Array.from({ length: 50 }).map((_, i) => ({
  top: `${(i * 7.3 + i*0.1) % 100}%`,
  left: `${(i * 13.7 + i*0.2) % 100}%`,
  opacity: 0.3 + (i % 7) * 0.1,
  scale: 0.5 + (i % 5) * 0.1,
}));

// Mentors data
const FIRST_ROW_MENTORS = [
  { id: "m1", name: "Aman Kumar", achievement: "DRDO Intern", imageUrl: "/aman.png" },
  { id: "m2", name: "Bhavishya", achievement: "Google Intern", imageUrl: "/Bhavishya.JPG" },
  { id: "m3", name: "Priyanshu Jangra", achievement: "SDE Microsoft", imageUrl: "/Priyanshu.PNG" },
  { id: "m4", name: "Udita", achievement: "Amazon Intern", imageUrl: "/Udita.JPG" },
  { id: "m5", name: "Sujanam", achievement: "Rishihood Intern", imageUrl: "/Sujanam.JPG" }
];

const SECOND_ROW_MENTORS = [
  { id: "m6", name: "Pranav Singh", achievement: "Secretary GDG", imageUrl: "/Pranav.jpeg" },
  { id: "m7", name: "Narendra Singh", achievement: "Founder CodeSingh", imageUrl: "/Narendra.jpeg" },
];

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const simulateFetch = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    simulateFetch();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b mt-12 from-purple-950 via-purple-900 to-indigo-900 text-white overflow-hidden">
        {/* Animated stars background */}
        <div className="absolute inset-0 overflow-hidden">
          {STAR_POSITIONS.map((star, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: star.top,
                left: star.left,
                opacity: star.opacity,
                scale: star.scale,
              }}
              animate={{
                opacity: [star.opacity, star.opacity + 0.3, star.opacity],
                scale: [star.scale, star.scale * 1.3, star.scale],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i % 5 * 0.2,
              }}
            />
          ))}
        </div>

        {/* Planets and Orbits - keep similar to provided*/}
        <motion.div className="absolute right-0 bottom-0 w-64 h-64 translate-x-1/4 translate-y-1/4 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 opacity-20" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }} />
        <motion.div className="absolute top-20 left-0 w-32 h-32 -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-300 to-purple-500 opacity-10" animate={{ y: [0, 10, 0] }} transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div className="absolute w-96 h-96 border border-purple-300/10 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
          <motion.div className="absolute w-64 h-64 -translate-x-1/2 -translate-y-1/2 border border-indigo-300/10 rounded-full" animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-indigo-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Explore Mentors
          </motion.h1>

          <motion.p
            className="text-lg max-w-3xl mx-auto mb-6 text-purple-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Find the perfect guide for your professional journey
          </motion.p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-screen py-8 bg-gradient-to-b from-indigo-50 to-white">
        {/* Loading State */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="inline-block w-24 h-24 relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-0 rounded-full border-4 border-purple-200 border-dashed"></div>
                <div className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full bg-purple-600 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-t-4 border-r-4 border-purple-600 animate-spin"></div>
                </div>
              </motion.div>
              <p className="text-lg text-purple-800 mt-6 font-medium">Searching across the universe...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content when not loading */}
        {!isLoading && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            {/* Super Seniors Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-medium text-gray-900 mb-6">Super Seniors!</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Added grid layout */}
                {FIRST_ROW_MENTORS.map(mentor => (
                  <motion.div
                    key={mentor.id}
                    className="w-full" // Adjusted width
                    variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3, delay: 0.1 * FIRST_ROW_MENTORS.indexOf(mentor) }} //Stagger animation
                  >
                    <Link href={`/mentors/${mentor.id}`} className="block h-full">
                      <MentorCard mentor={mentor} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Seniors Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-medium text-gray-900 mb-6">Seniors!</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Added grid layout */}
                {SECOND_ROW_MENTORS.map(mentor => (
                  <motion.div
                    key={mentor.id}
                    className="w-full" // Adjusted width
                    variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3, delay: 0.1 * SECOND_ROW_MENTORS.indexOf(mentor) }}//Stagger animation
                  >
                    <Link href={`/mentors/${mentor.id}`} className="block h-full">
                      <MentorCard mentor={mentor} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        )}
      </div>
    </>
  );
}