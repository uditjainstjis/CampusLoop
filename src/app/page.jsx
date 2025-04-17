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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static-bundles.visme.co/forms/vismeforms-embed.js";
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, []);
  useEffect(() => {
    initScrollTrigger();
  }, []);
  

  return (
    <motion.main

      className="overflow-hidden"
    >
      <Hero />
      <div className="w-full z-10 h-[30vh] "></div>

      <MentorShowcase/>
      <div className="w-full  h-[100vh] absolute bg-gradient-to-b from-white to-[#fad1e1] rounded-2xl"></div>

      <main > 
      <section className='bg-[#FFD833] absolute h-[300vh] w-full '></section>

      {/* The FAQ section with friction scroll */}
        <Faq />

    </main>
      {/* <Image style={{borderRadius:'50px', marginLeft:'auto', marginRight:'auto', marginTop:'-200px', marginBottom:'200px'}}  height={500} width={500} src='/image.png'/> */}

      {/* <section className='relative h-[80vh] bg-gradient-to-b from-[#bfe4e1] to-green-100'>     */}
        
            {/* <AnimatedSeniorConnectImage /> */}
      
      {/* </section> */}
      <div className={loaded ? "" : "bg-[#FFD833]"}>
      <div
        className="visme_d relative "
        data-title="CampusLoop form"
        data-url="kk399r1x-campusloop-form"
        data-domain="forms"
        data-full-page="false"
        data-min-height="700px"
        data-form-id="123703"
      ></div>
    </div>
    <div className='h-[13vh] bg-[#FFD833]'></div>
      {/* <div className="visme_d relative mt-[-50vh]" data-title="CampusLoop form" data-url="kk399r1x-campusloop-form" data-domain="forms" data-full-page="false" data-min-height="700px" data-form-id="123703"></div><script src="https://static-bundles.visme.co/forms/vismeforms-embed.js"></script> */}
    </motion.main>

    
  );
}
