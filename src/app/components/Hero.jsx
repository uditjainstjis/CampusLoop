'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useRouter } from 'next/navigation'; 

export default function Hero() {
  const mainHeadingRef = useRef(null);
  const subHeadingRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter(); 

  useEffect(() => {
    const mainHeading = mainHeadingRef.current;
    const subHeading = subHeadingRef.current;
    
    if (mainHeading) {
      // Wait 2 seconds before starting the main heading animation (falling from top)
      setTimeout(() => {
        // Create timeline for main heading animation (falling from top)
        const mainTl = gsap.timeline();
        
        mainTl.fromTo(mainHeading, 
          { 
            y: "-100%",  // Start position (from top)
            opacity: 0
          }, 
          {
            y: "0%",     // Final position
            opacity: 1,
            duration: 0.8,
            ease: "bounce.out" // Bouncy effect when it lands
          }
        );
      }, 1730); // 2 seconds delay for main heading
    }

    if (subHeading) {
      // Wait 4 seconds before starting the subheading animation (sliding from right)
      setTimeout(() => {
        // Create timeline for subheading animation (sliding from right)
        const subTl = gsap.timeline();
        
        // First part: quick slide from right with overshoot
        subTl.fromTo(subHeading, 
          { 
            x: "100%",  // Start position (from right)
            opacity: 0
          }, 
          {
            x: "-10%",  // Overshoot to the left
            opacity: 1,
            duration: 0.64,
            ease: "power2.in" // Fast acceleration
          }
        )
        // Second part: bounce back with elastic effect for sudden jerk feel
        .to(subHeading, {
          x: "0%",     // Final resting position
          duration: 0.3,
          ease: "back.out(2.5)" // Creates that sudden stop/jerk effect
        });
      }, 4000); // 4 seconds delay for subheading
    }

    // Parallax effect on scroll
    const container = containerRef.current;
    if (container) {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const parallaxRate = scrollPosition * 0.4; // Adjust rate as needed
        // Use GSAP for smoother transform updates
        gsap.to(container, { y: parallaxRate, ease: "none", duration: 0.1 });
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []); 

  return (
    <section ref={containerRef} className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Modern gradient background with mesh pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 z-0"></div>
      
      {/* Mesh overlay for texture */}
      <div className="z-1000 absolute inset-0 opacity-10 z-0" 
        style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\' viewBox=\'0 0 40 40\'%3E%3Cg fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 20v-1.41l2.83-2.83 1.41 1.41L1.41 20H0zm20 0v-1.41l2.83-2.83 1.41 1.41L21.41 20H20zM0 0v1.41l2.83 2.83-1.41 1.41L0 2.83V0h1.41l2.83 2.83-1.41 1.41L0 1.41V0h1.41l2.83 2.83-1.41 1.41L0 1.41V0zm20 0v1.41l2.83 2.83-1.41 1.41L20 2.83V0h1.41l2.83 2.83-1.41 1.41L20 1.41V0h1.41l2.83 2.83-1.41 1.41L20 1.41V0zm0 18.59L22.83 16l1.41 1.41L21.41 20H20v-1.41zm0 20v-1.41l2.83-2.83 1.41 1.41L21.41 40H20v-1.41zM0 36.59V40h-1.41l-2.83-2.83 1.41-1.41L0 38.59z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      ></div>
      
      {/* Content container */}
      <div className="container mx-auto px-6 z-10 pt-12 md:pt-0">
        <motion.div 
          className="relative z-10 text-center max-w-5xl mx-auto"
        >
          {/* Subtle decorative line */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '120px' }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 mx-auto mb-6"
          ></motion.div>
          
          {/* Main Heading - Falls from top */}
          <h1 
            ref={mainHeadingRef}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 leading-tight tracking-tighter text-white"
            style={{ 
              fontFamily: "'Inter', sans-serif", 
              fontWeight: 800, 
              textWrap: 'wrap',
              opacity: 0, // Start invisible
              transform: 'translateY(-100%)' // Start from top
            }}
          >
            <span className="block z-1000">A new way </span>
          </h1>
          
          {/* Subheading - Slides from right */}
          <h2 
            ref={subHeadingRef}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight tracking-tight text-white"
            style={{ 
              fontFamily: "'Inter', sans-serif", 
              fontWeight: 700, 
              textWrap: 'wrap',
              opacity: 0, // Start invisible
              transform: 'translateX(100%)' // Start from right
            }}
          >
            <span className="block mb-2 z-1000">to explore college life</span>
          </h2>
          
          <motion.p 
            className="text-xl md:text-2xl z-1000 text-gray-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 5.3 }} // Delayed to appear after both headings
          >
            Get guidance about, campus life, entrance preparation, how to start coding and anything.
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 5.6 }} // Delayed to appear after the paragraph
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button 
              onClick={() => router.push('/mentors')} 
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-medium rounded-md hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 border border-indigo-500"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              Checkout Senior's
            </button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Modern geometric elements */}
      <motion.div 
        className="absolute top-1/4 -left-12 w-40 h-40 rounded-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-xl z-0"
        animate={{ 
          y: [0, -30, 0],
          x: [0, 15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 12,
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 -right-12 w-56 h-56 rounded-full bg-gradient-to-l from-indigo-600/20 to-purple-600/20 blur-xl z-0"
        animate={{ 
          y: [0, 30, 0],
          x: [0, -15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 10,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      
      <motion.div 
        className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-gradient-to-tr from-purple-600/20 to-pink-600/20 blur-xl z-0"
        animate={{ 
          y: [0, 40, 0],
          x: [0, -10, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 14,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </section>
  );
}