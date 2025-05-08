"use client";

import { SessionProvider } from 'next-auth/react';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'ReserveMyTable',
    template: '%s | ReserveMyTable',
  },
  description: 'Welcome to ReserveMyTable — restaurant booking made easy.',
  openGraph: {
    title: 'MySite',
    description: 'Welcome to ReserveMyTable — restaurant booking made easy.',
    url: 'https://restaurant-booking-frontend-rho.vercel.app/',
    siteName: 'ReserveMyTable',
    images: [
      {
        url: 'https://www.example.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MySite',
    description: 'Welcome to ReserveMyTable — restaurant booking made easy.',
    images: ['https://www.example.com/twitter-image.jpg'],
    creator: '@yourhandle',
  },
  metadataBase: new URL('https://restaurant-booking-frontend-rho.vercel.app/'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Open+Sans:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <title>ReserveMyTable</title>
        <meta name="description" content="Book your table at the best restaurants in town." />
      </head>
      <body className="min-h-screen bg-gray-100 flex flex-col">
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
      </body>
    </html>
  );
}