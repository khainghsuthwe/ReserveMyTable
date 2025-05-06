"use client";

import { Review } from '@/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { StarIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface ReviewCarouselProps {
  reviews: Review[];
}

export default function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  return (
    <div className="w-full max-w-[900px] mx-auto px-4 sm:px-0">
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={16}
        slidesPerView={3}
        breakpoints={{
          1024: {
            slidesPerView: 4,
          },
        }}
        autoplay={{ delay: 5000 }}
        navigation
        className="w-full"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <motion.div
              className="bg-orange-100 p-4 rounded-xl shadow-lg w-64 h-[220px] flex flex-col"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 flex-1 overflow-hidden">{review.comment}</p>
              <p className="text-sm font-semibold text-gray-800 mt-2">{review.userName}</p>
              <p className="text-xs text-gray-500">{review.date}</p>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}