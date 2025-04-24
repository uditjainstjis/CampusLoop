// components/EnhancedCursor.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';

const EnhancedCursor = () => {
  // Use refs to store DOM elements
  const cursorRef = useRef(null);
  const textBoxRef = useRef(null);
  
  // Track current greeting index
  const [currentGreeting, setCurrentGreeting] = useState(0);
  
  // Store cursor visibility state
  const [isVisible, setIsVisible] = useState(false);

  // Define greetings in different languages
  const greetings = [
    { text: "Hi !"},
    { text: "नमस्ते !"},
    { text: "Hola !" },
    { text: "Bonjour !"},
    { text: "こんにちは !"},
    { text: "안녕하세요 !"},
    { text: "Ciao !"},
    { text: "你好 !" }
  ];

  useEffect(() => {
    // Mouse position variables
    let cursorX = 0;
    let cursorY = 0;
    let textBoxX = 0;
    let textBoxY = 0;
    
    // Animation variables
    let animationFrameId;
    
    // Smooth animation function using RAF
    const animate = () => {
      if (cursorRef.current && textBoxRef.current) {
        // Apply cursor position directly for immediate response
        cursorRef.current.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        // Add increased smooth easing for text box (more delay)
        textBoxX += (cursorX - textBoxX) * 0.05; // Reduced from 0.12 to 0.05 for more delay
        textBoxY += (cursorY + 50 - textBoxY) * 0.05; // Increased offset and reduced easing factor
        
        textBoxRef.current.style.transform = `translate(${textBoxX}px, ${textBoxY}px)`;
      }
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationFrameId = requestAnimationFrame(animate);
    
    // Track mouse position
    const handleMouseMove = (e) => {
      setIsVisible(true);
      // Store actual cursor position
      cursorX = e.clientX;
      cursorY = e.clientY;
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    // Change greeting periodically
    const greetingInterval = setInterval(() => {
      setCurrentGreeting((prev) => (prev + 1) % greetings.length);
    }, 2000);
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(greetingInterval);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.body.style.cursor = 'auto'; // Restore default cursor on unmount
    };
  }, []);

  if (!isVisible) return null;
  
  return (
    <>
      {/* Hardware-accelerated cursor with increased size */}
      <div className="fixed top-0 left-0 pointer-events-none z-50 w-full h-full">
        <div 
          ref={cursorRef}
          className="absolute"
          style={{ 
            willChange: 'transform',
            transform: 'translate(0px, 0px)'
          }}
        >
          <svg 
            width="36" 
            height="36" 
            viewBox="0 0 28 28" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M2.31 1.15L22.15 12.4c0.83 0.47 0.62 1.71-0.31 1.87l-9.59 1.67l-1.66 9.59c-0.16 0.93-1.4 1.14-1.87 0.31L1.15 2.31c-0.48-0.86 0.3-1.64 1.16-1.16z" 
              fill="#FF7070" 
              stroke="white" 
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
      
      {/* Rectangular text box with more delay */}
      <div className="fixed top-0 left-0 pointer-events-none z-40 w-full h-full">
        <div
          ref={textBoxRef}
          className="absolute rounded-full tracking-wide px-5 py-2 bg-gradient-to-r from-red-400 to-pink-400 border-4 border-gray-200 shadow-lg"
          style={{ 
            willChange: 'transform',
            transform: 'translate(0px, 0px)',
            minWidth: '120px',
            textAlign: 'center'
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <p className="text-white font-medium text-lg">
              {greetings[currentGreeting].text}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnhancedCursor;