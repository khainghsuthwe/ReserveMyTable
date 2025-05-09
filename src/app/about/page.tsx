"use client";

import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.section
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            About ReserveMyTable
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are passionate about connecting people with unforgettable dining experiences. Discover our story and mission to make restaurant reservations seamless and enjoyable.
          </p>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          className="mb-16"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
            Our Mission
          </h2>
          <div className="bg-orange-100 p-8 rounded-xl shadow-lg text-center max-w-3xl mx-auto">
            <p className="text-gray-600 text-lg">
              At ReserveMyTable, our mission is to simplify the dining experience by providing an intuitive platform that connects food lovers with their favorite restaurants. We strive to make every reservation effortless, ensuring you can focus on enjoying the moment.
            </p>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          className="mb-16"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-8">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { name: "Jane Doe", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
              { name: "John Smith", role: "CTO", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e" },
              { name: "Emily Johnson", role: "Head of Marketing", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f" },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                className="bg-white p-6 rounded-xl shadow-lg text-center"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.2 }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          className="text-center mb-16"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">
            Get in Touch
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <motion.div
              className="flex items-center text-gray-600"
              whileHover={{ scale: 1.05 }}
            >
              <EnvelopeIcon className="h-6 w-6 text-orange-500 mr-2" />
              <Link
                href="mailto:contact@reservemytable.com"
                className="text-orange-500 hover:text-orange-600 transition-colors"
              >
                contact@reservemytable.com
              </Link>
            </motion.div>
            <motion.div
              className="flex items-center text-gray-600"
              whileHover={{ scale: 1.05 }}
            >
              <PhoneIcon className="h-6 w-6 text-orange-500 mr-2" />
              <Link
                href="tel:+1234567890"
                className="text-orange-500 hover:text-orange-600 transition-colors"
              >
                +1 (234) 567-890
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}