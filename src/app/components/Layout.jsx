import { useEffect } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import { motion } from 'framer-motion';
import CustomCursor from './CustomCursor';

export default function Layout({ children }) {
  useEffect(() => {
    // Add smooth scrolling behavior to the whole page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Book personalized mentoring sessions with industry experts to accelerate your career growth."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <CustomCursor/>

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <motion.div

            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>

        <footer className="bg-gray-800 text-white py-12 px-4 ">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Campus Loop</h3>
              <p className="text-gray-300 mb-4">
                Connecting future junior's of the college to their present senior's for any help regarding college or something 😉
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
                <li><a href="/mentors" className="text-gray-300 hover:text-white transition-colors">Mentors</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-300">support@mentormatch.com</li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Campus Loop. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
