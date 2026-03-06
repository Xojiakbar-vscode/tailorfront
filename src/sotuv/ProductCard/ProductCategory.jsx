import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaSyncAlt,
  FaSpinner,
} from "react-icons/fa";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import dropDown from "../../assets/oG99I91tLW.json";

const API_BASE = "https://tailorback2025-production.up.railway.app/api";

// ================= SKELETON LOADER COMPONENT =================
const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse ${className}`} />
);

// ================= IMAGE SWIPER WITH LOADING STATE =================
const ImageSwiper = React.memo(({ images = [], productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedIndices, setLoadedIndices] = useState(new Set());

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [images]);

  const handleImageLoad = (index) => {
    setLoadedIndices((prev) => new Set(prev).add(index));
  };

  return (
    <div className="relative w-full h-full bg-gray-50 overflow-hidden rounded-t-[1.5rem]">
      <div
        className="flex h-full transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0 relative">
            {/* Rasm yuklanguncha ko'rinadigan Skeleton */}
            {!loadedIndices.has(idx) && (
              <Skeleton className="absolute inset-0 z-0" />
            )}
            <img
              src={img}
              alt={`${productName}-${idx}`}
              className={`w-full h-full object-cover relative z-10 transition-opacity duration-300 ${
                loadedIndices.has(idx) ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => handleImageLoad(idx)}
              loading={idx === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-3 right-3 bg-black/30 backdrop-blur-sm text-white text-[9px] px-2 py-0.5 rounded-full z-20">
          {currentIndex + 1}/{images.length}
        </div>
      )}
    </div>
  );
});

// ================= PRODUCT CARD =================
const ProductCard = React.memo(({ product, avg, toggleFavorite, isFavorite, addToCart }) => {
  const imageUrls = useMemo(() => product.images?.map((img) => img.image_url) || [], [product.images]);
  const currentPrice = useMemo(() => Number(product.price_uzs || product.price) || 0, [product.price_uzs, product.price]);

  return (
    <div className="group bg-white rounded-[1.8rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full mb-6">
      {/* Rasm konteyneri (Aspect Ratio orqali joyni saqlaymiz) */}
      <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden rounded-t-[1.8rem] bg-gray-100">
        <Link to={`/product/${product.id}`} className="w-full h-full block">
          <ImageSwiper 
            images={imageUrls.length > 0 ? imageUrls : ["/placeholder.jpg"]} 
            productName={product.name} 
          />
        </Link>
        <button
          onClick={() => toggleFavorite(product)}
          className={`absolute top-3 right-3 p-2.5 rounded-xl z-20 shadow-sm transition-transform active:scale-75 ${
            isFavorite ? "bg-red-500 text-white shadow-red-200" : "bg-white/90 text-red-400 hover:bg-white"
          }`}
        >
          {isFavorite ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 line-clamp-2 hover:text-red-600 transition-colors leading-snug min-h-[2.4rem]">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 my-2">
          <FaStar className="text-yellow-400" size={10} />
          <span className="text-gray-400 text-[10px] font-bold tracking-tighter">{avg}</span>
        </div>

        <div className="mt-auto">
          <div className="flex flex-col">
            <span className="text-red-600 font-black text-[17px] sm:text-[19px] tracking-tighter">
              {currentPrice.toLocaleString()} <span className="text-[9px]">SO'M</span>
            </span>
          </div>
          <button
            onClick={() => addToCart({ ...product, price: currentPrice, image: imageUrls[0] })}
            className="w-full mt-3 bg-slate-900 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all font-bold text-[10px] uppercase tracking-widest active:scale-95 shadow-md shadow-gray-100"
          >
            <FaShoppingCart size={12} /> SAVATGA
          </button>
        </div>
      </div>
    </div>
  );
});

// ================= CATEGORY SECTION =================
const CategorySection = React.memo(({ category, products, addToCart, getStats, favorites, toggleFavorite, onRefresh, isRefreshing, refreshSeed }) => {
  const selectedProducts = useMemo(() => {
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 8);
  }, [products, refreshSeed]);

  return (
    <div className="mb-20"> {/* Masofa biroz oshirildi */}
      <div className="flex items-center justify-between mb-5 px-1">
        <h2 className="text-lg sm:text-2xl font-black italic uppercase text-slate-900 tracking-tight border-l-4 border-red-600 pl-3">
          {category.name}
        </h2>
        <button
          onClick={() => onRefresh(category.id)}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 text-gray-400 hover:text-red-600 transition-colors group"
        >
          <FaSyncAlt className={`${isRefreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} size={12} />
          <span className="text-[9px] font-bold uppercase tracking-widest italic">Yangilash</span>
        </button>
      </div>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={12}
        slidesPerView={2}
        speed={500}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="!pb-6 custom-swiper"
      >
        {selectedProducts.map((p) => (
          <SwiperSlide key={`${refreshSeed}-${p.id}`}>
            <ProductCard
              product={p}
              {...getStats(p.id)}
              addToCart={addToCart}
              toggleFavorite={toggleFavorite}
              isFavorite={favorites?.some((f) => f.id === p.id)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* KATEGORIYA TAGIDAGI TUGMA */}
      <div className="flex justify-center mt-4">
        <Link 
          to={`/category/${category.slug}`} 
          className="group flex items-center gap-2 bg-gray-50 hover:bg-slate-900 text-slate-900 hover:text-white px-8 py-3 rounded-full border border-gray-200 transition-all duration-300 active:scale-95"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            "{category.name}" hammasini ko'rish
          </span>
          <div className="w-6 h-6 bg-white group-hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900 group-hover:text-white transform group-hover:translate-x-0.5 transition-transform">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
});

// ================= MAIN COMPONENT =================
const Products = ({ addToCart, favorites = [], toggleFavorite }) => {
  const [data, setData] = useState({ products: [], categories: [], reviews: [] });
  const [loading, setLoading] = useState(true);
  const [refreshSeeds, setRefreshSeeds] = useState({});
  const [refreshingId, setRefreshingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, c, r] = await Promise.all([
          fetch(`${API_BASE}/products`).then(res => res.json()),
          fetch(`${API_BASE}/categories`).then(res => res.json()),
          fetch(`${API_BASE}/reviews`).then(res => res.json()),
        ]);
        setData({
          products: Array.isArray(p) ? p.filter(x => x.is_active) : [],
          categories: Array.isArray(c) ? c : [],
          reviews: Array.isArray(r) ? r : []
        });
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStats = useCallback((id) => {
    const revs = data.reviews.filter(r => r.product_id === id);
    return { avg: revs.length ? (revs.reduce((a, b) => a + b.rating, 0) / revs.length).toFixed(1) : "5.0" };
  }, [data.reviews]);

  const productsByCategory = useMemo(() => {
    const flat = [];
    data.categories.forEach(c => {
      flat.push(c);
      if (c.children) c.children.forEach(ch => flat.push(ch));
    });
    return flat.map(c => ({
      ...c,
      products: data.products.filter(p => p.category_id === c.id)
    })).filter(c => c.products.length > 0);
  }, [data]);

  const handleRefresh = useCallback((id) => {
    setRefreshingId(id);
    setTimeout(() => {
      setRefreshSeeds(prev => ({ ...prev, [id]: Date.now() }));
      setRefreshingId(null);
    }, 500);
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <FaSpinner className="animate-spin text-3xl text-red-600 mb-4" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Yuklanmoqda</span>
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {productsByCategory.map((cat, idx) => (
        <CategorySection
          key={cat.id}
          category={cat}
          products={cat.products}
          addToCart={addToCart}
          getStats={getStats}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          onRefresh={handleRefresh}
          isRefreshing={refreshingId === cat.id}
          refreshSeed={refreshSeeds[cat.id] || 0}
        />
      ))}
      
      <div className="mt-12 flex flex-col items-center">
        <Link to="/all-products" className="group flex flex-col items-center active:scale-95 transition-transform">
          <Player autoplay loop src={dropDown} className="w-32 sm:w-40" />
          <span className="bg-slate-950 text-white px-12 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] -mt-5 z-20 hover:bg-red-600 transition-all shadow-2xl">
            Katalogni ko'rish
          </span>
        </Link>
      </div>
    </section>
  );
};

export default Products;