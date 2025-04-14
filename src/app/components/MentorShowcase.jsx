// src/components/MentorHeroShowcase.jsx (or your chosen file name)
import React from 'react';
import Link from 'next/link';
import { HeroParallax } from "../components/ui/hero-parallax";
const mockMentors = [
  {
    id: "mentor-1", // Unique key/id
    name: "Mehak Jain",
    achievement: "Lead Developer @ TechCorp",
    imageUrl: "/img1.jpeg",
  },
  {
    id: "mentor-2",
    name: "Bob Williams",
    achievement: "Marketing Director | Forbes 30 Under 30",
    imageUrl: "/img2.jpeg",

  },
  {
    id: "mentor-3",
    name: "Charlie Brown",
    achievement: "Senior UX Designer at CreateCo",
    imageUrl: "/img3.jpeg",

  },
  {
    id: "mentor-4",
    name: "Diana Davis",
    achievement: "Data Scientist & AI Researcher",
    imageUrl: "/img4.jpeg",
  },
  {
    id: "mentor-5",
    name: "Ethan Miller",
    achievement: "Venture Capitalist",
    imageUrl: "/img5.jpeg",
  },
  {
    id: "mentor-6", // Unique key/id
    name: "Mehak Jain",
    achievement: "Lead Developer @ TechCorp",
    imageUrl: "/img2.jpeg",
  },
  {
    id: "mentor-7",
    name: "Bob Williams",
    achievement: "Marketing Director | Forbes 30 Under 30",
    imageUrl: "/img5.jpeg",

  },
  {
    id: "mentor-8",
    name: "Charlie Brown",
    achievement: "Senior UX Designer at CreateCo",
    imageUrl: "/img1.jpeg",

  },
  {
    id: "mentor-9",
    name: "Diana Davis",
    achievement: "Data Scientist & AI Researcher",
    imageUrl: "/img4.jpeg",
  },
  {
    id: "mentor-10",
    name: "Ethan Miller",
    achievement: "Venture Capitalist",
    imageUrl: "/img1.jpeg",
  },
  
];

const parallaxProducts = mockMentors.map((mentor) => ({
  title: mentor.name, // Maps to the 'title' required by HeroParallax
  link: `/mentor/${mentor.id}`, // Example link to a mentor's profile page
  thumbnail: mentor.imageUrl, // Maps to the 'thumbnail' required by HeroParallax
}));


export default function MentorHeroShowcaseRedesigned() {
  const id = "mentor-hero-section"; // Optional ID for the section

  return (
    <div id={id} className="w-full "> {/* Ensure the container takes width */}
      <HeroParallax products={parallaxProducts}>
        {/* This content appears ABOVE the parallax grid */}
        <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto px-4"> {/* Added max-width & centering */}
          <h1 className="text-4xl md:text-7xl font-bold text-white text-center">
            Meet Your Mentors
          </h1>
          <p className="mt-6 text-lg md:text-xl text-neutral-200 text-center">
            Connect with industry leaders and accelerate your growth. <br />
            Explore profiles curated for your success journey.
          </p>
          <div className="mt-4 text-center text-neutral-300">
             Welcome, <span className="font-semibold text-white">Placeholder User!</span> | Achievements: <span className="font-semibold text-white">Rising Star ✨</span>
          </div>
          <div className="mt-10 flex justify-center">
             <Link
               href="/mentors" 
               className="inline-block px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black" // Added focus styles
              >
                Discover All Mentors
              </Link>
          </div>
        </div>
      </HeroParallax>
    </div>
  );
}