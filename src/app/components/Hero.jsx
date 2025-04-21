'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useRouter } from 'next/navigation'; 

export default function Hero() {
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter(); 

  useEffect(() => {
    const heading = textRef.current;
    
    if (heading) {
      const text = heading.innerText;
      const characters = text.split('');
      
      heading.innerHTML = '';
      characters.forEach((char, i) => {
        const span = document.createElement('span');
        span.innerText = char === ' ' ? '\u00A0' : char; // Keep non-breaking space for spaces
        span.style.display = 'inline-block';
        // Add initial vertical offset for animation if desired, or rely purely on GSAP's 'y'
        // span.style.transform = 'translateY(20px)'; 
        heading.appendChild(span);
      });
      
      gsap.to(heading.children, {
        opacity: 1,
        y: 0, 
        stagger: 0.05,
        duration: 0.4,
        ease: "power2.out",
        delay: 0.3
      });
    }

    // Parallax effect on scroll
    const container = containerRef.current;
    if (container) {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const parallaxRate = scrollPosition * 0.4; // Adjust rate as needed
        // Use GSAP for smoother transform updates (optional but recommended)
        gsap.to(container, { y: parallaxRate, ease: "none", duration: 0.1 });
        // Or keep direct style manipulation:
        // container.style.transform = `translateY(${parallaxRate}px)`;
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }

  // Add containerRef to dependency array if its value could ever change, 
  // though for top-level refs it's usually stable. Adding it is safer.
  }, []); 
  // Note: router is not needed in the dependency array for this useEffect

  return (
    <section ref={containerRef} className="min-h-screen  flex flex-col items-center justify-center relative overflow-hidden">
      {/* Modern gradient background with mesh pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 z-0"></div>
      
      {/* Mesh overlay for texture */}
      <div className="absolute inset-0 opacity-10 z-0" 
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

        </motion.div>
      </div>
      
      {/* Modern geometric elements - Keep as is */}
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
      {/* ... other motion divs ... */}
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