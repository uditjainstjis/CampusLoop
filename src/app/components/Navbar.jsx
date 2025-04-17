'use client'
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Navigation links
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/mentors', label: 'Mentors' },
  ];

  const ctaLink = { href: '/mentors', label: 'Book a Session' };

  // Detect scroll for enhanced navbar effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isOpen) setIsOpen(false);
  }, [pathname, isOpen]);

  // Animation variants
  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.3, 
        ease: [0.25, 1, 0.5, 1],
        staggerChildren: 0.05,
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { 
        duration: 0.2, 
        ease: [0.5, 0, 0.75, 0] 
      } 
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'py-3 backdrop-blur-xl bg-zinc-900/60 shadow-lg shadow-black/20' 
          : 'py-5 backdrop-blur-md bg-zinc-900/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center group">
              <span className="text-2xl font-bold text-white group-hover:opacity-90 transition-opacity duration-300">
                CampusLoop
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8 mr-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`relative text-base font-medium transition-all duration-300 hover:text-white ${
                      isActive 
                        ? 'text-white' 
                        : 'text-zinc-300'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span 
                        layoutId="navIndicator"
                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
            
            {/* CTA Button */}
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href={ctaLink.href}
                className="px-5 py-2 text-sm font-medium rounded-lg bg-white text-zinc-900 hover:bg-zinc-100 shadow-md transition-all duration-300 hover:shadow-lg"
              >
                {ctaLink.label}
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? 'close' : 'menu'}
                  initial={{ rotate: 0, opacity: 0.5 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 pt-20 bg-zinc-900/95 backdrop-blur-xl"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="px-5 py-8 flex flex-col space-y-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    variants={menuItemVariants}
                  >
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'text-white bg-zinc-800 border-l-2 border-white'
                          : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              
              <motion.div
                variants={menuItemVariants}
                className="px-4 pt-4"
              >
                <Link
                  href={ctaLink.href}
                  className="block w-full text-center px-4 py-3 rounded-lg font-medium bg-white text-zinc-900 hover:bg-zinc-100 transition-all duration-300"
                >
                  {ctaLink.label}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}