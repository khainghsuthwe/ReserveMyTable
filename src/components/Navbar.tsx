"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { HomeIcon, UserIcon, ArrowRightStartOnRectangleIcon, ArrowLeftEndOnRectangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const mobileMenuVariants = {
  closed: { x: '100%', opacity: 0 },
  open: { x: 0, opacity: 1, transition: { duration: 0.3 } },
};

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center">
          <HomeIcon className="h-6 w-6 mr-2" />
          Restaurant Reservations
        </Link>
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <XMarkIcon className="w-8 h-8" />
          ) : (
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
        <div className="hidden md:flex md:items-center md:space-x-6">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="/" className="flex items-center text-white hover:text-orange-200 transition-colors">
              <HomeIcon className="h-5 w-5 mr-1" />
              Home
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              href="/restaurants"
              className="flex items-center text-white hover:text-orange-200 transition-colors"
            >
              <UserIcon className="h-5 w-5 mr-1" />
              Restaurants
            </Link>
          </motion.div>
          {session ? (
            <>
              {session.user?.role === 'owner' ? (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    href="/owner/dashboard"
                    className="flex items-center text-white hover:text-orange-200 transition-colors"
                  >
                    <UserIcon className="h-5 w-5 mr-1" />
                    Dashboard
                  </Link>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    href="/profile"
                    className="flex items-center text-white hover:text-orange-200 transition-colors"
                  >
                    <UserIcon className="h-5 w-5 mr-1" />
                    Profile
                  </Link>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <button
                  onClick={() => signOut()}
                  className="flex items-center text-white hover:text-orange-200 transition-colors"
                >
                  <ArrowRightStartOnRectangleIcon className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </motion.div>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                href="/login"
                className="flex items-center text-white hover:text-orange-200 transition-colors"
              >
                <ArrowLeftEndOnRectangleIcon className="h-5 w-5 mr-1" />
                Login
              </Link>
            </motion.div>
          )}
        </div>
      </div>
      <motion.div
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-orange-500/90 backdrop-blur-md rounded-l-2xl p-6 shadow-lg ${
          isOpen ? 'block' : 'hidden'
        }`}
        variants={mobileMenuVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
      >
        <div className="flex justify-end mb-4">
          <button onClick={() => setIsOpen(false)}>
            <XMarkIcon className="w-8 h-8 text-white" />
          </button>
        </div>
        <div className="flex flex-col space-y-6 text-lg">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              href="/"
              className="flex items-center text-white hover:text-orange-200 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <HomeIcon className="h-6 w-6 mr-2" />
              Home
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              href="/restaurants"
              className="flex items-center text-white hover:text-orange-200 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <UserIcon className="h-6 w-6 mr-2" />
              Restaurants
            </Link>
          </motion.div>
          {session ? (
            <>
              {session.user?.role === 'owner' ? (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    href="/owner/dashboard"
                    className="flex items-center text-white hover:text-orange-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserIcon className="h-6 w-6 mr-2" />
                    Dashboard
                  </Link>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    href="/profile"
                    className="flex items-center text-white hover:text-orange-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserIcon className="h-6 w-6 mr-2" />
                    Profile
                  </Link>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="flex items-center text-white hover:text-orange-200 transition-colors"
                >
                  <ArrowRightStartOnRectangleIcon className="h-6 w-6 mr-2" />
                  Logout
                </button>
              </motion.div>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                href="/login"
                className="flex items-center text-white hover:text-orange-200 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <ArrowLeftEndOnRectangleIcon className="h-6 w-6 mr-2" />
                Login
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
}