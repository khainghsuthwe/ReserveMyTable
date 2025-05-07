'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState,Suspense } from 'react';
import { Restaurant, Cuisine } from '@/types';
import dummyData from '@/data/dummy.json';
import { BuildingStorefrontIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const restaurants: Restaurant[] = dummyData.restaurants;
const cuisines: Cuisine[] = dummyData.cuisines;

const ITEMS_PER_PAGE = 6;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function RestaurantsContent () {
  const searchParams = useSearchParams();
  const initialCuisine = searchParams.get('cuisine')?.toLowerCase() || '';

  const [area, setArea] = useState('');
  const [cuisine, setCuisine] = useState(initialCuisine);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCuisine(initialCuisine);
  }, [initialCuisine]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const matchCuisine = cuisine ? r.cuisine.toLowerCase() === cuisine.toLowerCase() : true;
      const matchArea = area ? r.location.toLowerCase().includes(area.toLowerCase()) : true;
      return matchCuisine && matchArea;
    });
  }, [cuisine, area]);

  const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);
  const paginatedRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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
          <h1 className="text-4xl font-bold text-gray-800">Explore Our Restaurants</h1>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <input
            type="text"
            placeholder="Filter by area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          />
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          >
            <option value="">All Cuisines</option>
            {cuisines.map((c) => (
              <option key={c.id} value={c.name.toLowerCase()}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Restaurant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {paginatedRestaurants.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">No restaurants found.</p>
          ) : (
            paginatedRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
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
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  currentPage === page
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition ${
                currentPage === totalPages
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
        <RestaurantsContent />
      </Suspense>
    </div>
  );
}