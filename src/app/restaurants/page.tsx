"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, Suspense } from 'react';
import { Restaurant, Cuisine, TableAvailability } from '@/types';
import dummyData from '@/data/dummy.json';
import { BuildingStorefrontIcon, ChevronLeftIcon, ChevronRightIcon,  CalendarIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const restaurants: Restaurant[] = dummyData.restaurants;
const cuisines: Cuisine[] = dummyData.cuisines;
const tableAvailabilities: TableAvailability[] = dummyData.tableAvailability || [];

const ITEMS_PER_PAGE = 6;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const filterVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

function RestaurantsContent() {
  const searchParams = useSearchParams();
  const initialCuisine = searchParams.get('cuisine')?.toLowerCase() || '';
  const initialSearch = searchParams.get('search')?.toLowerCase() || '';

  const [search, setSearch] = useState(initialSearch);
  const [cuisine, setCuisine] = useState(initialCuisine);
  const [date, setDate] = useState('');

  useEffect(() => {
    setCuisine(initialCuisine);
    setSearch(initialSearch);
  }, [initialCuisine, initialSearch]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      const matchCuisine = cuisine ? r.cuisine.toLowerCase() === cuisine.toLowerCase() : true;
      const matchSearch = search
        ? r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(search.toLowerCase()) ||
          r.location.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchDate = date
        ? tableAvailabilities.some(
            (avail) =>
              avail.restaurantId === r.id &&
              avail.date === date &&
              avail.timeSlots.some((slot) => slot.availableTables > slot.reservedTables)
          )
        : true;
      return matchCuisine && matchSearch && matchDate;
    });
  }, [cuisine, search, date]);

  const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearch('');
    setCuisine('');
    setDate('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-16">
        <motion.div
          className="flex items-center justify-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BuildingStorefrontIcon className="h-12 w-12 text-orange-500 mr-3" />
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-800">Discover Your Next Dining Experience</h1>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-col md:flex-row gap-6 mb-16 bg-gradient-to-r from-orange-100 to-orange-200 p-6 rounded-2xl shadow-lg"
          variants={filterVariants}
          initial="hidden"
          animate="visible"
        >
          <input
            type="text"
            placeholder="Search restaurants, cuisines, or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none bg-white p-4 rounded-lg w-full md:w-1/3 text-gray-700 text-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none placeholder-gray-500"
          />
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="border-none bg-white p-4 rounded-lg w-full md:w-1/3 text-gray-700 text-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
          >
            <option value="">All Cuisines</option>
            {cuisines.map((c) => (
              <option key={c.id} value={c.name.toLowerCase()}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="relative w-full md:w-1/3">
            <DatePicker
              selected={date ? new Date(date) : null}
              onChange={(date: Date | null) => setDate(date ? date.toISOString().split('T')[0] : '')}
              minDate={new Date()}
              placeholderText="Select a date"
              className="border-none bg-white p-4 pr-12 rounded-lg w-full text-gray-700 text-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none placeholder-gray-500"
            />
            <CalendarIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-orange-500" />
          </div>
          <motion.button
          onClick={clearFilters}
          className="flex items-center justify-center gap-2 bg-red-100 text-red-600 px-4 py-3 rounded-lg w-full md:w-auto font-medium shadow-sm hover:bg-red-200 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Clear all filters"
        >
          <ArrowPathIcon className="h-5 w-5" />
         clear
        </motion.button>
        </motion.div>

        {/* Restaurant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {paginatedRestaurants.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full text-lg font-medium">
              No restaurants found. Try adjusting your filters!
            </p>
          ) : (
            paginatedRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-orange-100"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="relative">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{restaurant.name}</h2>
                  <p className="text-gray-600 text-sm mb-1">{restaurant.location}</p>
                  <p className="text-gray-500 text-sm mb-4">{restaurant.hours}</p>
                  <Link
                    href={`/restaurants/${restaurant.id}`}
                    className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
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
          <motion.div
            className="flex justify-center gap-3 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-3 rounded-lg transition-all ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'
              }`}
              whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.9 }}
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </motion.button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <motion.button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === page
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {page}
              </motion.button>
            ))}

            <motion.button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-3 rounded-lg transition-all ${
                currentPage === totalPages
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'
              }`}
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.9 }}
            >
              <ChevronRightIcon className="h-6 w-6" />
            </motion.button>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="text-center py-12 text-gray-600 text-lg">Loading...</div>}>
        <RestaurantsContent />
      </Suspense>
    </div>
  );
}