"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Review } from '@/types';
import dummyData from '@/data/dummy.json';
import { StarIcon, MapPinIcon, ClockIcon, PhoneIcon, ClipboardDocumentListIcon, PhotoIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const photoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const menuVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function RestaurantDetail() {
  const { data: session, status } = useSession();
  const params = useParams();
  const id = params?.id as string;
  const restaurant = dummyData.restaurants.find((r) => r.id === id);
  const [reviews, setReviews] = useState<Review[]>(dummyData.reviews.filter((r) => r.restaurantId === id));
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError('Please log in to submit a review');
      return;
    }
    if (rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5');
      return;
    }
    const newReview: Review = {
      id: `${reviews.length + 1}`,
      restaurantId: id,
      userId: session.user?.id || 'unknown',
      userName: session.user?.name || 'Anonymous',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews([...reviews, newReview]);
    setRating(0);
    setComment('');
    setError('');
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-20 text-center">
          <p className="text-red-600 text-2xl font-semibold">Restaurant not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {status === 'loading' ? (
          <div className="text-center py-12 text-xl text-gray-700">Loading...</div>
        ) : (
          <>
            {/* Hero Image Section */}
            <motion.section
              className="relative w-full h-96 mb-12 overflow-hidden rounded-xl shadow-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-4xl font-bold">{restaurant.name}</h1>
                <div className="flex items-center mt-2">
                  <MapPinIcon className="h-5 w-5 text-white mr-2" />
                  <p className="text-lg">{restaurant.location}</p>
                </div>
              </div>
            </motion.section>

            {/* Details and Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Details */}
              <motion.div
                className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center mb-4">
                  <ClockIcon className="h-5 w-5 text-orange-500 mr-2" />
                  <p className="text-gray-600">{restaurant.hours}</p>
                </div>
                <div className="flex items-center mb-6">
                  <PhoneIcon className="h-5 w-5 text-orange-500 mr-2" />
                  <p className="text-gray-600">Phone: {restaurant.phone}</p>
                </div>

                {/* Menu */}
                <div className="flex items-center mb-4">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-orange-500 mr-2" />
                  <h2 className="text-2xl font-semibold text-gray-800">Menu</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {restaurant.menu.map((item, index) => (
                    <motion.div
                      key={item.name}
                      className="bg-orange-50 p-4 rounded-xl flex items-center"
                      variants={menuVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg mr-4"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                        <p className="text-orange-500 font-medium mt-1">${item.price.toFixed(2)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Dining Photos */}
                <div className="flex items-center mb-4">
                  <PhotoIcon className="h-6 w-6 text-orange-500 mr-2" />
                  <h2 className="text-2xl font-semibold text-gray-800">Dining Photos</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {restaurant.diningPhotos.length === 0 ? (
                    <p className="text-gray-600">No photos available.</p>
                  ) : (
                    restaurant.diningPhotos.map((photo, index) => (
                      <motion.div
                        key={index}
                        variants={photoVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                      >
                        <img
                          src={photo}
                          alt={`Dining at ${restaurant.name}`}
                          className="w-full h-48 object-cover rounded-xl"
                        />
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Table Availability Button */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Link
                    href={`/restaurants/${id}/availability`}
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors inline-block"
                  >
                    View Availability
                  </Link>
                </motion.div>
              </motion.div>

              {/* Sidebar (Table Types and Reviews) */}
              <motion.div
                className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {/* Table Types */}
                <div className="flex items-center mb-4">
                  <TableCellsIcon className="h-6 w-6 text-orange-500 mr-2" />
                  <h2 className="text-2xl font-semibold text-gray-800">Table Types</h2>
                </div>
                <div className="space-y-4 mb-6">
                  {restaurant.tableTypes.map((table, index) => (
                    <div
                      key={table.type}
                      className="p-4 bg-orange-50 rounded-lg"
                    >
                      <p className="font-semibold text-gray-800 capitalize">{table.type}</p>
                      <p className="text-gray-600">{table.description}</p>
                    </div>
                  ))}
                </div>

                {/* Reviews */}
                <div className="flex items-center mb-4">
                  <StarIcon className="h-6 w-6 text-yellow-500 mr-2" />
                  <h2 className="text-2xl font-semibold text-gray-800">Reviews</h2>
                </div>
                {reviews.length === 0 ? (
                  <p className="text-gray-600">No reviews yet.</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-200 pb-4"
                      >
                        <p className="font-semibold text-gray-800">{review.userName}</p>
                        <div className="flex items-center my-2">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-5 w-5 ${
                                i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                        <p className="text-sm text-gray-500 mt-1">{review.date}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Write Review */}
                {status === 'authenticated' && (
                  <motion.div
                    className="mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Write a Review</h3>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmitReview} className="space-y-6">
                      <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                          Rating
                        </label>
                        <select
                          id="rating"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          required
                        >
                          <option value="0">Select rating</option>
                          <option value="1">1 Star</option>
                          <option value="2">2 Stars</option>
                          <option value="3">3 Stars</option>
                          <option value="4">4 Stars</option>
                          <option value="5">5 Stars</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                          Comment
                        </label>
                        <textarea
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                          rows={4}
                          required
                        />
                      </div>
                      <motion.button
                        type="submit"
                        className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Submit Review
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}