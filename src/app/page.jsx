'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const sectionsData = [
  {
    id: 1,
    title: 'Is NST the right college for me?',
    questions: [
      'Opportunities at NST',
      'Unfiltered Truth About NST',
      'Expectations vs Reality Check',
      'Internships',
    ],
    bgColor: '#F8BBD0',
    imageUrl: '/ru1.avif',
  },
  {
    id: 2,
    title: 'How to excel early in college?',
    questions: [
      'How to get Internships right in first summer break?',
      'How to crack GSoC/ HPAIR / ICPC right in first Year?',
      'How to Become fullstack developer or freelancing ready in 2 years?',
    ],
    bgColor: '#C5CAE9',
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
    bgColor: '#B2DFDB',
    imageUrl: '/dy1.jpg',
  },
];

export default function ScrollSections() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!triggerRef.current) return;

      const triggerElement = triggerRef.current;
      const { top } = triggerElement.getBoundingClientRect();
      const triggerHeight = triggerElement.offsetHeight;

      const scrollProgress = Math.min(Math.max(-top / triggerHeight, 0), 1);
      const index = Math.floor(scrollProgress * sectionsData.length);

      setCurrentSectionIndex(index);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={triggerRef} className="h-[300vh] relative">
      {sectionsData.map((section, index) => {
        const isActive = index === currentSectionIndex;

        return (
          <div
            key={section.id}
            className={`h-screen w-full flex flex-col items-center justify-center text-center transition-opacity duration-700 ease-in-out absolute top-0 left-0 ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            style={{ backgroundColor: section.bgColor }}
          >
            <h2 className="text-4xl font-bold mb-4">{section.title}</h2>
            <ul className="mb-6 space-y-2">
              {section.questions.map((q, idx) => (
                <li key={idx} className="text-lg">{q}</li>
              ))}
            </ul>
            <div className="w-[300px] h-[200px] relative">
              <Image
                src={section.imageUrl}
                alt={section.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
          
        );
      })}
    </div>
  );
}
