// src/app/page.js
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from './components/Hero';
import AnimatedSeniorConnectImage from './components/AnimatedSeniorConnectImage'; // Adjust path if needed
import HumanCards from './components/HumanCards';
import MentorShowcase from './components/MentorShowcase';
import Faq from './components/Faq';
import Image from 'next/image';
import { initScrollTrigger } from './utils/animation';

export default function Home() {
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
      <div className="w-full z-10 h-[30vh] "></div>

      <MentorShowcase/>
      <div className="w-full  h-[100vh] absolute bg-gradient-to-b from-white to-[#fad1e1] rounded-2xl"></div>

      <Faq/>
      {/* <Image style={{borderRadius:'50px', marginLeft:'auto', marginRight:'auto', marginTop:'-200px', marginBottom:'200px'}}  height={500} width={500} src='/image.png'/> */}

      <section className='relative h-[80vh] bg-gradient-to-b from-[#bfe4e1] to-green-100'>    
        
            <AnimatedSeniorConnectImage />
      
      </section>
    </motion.main>
  );
}
