import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart, FaPercent, FaFire, FaArrowRight } from "react-icons/fa";

// Swiper CSS
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Lottie JSON (sizning faylingiz)
import dropDown from "../../assets/oG99I91tLW.json";

const API_BASE = "https://tailorback2025-production.up.railway.app/api";

/* ================= IMAGE SWIPER (Rasm Karuseli) ================= */
const ImageSwiper = ({ images = [], productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000); // Biroz sekinroq, yoqimli bo'lishi uchun
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative w-full h-40 sm:h-56 overflow-hidden rounded-2xl bg-gray-100">
      <div
        className="flex h-full transition-transform duration-700 ease-out"
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
      {/* Rasm ustidagi gradient (matn o'qilishi uchun) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

/* ================= PRODUCT CARD (Mahsulot Kartochkasi) ================= */
const ProductCard = ({
  product,
  avg,
  toggleFavorite,
  isFavorite,
  addToCart,
  showBadge = false,
}) => {
  const imageUrls = product.images?.map((img) => img.image_url) || [];
  const currentPrice = Number(product.price_uzs || product.price) || 0;
  const discount = product.discount;
  const isDiscountActive = discount && discount.is_active !== false;

  return (
    <div className="group relative h-full flex flex-col">
      {/* Glassmorphism Card Container */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-lg shadow-red-900/5 transition-all duration-300 group-hover:shadow-red-500/20 group-hover:-translate-y-1 group-hover:bg-white/80"></div>

      <div className="relative z-10 p-3 sm:p-4 flex flex-col h-full">
        {/* Rasm Qismi */}
        <div className="relative mb-3">
          <Link to={`/product/${product.id}`} className="block">
            <ImageSwiper
              images={
                imageUrls.length > 0
                  ? imageUrls
                  : ["https://geostudy.uz/img/pictures/cifvooipg_rf1.jpeg"]
              }
              productName={product.name}
            />
          </Link>

          {/* Like Tugmasi */}
          <button
            onClick={() => toggleFavorite(product)}
            className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md shadow-sm transition-transform active:scale-90 ${
              isFavorite
                ? "bg-red-500/90 text-white"
                : "bg-white/80 text-gray-400 hover:text-red-500"
            }`}
          >
            {isFavorite ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
          </button>

          {/* Badges (Chegirma/Top) */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {isDiscountActive && (
              <span className="bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                <FaPercent size={8} />
                {discount.percent ? `-${Math.round(discount.percent)}%` : "SALE"}
              </span>
            )}
            {showBadge && (
              <span className="bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                <FaFire size={8} /> HIT
              </span>
            )}
          </div>
        </div>

        {/* Matn Qismi */}
        <div className="flex flex-col flex-grow">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm sm:text-[15px] font-bold text-gray-800 leading-tight line-clamp-2 mb-1 group-hover:text-red-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Reyting */}
          <div className="flex items-center gap-1 mb-2">
            <FaStar className="text-yellow-400 text-[10px]" />
            <span className="text-xs text-gray-500 font-medium">{avg}</span>
          </div>

          <div className="mt-auto pt-2 flex items-end justify-between gap-2">
            <div className="flex flex-col">
              {isDiscountActive && (
                 <span className="text-[10px] text-gray-400 line-through decoration-red-400">
                    {Math.round(currentPrice * (1 + discount.percent / 100)).toLocaleString()}
                 </span>
              )}
              <span className="text-base sm:text-lg font-extrabold text-gray-900 leading-none">
                {currentPrice.toLocaleString()}
                <span className="text-[10px] text-red-600 ml-0.5 align-top font-bold">SO'M</span>
              </span>
            </div>

            {/* Savatga qo'shish tugmasi (Ixcham) */}
            <button
              onClick={() =>
                addToCart({
                  ...product,
                  price: currentPrice,
                  quantity: 1,
                  image: imageUrls[0],
                })
              }
              className="bg-red-600 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl shadow-lg shadow-red-200 active:scale-95 transition-all hover:bg-red-700 flex items-center justify-center"
            >
              <FaShoppingCart size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= PRODUCT SECTION (Bo'lim) ================= */
const ProductSection = ({
  title,
  products = [],
  addToCart,
  getStats,
  favorites,
  toggleFavorite,
  showBadge,
}) => {
  if (!products.length) return null;

  return (
    <div className="mb-12 sm:mb-20">
      {/* Sarlavha Dizayni */}
      <div className="flex items-center justify-between px-2 mb-6 sm:mb-8">
        <div className="relative">
          <h2 className="text-xl sm:text-3xl font-black text-gray-800 uppercase italic tracking-wide z-10 relative">
            {title}
          </h2>
          {/* Sarlavha orqasidagi qizil soya effekti */}
          <div className="absolute -bottom-2 left-0 w-1/2 h-3 bg-red-200/50 -skew-x-12 -z-0 rounded-sm"></div>
        </div>
        
        {/* "Barchasi" tugmasi mobile uchun */}
        <Link to="/all-products" className="sm:hidden text-xs font-bold text-red-600 flex items-center gap-1">
           Barchasi <FaArrowRight size={10}/>
        </Link>
      </div>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={15}
        slidesPerView={1.4} // Mobileda keyingi kartochka yarim ko'rinib turadi
        grabCursor={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        breakpoints={{
          480: { slidesPerView: 2, spaceBetween: 15 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="!pb-12 !px-2"
        style={{
             "--swiper-pagination-color": "#dc2626",
             "--swiper-pagination-bullet-inactive-color": "#999999",
             "--swiper-pagination-bullet-inactive-opacity": "0.4",
             "--swiper-pagination-bullet-size": "6px",
        }}
      >
        {products.map((p) => (
          <SwiperSlide key={p.id} className="h-auto">
            <ProductCard
              product={p}
              {...getStats(p.id)}
              addToCart={addToCart}
              toggleFavorite={toggleFavorite}
              isFavorite={favorites?.some((f) => f.id === p.id)}
              showBadge={showBadge}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
const Products = ({ addToCart, favorites = [], toggleFavorite }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, rRes] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/reviews`),
        ]);

        const pData = await pRes.json();
        const rData = await rRes.json();

        const activeOnly = Array.isArray(pData)
          ? pData.filter((p) => p.is_active !== false)
          : [];

        setAllProducts(activeOnly);
        setReviews(Array.isArray(rData) ? rData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // STATS
  const getStats = (id) => {
    const pRev = reviews.filter((r) => r.product_id === id);
    return {
      avg:
        pRev.length > 0
          ? (pRev.reduce((a, b) => a + b.rating, 0) / pRev.length).toFixed(1)
          : "5.0",
    };
  };

  // KATEGORIYALASH
  const categorized = useMemo(() => {
    return allProducts.reduce(
      (acc, p) => {
        if (p.discount?.is_active) acc.discounts.push(p);
        if (p.is_best_seller) acc.best.push(p);
        if (p.is_latest) acc.latest.push(p);
        if (p.is_popular) acc.popular.push(p);
        if (p.is_featured) acc.featured.push(p);

        if (
          !p.discount?.is_active &&
          !p.is_best_seller &&
          !p.is_latest &&
          !p.is_popular &&
          !p.is_featured
        ) {
          acc.others.push(p);
        }
        return acc;
      },
      { discounts: [], best: [], latest: [], popular: [], featured: [], others: [] }
    );
  }, [allProducts]);

  const { discounts, best, latest, popular, featured, others } = categorized;

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium animate-pulse">Yuklanmoqda...</p>
      </div>
    );

  return (
    <section className="relative min-h-screen bg-gray-50 overflow-hidden py-10">
      {/* Background Decor (Orqa fondagi bezaklar) */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-red-50/50 to-transparent pointer-events-none" />
      <div className="absolute top-20 right-0 w-64 h-64 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-2 sm:px-4">
        <ProductSection title="Katta Chegirmalar" products={discounts} addToCart={addToCart} getStats={getStats} favorites={favorites} toggleFavorite={toggleFavorite} showBadge={false} />
        <ProductSection title="Xit Savdo" products={best} addToCart={addToCart} getStats={getStats} favorites={favorites} toggleFavorite={toggleFavorite} showBadge={true} />
        <ProductSection title="Yangi Kolleksiya" products={latest} addToCart={addToCart} getStats={getStats} favorites={favorites} toggleFavorite={toggleFavorite} showBadge={false} />
        <ProductSection title="Trenddagi" products={popular} addToCart={addToCart} getStats={getStats} favorites={favorites} toggleFavorite={toggleFavorite} showBadge={true} />
        <ProductSection title="Maxsus Taklif" products={featured} addToCart={addToCart} getStats={getStats} favorites={favorites} toggleFavorite={toggleFavorite} showBadge={false} />
        <ProductSection title="Barchasi" products={others} addToCart={addToCart} getStats={getStats} favorites={favorites} toggleFavorite={toggleFavorite} showBadge={false} />

        {/* CATALOG LINK */}
        <div className="mt-24 pb-10 flex flex-col items-center relative z-10">
          <Link
            to="/all-products"
            className="group relative flex flex-col items-center transition-transform active:scale-95"
          >
            <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full scale-50 group-hover:scale-100 transition-all duration-500"></div>
            <Player autoplay loop src={dropDown} className="w-28 sm:w-40 relative z-10 drop-shadow-xl" />
            <span className="relative z-10 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-3.5 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 -mt-6 border border-slate-700/50 group-hover:from-red-600 group-hover:to-red-500 group-hover:shadow-red-500/30 transition-all duration-300">
              Katalogga o'tish
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products;