"use client";

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Restaurant, Review } from '@/types';
import dummyData from '@/data/dummy.json';
import { HomeIcon, MagnifyingGlassIcon, CalendarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import RestaurantCarousel from '@/components/RestaurantCarousel';
import ReviewCarousel from '@/components/ReviewCarousel';

const restaurants: Restaurant[] = dummyData.restaurants;
const reviews: Review[] = dummyData.reviews;

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const { data: session } = useSession();

  // Most popular restaurants (based on review count)
  const popularRestaurants = restaurants
    .map((restaurant) => ({
      ...restaurant,
      reviewCount: reviews.filter((r) => r.restaurantId === restaurant.id).length,
    }))
    .sort((a, b) => b.reviewCount - a.reviewCount);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.section
          className="relative bg-cover bg-center h-96 rounded-xl mb-12 flex items-center justify-center text-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1552566626-52f8b828add9)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-black/50 rounded-xl"></div>
          <div className="relative z-10">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Book Your Dining Experience Today
            </motion.h1>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/restaurants"
                className="inline-block bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Browse Restaurants
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {session && (
          <motion.p
            className="text-center text-xl text-gray-700 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Hello, {session.user?.name}! Ready to book your next dining experience?
          </motion.p>
        )}

        {/* Most Popular Restaurants Carousel */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Most Popular Restaurants
          </h2>
          <RestaurantCarousel restaurants={popularRestaurants} />
        </section>

        {/* Recent Reviews Carousel */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            What Our Customers Say
          </h2>
          <ReviewCarousel reviews={reviews} />
        </section>

        {/* Information Cards */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
            Your Dining Journey
          </h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <motion.div
              className="bg-orange-100 p-6 rounded-xl shadow-lg flex flex-col items-center text-center max-w-xs"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <MagnifyingGlassIcon className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Explore</h3>
              <p className="text-gray-600 mt-2">
                Discover a variety of restaurants with unique cuisines and atmospheres tailored to your taste.
              </p>
            </motion.div>
            <motion.div
              className="bg-orange-100 p-6 rounded-xl shadow-lg flex flex-col items-center text-center max-w-xs"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <CalendarIcon className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Reserve</h3>
              <p className="text-gray-600 mt-2">
                Easily book a table at your favorite restaurant with just a few clicks.
              </p>
            </motion.div>
            <motion.div
              className="bg-orange-100 p-6 rounded-xl shadow-lg flex flex-col items-center text-center max-w-xs"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <SparklesIcon className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Dine</h3>
              <p className="text-gray-600 mt-2">
                Enjoy a seamless dining experience with exceptional service and delicious meals.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}