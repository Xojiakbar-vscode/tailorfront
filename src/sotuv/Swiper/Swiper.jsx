import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import axios from "axios";

// Swiper styles
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
        const res = await axios.get(
          "https://tailorback2025-production.up.railway.app/api/banners"
        );

        if (Array.isArray(res.data)) {
          const activeBanners = res.data.filter(
            (item) => item.status === true
          );
          setBanners(activeBanners);
        }
      } catch (err) {
        console.error("Bannerlarni yuklashda xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "30px" }}>
        Yuklanmoqda...
      </div>
    );
  }

  if (!banners.length) return null;

  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        loop={banners.length > 1}
        observer={true}
        observeParents={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
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
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                maxHeight: "500px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/1200x500?text=Banner";
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
        }
