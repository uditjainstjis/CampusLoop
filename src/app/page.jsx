// src/app/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
// Assuming other components are correctly imported
import MentorShowcase from './components/MentorShowcase';
// ... other imports if needed

export default function Home() {
  // 1. State to track if the video should be clipped
  const [isVideoClipped, setIsVideoClipped] = useState(false);

  // 2. useEffect to set the clipping state after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVideoClipped(true);
    }, 3000); // 3000 milliseconds = 3 seconds

    // Cleanup function to clear the timer if the component unmounts
    // before the 3 seconds are up, preventing memory leaks.
    return () => clearTimeout(timer);

  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <motion.main className="overflow-hidden">
      {/* Consider adding pointer-events-none if this overlay shouldn't block interactions */}
      <div className="w-full absolute z-10 md:block hidden flex justify-center items-center pointer-events-none">
        {/* It might be better to control size/position on this container */}
        <div className="w-full h-full relative mr-12"> {/* Added relative container for positioning context if needed */}
          <video
            className="w-full h-full rounded-xl " // Removed mr-40 from video, apply to container if needed
            // 3. Apply conditional style for clip-path
            style={{
              clipPath: isVideoClipped ? 'inset(0 50% 0 0)' : 'none', // Clip right 50%
              transition: 'clip-path 0.3s ease', // Optional: smooth transition
            }}
            autoPlay
            // loop // Removed loop - effect will only happen once after 3s. Add back if you want it repeating.
            muted
            playsInline
          >
            <source src="guy.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <Hero />

      {/* This div pushes content down, acting as a spacer below the absolute video */}
      {/* Adjust height as needed based on your Hero/Video layout */}
      <div className="w-full h-[100vh] relative z-0"> {/* Example: Make spacer fill viewport height */}
         {/* Or adjust height based on Hero content */}
      </div>


      <MentorShowcase />

      {/* Removed redundant <main> inside <motion.main> */}
      {/* Add other sections here */}
      {/* <Faq /> */}
      {/* <HumanCards /> */}
      {/* <AnimatedSeniorConnectImage /> */}

    </motion.main>
  );
}