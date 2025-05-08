'use client';

import { useRouter } from 'next/navigation';
import { Cuisine } from '@/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { motion } from 'framer-motion';

interface CuisineCarouselProps {
  cuisines: Cuisine[];
}

export default function CuisineCarousel({ cuisines }: CuisineCarouselProps) {
  const router = useRouter();

  const handleCuisineClick = (cuisineName: string) => {
    router.push(`/restaurants?cuisine=${encodeURIComponent(cuisineName)}`);
  };

  return (
    <div className="mb-16">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
        Cuisines
      </h2>

      <Swiper
        modules={[Scrollbar]}
        spaceBetween={16}
        slidesPerView="auto"
        
        className="pb-4"
      >
        {cuisines.map((cuisine) => (
          <SwiperSlide key={cuisine.id} style={{ width: '192px' /* w-48 */ }}>
            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCuisineClick(cuisine.name)}
            >
              <img
                src={cuisine.image}
                alt={cuisine.name}
                className="w-full h-32 object-cover rounded-xl mb-2"
              />
              <h3 className="text-lg font-semibold text-orange-500 text-center">
                {cuisine.name}
              </h3>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
