'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Format date helper function
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

// Animated skeleton loading component
const MentorDetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex flex-col items-center">
      <div className="rounded-full w-40 h-40 bg-gray-200 mb-8"></div>
      <div className="h-10 bg-gray-200 w-72 mb-4 rounded"></div>
      <div className="h-5 bg-gray-200 w-52 mb-10 rounded"></div>
      <div className="w-full h-48 bg-gray-200 rounded mb-12"></div>
      <div className="w-full h-32 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default function MentorDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [mentor, setMentor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const fetchMentorDetails = async () => {
        setIsLoading(true);
        setError(null);
        setMentor(null);
        try {
          const response = await fetch(`/api/mentors/${id}`);
          if(response.status==401){
              router.push('/signin');
              return;
          }
          if (!response.ok) {
            if (response.status === 404) { throw new Error('Mentor not found.'); }
            let errorMsg = `Failed to fetch mentor data (status: ${response.status})`;
            try { const errorData = await response.json(); errorMsg = errorData.message || errorMsg; } catch (_) {}
            throw new Error(errorMsg);
          }
          const data = await response.json();
          setMentor(data);
        } catch (err) {
          console.error("Error fetching mentor details:", err);
          setError(err.message || 'An unexpected error occurred.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchMentorDetails();
    } else {
      setError("Mentor ID is missing.");
      setIsLoading(false);
    }
  }, [id, router]);

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
  };

  const handleBookSession = () => {
    // Here you would implement the booking logic
    alert(`Booking session with ${mentor.name} on ${formatDate(selectedSlot.date)} at ${selectedSlot.startTime}`);
    setShowBookingModal(false);
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <MentorDetailSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="text-center py-32 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-medium text-gray-700 mb-6">Error Loading Mentor</h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <Link href="/mentors" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Mentors
        </Link>
      </motion.div>
    );
  }

  if (!mentor) {
    return <div className="text-center py-32 text-gray-500">Mentor data unavailable.</div>;
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      {/* Top navigation bar with back button */}
      <motion.nav 
        className="py-5 sticky top-0 bg-white/90 backdrop-blur-md z-10 shadow-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <Link href="/mentors" className="text-gray-600 hover:text-indigo-700 flex items-center transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Mentors
          </Link>
          
          {/* Optional: Add a quick action button here */}
          <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center gap-1 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Profile
          </button>
        </div>
      </motion.nav>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        {/* Banner - Optional decorative element */}
        <motion.div 
          className="h-32 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl mb-12 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-20 h-20 bg-indigo-400 rounded-full"></div>
            <div className="absolute bottom-0 right-1/3 w-32 h-32 bg-purple-400 rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-blue-400 rounded-full"></div>
          </div>
        </motion.div>

        {/* Profile header with enhanced styling */}
        <div className="relative mb-16">
          {/* Profile picture - elevated above the banner */}
          <motion.div 
            className="relative mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative h-48 w-48 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
              {mentor.imageUrl ? (
                <Image 
                  alt={`${mentor.name}'s profile photo`} 
                  src={mentor.imageUrl} 
                  layout="fill" 
                  objectFit="cover" 
                  className="object-center"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <span className="text-5xl font-bold text-indigo-600/60">
                    {mentor.name ? mentor.name.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Mentor name and title */}
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{mentor.name}</h1>
            {mentor.achievement && (
              <p className="text-xl text-indigo-600 font-medium mb-4">{mentor.achievement}</p>
            )}
            
            {/* Contextual badges */}
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Available Now</span>
              </div>
              <div className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{mentor.availability?.length || 0} Sessions Available</span>
              </div>
            </div>
          </motion.div>
          
          {/* Skills tags */}
          {mentor.skills && mentor.skills.length > 0 && (
            <motion.div 
              className="flex flex-wrap justify-center gap-2 mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {mentor.skills.map((skill, index) => (
                <motion.span 
                  key={index} 
                  className="text-sm px-4 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full shadow-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + (index * 0.05) }}
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Main content area - Left side (2/3 width on large screens) */}
          <motion.div 
            className="lg:col-span-2 space-y-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* About section */}
            <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                About
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                {mentor.about || 'No description provided.'}
              </p>
            </section>

            {/* How I Can Help section */}
            {mentor.help && mentor.help.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  How I Can Help You
                </h2>
                <div className="space-y-4">
                  {mentor.help.map((helpItem, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start bg-indigo-50 p-4 rounded-lg"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                    >
                      <div className="mt-1 mr-4 flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-700 text-lg">{helpItem}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>

          {/* Booking sidebar - Right side (1/3 width on large screens) */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Available Sessions
              </h2>
              
              {mentor.availability && mentor.availability.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {mentor.availability.map((slot, index) => (
                    <motion.div 
                      key={index} 
                      className={`border rounded-xl p-4 transition-colors cursor-pointer ${
                        selectedSlot === slot 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                      }`}
                      onClick={() => handleSelectSlot(slot)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + (index * 0.05) }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-900 text-lg font-medium">{formatDate(slot.date)}</p>
                          <p className="text-gray-600">{slot.startTime} - {slot.endTime}</p>
                        </div>
                        {selectedSlot === slot && (
                          <div className="text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500">No availability provided. Contact for scheduling.</p>
                </div>
              )}
              
              {/* Book session button */}
              <motion.button 
                className={`w-full py-4 mt-6 text-white text-lg font-medium rounded-xl transition-all ${
                  selectedSlot 
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={!selectedSlot}
                onClick={() => setShowBookingModal(true)}
                whileHover={selectedSlot ? { scale: 1.03 } : {}}
                whileTap={selectedSlot ? { scale: 0.97 } : {}}
              >
                {selectedSlot ? 'Book Selected Session' : 'Select a Session'}
              </motion.button>
              
              {/* Contact info */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Contact Options</h3>
                <div className="flex space-x-3">
                  <button className="flex-1 py-2 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </button>
                  <button className="flex-1 py-2 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      {/* Booking confirmation modal */}
      {showBookingModal && selectedSlot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <motion.div 
            className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-indigo-600 p-6 text-white">
              <h3 className="text-xl font-bold">Confirm Booking</h3>
              <p className="text-indigo-100 mt-1">Session with {mentor.name}</p>
            </div>
            
            <div className="p-6">
              <div className="mb-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">{formatDate(selectedSlot.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time:</span>
                  <span className="font-medium">{selectedSlot.startTime} - {selectedSlot.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">60 minutes</span>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button 
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors"
                  onClick={handleBookSession}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}