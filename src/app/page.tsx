"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Restaurant, Review, Cuisine } from "@/types";
import dummyData from "@/data/dummy.json";
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import RestaurantCarousel from "@/components/RestaurantCarousel";
import ReviewCarousel from "@/components/ReviewCarousel";
import CuisineCarousel from "@/components/CuisineCarousel";

const restaurants: Restaurant[] = dummyData.restaurants;
const reviews: Review[] = dummyData.reviews;
const cuisines: Cuisine[] = dummyData.cuisines;

const deals = [
  {
    id: 1,
    title: "Happy Hour Special",
    description:
      "50% off appetizers at The Gourmet Bistro every weekday from 4–6 PM.",
    expiry: "2 days left",
    restaurantId: 1,
    image:
      "https://images.pexels.com/photos/18999501/pexels-photo-18999501/free-photo-of-man-with-a-wineglass-at-a-party.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 2,
    title: "Date Night Deal",
    description:
      "Free dessert with any two entrees at La Bella Vita this weekend.",
    expiry: "This weekend only",
    restaurantId: 2,
    image:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Family Feast",
    description:
      "20% off family-style meals at Sunny Garden for groups of 4+.",
    expiry: "1 week left",
    restaurantId: 3,
    image:
      "https://images.pexels.com/photos/5775055/pexels-photo-5775055.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const popularRestaurants = restaurants
    .map((restaurant) => ({
      ...restaurant,
      reviewCount: reviews.filter((r) => r.restaurantId === restaurant.id).length,
    }))
    .sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5); ;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-12">

        {/* Hero Section */}
        <section
          className="relative h-[400px] md:h-[450px] bg-cover bg-center rounded-xl mb-16 flex items-center justify-center text-center px-4"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=80)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/80 rounded-xl"></div>
          <div className="relative z-10 max-w-2xl text-white space-y-5">
            <h1 className="text-3xl md:text-4xl font-bold">
              Discover & Book the Best Restaurants
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Unforgettable meals, local flavors, and curated experiences await.
            </p>
            <form onSubmit={handleSearch} className="mt-4 max-w-lg mx-auto">
              <div className="relative flex items-center bg-white rounded-lg shadow-lg border-2 border-orange-300">
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines, or areas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 text-gray-800 text-base rounded-lg focus:outline-none placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-orange-500 hover:bg-orange-600 rounded-r-lg"
                >
                  <MagnifyingGlassIcon className="h-6 w-6 text-white" />
                </button>
              </div>
            </form>
          </div>
        </section>


        {session && (
          <p className="text-center text-xl text-gray-700 mb-12">
            Hello, {session.user?.name}! Ready to book your next dining experience?
          </p>
        )}

        {/* Popular Restaurants */}
        <section className="mb-20 py-3 px-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
            Popular Restaurants
          </h2>
          <RestaurantCarousel restaurants={popularRestaurants} reviews={reviews} />
        </section>

        {/* Exclusive Deals */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
            Exclusive Deals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <motion.div
                key={deal.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 * deal.id }}
                whileHover={{ scale: 1.03 }}
              >
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">{deal.title}</h3>
                  <p className="text-gray-600 mt-2">{deal.description}</p>
                  <p className="text-orange-500 font-bold mt-2">
                    Expires in: {deal.expiry}
                  </p>
                  <Link
                    href={`/restaurants/${deal.restaurantId}`}
                    className="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Browse by Cuisine */}
        <CuisineCarousel cuisines={cuisines} />

        {/* Dining Journey */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
            Your Dining Journey
          </h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            {[
              {
                icon: <MagnifyingGlassIcon className="h-10 w-10 text-orange-500" />,
                title: "Explore",
                text: "Discover restaurants with unique flavors and vibes.",
              },
              {
                icon: <CalendarIcon className="h-10 w-10 text-orange-500" />,
                title: "Reserve",
                text: "Book your table easily in a few clicks.",
              },
              {
                icon: <SparklesIcon className="h-10 w-10 text-orange-500" />,
                title: "Dine",
                text: "Enjoy an unforgettable meal and experience.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="bg-orange-100 p-6 rounded-xl shadow-md flex flex-col items-center text-center w-full sm:max-w-xs"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {step.icon}
                <h3 className="text-xl font-semibold text-gray-800 mt-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 mt-2">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
            What Our Customers Say
          </h2>
          <ReviewCarousel reviews={reviews} />
        </section>
      </main>
    </div>
  );
}
