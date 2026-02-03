import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { FaStar, FaShoppingCart, FaHeart, FaPercent, FaRegHeart, FaFire } from "react-icons/fa";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import dropDown from "../../assets/oG99I91tLW.json";

const API_BASE = "https://tailorback2025-production.up.railway.app/api";

/* ================= IMAGE SWIPER ================= */

const ImageSwiper = ({ images = [], productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev =>
        prev === images.length - 1 ? 0 : prev + 1
      );
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

/* ================= PRODUCT CARD ================= */

const ProductCard = ({
  product,
  avg,
  toggleFavorite,
  isFavorite,
  addToCart,
  showBadge = false
}) => {
  const imageUrls = product.images?.map(img => img.image_url) || [];

  const currentPrice =
    Number(product.price_uzs || product.price) || 0;

  const discount = product.discount;
  const isDiscountActive = discount && discount.is_active !== false;

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col relative overflow-hidden h-full mb-12">
      <div className="h-48 sm:h-64 relative block">
        <Link to={`/product/${product.id}`} className="w-full h-full block">
          <ImageSwiper
            images={
              imageUrls.length > 0
                ? imageUrls
                : ["https://geostudy.uz/img/pictures/cifvooipg_rf1.jpeg"]
            }
            productName={product.name}
          />
        </Link>

        {/* FAVORITE */}
        <button
          onClick={() => toggleFavorite(product)}
          className={`absolute top-3 right-3 p-3 backdrop-blur-md rounded-2xl z-10 shadow-lg transition-all active:scale-75 ${
            isFavorite
              ? "bg-red-500 text-white"
              : "bg-white/90 text-red-400 hover:bg-red-50"
          }`}
        >
          {isFavorite ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
        </button>

        {/* BADGES */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isDiscountActive && (
            <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-xl animate-pulse">
              <FaPercent size={8} />
              {discount.percent
                ? `${Math.round(discount.percent)}%`
                : "SALE"}
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
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">
          Tailor Premium
        </span>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm sm:text-base font-black text-slate-800 line-clamp-2 hover:text-red-600 uppercase italic transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* RATING */}
        <div className="flex items-center gap-1 my-3">
          <div className="flex text-yellow-400 text-[10px]">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < Math.round(avg)
                    ? "text-yellow-400"
                    : "text-gray-200"
                }
              />
            ))}
          </div>
          <span className="text-gray-400 text-[10px] font-black tracking-tighter">
            ({avg})
          </span>
        </div>

        <div className="mt-auto">
          <span className="text-red-600 font-black text-xl tracking-tighter">
            {currentPrice.toLocaleString()}{" "}
            <span className="text-[10px]">SO'M</span>
          </span>

          <button
            onClick={() =>
              addToCart({
                ...product,
                price: currentPrice,
                quantity: 1,
                image: imageUrls[0]
              })
            }
            className="w-full mt-4 bg-slate-950 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-xl shadow-slate-200"
          >
            <FaShoppingCart size={14} /> SAVATGA
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= PRODUCT SECTION ================= */

const ProductSection = ({
  title,
  products = [],
  addToCart,
  getStats,
  favorites,
  toggleFavorite,
  accentColor,
  showBadge
}) => {
  if (!products.length) return null;

  return (
    <div className="mb-20">
      <h2 className="text-2xl sm:text-4xl font-black italic uppercase">
        {title}
      </h2>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={20}
        slidesPerView={2}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 }
        }}
        className="!pb-14"
      >
        {products.map(p => (
          <SwiperSlide key={p.id}>
            <ProductCard
              product={p}
              {...getStats(p.id)}
              addToCart={addToCart}
              toggleFavorite={toggleFavorite}
              isFavorite={favorites?.some(f => f.id === p.id)}
              showBadge={showBadge}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

/* ================= MAIN ================= */

const Products = ({ addToCart, favorites = [], toggleFavorite }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  /* FETCH */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, rRes] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/reviews`)
        ]);

        const pData = await pRes.json();
        const rData = await rRes.json();

        const activeOnly = Array.isArray(pData)
          ? pData.filter(p => p.is_active !== false)
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

  /* STATS */
  const getStats = id => {
    const pRev = reviews.filter(r => r.product_id === id);

    return {
      avg:
        pRev.length > 0
          ? (
              pRev.reduce((a, b) => a + b.rating, 0) /
              pRev.length
            ).toFixed(1)
          : "5.0"
    };
  };

  /* 🔥 ONE LOOP CATEGORIZATION */
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
      {
        discounts: [],
        best: [],
        latest: [],
        popular: [],
        featured: [],
        others: []
      }
    );
  }, [allProducts]);

  const { discounts, best, latest, popular, featured, others } = categorized;

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <ProductSection title="Katta chegirmalar" products={discounts} {...{addToCart,getStats,favorites,toggleFavorite}} />
      <ProductSection title="Eng kop sotilganlar" products={best} {...{addToCart,getStats,favorites,toggleFavorite}} />
      <ProductSection title="Yangi kelganlar" products={latest} {...{addToCart,getStats,favorites,toggleFavorite}} />
      <ProductSection title="Trenddagilar" products={popular} {...{addToCart,getStats,favorites,toggleFavorite}} />
      <ProductSection title="Tanlanganlar" products={featured} {...{addToCart,getStats,favorites,toggleFavorite}} />
      <ProductSection title="Boshqa mahsulotlar" products={others} {...{addToCart,getStats,favorites,toggleFavorite}} />


      <div className="mt-16 flex flex-col items-center"> <Link to="/all-products" className="group relative flex flex-col items-center transition-transform active:scale-95"> <Player autoplay loop src={dropDown} className="w-36 sm:w-44" /> <span className="bg-slate-950 text-white px-10 py-4 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl -mt-8 z-10 transition-all group-hover:bg-red-600 group-hover:shadow-red-200"> Katalogga o'tish </span> </Link> </div>
    </section>
  );
};

export default Products;
