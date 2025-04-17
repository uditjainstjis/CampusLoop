// File: app/mentors/page.js
'use client'; // Needed for useState, useEffect for client-side fetching/filtering

import { useState, useEffect } from 'react';
import Head from 'next/head'; // Or use generateMetadata
import { motion } from 'framer-motion';
import Link from 'next/link';
import MentorCard from '../components/MentorCard'; // Adjust path if needed
import { useRouter } from 'next/navigation'

// --- Default/Fallback Data (Optional, but good for resilience) ---
// Use structure matching your LATEST schema if you keep this
const DEFAULT_MENTORS = [
  {
    id: 'default-1',
    name: 'Default Mentor 1',
    achievement: 'Example Achievement',
    imageUrl: '/images/default-mentor-1.jpg', // Ensure this image exists
    skills: ['React', 'JavaScript'],
    // Add other fields like 'about', 'help', 'availability' if MentorCard needs them for previews
  },
  // Add more default mentors if desired
];

export default function MentorsListPage() {
  const [allMentors, setAllMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  // You can re-add category filters if needed (based on 'skills')
  // const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const router = useRouter()

  // Fetch mentors on component mount
  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true);
      setStatusMessage(null);
      try {
        const response = await fetch('/api/mentors'); // Fetch from your API route
        if (!response.ok) {
          if(response.status==401){
            router.push('/signin')
            return
          }else{
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        const mentorsData = await response.json();

        if (!mentorsData || mentorsData.length === 0) {
          // Handle API success but empty data - maybe show defaults or a message
          console.warn('API returned successfully but with no mentor data.');
          // setAllMentors(DEFAULT_MENTORS); // Optionally use defaults
          // setFilteredMentors(DEFAULT_MENTORS);
          setAllMentors([]); // Or just show empty
          setFilteredMentors([]);
          setStatusMessage('No mentors found.'); // Inform the user
        } else {
          // API Success with data
          setAllMentors(mentorsData);
          setFilteredMentors(mentorsData);
        }
      } catch (e) {
        console.error('Error fetching mentors:', e);
        setStatusMessage('Failed to load mentors. Please try again later.');
        // Optionally load defaults as fallback
        // console.warn('Loading default mentor data as fallback.');
        // setAllMentors(DEFAULT_MENTORS);
        // setFilteredMentors(DEFAULT_MENTORS);
        setAllMentors([]); // Clear previous data on error
        setFilteredMentors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, []); // Empty dependency array, runs once on mount

  // Filter mentors by search term (adapt if adding category filters)
  useEffect(() => {
    let result = [...allMentors];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(mentor =>
        mentor.name.toLowerCase().includes(term) ||
        (mentor.achievement && mentor.achievement.toLowerCase().includes(term)) ||
        mentor.skills.some(skill => skill.toLowerCase().includes(term))
      );
    }

    setFilteredMentors(result);
  }, [searchTerm, allMentors]);

  // --- Optional: Define Skill Categories for Filtering ---
  // const skillCategories = [ { key: 'all', label: 'All' }, /* ... other skills */ ];

  return (
    <>
      {/* Use generateMetadata or Head */}
      <Head>
        <title>Our Mentors | Mentor Match</title>
        <meta name="description" content="Discover experienced mentors ready to help you grow." />
      </Head>

      {/* Hero Section */}
      <div className="bg-white text-gray-800 border-b border-gray-200">
         <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
             <motion.h1 /* ... */ className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
                Find Your Mentor
             </motion.h1>
             <motion.p /* ... */ className="text-lg md:text-xl max-w-3xl mx-auto mb-12 text-gray-600">
                Connect with industry experts to accelerate your career growth.
             </motion.p>
            {/* Search bar */}
            <motion.div /* ... */ className="max-w-2xl mx-auto">
              <div className="relative">
                  <input
                      type="text"
                      placeholder="Search by name, achievement or skill..."
                      className="w-full px-6 py-3 rounded-full text-gray-800 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {/* Search Icon */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                     <svg /* ... */ className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                     </svg>
                  </div>
              </div>
            </motion.div>
         </div>
      </div>

      {/* Main Content Area */}
      <motion.div
        className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
           {/* Add Filter tabs here if needed */}
           {/* ... */}

           {/* Status Message Area */}
           {isLoading && (
             <div className="text-center py-12">
                <p className="text-lg text-gray-500">Loading mentors...</p>
                {/* Spinner */}
                <div className="mt-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                   <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
             </div>
           )}

           {!isLoading && statusMessage && (
              <div className="text-center py-4 px-4 mb-6 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md">
                 <p className="text-sm">{statusMessage}</p>
              </div>
           )}

          {/* Mentor Grid (only show when not loading) */}
          {!isLoading && (
            <>
              {filteredMentors.length === 0 && !statusMessage ? ( // Only show "No results" if loading is finished and no other status message exists
                <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
                  <svg /* No results icon */ className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8zm10 10l-4.35-4.35M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No Mentors Found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
                  {searchTerm && ( // Show reset button only if a search term exists
                     <button
                        onClick={() => setSearchTerm('')}
                        className="mt-6 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                     >
                        Clear Search
                     </button>
                   )}
                </div>
              ) : (
                 // Display Mentor Cards
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMentors.map((mentor, index) => (
                    <motion.div
                      key={mentor.id} // Ensure API returns a unique 'id' (mapped from '_id')
                      className="h-full"
                    >
                       {/* Link each card to the dynamic detail page */}
                      <Link href={`/mentors/${mentor.id}`} className="block h-full">
                         {/* Pass the necessary mentor data to MentorCard */}
                         {/* Ensure MentorCard is updated for the new schema */}
                         <MentorCard mentor={mentor} />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}