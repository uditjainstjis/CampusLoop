// src/app/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import AnimatedSeniorConnectImage from './components/AnimatedSeniorConnectImage'; // Adjust path if needed
import HumanCards from './components/HumanCards';
import MentorShowcase from './components/MentorShowcase';
import Faq from './components/Faq';
import Image from 'next/image';
import { initScrollTrigger } from './utils/animation';

export default function Home() {

  return (
    <motion.main

      className="overflow-hidden"
    >
      <div className="w-full absolute z-10 flex justify-center items-center">
        <video
          className="w-full h-full rounded-xl mr-40"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="guy.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
      <Hero />
      <div className="w-full z-10 h-[30vh] "></div>

      <MentorShowcase/>
      <main > 

    </main>
    </motion.main>

    
  );
}
