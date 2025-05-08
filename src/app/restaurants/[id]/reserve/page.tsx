"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Restaurant, TableAvailability } from '@/types';
import dummyData from '@/data/dummy.json';
import { CalendarIcon, ClockIcon, UsersIcon, EnvelopeIcon, RectangleGroupIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const restaurants: Restaurant[] = dummyData.restaurants;
const tableAvailability: TableAvailability[] = dummyData.tableAvailability;

export default function ReservationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = React.use(params); // Unwrap params with React.use()
  const restaurant = restaurants.find((r) => r.id === id);
  const preSelectedTableId = searchParams.get('tableId') || '';

  const [reservation, setReservation] = useState({
    tableId: preSelectedTableId,
    date: '',
    time: '',
    partySize: '',
    contactEmail: '',
  });
  const [reservationStatus, setReservationStatus] = useState('');

  useEffect(() => {
    // Update tableId and set date if pre-selected from query params
    if (preSelectedTableId) {
      const selectedTable = tableAvailability.find((t) => t.id === preSelectedTableId);
      setReservation((prev) => ({
        ...prev,
        tableId: preSelectedTableId,
        date: selectedTable ? selectedTable.date : '',
      }));
    }
  }, [preSelectedTableId]);

  const handleTableChange = (tableId: string) => {
    const selectedTable = tableAvailability.find((t) => t.id === tableId);
    setReservation((prev) => ({
      ...prev,
      tableId,
      date: selectedTable ? selectedTable.date : '',
      time: '', // Reset time when table changes
    }));
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (
      !reservation.tableId ||
      !reservation.date ||
      !reservation.time ||
      !reservation.partySize ||
      !reservation.contactEmail
    ) {
      setReservationStatus('Please fill out all fields.');
      return;
    }
    // Verify table availability
    const selectedTable = tableAvailability.find((t) => t.id === reservation.tableId);
    if (!selectedTable) {
      setReservationStatus('Selected table is no longer available.');
      return;
    }
    // Check if any time slot has available tables
    const hasAvailableTables = selectedTable.timeSlots.some((slot) => slot.availableTables > 0);
    if (!hasAvailableTables) {
      setReservationStatus('Selected table is no longer available.');
      return;
    }
    // Find the specific time slot that matches the selected time
    const selectedSlot = selectedTable.timeSlots.find((slot) => slot.time === reservation.time);
    if (!selectedSlot || selectedSlot.availableTables <= 0) {
      setReservationStatus('Selected time slot is no longer available.');
      return;
    }
    // Store reservation in localStorage
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    reservations.push({
      restaurantId: id,
      restaurantName: restaurant?.name,
      tableDetails: `${selectedTable.date} at ${selectedSlot.time}, ${selectedSlot.availableTables} available`,
      ...reservation,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('reservations', JSON.stringify(reservations));
    setReservationStatus('Reservation successful! We’ll send a confirmation soon.');
    setReservation({ tableId: '', date: '', time: '', partySize: '', contactEmail: '' });
    // Redirect to restaurant page after 2 seconds
    setTimeout(() => {
      router.push(`/restaurants/${id}`);
    }, 2000);
  };

  if (!restaurant) {
    return <div className="text-center py-12">Restaurant not found.</div>;
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <motion.section
          className="bg-orange-100 p-6 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Reserve a Table at {restaurant.name}
          </h1>
          <form onSubmit={handleReservationSubmit} className="space-y-4">
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <RectangleGroupIcon className="h-5 w-5 text-orange-500 mr-2" />
              <select
                value={reservation.tableId}
                onChange={(e) => handleTableChange(e.target.value)}
                className="w-full outline-none text-gray-700"
                required
              >
                <option value="">Select a Table</option>
                {tableAvailability
                  .filter((table) => table.timeSlots.some((slot) => slot.availableTables > 0))
                  .map((table) => (
                    <option key={table.id} value={table.id}>
                      {table.date} ({table.timeSlots
                        .filter((slot) => slot.availableTables > 0)
                        .map((slot) => `${slot.time}: ${slot.availableTables} available`)
                        .join(', ')})
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <CalendarIcon className="h-5 w-5 text-orange-500 mr-2" />
              <input
                type="text"
                value={reservation.date}
                className="w-full outline-none text-gray-700 bg-transparent"
                readOnly
                placeholder="Select a table to set date"
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <ClockIcon className="h-5 w-5 text-orange-500 mr-2" />
              <select
                value={reservation.time}
                onChange={(e) => setReservation({ ...reservation, time: e.target.value })}
                className="w-full outline-none text-gray-700"
                required
                disabled={!reservation.tableId}
              >
                <option value="">Select Time</option>
                {reservation.tableId &&
                  tableAvailability
                    .find((t) => t.id === reservation.tableId)
                    ?.timeSlots.filter((slot) => slot.availableTables > 0)
                    .map((slot) => (
                      <option key={slot.id} value={slot.time}>
                        {slot.time} ({slot.availableTables} available)
                      </option>
                    ))}
              </select>
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <UsersIcon className="h-5 w-5 text-orange-500 mr-2" />
              <input
                type="number"
                placeholder="Party Size"
                value={reservation.partySize}
                onChange={(e) => setReservation({ ...reservation, partySize: e.target.value })}
                className="w-full outline-none text-gray-700"
                min="1"
                required
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <EnvelopeIcon className="h-5 w-5 text-orange-500 mr-2" />
              <input
                type="email"
                placeholder="Contact Email"
                value={reservation.contactEmail}
                onChange={(e) => setReservation({ ...reservation, contactEmail: e.target.value })}
                className="w-full outline-none text-gray-700"
                required
              />
            </div>
            <motion.button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Table
            </motion.button>
          </form>
          {reservationStatus && (
            <motion.p
              className={`mt-4 text-center ${
                reservationStatus.includes('successful') ? 'text-green-600' : 'text-red-600'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {reservationStatus}
            </motion.p>
          )}
        </motion.section>
      </main>
    </div>
  );
}