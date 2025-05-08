// src/components/ClientLayout.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow"
      >
        {children}
      </motion.div>
      <Footer />
    </SessionProvider>
  );
}
