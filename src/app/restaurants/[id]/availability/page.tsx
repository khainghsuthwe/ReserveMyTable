"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, TableCellsIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import type { TableAvailability } from '@/types';
import dummyData from '@/data/dummy.json';

export default function TableAvailability() {
  const params = useParams();
  const id = params?.id as string;
  const restaurant = dummyData.restaurants.find((r) => r.id === id);
  const [searchDate, setSearchDate] = useState<string>('');
  const [searchTime, setSearchTime] = useState<string>('');

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-20 text-center">
          <p className="text-red-600 text-2xl font-semibold">Restaurant not found</p>
        </main>
      </div>
    );
  }

  const filteredTables = dummyData.tableAvailability
    .filter((table) => table.restaurantId === id)
    .filter((table) => {
      const matchesDate = !searchDate || table.date === searchDate;
      const matchesTime = !searchTime || table.time === searchTime;
      return matchesDate && matchesTime;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Link */}
          <Link
            href={`/restaurants/${id}`}
            className="flex items-center text-orange-500 hover:text-orange-600 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Restaurant
          </Link>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">Table Availability</h1>
          <p className="text-gray-800 text-lg font-semibold mb-2">{restaurant.name}</p>
          <p className="text-gray-600 mb-6">{restaurant.location}</p>

          {/* Search Form */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="flex items-center text-gray-700 mb-2">
                <CalendarIcon className="h-5 w-5 text-orange-500 mr-2" />
                Date
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="flex-1">
              <label className="flex items-center text-gray-700 mb-2">
                <ClockIcon className="h-5 w-5 text-orange-500 mr-2" />
                Time
              </label>
              <input
                type="time"
                value={searchTime}
                onChange={(e) => setSearchTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </motion.div>

        {filteredTables.length === 0 ? (
          <p className="text-center text-gray-600 text-xl">No available tables match your criteria.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTables.map((table, index) => (
              <motion.div
                key={table.id}
                className="bg-white p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <img
                  src={table.image}
                  alt={`Table at ${table.date} ${table.time}`}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <div className="flex items-center mb-2">
                  <CalendarIcon className="h-5 w-5 text-orange-500 mr-2" />
                  <p className="font-semibold text-gray-800">{table.date}</p>
                </div>
                <div className="flex items-center mb-2">
                  <ClockIcon className="h-5 w-5 text-orange-500 mr-2" />
                  <p className="font-semibold text-gray-800">{table.time}</p>
                </div>
                <div className="flex items-center mb-2">
                  <TableCellsIcon className="h-5 w-5 text-orange-500 mr-2" />
                  <p className="text-gray-600">Available: {table.available}</p>
                </div>
                <div className="flex items-center mb-4">
                  <TableCellsIcon className="h-5 w-5 text-orange-500 mr-2" />
                  <p className="text-gray-600">Reserved: {table.reserved}</p>
                </div>
                {table.available > 0 && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4"
                  >
                    <Link
                      href={`/restaurants/${id}/reserve?tableId=${table.id}`}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors inline-block"
                    >
                      Reserve Now
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}