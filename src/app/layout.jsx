// src/app/layout.js
'use client';

import './globals.css';
import Layout from './components/Layout';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from './contexts/AuthContext';
export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head />
      <body>
        <Layout>
          <AnimatePresence mode="wait">
            <motion.div key={pathname}>
              {children}
            </motion.div>
          </AnimatePresence>
        </Layout>
      </body>
    </html>
  );
}
