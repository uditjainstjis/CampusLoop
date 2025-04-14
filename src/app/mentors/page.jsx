'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import MentorCard from '../components/MentorCard'; // Assuming this path is correct
import Link from 'next/link';

// --- Define Default Mentor Data ---
// This will be used if the API fetch fails.
// Make sure the structure matches your actual mentor data and MentorCard props.
const DEFAULT_MENTORS = [
  {
    id: 'default-1',
    name: 'Jane Doe (Example)',
    title: 'Senior React Developer',
    imageUrl: '/images/default-mentor-1.jpg', // Provide path to a placeholder image
    expertise: ['React', 'JavaScript', 'TypeScript', 'Frontend Architecture'],
    bio: 'Example mentor helping developers master React.',
    rate: 75, // Example rate
    availability: ['Weekdays', 'Evenings'] // Example availability
  },
  {
    id: 'default-2',
    name: 'John Smith (Example)',
    title: 'AI/ML Engineer',
    imageUrl: '/images/default-mentor-2.jpg', // Provide path to a placeholder image
    expertise: ['Machine Learning', 'Python', 'Data Science', 'TensorFlow'],
    bio: 'Example mentor passionate about AI and sharing knowledge.',
    rate: 90,
    availability: ['Weekends']
  },
  {
    id: 'default-3',
    name: 'Alex Chen (Example)',
    title: 'Lead Product Designer',
    imageUrl: '/images/default-mentor-3.jpg', // Provide path to a placeholder image
    expertise: ['Design', 'UX/UI', 'Figma', 'Product Strategy'],
    bio: 'Example mentor focused on user-centered design principles.',
    rate: 80,
    availability: ['Weekdays']
  }
];
// --- End Default Mentor Data ---


export default function Mentors() {
  // State for storing fetched mentors
  const [allMentors, setAllMentors] = useState([]);
  // State for filters and search
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  // State for the mentors currently displayed (after filtering/search)
  const [filteredMentors, setFilteredMentors] = useState([]);
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  // State for error handling / status message
  const [statusMessage, setStatusMessage] = useState(null); // Renamed from 'error' for clarity

  // Fetch mentors on component mount
  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true);
      setStatusMessage(null); // Clear previous status messages
      try {
        const response = await fetch('/api/mentors');
        if (!response.ok) {
           // Throw error to be caught below, triggering fallback
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const mentorsData = await response.json();
        if (!mentorsData || mentorsData.length === 0) {
            // Handle case where API returns success but empty data
            console.warn('API returned successfully but with no mentor data. Using default examples.');
            setAllMentors(DEFAULT_MENTORS);
            setFilteredMentors(DEFAULT_MENTORS);
            setStatusMessage('Could not load live data. Showing default examples.');
        } else {
            // API Success with data
            setAllMentors(mentorsData);
            setFilteredMentors(mentorsData);
        }
      } catch (e) {
        // --- API Fetch Failed - Load Default Data ---
        console.error('Error fetching mentors:', e);
        console.warn('API fetch failed. Loading default mentor data as fallback.');
        setAllMentors(DEFAULT_MENTORS);
        setFilteredMentors(DEFAULT_MENTORS);
        // Set a status message to inform the user
        setStatusMessage('Failed to load live mentors. Showing default examples.');
        // --- End Fallback Logic ---
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, []); // Dependency array is empty, runs once on mount

  // Filter mentors by expertise category and search term
  useEffect(() => {
    let result = [...allMentors]; // Start with current mentors (either API or default)

    if (filter !== 'all') {
      result = result.filter(mentor =>
        mentor.expertise.some(skill =>
          skill.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(mentor =>
        mentor.name.toLowerCase().includes(term) ||
        (mentor.title && mentor.title.toLowerCase().includes(term)) || // Added safety check for title
        mentor.expertise.some(skill => skill.toLowerCase().includes(term))
      );
    }

    setFilteredMentors(result);
  }, [filter, searchTerm, allMentors]); // Re-run filter when base data (allMentors) changes

  // List of expertise categories for filter
  // Consider dynamically generating these from `allMentors` for better accuracy
  const expertiseCategories = [
    { key: 'all', label: 'All Mentors' },
    { key: 'react', label: 'React' },
    { key: 'machine learning', label: 'Machine Learning' },
    { key: 'product', label: 'Product' },
    { key: 'design', label: 'Design' },
    { key: 'mobile', label: 'Mobile' }
    // Add more categories if needed, especially if DEFAULT_MENTORS have others
  ];

  return (
    <>
      <Head>
        <title>Our Mentors | Mentor Match</title>
        <meta name="description" content="Discover and book sessions with our experienced mentors" />
      </Head>

      {/* Hero Section - Light Theme */}
      <div className="bg-white text-gray-800 border-b border-gray-200"> {/* Changed background */}
        {/* ... (Hero section content remains the same) ... */}
         <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
           <motion.h1
             className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900" // Darker text for heading
             initial={{ y: -50, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.8 }}
           >
             Find Your Perfect Mentor
           </motion.h1>

           <motion.p
             className="text-lg md:text-xl max-w-3xl mx-auto mb-12 text-gray-600" // Standard body text color
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.8, delay: 0.2 }}
           >
             Connect with industry experts who can accelerate your career growth,
             provide personalized guidance, and help you reach your professional goals.
           </motion.p>

           {/* Search bar - Minimalist */}
           <motion.div
             className="max-w-2xl mx-auto" // Slightly narrower max-width
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.8, delay: 0.4 }}
           >
             <div className="relative">
               <input
                 type="text"
                 placeholder="Search by name, role or expertise..."
                 className="w-full px-6 py-3 rounded-full text-gray-800 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400" // Lighter bg, border, blue focus ring
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
               <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"> {/* Centered icon */}
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
               </div>
             </div>
           </motion.div>
         </div>
      </div>

      {/* Main Content Area - Light background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50" // Kept light gray bg for subtle contrast
      >
        <div className="max-w-7xl mx-auto">
          {/* Filter tabs - Minimalist Style */}
          <div className="flex overflow-x-auto pb-4 space-x-3 mb-8 scrollbar-hide"> {/* Reduced space */}
            {expertiseCategories.map((category, index) => (
              <motion.button
                key={category.key}
                onClick={() => setFilter(category.key)}
                className={`px-5 py-2 rounded-full font-medium whitespace-nowrap text-sm transition-colors border ${ // Added border
                  filter === category.key
                    ? 'bg-blue-500 text-white border-blue-500' // Active: Blue background
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100 hover:border-gray-400' // Inactive: White bg, gray text/border
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {category.label}
              </motion.button>
            ))}
          </div>

           {/* Status Message Area (Covers Loading and Fallback Info) */}
           {isLoading && (
             <div className="text-center py-12">
               <p className="text-lg text-gray-500">Loading mentors...</p>
               <div className="mt-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                 <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
               </div>
             </div>
           )}

           {/* Display status message if not loading and message exists */}
           {!isLoading && statusMessage && (
              <div className="text-center py-4 px-4 mb-6 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md"> {/* Style for info/warning */}
                 <p className="text-sm">{statusMessage}</p>
              </div>
           )}


          {/* Content Display (only when not loading) */}
          {/* Now this section shows either API data or default data */}
          {!isLoading && (
            <>
              {/* Results count */}
              <div className="flex justify-between items-center mb-8">
                <p className="text-sm text-gray-600"> {/* Slightly smaller text */}
                  Found <span className="font-semibold text-gray-800">{filteredMentors.length}</span> {filteredMentors.length === 1 ? 'mentor' : 'mentors'}
                </p>
              </div>

              {filteredMentors.length === 0 ? (
                // No Mentors Found (after filtering/search, or if default data is empty)
                <div className="text-center py-16 bg-white border border-gray-200 rounded-lg"> {/* Contained message */}
                   <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      {/* Using a user search icon */}
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m8-10a4 4 0 100-8 4 4 0 000 8zm10 10l-4.35-4.35M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No Mentors Found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                   { (filter !== 'all' || searchTerm !== '') && (
                    <button
                        onClick={() => { setFilter('all'); setSearchTerm(''); }}
                        className="mt-6 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors" // Consistent button style
                    >
                        Reset Filters
                    </button>
                   )}
                </div>
              ) : (
                 // Display Mentor Cards
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Slightly smaller gap */}
                  {filteredMentors.map((mentor, index) => (
                    <motion.div
                      key={mentor.id} // Use mentor.id as key
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="h-full" // Ensure motion div takes full height for link
                    >
                      {/* Assuming MentorCard has a light theme (e.g., white bg, subtle shadow/border) */}
                      <Link href={`/mentor/${mentor.id}`} className="block h-full">
                         {/* Make sure MentorCard accepts 'mentor' prop with the defined structure */}
                        <MentorCard mentor={mentor} showBookButton={false} />
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