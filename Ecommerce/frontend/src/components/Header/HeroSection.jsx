import React from 'react'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
function HeroSection() {
    const images = [
        
        "https://images.pexels.com/photos/1050312/pexels-photo-1050312.jpeg",
        "https://images.pexels.com/photos/6207749/pexels-photo-6207749.jpeg",
        "https://images.pexels.com/photos/2220253/pexels-photo-2220253.jpeg",
    ]
    return (
        <div className="w-full">

            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop={true}
                className="overflow-hidden"
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={img}
                            alt={`slide-${index}`}
                            className="
                w-full
                h-55
                sm:h-70
                md:h-90
                lg:h-105
                xl:h-125
                object-cover
              "
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

        </div>
    )
}

export default HeroSection