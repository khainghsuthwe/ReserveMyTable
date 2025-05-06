"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Restaurant, Review, TableAvailability } from '@/types';
import dummyData from '@/data/dummy.json';
import { StarIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const photoVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const tableVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
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

  const tableAvailability: TableAvailability[] = dummyData.tableAvailability;

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
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-12 text-center">
          <p className="text-red-500 text-lg">Restaurant not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        {status === 'loading' ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-80 object-cover rounded-lg mb-6"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{restaurant.name}</h1>
            <p className="text-gray-600 mb-2">{restaurant.location}</p>
            <p className="text-gray-600 mb-6">{restaurant.hours}</p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {restaurant.menu.map((item, index) => (
                <motion.div
                  key={item.name}
                  className="bg-orange-100 p-4 rounded-lg flex items-start"
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.2 }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <p className="text-orange-500 font-semibold mt-1">${item.price.toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dining Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {restaurant.diningPhotos.length === 0 ? (
                <p className="text-gray-600">No photos available.</p>
              ) : (
                restaurant.diningPhotos.map((photo, index) => (
                  <motion.div
                    key={index}
                    variants={photoVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.2 }}
                  >
                    <img
                      src={photo}
                      alt={`Dining at ${restaurant.name}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </motion.div>
                ))
              )}
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Table Types</h2>
            <div className="space-y-4 mb-6">
              {restaurant.tableTypes.map((table, index) => (
                <motion.div
                  key={table.type}
                  className="p-4 bg-orange-100 rounded-lg"
                  variants={tableVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.2 }}
                >
                  <p className="font-semibold text-gray-800 capitalize">{table.type}</p>
                  <p className="text-gray-600">{table.description}</p>
                </motion.div>
              ))}
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Table Availability</h2>
            <div className="space-y-4 mb-6">
              {tableAvailability.map((table, index) => (
                <motion.div
                  key={table.id}
                  className="flex items-center p-4 bg-orange-100 rounded-lg"
                  variants={tableVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.2 }}
                >
                  <img
                    src={table.image}
                    alt={`Table at ${table.date} ${table.time}`}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {table.date} at {table.time}
                    </p>
                    <p className="text-gray-600">{table.available} tables available</p>
                    <p className="text-gray-600">{table.reserved} tables reserved</p>
                  </div>
                  {table.available > 0 && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={`/restaurants/${id}/reserve?tableId=${table.id}`}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                      >
                        Reserve
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <StarIcon className="h-6 w-6 text-yellow-500 mr-2" />
              Reviews
            </h2>
            {reviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    className="border-b border-gray-200 pb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
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
                  </motion.div>
                ))}
              </div>
            )}

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
        )}
      </main>
    </div>
  );
}