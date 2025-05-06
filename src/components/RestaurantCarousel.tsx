"use client";

import { Restaurant } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface Props {
  restaurants: Restaurant[];
}

export default function RestaurantCarousel({ restaurants }: Props) {
  return (
    <div className="relative w-full">
        {/* Navigation buttons */}
        <div className="swiper-button-prev z-10 absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/10 dark:bg-white/10 rounded-full hover:bg-black/20 dark:hover:bg-white/20 transition p-1 cursor-pointer">
        <ChevronLeftIcon className="h-5 w-5 text-orange-500" />
        </div>
        <div className="swiper-button-next z-10 absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/10 dark:bg-white/10 rounded-full hover:bg-black/20 dark:hover:bg-white/20 transition p-1 cursor-pointer">
        <ChevronRightIcon className="h-5 w-5 text-orange-500" />
        </div>



      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{
          clickable: true,
          el: ".swiper-pagination",
        }}
        className="pb-10"
      >
        {restaurants.map((restaurant) => (
          <SwiperSlide key={restaurant.id}>
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-36 lg-h-48 object-cover"
              />
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{restaurant.name}</h3>
                  <p className="text-gray-600">{restaurant.location}</p>
                  <p className="text-gray-600">{restaurant.hours}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Extra spacing for pagination bubbles */}
      <div className="mt-6 lg-mt-8 flex justify-center">
        <div className="swiper-pagination" />
      </div>
    </div>
  );
}
