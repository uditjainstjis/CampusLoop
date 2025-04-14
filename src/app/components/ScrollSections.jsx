// components/FullScreenScrollSectionsVerticalWipeReversed.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// --- Data with Frame Color ---
const sectionsData = [
    // ... (keep your data exactly the same)
    {
        id: 1,
        title: 'Is NST the right college for me?',
        questions: [ 'Opportunities at NST', 'Unfiltered Truth About NST'],
        bgColor: '#fad3e1', // Light Pink
        frameBgColor: '#F8BBD0', // Darker Pink
        imageUrl: '/ru1.avif',
    },
    {
        id: 2,
        title: 'How to excel early in college?',
        questions: ['How to crack internships in 1st year?', 'How to get into Google Summer Internship?'],
        bgColor: '#d1d5ed', // Light Indigo
        frameBgColor: '#C5CAE9', // Darker Indigo
        imageUrl: '/stud1.jpg',
    },
    {
        id: 3,
        title: 'How to crack NSAT with 9+ score',
        questions: ['How to Crack Interview round 1', 'How to clear Newtons Tech round'],
        bgColor: '#bfe4e1', // Light Teal
        frameBgColor: '#B2DFDB', // Darker Teal
        imageUrl: '/dy1.jpg',
    },
    {
        id: 3,
        title: 'How to crack NSAT with 9+ score',
        questions: [],
        bgColor: '#bfe4e1', // Light Teal
        frameBgColor: '#B2DFDB', // Darker Teal
        imageUrl: '/dy1.jpg',
    },
];
// --- End Data ---

// --- Animation Styles (For Text Fade) ---
const animationStyles = `
  @keyframes fadeInText {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeInText {
    animation: fadeInText 0.5s ease-in-out forwards;
  }
`;
// --- End Animation Styles ---


export default function FullScreenScrollSectionsVerticalWipeReversed() {
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [hasBeenActivated, setHasBeenActivated] = useState(false);

    const sectionWrapperRef = useRef(null);
    const fixedContentRef = useRef(null);
    const nextImageClipRef = useRef(null);

    const totalScrollHeight = `${sectionsData.length * 100}vh`;

    useEffect(() => {
        const wrapperElement = sectionWrapperRef.current;
        const nextImageElement = nextImageClipRef.current;

        if (!wrapperElement) return;

        let lastKnownScrollY = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            lastKnownScrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const { top, bottom, height } = wrapperElement.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;
                    const isInView = top <= 0 && bottom >= viewportHeight;

                    // --- Activation Logic ---
                    if (isInView) {
                        if (!isActive) {
                            setIsActive(true);
                            if (!hasBeenActivated) setHasBeenActivated(true);
                        }

                        // --- Section Index Calculation ---
                        const scrolledDistanceInWrapper = -top;
                        const heightPerSection = height / sectionsData.length;
                        let sectionIndex = Math.floor(scrolledDistanceInWrapper / heightPerSection);
                        sectionIndex = Math.max(0, Math.min(sectionsData.length - 1, sectionIndex));
                        if (sectionIndex !== currentSectionIndex) {
                            setCurrentSectionIndex(sectionIndex);
                        }

                        // --- Image Wipe Calculation ---
                        if (nextImageElement) {
                            const scrollProgressWithinSection = (scrolledDistanceInWrapper % heightPerSection) / heightPerSection;

                            // Calculate clip-path percentage (vertical wipe from bottom to top)
                            // Controls the *top* inset edge.
                            // 100% clipped (invisible) at progress 0 -> inset(100% 0 0 0)
                            // 0% clipped (fully visible) at progress 1 -> inset(0% 0 0 0)
                            const clipPercentage = Math.max(0, Math.min(100, (1 - scrollProgressWithinSection) * 100));

                            // Apply the reversed vertical clip-path style
                            // MODIFIED LINE: Changed from bottom edge to top edge
                            nextImageElement.style.clipPath = `inset(${clipPercentage}% 0 0 0)`;
                            nextImageElement.style.transition = 'clip-path none';
                        }

                    } else { // --- Deactivation Logic ---
                        if (isActive) {
                           setIsActive(false);
                           // Optional: Reset clip-path when inactive
                           // if (nextImageElement) {
                           //    nextImageElement.style.transition = 'clip-path 0.3s ease-out';
                           //    nextImageElement.style.clipPath = 'inset(100% 0 0 0)'; // Reset to fully clipped from top
                           // }
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [currentSectionIndex, isActive, hasBeenActivated]);

    const currentSection = sectionsData[currentSectionIndex];
    const nextSectionIndex = currentSectionIndex + 1;
    const nextSection = sectionsData[nextSectionIndex];

    const imageWidth = 350;
    const imageHeight = 200;
    const frameWidthClass = "w-[320px] sm:w-[360px] md:w-[400px]";
    const frameHeightClass = "h-[220px] sm:h-[250px] md:h-[280px]";


    return (
        <>
            <style jsx global>{animationStyles}</style>
            <div ref={sectionWrapperRef} className="relative w-full z-0" style={{ height: totalScrollHeight }}>
                {/* Fixed container */}
                <div
                    ref={fixedContentRef}
                    className={`
                        fixed top-0 left-0 w-full h-screen flex justify-center items-center
                        p-6 sm:p-10 md:p-16 lg:p-20 box-border overflow-hidden z-10
                        ease-in-out transition-[transform,background-color] duration-300 transition-opacity duration-800
                        ${isActive ? 'opacity-100 visible' : 'opacity-0 invisible'}
                        ${hasBeenActivated ? 'translate-y-0' : 'translate-y-full'}
                    `}
                    style={{ backgroundColor: currentSection.bgColor }}
                >
                    {/* Main Content Layout */}
                    <div className="flex flex-col md:flex-row items-center text-center md:text-left md:gap-10 lg:gap-16 max-w-4xl w-full text-gray-800">

                        {/* Image Frame Container */}
                        <div className={`mb-6 md:mb-0 flex-shrink-0 ${frameWidthClass} ${frameHeightClass} rounded-2xl shadow-xl relative overflow-hidden`}
                             style={{ backgroundColor: currentSection.frameBgColor }}
                             >
                             {/* Container to stack images */}
                             <div className="absolute inset-0">
                                 {/* Current Image Layer */}
                                 <div className="absolute inset-0 flex justify-center items-center p-4">
                                    {currentSection.imageUrl && (
                                        <Image
                                            src={currentSection.imageUrl}
                                            alt={currentSection.title || "Current section image"}
                                            width={imageWidth}
                                            height={imageHeight}
                                            style={{ objectFit: 'contain', borderRadius: '8px' }}
                                            priority={currentSectionIndex === 0}
                                            className="max-w-full max-h-full"
                                        />
                                    )}
                                 </div>

                                 {/* Next Image Layer (with Reversed Vertical Wipe) */}
                                 {nextSection && (
                                     <div
                                        // Initial clip from top
                                        style={{ backgroundColor: nextSection.frameBgColor, clipPath: 'inset(100% 0 0 0)' }}
                                        ref={nextImageClipRef}
                                        className="absolute inset-0 flex justify-center items-center p-4"
                                     >
                                         {nextSection.imageUrl && (
                                              <Image
                                                src={nextSection.imageUrl}
                                                alt={nextSection.title || "Next section image"}
                                                width={imageWidth}
                                                height={imageHeight}
                                                style={{ objectFit: 'contain', borderRadius: '8px'  }}
                                                className="max-w-full max-h-full"
                                                loading="lazy"
                                              />
                                         )}
                                     </div>
                                 )}
                             </div>
                        </div>
                        {/* End Image Frame Container */}

                        {/* Text Container */}
                        <div key={currentSection.id} className="flex-grow animate-fadeInText">
                           {/* ... text content ... */}
                           <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-5">
                                {currentSection.title}
                            </h2>
                            <ul className="list-none p-0 m-0 space-y-1 md:space-y-2">
                                {currentSection.questions.map((q, index) => (
                                    <li key={index} className="text-sm sm:text-base lg:text-lg opacity-80">
                                        {q}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* End Text Container */}

                    </div>
                </div>
            </div>
        </>
    );
}