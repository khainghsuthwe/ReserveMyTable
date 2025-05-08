'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarIcon, ClockIcon, TableCellsIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import type { Restaurant, TableAvailability } from '@/types';
import dummyData from '@/data/dummy.json';

// Utility function for time slots
function generateTimeSlots(start: string, end: string, intervalMinutes: number): string[] {
  const slots: string[] = [];
  try {
    // Parse time with AM/PM (e.g., "11:00 AM" or "11:00")
    const parseTime = (timeStr: string): [number, number] => {
      const [time, period] = timeStr.trim().split(/\s+/);
      const [hour, minute] = time.split(':').map(Number);
      if (isNaN(hour) || isNaN(minute)) throw new Error('Invalid time format');
      let adjustedHour = hour;
      if (period) {
        if (period.toLowerCase() === 'pm' && hour < 12) adjustedHour += 12;
        if (period.toLowerCase() === 'am' && hour === 12) adjustedHour = 0;
      }
      return [adjustedHour, minute];
    };

    const [startHour, startMinute] = parseTime(start);
    const [endHour, endMinute] = parseTime(end);
    let currentTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    while (currentTime <= endTime) {
      const hours = Math.floor(currentTime / 60)
        .toString()
        .padStart(2, '0');
      const minutes = (currentTime % 60).toString().padStart(2, '0');
      slots.push(`${hours}:${minutes}`);
      currentTime += intervalMinutes;
    }
  } catch (error) {
    console.error('Error generating time slots:', error);
    return [];
  }
  return slots;
}

// Utility function to normalize date picker input to YYYY-MM-DD
function normalizeDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map((part) => parseInt(part, 10));
  if (!year || !month || !day) return dateStr;
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

// Utility function to format time to 12-hour AM/PM
function formatTimeTo12Hour(time: string): string {
  try {
    const [hour, minute] = time.split(':').map(Number);
    if (isNaN(hour) || isNaN(minute)) return time;
    const period = hour >= 12 ? 'PM' : 'AM';
    const adjustedHour = hour % 12 || 12; // Convert 0 to 12 for midnight
    return `${adjustedHour}:${minute.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return time;
  }
}

// Validate date format (YYYY-MM-DD)
function isValidDateFormat(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

// Explicitly type tableAvailability
const tableAvailability: TableAvailability[] = dummyData.tableAvailability;

// Log warnings for invalid dates in development
if (process.env.NODE_ENV === 'development') {
  tableAvailability.forEach((avail) => {
    if (!isValidDateFormat(avail.date)) {
      console.warn(`Invalid date format in tableAvailability: ${avail.date} (ID: ${avail.id})`);
    }
  });
}

export default function TableAvailabilityPage() {
  const params = useParams();
  const id = params?.id as string;
  const restaurant = dummyData.restaurants.find((r: Restaurant) => r.id === id);
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

  // Normalize searchDate for comparison
  const normalizedSearchDate = normalizeDate(searchDate);

  // Generate time slots and log for debugging
  const timeSlots = generateTimeSlots(restaurant.hours.split('-')[0], restaurant.hours.split('-')[1], 30);
  console.log('Generated Time Slots:', timeSlots);

  // Debug logs
  console.log('Search Date:', searchDate, 'Normalized:', normalizedSearchDate);
  console.log('Available Dates:', tableAvailability.map((avail) => avail.date));

  const filteredTableAvailability = tableAvailability
    .filter((avail) => avail.restaurantId === id)
    .filter((avail) => {
      console.log(
        `Comparing: searchDate=${normalizedSearchDate}, availDate=${avail.date}, match=${
          !normalizedSearchDate || avail.date === normalizedSearchDate
        }`
      );
      return !normalizedSearchDate || avail.date === normalizedSearchDate;
    })
    .map((avail) => ({
      ...avail,
      timeSlots: avail.timeSlots
        .filter((slot) => slot.availableTables > 0)
        .filter((slot) => !searchTime || slot.time === searchTime),
    }))
    .filter((avail) => avail.timeSlots.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="flex items-center text-gray-700 mb-2">
                <CalendarIcon className="h-5 w-5 text-orange-500 mr-2" />
                Date
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(normalizeDate(e.target.value))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="flex-1">
              <label className="flex items-center text-gray-700 mb-2">
                <ClockIcon className="h-5 w-5 text-orange-500 mr-2" />
                Time
              </label>
              <select
                value={searchTime}
                onChange={(e) => {
                  console.log('Selected Time:', e.target.value);
                  setSearchTime(e.target.value);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                disabled={timeSlots.length === 0}
              >
                <option value="">Any Time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {formatTimeTo12Hour(time)}
                  </option>
                ))}
              </select>
              {timeSlots.length === 0 && (
                <p className="text-red-500 text-sm mt-1">No time slots available</p>
              )}
            </div>
          </div>
        </motion.div>

        {filteredTableAvailability.length === 0 ? (
          <div className="text-center text-gray-600 text-xl">
            <p>No available tables match your criteria.</p>
            <p className="mt-2">Try selecting a different date or time.</p>
          </div>
        ) : (
          filteredTableAvailability.map((avail) => (
            <div key={avail.id} className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{avail.date}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {avail.timeSlots.map((slot, index) => (
                  <motion.div
                    key={slot.id}
                    className="bg-white p-6 rounded-xl shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className="flex items-center mb-2">
                      <CalendarIcon className="h-5 w-5 text-orange-500 mr-2" />
                      <p className="font-semibold text-gray-800">{avail.date}</p>
                    </div>
                    <div className="flex items-center mb-2">
                      <ClockIcon className="h-5 w-5 text-orange-500 mr-2" />
                      <p className="font-semibold text-gray-800">{formatTimeTo12Hour(slot.time)}</p>
                    </div>
                    <div className="flex items-center mb-2">
                      <TableCellsIcon className="h-5 w-5 text-orange-500 mr-2" />
                      <p className="text-gray-600">Available Tables: {slot.availableTables}</p>
                    </div>
                    <div className="flex items-center mb-2">
                      <TableCellsIcon className="h-5 w-5 text-orange-500 mr-2" />
                      <p className="text-gray-600">Reserved Tables: {slot.reservedTables}</p>
                    </div>
                    <div className="mb-4">
                      <p className="font-semibold text-gray-800">Table Types:</p>
                      <ul className="list-disc pl-5 text-gray-600">
                        {slot.tableTypes.map((type) => (
                          <li key={type.type}>
                            {type.type}: {type.available} available
                          </li>
                        ))}
                      </ul>
                    </div>
                    {slot.availableTables > 0 && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4"
                      >
                        <Link
                          href={`/restaurants/${id}/reserve?slotId=${slot.id}`}
                          className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors inline-block"
                        >
                          Reserve Now
                        </Link>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}