"use client";

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  // If no session, return null (redirect will handle navigation)
  if (!session) {
    return null;
  }

  // Default image if user image is not provided
  const defaultImage = 'https://via.placeholder.com/150';
  const userImage = session.user?.image || defaultImage;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border-2 border-orange-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <img
            src={userImage}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-orange-300"
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {session.user?.name || 'User'}
          </h1>
          <p className="text-gray-600 mb-2">{session.user?.email || 'No email'}</p>
          <p className="text-orange-500 font-semibold mb-6 capitalize">
            {session.user?.role || 'customer'}
          </p>
          <motion.button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Log Out
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}