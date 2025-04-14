// components/FullScreenScrollSectionsSlideUp.js
'use client'; // Add this directive if using Next.js App Router

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// --- Data ---
const sectionsData = [
    {
        id: 1,
        title: 'Is NST the right college for me?',
        questions: [
            'What are Opportunities at NST?',
            'Unfiltered Truth About NST?',
            'Expectations vs Reality Check?',
        ],
        bgColor: '#F8BBD0', // Light Pink
        imageUrl: '/ru1.avif', // Make sure these paths are correct in your public folder
    },
    {
        id: 2,
        title: 'How to excel early in college?',
        questions: [
            'How to get Internships right in first summer break?',
            'How to Become fullstack developer or freelancing ready in 2 years?',
        ],
        bgColor: '#C5CAE9', // Light Indigo
        imageUrl: '/stud1.jpg',
    },
    {
        id: 3,
        title: 'Navigating NST Admissions & Interviews',
        questions: [
            'How to crack NSAT with 9+ score?',
            'How to Crack Interview round 1?',
            'How to reach at Tech round level in NST?',
        ],
        bgColor: '#B2DFDB', // Light Teal
        imageUrl: '/dy1.jpg',
    },
];
// --- End of Data ---

// --- Animation Styles (ensure fadeIn is defined if not using Tailwind config) ---
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out forwards;
  }
`;
// --- End Animation Styles ---


export default function FullScreenScrollSectionsSlideUp() {
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [hasBeenActivated, setHasBeenActivated] = useState(false); // Track first activation

    const sectionWrapperRef = useRef(null);
    const fixedContentRef = useRef(null);

    const totalScrollHeight = `${sectionsData.length * 100}vh`;

    useEffect(() => {
        const wrapperElement = sectionWrapperRef.current;
        if (!wrapperElement) return;

        const handleScroll = () => {
            const { top, bottom, height } = wrapperElement.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const isInView = top <= 0 && bottom >= viewportHeight;

            if (isInView) {
                if (!isActive) { // Check if just became active
                    setIsActive(true);
                    if (!hasBeenActivated) { // Check if it's the very first time
                        setHasBeenActivated(true);
                    }
                }

                // Calculate section index based on scroll progress within the wrapper
                const scrolledDistanceInWrapper = -top;
                const heightPerSection = height / sectionsData.length;
                let sectionIndex = Math.floor(scrolledDistanceInWrapper / heightPerSection);
                sectionIndex = Math.max(0, Math.min(sectionsData.length - 1, sectionIndex));

                if (sectionIndex !== currentSectionIndex) {
                    setCurrentSectionIndex(sectionIndex);
                }
            } else {
                if (isActive) { // Check if just became inactive
                   setIsActive(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [currentSectionIndex, isActive, hasBeenActivated]); // Add state dependencies

    const currentSection = sectionsData[currentSectionIndex];

    return (
        <>
            {/* <style jsx global>{animationStyles}</style> */}

            {/* Wrapper reserves space and triggers activation */}
            <div
                ref={sectionWrapperRef}
                className="relative w-full z-0"
                style={{ height: totalScrollHeight }}
            >
                {/* Fixed container handles display */}
                <div
                    ref={fixedContentRef}
                    className={`
                        fixed top-0 left-0 w-full h-screen flex justify-center items-center
                        p-6 sm:p-10 box-border overflow-hidden z-10
                        transition-all duration-700 ease-in-out // Apply transition to transform, opacity, background-color
                        ${isActive ? 'opacity-100 visible' : 'opacity-0 invisible'}
                        ${hasBeenActivated ? 'translate-y-0' : 'translate-y-full'} // Control vertical position
                    `}
                    style={{ backgroundColor: currentSection.bgColor }}
                >
                    {/* Inner content container for fade animation between sections */}
                    <div
                        key={currentSection.id} // Key triggers re-render and animation on section change
                        className="flex flex-col md:flex-row items-center text-center md:text-left md:gap-8 lg:gap-12 max-w-4xl w-full text-gray-800 animate-fadeIn" // Fade in content *within* the slide
                    >
                        {/* Image */}
                        {currentSection.imageUrl && (
                            <div className="mb-5 md:mb-0 flex-shrink-0 "> {/* Added size constraints */}
                                <Image
                                    src={currentSection.imageUrl}
                                    alt={currentSection.title || "Section image"}
                                    width={350} height={350}
                                    sizes="(max-width: 768px) 250px, 350px"
                                    style={{ objectFit: 'contain', width: '100%', height: 'auto', borderRadius: '8px' }}
                                    priority={currentSectionIndex === 0} // Prioritize first image
                                />
                            </div>
                        )}
                        {/* Text */}
                        <div className="flex-grow">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal mb-4 sm:mb-6">
                                {currentSection.title}
                            </h2>
                            <ul className="list-none p-0 m-0 space-y-2">
                                {currentSection.questions.map((q, index) => (
                                    <li key={index} className=" text:sm lg:text-base opacity-90">
                                        {q}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}