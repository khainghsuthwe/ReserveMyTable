import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <motion.footer
      className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-12"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <motion.div
            className="flex flex-col items-center md:items-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-4">ReserveMyTable</h3>
            <p className="text-sm text-orange-100 text-center md:text-left">
              Book your dining experience with ease and enjoy unforgettable moments.
            </p>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            className="flex flex-col items-center md:items-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a
                href="mailto:contact@restaurantreservations.com"
                className="flex items-center text-orange-100 hover:text-white transition-colors"
              >
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                contact@reservemytable.com
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center text-orange-100 hover:text-white transition-colors"
              >
                <PhoneIcon className="h-5 w-5 mr-2" />
                +1 (234) 567-890
              </a>
            </div>
          </motion.div>

          {/* Social Media Section */}
          <motion.div
            className="flex flex-col items-center md:items-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <motion.a
                href="https://facebook.com/restaurantreservations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-100 hover:text-white transition-colors"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaFacebook className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="https://instagram.com/restaurantreservations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-100 hover:text-white transition-colors"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaInstagram className="h-6 w-6" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 text-center text-sm text-orange-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p>© {new Date().getFullYear()} Reserve My Table. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
