import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import axios from "axios";

// Swiper style
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Swiper.css";

export default function Slider() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get("https://tailorback2025-production.up.railway.app/api/banners");
        
        // BU YERDA FILTRLASH: Faqat statusi true bo'lganlarni saqlaymiz
        const activeBanners = response.data.filter(item => item.status === true);
        
        setBanners(activeBanners); 
      } catch (error) {
        console.error("Xatolik yuz berdi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Yuklanmoqda...</div>;
  }

  // Agar filtrdan keyin rasm qolmasa, slayderni ko'rsatmaymiz
  if (banners.length === 0) {
    return null; 
  }

  return (
    <div style={{ width: "90%", margin: "0 auto" }} data-aos="fade-down">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        loop={banners.length > 1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
        style={{ padding: "30px 0" }}
      >
        {banners.map((item) => (
          <SwiperSlide key={item.id}>
            <img
              src={item.image_url}
              alt={item.title || "Banner"}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "500px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}