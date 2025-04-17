// src/app/layout.js
'use client';

import './globals.css';
import Layout from './components/Layout';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import SessionWrapper from "./components/SessionWrapper";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body>
        
      <SessionWrapper>
        <Layout>
          <AnimatePresence mode="wait">
            <motion.div key={pathname}>
              {children}
            </motion.div>
          </AnimatePresence>
        </Layout>
      </SessionWrapper>


      </body>
    </html>
  );
}
