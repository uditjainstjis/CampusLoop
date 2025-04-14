// src/app/layout.js
'use client';

import './globals.css';
import Layout from './components/Layout';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head />
      <body>
        <Layout>
          <AnimatePresence mode="wait">
            <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </Layout>
      </body>
    </html>
  );
}
