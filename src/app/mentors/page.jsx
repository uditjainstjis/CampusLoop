// File: app/mentors/page.js
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Image is not used in this component, you can remove the import if confirmed
// import Image from 'next/image';
import Link from 'next/link';
import MentorCard from '../components/MentorCard';
import MentorCardShimmer from '../components/MentorCardShimmer'; // Import the shimmer component

// Predefined star positions (keep this)
const STAR_POSITIONS = Array.from({ length: 50 }).map((_, i) => ({
  top: `${(i * 7.3 + i*0.1) % 100}%`,
  left: `${(i * 13.7 + i*0.2) % 100}%`,
  opacity: 0.3 + (i % 7) * 0.1,
  scale: 0.5 + (i % 5) * 0.1,
}));

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [mentors1, setMentors1] = useState([]); // Super Seniors
  const [mentors2, setMentors2] = useState([]); // Seniors

  useEffect(() => {
    async function getData() {
      setIsLoading(true); // Start loading
      try {
        const res = await fetch('/api/mentors');
        if (!res.ok) {
          throw new Error(`Error fetching mentors: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        const dataArr = data.mentors;

        const firstRow = [];
        const secondRow = [];

        dataArr.forEach(mentor => {
          if (mentor.seniority === 1) {
            firstRow.push(mentor);
          } else if (mentor.seniority === 2) {
            secondRow.push(mentor);
          }
        });

        setMentors1(firstRow);
        setMentors2(secondRow);

      } catch (error) {
        console.error('Got error while fetching Mentors data', error);
        // Optionally set state to indicate error
      } finally {
        // Add a small delay to make the shimmer effect visible
        setTimeout(() => {
           setIsLoading(false); // End loading
        }, 500); // Minimum 500ms loading time
      }
    }

    getData();
  }, []);

  // Removed the second useEffect for simulating fetch, the first useEffect handles the actual fetch and loading state.
  // useEffect(() => {
  //   const simulateFetch = () => {
  //     setTimeout(() => {
  //       setIsLoading(false);
  //     }, 1000);
  //   };
  //   simulateFetch();
  // }, []);


  // Determine the number of shimmer cards to display.
  // You can adjust this number based on how many cards you expect or want to show as placeholders.
  const numberOfShimmerCards = 6; // Example: Display 6 shimmer cards per section

  return (
    <>
      {/* Hero Section (keep as is) */}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Super Seniors Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-medium text-gray-900 mb-6">Super Seniors!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Display Shimmer Cards while loading
                Array.from({ length: numberOfShimmerCards }).map((_, index) => (
                  <MentorCardShimmer key={index} />
                ))
              ) : (
                // Display actual Mentor Cards when not loading
                mentors1.map(mentor => (
                  <motion.div
                    // Using mentor._id as key. Ensure your API provides a unique ID.
                    // If not, you might need to use mentor.id or another unique property.
                    key={mentor._id}
                    className="w-full"
                    variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}
                    initial="hidden"
                    animate="visible"
                    // Stagger animation based on index
                    transition={{ duration: 0.3, delay: 0.1 * mentors1.indexOf(mentor) }}
                  >
                    <Link href={`/mentors/${mentor._id}`} className="block h-full">
                      <MentorCard mentor={mentor} />
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Seniors Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-medium text-gray-900 mb-6">Seniors!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Display Shimmer Cards while loading
                Array.from({ length: numberOfShimmerCards }).map((_, index) => (
                  <MentorCardShimmer key={index + numberOfShimmerCards} /> // Use offset for key in the second section
                ))
              ) : (
                // Display actual Mentor Cards when not loading
                mentors2.map(mentor => (
                   <motion.div
                    // Using mentor._id as key. Ensure your API provides a unique ID.
                    // If not, you might need to use mentor.id or another unique property.
                    key={mentor._id}
                    className="w-full"
                    variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}
                    initial="hidden"
                    animate="visible"
                    // Stagger animation based on index
                    transition={{ duration: 0.3, delay: 0.1 * mentors2.indexOf(mentor) }}
                  >
                    <Link href={`/mentors/${mentor._id}`} className="block h-full">
                      <MentorCard mentor={mentor} />
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}