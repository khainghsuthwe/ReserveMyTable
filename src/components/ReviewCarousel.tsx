"use client";

import { Review } from '@/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface ReviewCarouselProps {
  reviews: Review[];
}

export default function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const isSingleSlide = reviews.length === 1;

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-0 bg-orange-50 rounded-2xl py-8 relative">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={14}
        slidesPerView={isSingleSlide ? 1 : 1.2}
        breakpoints={{
         
          480: { slidesPerView: isSingleSlide ? 1 : 1.5 },
          768: { slidesPerView: isSingleSlide ? 1 : 2, spaceBetween: 15 },
          1024: { slidesPerView: isSingleSlide ? 1 : 3, spaceBetween: 16 },
          1280: { slidesPerView: isSingleSlide ? 1 : 3.5, spaceBetween: 18 },
        }}
        centeredSlides={true}
        autoplay={{ delay: 5000 }}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}
        pagination={{
          el: '.swiper-pagination',
          clickable: true,
          type: 'bullets',
          renderBullet: (index, className) => `<span class="${className}"></span>`,
        }}
        className="w-full"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <motion.div
              className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl border-2 border-orange-500 w-64 h-[220px] md:h-[260px] flex flex-col shadow-lg"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-center mb-3">
                <div className="bg-orange-100 rounded-full p-2 shadow-sm flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="italic text-lg text-gray-700 flex-1 overflow-hidden">{review.comment}</p>
              <p className="text-sm font-bold text-orange-500 mt-2">{review.userName}</p>
              <p className="text-xs text-gray-500">{review.date}</p>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-pagination mt-4 flex justify-center space-x-2"></div>
      <button
        className="custom-prev absolute top-1/2 left-0 transform -translate-y-1/2 z-10 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-full w-12 h-12 shadow-md flex items-center justify-center hover:bg-orange-600 hover:scale-110 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button
        className="custom-next absolute top-1/2 right-0 transform -translate-y-1/2 z-10 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-full w-12 h-12 shadow-md flex items-center justify-center hover:bg-orange-600 hover:scale-110 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>
      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 24px;
          height: 8px;
          background: #d1d5db;
          border-radius: 4px;
          opacity: 1;
          display: inline-block;
          margin: 0 4px;
          transition: background 0.3s;
        }
        .swiper-pagination-bullet-active {
          width: 24px;
          height: 8px;
          background: #f97316;
          border-radius: 4px;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}