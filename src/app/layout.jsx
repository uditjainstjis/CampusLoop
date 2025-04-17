// src/app/layout.js
'use client';

import './globals.css';
import Layout from './components/Layout';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import SessionWrapper from "./components/SessionWrapper";
import { AuthProvider } from './contexts/AuthContext';
export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head />
      <body>
      <SessionWrapper>
      {/* <AuthProvider> */}
        <Layout>
          <AnimatePresence mode="wait">
            <motion.div key={pathname}>
              {children}
            </motion.div>
          </AnimatePresence>
        </Layout>
        {/* </AuthProvider> */}
        </SessionWrapper>

      </body>
    </html>
  );
}
