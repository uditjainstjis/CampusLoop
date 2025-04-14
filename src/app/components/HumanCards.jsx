import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Images for senior professionals (using data URIs for demo - would be replaced with actual photos)
const professionalImages = [
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23334155'/%3E%3Ccircle cx='100' cy='70' r='40' fill='%237c93c1'/%3E%3Cpath d='M40,180 C40,120 160,120 160,180' fill='%237c93c1'/%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23334155'/%3E%3Ccircle cx='100' cy='70' r='40' fill='%23a78bfa'/%3E%3Cpath d='M40,180 C40,120 160,120 160,180' fill='%23a78bfa'/%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23334155'/%3E%3Ccircle cx='100' cy='70' r='40' fill='%238b5cf6'/%3E%3Cpath d='M40,180 C40,120 160,120 160,180' fill='%238b5cf6'/%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23334155'/%3E%3Ccircle cx='100' cy='70' r='40' fill='%236d6deb'/%3E%3Cpath d='M40,180 C40,120 160,120 160,180' fill='%236d6deb'/%3E%3C/svg%3E",
];

const humanData = [
  { 
    id: 1, 
    name: 'Alex Morgan', 
    role: 'Senior Software Architect', 
    testimonial: 'The mentorship changed my career trajectory completely.',
    position: 'layer1-left',
    image: professionalImages[0]
  },
  { 
    id: 2, 
    name: 'Jamie Lee', 
    role: 'Data Science Director', 
    testimonial: 'I gained practical insights that no course could teach me.',
    position: 'layer1-right',
    image: professionalImages[1]
  },
  { 
    id: 3, 
    name: 'Jordan Taylor', 
    role: 'UX Design Lead',
    testimonial: 'My mentor helped me land my dream job in just 3 months.',
    position: 'layer2-left',
    image: professionalImages[2]
  },
  { 
    id: 4, 
    name: 'Casey Rivera', 
    role: 'Product Director', 
    testimonial: 'The structured guidance helped me transition to a new field.',
    position: 'layer2-right',
    image: professionalImages[3]
  },
  { 
    id: 5, 
    name: 'Riley Johnson', 
    role: 'Marketing Strategist', 
    testimonial: 'I doubled my income thanks to my mentor\'s strategic advice.',
    position: 'bottom',
    image: professionalImages[0]
  }
];

export default function HumanCards() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  useEffect(() => {
    const section = sectionRef.current;
    
    if (section && typeof window !== 'undefined') {
      // Layer 1 - Left card animation (slow movement)
      gsap.fromTo(
        '.card-layer1-left',
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0
        },
        {
          x: -120,
          y: -180,
          opacity: 0.4,
          scale: 0.85,
          rotation: -8,
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'bottom top',
            scrub: 2, // Slow scrub for smoother animation
          }
        }
      );
      
      // Layer 1 - Right card animation (slow movement)
      gsap.fromTo(
        '.card-layer1-right',
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0
        },
        {
          x: 120,
          y: -180,
          opacity: 0.4,
          scale: 0.85,
          rotation: 8,
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'bottom top',
            scrub: 2, // Slow scrub for smoother animation
          }
        }
      );
      
      // Layer 2 - Left card animation (different path)
      gsap.fromTo(
        '.card-layer2-left',
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0
        },
        {
          x: -200,
          y: -100,
          opacity: 0.3,
          scale: 0.9,
          rotation: -12,
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'bottom top',
            scrub: 3, // Even slower scrub for more subtle movement
          }
        }
      );
      
      // Layer 2 - Right card animation (different path)
      gsap.fromTo(
        '.card-layer2-right',
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0
        },
        {
          x: 200,
          y: -100,
          opacity: 0.3,
          scale: 0.9,
          rotation: 12,
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'bottom top',
            scrub: 3, // Even slower scrub for more subtle movement
          }
        }
      );
      
      // Bottom cards
      gsap.fromTo(
        '.card-bottom',
        {
          y: 0,
          opacity: 1,
          scale: 1
        },
        {
          y: 50, // Less movement
          opacity: function(i) {
            return 0.8 - (i * 0.1); // Staying more visible
          },
          scale: function(i) {
            return 1 - (i * 0.03); // Subtle scaling
          },
          stagger: 0.2, // More spacing between animations
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'bottom top',
            scrub: 2, // Slower scrub
          }
        }
      );
    }
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-900 text-white"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-indigo-900/30 z-0"></div>
      <div className="absolute inset-0 opacity-5 z-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '80px' }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 mx-auto mb-6"
          ></motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Success Stories
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Real professionals who transformed their careers through expert mentorship.
          </p>
        </motion.div>
        
        <div className="relative min-h-[700px]">
          {/* First layer - Left card */}
          {humanData.filter(human => human.position === 'layer1-left').map(human => (
            <div 
              key={human.id} 
              className="absolute top-10 left-[5%] md:left-[15%] card-layer1-left z-20"
            >
              <motion.div 
                className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-md shadow-2xl overflow-hidden max-w-[260px]"
                initial={{ x: -80, y: -30, opacity: 0, rotate: -5 }}
                animate={isInView ? { x: 0, y: 0, opacity: 1, rotate: 0 } : {}}
                transition={{ duration: 1.2, delay: 0.2 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={human.image} 
                    alt={human.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-24"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">{human.name}</h3>
                    <p className="text-indigo-300 text-sm">{human.role}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-300 text-sm italic">"{human.testimonial}"</p>
                </div>
              </motion.div>
            </div>
          ))}
          
          {/* First layer - Right card */}
          {humanData.filter(human => human.position === 'layer1-right').map(human => (
            <div 
              key={human.id} 
              className="absolute top-10 right-[5%] md:right-[15%] card-layer1-right z-20"
            >
              <motion.div 
                className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-md shadow-2xl overflow-hidden max-w-[260px]"
                initial={{ x: 80, y: -30, opacity: 0, rotate: 5 }}
                animate={isInView ? { x: 0, y: 0, opacity: 1, rotate: 0 } : {}}
                transition={{ duration: 1.2, delay: 0.2 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={human.image} 
                    alt={human.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-24"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">{human.name}</h3>
                    <p className="text-purple-300 text-sm">{human.role}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-300 text-sm italic">"{human.testimonial}"</p>
                </div>
              </motion.div>
            </div>
          ))}
          
          {/* Second layer - Left card (different position) */}
          {humanData.filter(human => human.position === 'layer2-left').map(human => (
            <div 
              key={human.id} 
              className="absolute top-[240px] left-[0%] md:left-[5%] card-layer2-left z-10"
            >
              <motion.div 
                className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-md shadow-2xl overflow-hidden max-w-[240px]"
                initial={{ x: -120, y: 0, opacity: 0, rotate: -8 }}
                animate={isInView ? { x: 0, y: 0, opacity: 1, rotate: -3 } : {}}
                transition={{ duration: 1.4, delay: 0.4 }}
              >
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={human.image} 
                    alt={human.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-24"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="text-lg font-semibold">{human.name}</h3>
                    <p className="text-blue-300 text-xs">{human.role}</p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-gray-300 text-xs italic">"{human.testimonial}"</p>
                </div>
              </motion.div>
            </div>
          ))}
          
          {/* Second layer - Right card (different position) */}
          {humanData.filter(human => human.position === 'layer2-right').map(human => (
            <div 
              key={human.id} 
              className="absolute top-[240px] right-[0%] md:right-[5%] card-layer2-right z-10"
            >
              <motion.div 
                className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-md shadow-2xl overflow-hidden max-w-[240px]"
                initial={{ x: 120, y: 0, opacity: 0, rotate: 8 }}
                animate={isInView ? { x: 0, y: 0, opacity: 1, rotate: 3 } : {}}
                transition={{ duration: 1.4, delay: 0.4 }}
              >
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={human.image} 
                    alt={human.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-24"></div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="text-lg font-semibold">{human.name}</h3>
                    <p className="text-pink-300 text-xs">{human.role}</p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-gray-300 text-xs italic">"{human.testimonial}"</p>
                </div>
              </motion.div>
            </div>
          ))}
          
          {/* Bottom card - call to action */}
          <motion.div 
            className="absolute bottom-10 left-0 right-0 mx-auto flex justify-center"
            initial={{ y: 50, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="bg-indigo-800/60 border border-indigo-600/40 backdrop-blur-md rounded-md shadow-2xl p-6 max-w-lg text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Ready for your success story?</h3>
              <p className="text-indigo-200 mb-4">Join thousands of professionals who transformed their careers with expert guidance.</p>
              <button 
                onClick={() => document.getElementById('featured-mentors')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-white text-indigo-900 font-medium rounded-md hover:bg-indigo-50 transition-colors duration-300"
              >
                Find Your Mentor
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
