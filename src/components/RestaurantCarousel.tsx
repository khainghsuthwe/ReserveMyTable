"use client";

import { Restaurant } from '@/types';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface RestaurantCarouselProps {
  restaurants: Restaurant[];
}

export default function RestaurantCarousel({ restaurants }: RestaurantCarouselProps) {
  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-0 relative">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={15}
        slidesPerView={1.2}
        breakpoints={{     
          480: { slidesPerView: 1.5, spaceBetween: 16 },
          768: { slidesPerView: 2, spaceBetween: 20 },
          840: { slidesPerView: 2.5, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
          1280: { slidesPerView: 3.5, spaceBetween: 32 },
        }}
        centeredSlides={false}
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
        {restaurants.map((restaurant) => (
          <SwiperSlide key={restaurant.id}>
            <Link href={`/restaurants/${restaurant.id}`}>
              <motion.div
                className="bg-white p-6 rounded-2xl shadow-2xl border-2 border-orange-200 w-64 md:w-72 h-[320px] md:h-[380px] flex flex-col cursor-pointer overflow-hidden"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative w-full h-40 md:h-56 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20"></div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mt-4 truncate">{restaurant.name}</h3>
                <p className="text-gray-600 text-sm mt-2 truncate">{restaurant.location}</p>
              </motion.div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-pagination mt-4 flex justify-center space-x-2"></div>
      <button
        className="custom-prev absolute top-1/2 left-0 transform -translate-y-1/2 z-10 bg-black/50 text-white rounded-lg w-12 h-12 shadow-md flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        className="custom-next absolute top-1/2 right-0 transform -translate-y-1/2 z-10 bg-black/50 text-white rounded-lg w-12 h-12 shadow-md flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>
      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #9CA3AF;
          border-radius: 50%;
          opacity: 1;
          display: inline-block;
          margin: 0 4px;
          transition: background 0.3s, width 0.3s, height 0.3s;
          z-index: 10;
        }
        .swiper-pagination-bullet-active {
          width: 10px;
          height: 10px;
          background: #F97316;
          border-radius: 50%;
          opacity: 1;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}