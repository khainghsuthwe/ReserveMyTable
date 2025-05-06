"use client";

import Link from 'next/link';
import { Restaurant } from '@/types';
import dummyData from '@/data/dummy.json';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const restaurants: Restaurant[] = dummyData.restaurants;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Restaurants() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <motion.div
          className="flex items-center justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BuildingStorefrontIcon className="h-10 w-10 text-orange-500 mr-2" />
          <h1 className="text-4xl font-bold text-gray-800">
            Explore Our Restaurants
          </h1>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800">{restaurant.name}</h2>
                <p className="text-gray-600 mt-2">{restaurant.location}</p>
                <p className="text-gray-600">{restaurant.hours}</p>
                <Link
                  href={`/restaurants/${restaurant.id}`}
                  className="mt-4 inline-block text-orange-500 font-semibold hover:text-orange-600 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}