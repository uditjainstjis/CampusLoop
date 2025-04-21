// components/FaqStickyScroll.jsx
'use client';

import { act, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { isAscii } from 'buffer';

// --- Data (keep your original data structure) ---
const sections = [
    {
      id: 1,
      question: "Is NST the right college for me?",
      answer: "Opportunities at NST ,Unfiltered Truth About NST",
      color: "bg-indigo-500",
      textColor: "text-indigo-700" // Optional: Text color related to background
    },
    {
      id: 2,
      question: "How to excel early in college?",
      answer: "How to crack internships in 1st year? ,How to get into Google Summer Internship?",
      color: "bg-emerald-500",
      textColor: "text-emerald-700"
    },
    {
      id: 3,
      question: "How to crack NSAT with 9+ score",
      answer: "How to Crack Interview round 1 ,How to clear Newtons Tech round",
      color: "bg-amber-500",
      textColor: "text-amber-700"
    },
    // Add more sections if needed
];

// --- Component ---
export default function FaqStickyScroll() {
  const [activeSection, setActiveSection] = useState(0);
  const [isSticky, setIsSticky] = useState(false); // State to control fixed positioning

  const containerRef = useRef(null); // Ref for the tall scrollable container
  const stickyContentRef = useRef(null); // Ref for the content that will be fixed

  const totalHeight = `${sections.length * 100}vh`; // Calculate total scrollable height

  // useScroll to track progress within the tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"] // Animate while the container scrolls through the viewport
  });

  // Update activeSection based on scroll progress
  // Using useMotionValueEvent for optimized updates
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
      const currentSection = Math.floor(latest * sections.length);
      // Clamp the value to be within the valid range of indices
      setActiveSection(Math.min(Math.max(currentSection, 0), sections.length - 1));
  });
  

  // Effect to check if the container is in the viewport to apply 'fixed' positioning
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { top, bottom } = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Check if the top of the container is at or above the top of the viewport
      // AND the bottom is below the bottom of the viewport.
      // This means the container *currently spans* the entire viewport height.
      const shouldBeSticky = top <= 0 && bottom >= viewportHeight;

      // Only update state if the sticky status actually changes
      setIsSticky(prev => prev !== shouldBeSticky ? shouldBeSticky : prev);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  console.log(activeSection)
  // --- Card Animation Variants ---
  const cardVariants = {
    initial: { x: '-50%', y: '60%', opacity: 0, scale: 0.7, rotate: -5 }, // Start further down/left, slightly smaller/rotated
    enter: { x: '0%', y: '0%', opacity: 1, scale: 1, rotate: 0 },       // Animate to center, full size, no rotation
    exit: { x: '50%', y: '-60%', opacity: 0, scale: 0.7, rotate: 5 }    // Exit up/right, smaller/rotated
  };

  const currentBgColor = sections[activeSection]?.color || 'bg-gray-200'; // Fallback bg

  return (
    // 1. The Tall Container: Defines the scrollable area for the animation
    <div ref={containerRef} className="relative z-10" style={{ height: totalHeight }}>

      {/* 2. The Sticky/Fixed Content Wrapper:
          - Takes full viewport height/width.
          - Its position ('sticky' initially, then 'fixed' when active) is controlled by `isSticky` state.
          - `top-0` ensures it aligns to the top when sticky/fixed.
          - Contains the actual visible content (backgrounds, cards, dots).
      */}
      <div
        ref={stickyContentRef}
        className={`w-full h-screen overflow-hidden ${ isSticky ? 'fixed top-0 left-0' : 'sticky top-0' }`}
      >
        {/* Background colors - Animated Presence for smooth transitions */}
        <AnimatePresence initial={false}>
          <motion.div
            key={`bg-${sections[activeSection].id}`} // Key changes trigger animation
            className={`absolute inset-0 ${currentBgColor}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Centered Content Area */}
        <div className="relative h-full w-full flex items-center justify-center p-4 md:p-8">
          {/* Cards - Use AnimatePresence to handle enter/exit */}
          <AnimatePresence initial={false} custom={activeSection}>
            {sections.map((section, index) => (
              // Render only the active card? Or let AnimatePresence handle it?
              // Let AnimatePresence handle it for smoother transitions between cards.
              // We only need one motion.div inside AnimatePresence that changes based on activeSection.
              index === activeSection && (
                <motion.div
                  key={`card-${section.id}`} // Key changes trigger enter/exit
                  className="absolute w-full max-w-xl" // Centered card
                  custom={activeSection} // Pass index for potential direction control (not used here)
                  variants={cardVariants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  transition={{
                    type: "spring",
                    stiffness: 90, // Slightly softer spring
                    damping: 20,
                    // duration: 0.6 // Duration is often inferred with spring
                  }}
                >
                  <div className="p-6 md:p-8 bg-white bg-opacity-95 rounded-lg shadow-xl backdrop-blur-sm"> {/* Added backdrop blur */}
                    <div className="relative mb-4">
                      {/* Decorative element using section's text color */}
                      <div className={`absolute -left-4 top-1 w-1.5 h-6 ${section.color} rounded-full`} />
                      <h2 className={`text-2xl font-semibold ml-2 ${section.textColor || 'text-gray-800'}`}>
                          {section.question}
                      </h2>
                    </div>
                    <p className="text-gray-700 text-lg">{section.answer}</p>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
          {sections.map((section, index) => (
            <button
              key={`nav-${section.id}`}
              aria-label={`Go to section ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeSection
                  ? 'bg-white scale-125 ring-2 ring-white ring-offset-2 ring-offset-black/30' // Enhanced active state
                  : 'bg-white/40 hover:bg-white/70 backdrop-blur-sm' // Dimmed inactive state with hover
              }`}
              onClick={() => {
                 if (!containerRef.current) return;

                // Calculate target scroll position based on section index and container height
                const containerTop = containerRef.current.offsetTop;
                const containerHeight = containerRef.current.offsetHeight;
                // Scroll position where the *start* of the indexed section aligns with the *start* of the viewport
                const targetScrollY = containerTop + (index / sections.length) * (containerHeight - window.innerHeight);

                window.scrollTo({
                  top: targetScrollY,
                  behavior: 'smooth'
                });
              }}
            />
          ))}
        </div>
      </div> {/* End Sticky/Fixed Content Wrapper */}

      
    </div> // End Tall Container
  );
}