// File: app/mentors/page.js
'use client';

import { useState, useEffect } from 'react';
// import Head from 'next/head'; // DEPRECATED in App Router
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import Image from 'next/image';
import Link from 'next/link';
// import { useRouter } from 'next/navigation'; // Not used in the final render logic here, can be removed if not needed elsewhere
import MentorCard from '../components/MentorCard'; // Import the reusable component

// --- Metadata for App Router ---
// export const metadata = {
//   title: 'Our Mentors | Mentor Match',
//   description: 'Discover experienced mentors ready to help you grow.',
// };
// Note: Add this metadata object outside the component if you prefer static metadata.
// If you need dynamic metadata, define a generateMetadata function.
// For simplicity here, we'll remove the old <Head> and note how to add static metadata.

// Predefined star positions for consistent server/client rendering
const STAR_POSITIONS = Array.from({ length: 50 }).map((_, i) => ({
  top: `${(i * 7.3 + i*0.1) % 100}%`, // Added small offset
  left: `${(i * 13.7 + i*0.2) % 100}%`, // Added small offset
  opacity: 0.3 + (i % 7) * 0.1,
  scale: 0.5 + (i % 5) * 0.1,
  // animationDelay will be handled by stagger in motion.div if needed
}));

// First row of mentors data - Moved data outside the component
const FIRST_ROW_MENTORS = [
  {
    id: "m1",
    name: "Anuj Singhal",
    achievement: "MoveIn Sync Intern",
    imageUrl: "/img3.jpeg",
  },
  {
    id: "m2",
    name: "Priya Sharma",
    achievement: "UX Designer at Google",
    imageUrl: "/img1.jpeg",
  },
  {
    id: "m3",
    name: "Rahul Verma",
    achievement: "Software Engineer at Microsoft",
    imageUrl: "/img2.jpeg",
  },
  {
    id: "m4",
    name: "Nisha Patel",
    achievement: "Product Manager at Amazon",
    imageUrl: "/img4.jpeg",
  },
  {
    id: "m5",
    name: "Vikram Singh",
    achievement: "Data Scientist at Netflix",
    imageUrl: "/img5.jpeg",
  }
];

// Second row of mentors data - Moved data outside the component
const SECOND_ROW_MENTORS = [
  {
    id: "m6",
    name: "Sanya Malhotra",
    achievement: "Frontend Developer at Meta",
    imageUrl: "/img6.jpeg",
  },
  {
    id: "m7",
    name: "Arjun Kumar",
    achievement: "Backend Engineer at Twitter",
    imageUrl: "/img7.jpeg",
  },
  {
    id: "m8",
    name: "Meera Kapoor",
    achievement: "ML Engineer at Apple",
    imageUrl: "/img8.jpeg",
  },
  {
    id: "m9",
    name: "Karan Mehta",
    achievement: "UI Designer at Adobe",
    imageUrl: "/img9.jpeg",
  },
  {
    id: "m10",
    name: "Neha Gupta",
    achievement: "Tech Lead at Spotify",
    imageUrl: "/img10.jpeg",
  }
];

// Main page component - Renamed to 'Page' for App Router convention
export default function Page() { // Renamed from MentorsListPage to Page
  const [isLoading, setIsLoading] = useState(true);
  // const router = useRouter(); // Removed as it's not used here

  // Simulate loading
  useEffect(() => {
    const simulateFetch = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    simulateFetch();
  }, []);

  // If you want static metadata, define it outside and uncomment the import above
  // If you need dynamic metadata based on props (e.g., search params),
  // use the generateMetadata function instead.

  return (
    <>
      {/* Metadata goes here in App Router via export const metadata or generateMetadata */}
      {/* No <Head> tag needed directly in component */}

      {/* Hero Section with Space Theme */}
      <div className="relative bg-gradient-to-b mt-12 from-purple-950 via-purple-900 to-indigo-900 text-white overflow-hidden">
        {/* Animated stars background - WITH FIXED POSITIONS */}
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
                delay: i % 5 * 0.2, // Stagger delay for stars
              }}
            />
          ))}
        </div>

        {/* Large planet - Fixed position */}
        <motion.div
          className="absolute right-0 bottom-0 w-64 h-64 translate-x-1/4 translate-y-1/4 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 opacity-20"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Small planet - Fixed position */}
        <motion.div
          className="absolute top-20 left-0 w-32 h-32 -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-300 to-purple-500 opacity-10"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Orbit rings - Fixed positions */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="absolute w-96 h-96 border border-purple-300/10 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            className="absolute w-64 h-64 -translate-x-1/2 -translate-y-1/2 border border-indigo-300/10 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
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
        <AnimatePresence mode="wait"> {/* Added mode="wait" */}
          {isLoading && (
            <motion.div
              key="loading" // <-- ADDED KEY HERE
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
        {/* Changed the second AnimatePresence */}
        {!isLoading && ( // Render this motion.div directly when not loading
            <motion.div
              key="content" // <-- ADDED KEY HERE
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              // Removed exit here, as it's handled by the first AnimatePresence when isLoading becomes true again
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
              {/* First Row of Mentors */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-medium text-gray-900"> Super Senior's !</h2>
                </div>
                <div className="overflow-x-auto pb-6 hide-scrollbar">
                  <motion.div
                    className="flex gap-6 min-w-min"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.05 } },
                      hidden: {},
                    }}
                  >
                    {FIRST_ROW_MENTORS.map((mentor) => (
                      <motion.div
                        key={mentor.id}
                        variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}
                        className="w-[450px] flex-shrink-0"
                      >
                         <Link href={`/mentors/${mentor.id}`} className="block h-full">
                            <MentorCard mentor={mentor} />
                         </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Second Row of Mentors */}
              <div className="mb-16">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-medium text-gray-900">Senior's !</h2>
                </div>
                 <div className="overflow-x-auto pb-6 hide-scrollbar">
                  <motion.div
                    className="flex gap-6 min-w-min"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.05 } },
                      hidden: {},
                    }}
                  >
                    {SECOND_ROW_MENTORS.map((mentor) => (
                      <motion.div
                        key={mentor.id}
                        variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}
                        className="w-[450px] flex-shrink-0"
                      >
                         <Link href={`/mentors/${mentor.id}`} className="block h-full">
                            <MentorCard mentor={mentor} />
                         </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* CSS for hiding scrollbar but keeping scroll functionality */}
              <style jsx global>{`
                .hide-scrollbar {
                  scrollbar-width: none;
                  -ms-overflow-style: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
            </motion.div>
          )}
      </div>
    </>
  );
}