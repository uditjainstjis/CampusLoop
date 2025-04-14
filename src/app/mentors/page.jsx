import { useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import MentorCard from '../components/MentorCard';

export default function Mentors({ mentors }) {
  return (
    <>
      <Head>
        <title>Our Mentors | Mentor Match</title>
        <meta name="description" content="Discover and book sessions with our experienced mentors" />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Our Mentors
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Schedule a session with one of our industry experts to accelerate your growth
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentors.map((mentor, index) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <MentorCard mentor={mentor} showBookButton={true} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export async function getServerSideProps() {
  // In a real production app, this would be a fetch from a database
  // For this MVP, we'll use the in-memory data from our API route
  try {
    // Use absolute URL with host
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || process.env.HOST || 'localhost:5000';
    const response = await fetch(`${protocol}://${host}/api/mentors`);
    const mentors = await response.json();
    
    return {
      props: {
        mentors,
      },
    };
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return {
      props: {
        mentors: [],
      },
    };
  }
}
