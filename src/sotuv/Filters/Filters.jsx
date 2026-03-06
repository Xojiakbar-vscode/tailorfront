import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, FreeMode, Mousewheel } from "swiper/modules";
import { 
  FaSpinner, 
  FaChevronLeft, 
  FaChevronRight, 
  FaLayerGroup,
  FaExclamationCircle 
} from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

const API_URL = "https://tailorback2025-production.up.railway.app/api/categories";

// ================= OPTIMIZED LAZY IMAGE =================
const LazyImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 border border-gray-50">
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" 
             style={{ backgroundSize: '200% 100%' }} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} w-full h-full object-cover transition-all duration-500 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <FaLayerGroup className="text-gray-300" size={10} />
        </div>
      )}
    </div>
  );
};

// ================= ENHANCED CATEGORY BUTTON =================
const CategoryButton = React.memo(({ category, onClick, isActive }) => {
  return (
    <button
      onClick={() => onClick(category)}
      className={`
        relative inline-flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full 
        text-[13px] sm:text-sm font-bold tracking-tight transition-all duration-300 whitespace-nowrap
        ${isActive 
          ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-y-[-2px]' 
          : 'bg-white text-slate-600 border border-slate-100 hover:border-red-200 hover:text-red-600 hover:shadow-lg hover:translate-y-[-2px]'
        }
      `}
    >
      {category.image ? (
        <LazyImage src={category.image} alt={category.name} />
      ) : (
        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center ${isActive ? 'bg-white/10' : 'bg-red-50'}`}>
          <FaLayerGroup size={10} className={isActive ? 'text-white' : 'text-red-500'} />
        </div>
      )}
      <span>{category.name}</span>
      {isActive && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
      )}
    </button>
  );
});

// ================= MAIN FILTERS COMPONENT =================
const Filters = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [swiperState, setSwiperState] = useState({ isBeginning: true, isEnd: false });
  
  const swiperRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Tarmoq xatosi");
        const data = await response.json();
        const parents = data
          .filter(cat => cat.parent_id === null)
          .sort((a, b) => a.name.localeCompare(b.name));
        setCategories(parents);
      } catch (err) {
        setError("Kategoriyalarni yuklab bo'lmadi");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const path = location.pathname;
    const match = path.match(/\/category\/(.+)/);
    if (match) {
      const active = categories.find(c => c.slug === match[1] || String(c.id) === match[1]);
      if (active) setActiveCategory(active.id);
    } else {
      setActiveCategory(null);
    }
  }, [categories, location.pathname]);

  const goToCategory = useCallback((category) => {
    navigate(`/category/${category.slug || category.id}`);
  }, [navigate]);

  if (loading) return (
    <div className="flex gap-3 overflow-hidden py-6 justify-center">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-10 w-32 bg-gray-100 rounded-full animate-pulse" />
      ))}
    </div>
  );

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
      <div className="relative group">
        
        {/* Swiper Container */}
        <div className="relative overflow-hidden rounded-3xl">
          {/* Glassmorphism gradient edges to hide overflow silliqroq */}
          <div className={`absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none transition-opacity duration-300 bg-gradient-to-r from-white to-transparent ${swiperState.isBeginning ? 'opacity-0' : 'opacity-100'}`} />
          <div className={`absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none transition-opacity duration-300 bg-gradient-to-l from-white to-transparent ${swiperState.isEnd ? 'opacity-0' : 'opacity-100'}`} />

          <Swiper
            modules={[Autoplay, Navigation, FreeMode, Mousewheel]}
            spaceBetween={10}
            slidesPerView="auto"
            freeMode={{ enabled: true, sticky: false, momentumRatio: 0.5 }}
            mousewheel={{ forceToAxis: true }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setSwiperState({ isBeginning: swiper.isBeginning, isEnd: swiper.isEnd });
            }}
            onSlideChange={(swiper) => {
              setSwiperState({ isBeginning: swiper.isBeginning, isEnd: swiper.isEnd });
            }}
            className="!py-4 !px-2"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id} style={{ width: "auto" }}>
                <CategoryButton
                  category={category}
                  onClick={goToCategory}
                  isActive={activeCategory === category.id}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Navigation - Faqat desktopda ko'rinadi */}
        {!swiperState.isBeginning && (
          <button 
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-[-15px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-xl rounded-full hidden md:flex items-center justify-center border border-gray-100 hover:bg-red-600 hover:text-white transition-all"
          >
            <FaChevronLeft size={12} />
          </button>
        )}
        {!swiperState.isEnd && (
          <button 
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-[-15px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-xl rounded-full hidden md:flex items-center justify-center border border-gray-100 hover:bg-red-600 hover:text-white transition-all"
          >
            <FaChevronRight size={12} />
          </button>
        )}
      </div>
    </section>
  );
};

// CSS-in-JS for extra smoothness
const globalStyles = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .animate-shimmer {
    animation: shimmer 1.5s infinite linear;
  }
  .swiper-free-mode > .swiper-wrapper {
    transition-timing-function: ease-out !important;
  }
  /* Remove blue highlight on mobile */
  button { -webkit-tap-highlight-color: transparent; }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement("style");
  style.innerText = globalStyles;
  document.head.appendChild(style);
}

export default React.memo(Filters);