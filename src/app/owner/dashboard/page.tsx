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

  const handleUpdateAvailability = (
    availabilityId: string, 
    slotId: string, 
    tableType: string, 
    available: number
  ) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === availabilityId
          ? {
              ...table,
              timeSlots: table.timeSlots.map((slot) =>
                slot.id === slotId
                  ? {
                      ...slot,
                      tableTypes: slot.tableTypes.map((type) =>
                        type.type === tableType ? { ...type, available } : type
                      ),
                      availableTables: slot.tableTypes.reduce(
                        (sum, type) => sum + (type.type === tableType ? available : type.available), 0
                      ),
                    }
                  : slot
              ),
            }
          : table
      )
    );
  };

  const reserveTable = (availabilityId: string, slotId: string, tableType: string) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === availabilityId
          ? {
              ...table,
              timeSlots: table.timeSlots.map((slot) =>
                slot.id === slotId
                  ? {
                      ...slot,
                      tableTypes: slot.tableTypes.map((type) =>
                        type.type === tableType && type.available > 0
                          ? { ...type, available: type.available - 1 }
                          : type
                      ),
                      availableTables: slot.tableTypes.reduce(
                        (sum, type) => sum + (type.type === tableType && type.available > 0 ? type.available - 1 : type.available), 0
                      ),
                      reservedTables: slot.reservedTables + (slot.tableTypes.find(t => t.type === tableType && t.available > 0) ? 1 : 0),
                    }
                  : slot
              ),
            }
          : table
      )
    );
  };

  const unreserveTable = (availabilityId: string, slotId: string, tableType: string) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === availabilityId
          ? {
              ...table,
              timeSlots: table.timeSlots.map((slot) =>
                slot.id === slotId
                  ? {
                      ...slot,
                      tableTypes: slot.tableTypes.map((type) =>
                        type.type === tableType && slot.reservedTables > 0
                          ? { ...type, available: type.available + 1 }
                          : type
                      ),
                      availableTables: slot.tableTypes.reduce(
                        (sum, type) => sum + (type.type === tableType && slot.reservedTables > 0 ? type.available + 1 : type.available), 0
                      ),
                      reservedTables: slot.reservedTables - (slot.tableTypes.find(t => t.type === tableType && slot.reservedTables > 0) ? 1 : 0),
                    }
                  : slot
              ),
            }
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
              className="py-4 border-b border-gray-200"
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{table.date}</h3>
              {table.timeSlots.map((slot) => (
                <div key={slot.id} className="ml-4 mb-4">
                  <div className="flex items-center justify-between py-2">
                    <p className="text-gray-700">{slot.time}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-800">
                        {slot.reservedTables} reserved / {slot.availableTables} available
                      </span>
                    </div>
                  </div>
                  {slot.tableTypes.map((tableType) => (
                    <div key={tableType.type} className="ml-4 flex items-center justify-between py-2">
                      <p className="text-gray-600">{tableType.type}</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => unreserveTable(table.id, slot.id, tableType.type)}
                            disabled={slot.reservedTables <= 0}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            -
                          </motion.button>
                          <span className="text-gray-800">{tableType.available} available</span>
                          <motion.button
                            onClick={() => reserveTable(table.id, slot.id, tableType.type)}
                            disabled={tableType.available <= 0}
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
                              handleUpdateAvailability(table.id, slot.id, tableType.type, tableType.available - 1)
                            }
                            disabled={tableType.available <= 0}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            -
                          </motion.button>
                          <span className="text-gray-800">Set availability</span>
                          <motion.button
                            onClick={() =>
                              handleUpdateAvailability(table.id, slot.id, tableType.type, tableType.available + 1)
                            }
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            +
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}