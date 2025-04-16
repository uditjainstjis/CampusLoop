'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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

// Loading skeleton
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

  useEffect(() => {
    if (id) {
      const fetchMentorDetails = async () => {
        setIsLoading(true);
        setError(null);
        setMentor(null);
        try {
          const response = await fetch(`/api/mentors/${id}`);
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
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <MentorDetailSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-32 px-6">
        <h2 className="text-xl font-medium text-gray-700 mb-6">Error Loading Mentor</h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <Link href="/mentors" className="text-blue-500 hover:text-blue-700">
          ← Back to Mentors
        </Link>
      </div>
    );
  }

  if (!mentor) {
    return <div className="text-center py-32 text-gray-500">Mentor data unavailable.</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Top navigation bar with back button */}
      <nav className="py-5 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
          <Link href="/mentors" className="text-gray-600 hover:text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pb-20">
        {/* Profile header */}
        <div className="flex flex-col items-center mb-16">
          {mentor.imageUrl ? (
            <div className="relative h-48 w-48 mb-8 rounded-full overflow-hidden">
              <Image 
                alt={`${mentor.name}'s profile photo`} 
                src={mentor.imageUrl} 
                layout="fill" 
                objectFit="cover" 
                className="object-center"
              />
            </div>
          ) : (
            <div className="h-48 w-48 mb-8 rounded-full bg-gray-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          
          <h1 className="text-3xl font-semibold text-gray-900 mb-2 text-center">{mentor.name}</h1>
          {mentor.achievement && (
            <p className="text-xl text-gray-500 mb-6 text-center max-w-lg">{mentor.achievement}</p>
          )}
          
          {mentor.skills && mentor.skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {mentor.skills.slice(0, 5).map((skill, index) => (
                <span key={index} className="text-sm px-4 py-1 bg-gray-50 text-gray-600 rounded-full">
                  {skill}
                </span>
              ))}
              {mentor.skills.length > 5 && (
                <span className="text-sm px-4 py-1 bg-gray-50 text-gray-500 rounded-full">
                  +{mentor.skills.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Main content with increased spacing */}
        <div className="max-w-3xl mx-auto space-y-16">
          {/* About section */}
          <section>
            <h2 className="text-2xl font-medium text-gray-900 mb-6">About</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">
              {mentor.about || 'No description provided.'}
            </p>
          </section>

          {/* How I Can Help section */}
          {mentor.help && mentor.help.length > 0 && (
            <section>
              <h2 className="text-2xl font-medium text-gray-900 mb-6">How I Can Help You</h2>
              <div className="space-y-4">
                {mentor.help.map((helpItem, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mt-1.5 mr-4 flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-lg">{helpItem}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Availability section */}
          <section>
            <h2 className="text-2xl font-medium text-gray-900 mb-6">Available Sessions</h2>
            {mentor.availability && mentor.availability.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {mentor.availability.map((slot, index) => (
                  <div key={index} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer">
                    <p className="text-gray-900 text-lg font-medium">{formatDate(slot.date)}</p>
                    <p className="text-gray-500">{slot.startTime} - {slot.endTime}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg text-gray-500">No availability provided. Contact for scheduling.</p>
            )}
          </section>

          {/* Book session button */}
          <div className="pt-8">
            <button className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-medium rounded-xl transition-colors">
              Book a Session
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}