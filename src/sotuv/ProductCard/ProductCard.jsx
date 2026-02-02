import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { FaStar, FaShoppingCart, FaHeart, FaPercent, FaRegHeart, FaFire } from "react-icons/fa";

// Swiper stillari
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import dropDown from "../../assets/oG99I91tLW.json";

// --- API URL-lar ---
const API_BASE = "https://tailorback2025-production.up.railway.app/api";

// --- 1. IMAGE SWIPER ---
const ImageSwiper = ({ images = [], productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-t-xl bg-gray-50">
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <img 
            key={idx} 
            src={img} 
            alt={productName} 
            className="w-full h-full object-cover flex-shrink-0" 
          />
        ))}
      </div>
    </div>
  );
};

// --- 2. PRODUCT CARD ---
const ProductCard = ({ product, avg, toggleFavorite, isFavorite, addToCart, showBadge = false }) => {
  const imageUrls = product.images?.map(img => img.image_url) || [];
  const currentPrice = Number(product.price_uzs || product.price) || 0;
  const discount = product.discount;
  const isDiscountActive = discount && discount.is_active !== false;

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col relative overflow-hidden h-full mb-12">
      <div className="h-48 sm:h-64 relative block">
        <Link to={`/product/${product.id}`} className="w-full h-full block">
          <ImageSwiper images={imageUrls.length > 0 ? imageUrls : ["https://geostudy.uz/img/pictures/cifvooipg_rf1.jpeg"]} productName={product.name}/>
        </Link>
        
        <button
          onClick={() => toggleFavorite(product)}
          className={`absolute top-3 right-3 p-3 backdrop-blur-md rounded-2xl z-10 shadow-lg transition-all active:scale-75 ${
            isFavorite ? "bg-red-500 text-white" : "bg-white/90 text-red-400 hover:bg-red-50"
          }`}
        >
          {isFavorite ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
        </button>

        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isDiscountActive && (
            <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-xl animate-pulse">
              <FaPercent size={8} /> {discount.percent ? `${Math.round(discount.percent)}%` : 'SALE'}
            </span>
          )}
          {showBadge && (
            <span className="bg-orange-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-xl">
              <FaFire size={8} /> TOP
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Tailor Premium</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm sm:text-base font-black text-slate-800 line-clamp-2 hover:text-red-600 uppercase italic transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 my-3">
          <div className="flex text-yellow-400 text-[10px]">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.round(avg) ? "text-yellow-400" : "text-gray-200"} />
            ))}
          </div>
          <span className="text-gray-400 text-[10px] font-black tracking-tighter">({avg})</span>
        </div>

        <div className="mt-auto">
          <div className="flex flex-col mb-4">
            <span className="text-red-600 font-black text-xl tracking-tighter">
              {currentPrice.toLocaleString()} <span className="text-[10px]">SO'M</span>
            </span>
          </div>
          
          <button
            onClick={() => addToCart({ 
              ...product, 
              price: currentPrice, 
              quantity: 1, 
              image: imageUrls[0] 
            })}
            className="w-full bg-slate-950 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-xl shadow-slate-200"
          >
            <FaShoppingCart size={14} /> SAVATGA
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 3. PRODUCT SECTION ---
const ProductSection = ({ title, products = [], addToCart, getStats, favorites, toggleFavorite, accentColor, showBadge }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="mb-20">
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 italic uppercase tracking-tighter">{title}</h2>
          <div className={`h-2 w-20 ${accentColor} rounded-full mt-2 shadow-lg`}></div>
        </div>
      </div>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={20}
        slidesPerView={2}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 25 },
          1024: { slidesPerView: 4, spaceBetween: 30 },
        }}
        className="product-swiper !pb-14"
      >
        {products.map((p) => (
          <SwiperSlide key={p.id}>
            <ProductCard
              product={p}
              {...getStats(p.id)}
              addToCart={addToCart}
              toggleFavorite={toggleFavorite}
              isFavorite={favorites?.some(fav => fav.id === p.id)}
              showBadge={showBadge}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// --- 4. MAIN COMPONENT ---
const Products = ({ addToCart, favorites = [], toggleFavorite }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, rRes, tRes] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/reviews`),
          fetch(`${API_BASE}/orders/top-selling`) // YANGI API
        ]);
        
        const pData = await pRes.json();
        const tData = await tRes.json();
        const rData = await rRes.json();
        
        // Faqat aktiv mahsulotlarni filtrlaymiz
        const activeOnly = Array.isArray(pData) ? pData.filter(item => item.is_active !== false) : [];
        
        setAllProducts(activeOnly);
        setTopSelling(Array.isArray(tData) ? tData.filter(item => item.is_active !== false) : []);
        setReviews(Array.isArray(rData) ? rData : []);
      } catch (e) {
        console.error("Ma'lumotlarni yuklashda xatolik:", e);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchData();
  }, []);

  const getStats = (id) => {
    const pRev = reviews.filter(r => r.product_id === id);
    return { 
      avg: pRev.length > 0 ? (pRev.reduce((a, b) => a + b.rating, 0) / pRev.length).toFixed(1) : "5.0" 
    };
  };

  // Filtrlangan to'plamlar
  const latest = allProducts.filter(p => p.is_latest);
  const popular = allProducts.filter(p => p.is_popular);
  const discounts = allProducts.filter(p => p.discount?.is_active);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-8 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
        <FaFire className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600 animate-bounce" />
      </div>
      <p className="mt-6 font-black text-slate-400 uppercase tracking-[0.3em] text-[10px] animate-pulse">TailorShop...</p>
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 bg-white overflow-hidden">
      
      {/* 1. TOP SELLING - ALOHIDA API-DAN */}
      <ProductSection 
        title="Eng ko'p sotilgan" 
        products={topSelling} 
        accentColor="bg-orange-500"
        showBadge={true}
        {...{addToCart, getStats, favorites, toggleFavorite}}
      />

      {/* 2. DISCOUNTS */}
      <ProductSection 
        title="Katta chegirmalar" 
        products={discounts} 
        accentColor="bg-red-600"
        {...{addToCart, getStats, favorites, toggleFavorite}}
      />

      {/* 3. NEW ARRIVALS */}
      <ProductSection 
        title="Yangi kelganlar" 
        products={latest} 
        accentColor="bg-slate-900"
        {...{addToCart, getStats, favorites, toggleFavorite}}
      />

      {/* 4. TRENDING */}
      <ProductSection 
        title="Trenddagilar" 
        products={popular} 
        accentColor="bg-blue-600"
        {...{addToCart, getStats, favorites, toggleFavorite}}
      />

      {/* Footer CTA */}
      <div className="mt-16 flex flex-col items-center">
        <Link to="/all-products" className="group relative flex flex-col items-center transition-transform active:scale-95">
          <Player 
            autoplay 
            loop 
            src={dropDown} 
            className="w-36 sm:w-44" 
          />
          <span className="bg-slate-950 text-white px-10 py-4 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl -mt-8 z-10 transition-all group-hover:bg-red-600 group-hover:shadow-red-200">
            Katalogga o'tish
          </span>
        </Link>
      </div>
    </section>
  );
};

export default Products;