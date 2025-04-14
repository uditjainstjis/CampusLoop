// src/app/page.js
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import HumanCards from './components/HumanCards';
import MentorShowcase from './components/MentorShowcase';
import Faq from './components/Faq';
import { initScrollTrigger } from './utils/animation';

export default function Home({ mentors }) {
  useEffect(() => {
    initScrollTrigger();
  }, []);
  

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-hidden"
    >
      <Hero />
      {/* <HumanCards /> */}
      <div className='w-full h-[30vh]'></div>
      <MentorShowcase mentors={mentors} />
      <Faq/>

    </motion.main>
  );
}
