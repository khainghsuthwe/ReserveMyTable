"use client";

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { TableAvailability } from '@/types';
import dummyData from '@/data/dummy.json';
import { TableCellsIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function OwnerDashboard() {
  const { data: session } = useSession();
  const [tables, setTables] = useState<TableAvailability[]>(dummyData.tableAvailability);

  const handleUpdateAvailability = (id: string, available: number, reserved: number) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === id ? { ...table, available, reserved } : table
      )
    );
  };

  const reserveTable = (id: string) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === id && table.available > 0
          ? { ...table, available: table.available - 1, reserved: table.reserved + 1 }
          : table
      )
    );
  };

  const unreserveTable = (id: string) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === id && table.reserved > 0
          ? { ...table, available: table.available + 1, reserved: table.reserved - 1 }
          : table
      )
    );
  };

  if (!session || session.user?.role !== 'owner') {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12 text-center">
          <p className="text-red-500 text-lg">Unauthorized access</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TableCellsIcon className="h-8 w-8 text-primaryOrange mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Restaurant Owner Dashboard</h1>
        </motion.div>
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Manage Table Availability</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          {tables.map((table, index) => (
            <motion.div
              key={table.id}
              className="flex items-center justify-between py-4 border-b border-gray-200"
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={table.image}
                  alt={`Table at ${table.date} ${table.time}`}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <p className="text-gray-700">
                  {table.date} at {table.time}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => unreserveTable(table.id)}
                    disabled={table.reserved <= 0}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    -
                  </motion.button>
                  <span className="text-gray-800">{table.reserved} reserved</span>
                  <motion.button
                    onClick={() => reserveTable(table.id)}
                    disabled={table.available <= 0}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    +
                  </motion.button>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() =>
                      handleUpdateAvailability(table.id, table.available - 1, table.reserved)
                    }
                    disabled={table.available <= 0}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    -
                  </motion.button>
                  <span className="text-gray-800">{table.available} available</span>
                  <motion.button
                    onClick={() =>
                      handleUpdateAvailability(table.id, table.available + 1, table.reserved)
                    }
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    +
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}