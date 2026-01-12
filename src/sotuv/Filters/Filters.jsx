import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

// Swiper stillari
import "swiper/css";
import "swiper/css/navigation";
import "./Filters.css";

const API_URL = "https://tailorback2025-production.up.railway.app/api/categories";

const Filters = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const parentCategories = data.filter((cat) => cat.parent_id === null);
        setCategories(parentCategories);
      } catch (error) {
        console.error("Kategoriyalarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return null;

  // Agar kategoriyalar 5 tadan ko'p bo'lsa Slider, bo'lmasa oddiy List chiqadi
  const useSwiper = categories.length > 5;

  return (
    <section className="filters-container" data-aos="fade-up">
      {useSwiper ? (
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={15}
          slidesPerView="auto"
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          className="mySwiper"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id} style={{ width: "auto" }}>
              <button
                className="filter-btn"
                onClick={() => navigate(`/category/${category.id}`)}
              >
                {/* Rasm backenddan kelsa chiqadi, bo'lmasa chiqarilmaydi */}
                {category.image && <img src={category.image} alt={category.name} />}
                {category.name}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="filters-flex">
          {categories.map((category) => (
            <button
              key={category.id}
              className="filter-btn"
            onClick={() => navigate(`/category/${category.id}`)}
            >
              {category.image && <img src={category.image} alt={category.name} />}
              {category.name}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default Filters;