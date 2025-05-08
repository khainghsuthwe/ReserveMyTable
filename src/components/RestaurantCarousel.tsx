"use client";

import { Restaurant, Review } from '@/types';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
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
    <div className="w-full  mx-auto px-0 relative ">
      
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={14}
        slidesPerView={1}
        breakpoints={{
          300: { slidesPerView: 1.2, spaceBetween: 12, centeredSlides: true },
          460: { slidesPerView: 1.5, spaceBetween: 15, centeredSlides: false },
          538: { slidesPerView: 1.8, spaceBetween: 16, centeredSlides: false },
          768: { slidesPerView: 2.2, spaceBetween: 20, centeredSlides: false },
          840: { slidesPerView: 2.5, spaceBetween: 20, centeredSlides: false },
          1024: { slidesPerView: 3, spaceBetween: 25, centeredSlides: false },
          1280: { slidesPerView: 3.5, spaceBetween: 25, centeredSlides: false },
        }}
        autoplay={{ delay: 5000 }}
        pagination={{
          el: '.swiper-custom-pagination',
          clickable: true,
          
        }}
        className="w-full"
      >
        {restaurants.map((restaurant) => {
          const avgRating = getAverageRating(restaurant.id);
          const reviewCount = reviews.filter(r => r.restaurantId === restaurant.id).length;
          const isPopular = reviewCount >= 5; // You can change the threshold

          return (
            <SwiperSlide key={restaurant.id} >
              <Link href={`/restaurants/${restaurant.id}`}>
                <motion.div
                  className="bg-white p-2 md:p-4 rounded-2xl shadow-lg border border-orange-200 w-56 md:w-64 h-[300px] md:h-[360px] flex flex-col cursor-pointer overflow-hidden transition-all"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative w-full h-36 md:h-48 overflow-hidden rounded-xl">
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
                  <h3 className="text-md md:text-lg font-semibold text-gray-800 mt-3 truncate">{restaurant.name}</h3>
                  <p className="text-xs md:text-sm text-gray-600 truncate">{restaurant.location}</p>
                  <div className="flex items-center mt-2 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <SolidStar
                        key={i}
                        className={`h-3 md:h-4 w-3 md:w-4 ${i < Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}
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

      <div className="swiper-custom-pagination mt-6 flex justify-center space-x-2"></div>

      
    </div>
  );
}