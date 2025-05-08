"use client";

import { Restaurant, Review } from '@/types';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon as SolidStar } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface RestaurantCarouselProps {
  restaurants: Restaurant[];
  reviews: Review[];
}

export default function RestaurantCarousel({ restaurants, reviews }: RestaurantCarouselProps) {
  const getAverageRating = (restaurantId: string) => {
    const restaurantReviews = reviews.filter(r => r.restaurantId === restaurantId);
    if (restaurantReviews.length === 0) return 0;
    const total = restaurantReviews.reduce((sum, r) => sum + r.rating, 0);
    return total / restaurantReviews.length;
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-0 relative">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={15}
        slidesPerView={1}
        breakpoints={{
          320: { slidesPerView: 1.2, spaceBetween: 15, centeredSlides: true, },
          460: { slidesPerView: 1.5, spaceBetween: 20, centeredSlides: false, },
          538: { slidesPerView: 2, spaceBetween: 20, centeredSlides: false, },
          768: { slidesPerView: 2.5, spaceBetween: 24, centeredSlides: false },
          840: { slidesPerView: 3, spaceBetween: 24,centeredSlides: false },
          1024: { slidesPerView: 3.5, spaceBetween: 30 , centeredSlides: false },
          1280: { slidesPerView: 4, spaceBetween: 30, centeredSlides: false },
        }}
        centeredSlides={true}
        autoplay={{ delay: 5000 }}
        navigation={{ nextEl: '.custom-next', prevEl: '.custom-prev' }}
        pagination={{
          el: '.swiper-pagination',
          clickable: true,
          type: 'bullets',
          renderBullet: (index, className) => `<span class="${className}"></span>`,
        }}
        className="w-full"
      >
        {restaurants.map((restaurant) => {
          const avgRating = getAverageRating(restaurant.id);
          const reviewCount = reviews.filter(r => r.restaurantId === restaurant.id).length;
          const isPopular = reviewCount >= 5; // You can change the threshold

          return (
            <SwiperSlide key={restaurant.id}>
              <Link href={`/restaurants/${restaurant.id}`}>
                <motion.div
                  className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-orange-200 w-64 md:w-72 h-[340px] md:h-[400px] flex flex-col cursor-pointer overflow-hidden transition-all"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative w-full h-40 md:h-56 overflow-hidden rounded-xl">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    {isPopular && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full z-10">
                        Popular
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mt-4 truncate">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{restaurant.location}</p>
                  <div className="flex items-center mt-2 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <SolidStar
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      ({avgRating.toFixed(1)} · {reviewCount})
                    </span>
                  </div>
                </motion.div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="swiper-pagination mt-4 flex justify-center space-x-2"></div>

      <button
        className="custom-prev absolute top-1/2 left-0 transform -translate-y-1/2 z-10 bg-black/50 text-white rounded-lg w-10 h-10 md:w-12 md:h-12 shadow-md flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        className="custom-next absolute top-1/2 right-0 transform -translate-y-1/2 z-10 bg-black/50 text-white rounded-lg w-10 h-10 md:w-12 md:h-12 shadow-md flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          border-radius: 9999px;
          transition: background 0.3s;
        }
        .swiper-pagination-bullet-active {
          background: #f97316;
        }
      `}</style>
    </div>
  );
}
