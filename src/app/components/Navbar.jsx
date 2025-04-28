// src/app/components/Navbar.jsx
'use client'
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// --- ADD THESE IMPORTS ---
import { useSession, signIn, signOut } from 'next-auth/react';
// -------------------------

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // --- GET SESSION DATA ---
  // status can be 'loading', 'authenticated', or 'unauthenticated'
  // session contains user data when authenticated
  const { data: session, status } = useSession();
  // -------------------------


  // Navigation links
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/mentors', label: 'Mentors' },
    // Add other links here if needed
  ];

  // Decide if CTA is shown or changes based on auth status if needed
  // For now, keeping it simple.

  // Detect scroll for enhanced navbar effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check scroll position on initial load
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isOpen) setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
      className={`fixed w-full z-[10000] transition-all duration-500 ${
        scrolled
          ? 'py-3 backdrop-blur-xl bg-zinc-900/60 shadow-lg shadow-black/20'
          : 'py-5 backdrop-blur-md bg-zinc-900/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-7">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center group" onClick={() => isOpen && setIsOpen(false)}>
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

             {/* --- AUTH BUTTONS (DESKTOP) --- */}
             {status === 'loading' && (
                // Show loading state while session is being fetched
                <div className="text-zinc-400 text-sm">Loading...</div>
              )}
              {status === 'unauthenticated' && (
                 // Show Login button if not authenticated
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Link to your custom sign-in page */}
                  <Link
                    href="/signin"
                    className="px-5 py-2 text-sm font-medium rounded-lg bg-white text-zinc-900 hover:bg-zinc-100 shadow-md transition-all duration-300 hover:shadow-lg"
                  >
                    Login
                  </Link>
                </motion.div>
              )}
              {status === 'authenticated' && (
                 // Show profile info and Sign Out button if authenticated
                <div className="flex items-center space-x-4">
                   {/* Profile Info (Optional: show name/image/link) */}
                   {/* Use session.user.name, session.user.email, session.user.image */}
                  <Link href="/profile" className="flex items-center group"> {/* Link to a hypothetical profile page */}
                     {session?.user?.image && ( // Use the image from the session if available
                        <img
                          src={session.user.image}
                          alt={session?.user?.name || 'Profile'}
                          className="w-8 h-8 rounded-full mr-2 ring-1 ring-white/30 group-hover:ring-white/50"
                        />
                      )}
                    <span className="text-sm font-medium text-white hover:underline hidden sm:inline">
                      {session?.user?.name || session?.user?.mobileNumber || 'Profile'} {/* Show name or mobile number */}
                    </span>
                  </Link>

                  {/* Sign Out Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                       onClick={() => signOut({ callbackUrl: '/' })} // Calls sign-out, redirects to home page
                      className="px-4 py-2 text-xs font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-md transition-all duration-300 hover:shadow-lg"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                </div>
              )}
            {/* --- END AUTH BUTTONS (DESKTOP) --- */}



          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isOpen ? 'close' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
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
            className="md:hidden absolute top-0 inset-x-0 z-50 min-h-screen pt-16 sm:pt-20 bg-zinc-900/95 backdrop-blur-xl"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="px-5 pt-6 pb-8 flex flex-col z-[10000] space-y-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    variants={menuItemVariants}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)} // Close menu on link click
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

              {/* --- AUTH BUTTONS (MOBILE) --- */}
              {status === 'loading' && (
                 <motion.div variants={menuItemVariants} className="px-4 pt-4">
                    <div className="text-zinc-400 text-center">Loading...</div>
                 </motion.div>
               )}
               {status === 'unauthenticated' && (
                 <motion.div variants={menuItemVariants} className="px-4 pt-4">
                   {/* Link to your custom sign-in page */}
                   <Link
                     href="/signin"
                     onClick={() => setIsOpen(false)} // Close menu after clicking login
                     className="block w-full text-center px-4 py-3 rounded-lg font-medium bg-white text-zinc-900 hover:bg-zinc-100 transition-all duration-300"
                   >
                     Login
                   </Link>
                 </motion.div>
               )}
               {status === 'authenticated' && (
                 <>
                   {/* Profile Link (Optional) */}
                    <motion.div variants={menuItemVariants} className="px-4">
                       <Link
                         href="/profile" // Link to a hypothetical profile page
                         onClick={() => setIsOpen(false)} // Close menu on link click
                         className="block w-full text-center px-4 py-3 rounded-lg font-medium text-white border border-zinc-700 hover:bg-zinc-800 transition-all duration-300"
                       >
                          {session?.user?.image && (
                            <img
                              src={session.user.image}
                              alt={session?.user?.name || 'Profile'}
                              className="w-8 h-8 rounded-full mx-auto mb-2 ring-1 ring-white/30"
                            />
                          )}
                          {session?.user?.name || session?.user?.mobileNumber || 'Profile'}
                       </Link>
                    </motion.div>

                   {/* Sign Out Button */}
                   <motion.div variants={menuItemVariants} className="px-4">
                     <button
                       onClick={() => {
                           signOut({ callbackUrl: '/' }); // Sign out and redirect
                           setIsOpen(false); // Close menu after clicking sign out
                       }}
                       className="block w-full text-center px-4 py-3 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
                     >
                       Sign Out
                     </button>
                   </motion.div>
                 </>
               )}
              {/* --- END AUTH BUTTONS (MOBILE) --- */}


              {/* CTA Button (Kept separate for now) */}
               <motion.div
                variants={menuItemVariants}
                className="px-4 pt-4 z-[10000]"
              >
                <Link
                  href={ctaLink.href}
                  onClick={() => setIsOpen(false)} // Close menu on link click
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