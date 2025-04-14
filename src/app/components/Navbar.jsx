'use client'
import { useState, useEffect } from 'react';
// Changed import: usePathname from 'next/navigation' instead of useRouter from 'next/router'
import { usePathname } from 'next/navigation'; 
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Changed hook: usePathname() instead of useRouter()
  const pathname = usePathname(); 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  // Changed dependency: pathname instead of router.pathname
  }, [pathname]); 

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/55 shadow-md py-2' : 'bg-transparent py-4'}`}>
    {/* <nav className={`fixed w-full z-50 transition-all duration-300 'bg-transparent py-4'}`}> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mt-2">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center">
              <span className={`text-2xl font-bold ${scrolled ? 'text-white' : 'text-white'} `}>
                Campus Loop
              </span>
            </Link>
          </motion.div>
          
          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link href="/" className={`text-lg font-medium ${scrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-gray-200'} transition-colors`}>
                Home
              </Link>
              <Link href="/mentors" className={`text-lg font-medium ${scrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-gray-200'} transition-colors`}>
                Mentors
              </Link>
              <Link href="/mentors" className={`px-5 py-2 rounded-lg ${
                scrolled 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-white text-indigo-600 hover:bg-gray-100'
              } transition-colors font-medium`}>
                Book a Session
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                scrolled ? 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100' : 'text-white hover:text-gray-200 hover:bg-gray-800'
              }`}
              aria-expanded="false"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-indigo-50 hover:text-indigo-600">
                Home
              </Link>
              <Link href="/mentors" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-indigo-50 hover:text-indigo-600">
                Mentors
              </Link>
              <Link href="/mentors" className="block px-4 py-2 mt-4 text-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium">
                Book a Session
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}