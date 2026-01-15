import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { FaPercent } from "react-icons/fa6";

import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";

const LottiePlayer = lazy(() =>
  import("@lottiefiles/react-lottie-player").then(m => ({ default: m.Player }))
);

import dropDown from "../../assets/oG99I91tLW.json";

// Image Swiper Komponenti
const ImageSwiper = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-t-xl">
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <img key={idx} src={img} alt="Product" className="w-full h-full object-cover flex-shrink-0" loading={idx === 0 ? "eager" : "lazy"} />
        ))}
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, idx) => (
            <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? "w-4 bg-red-500" : "w-1.5 bg-white/60"}`} />
          ))}
        </div>
      )}
    </div>
  );
};

// Chegirmani tekshirish funksiyasi
const isDiscountValid = (discount) => {
  if (!discount || discount.is_active === false) return false;
  if (discount.valid_until) {
    const now = new Date();
    const expiry = new Date(discount.valid_until);
    if (expiry < now) return false;
  }
  return discount.percent || discount.amount;
};

const Products = ({ addToCart, favorites = [], toggleFavorite }) => {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          fetch("https://tailorback2025-production.up.railway.app/api/products"),
          fetch("https://tailorback2025-production.up.railway.app/api/reviews")
        ]);
        if (!prodRes.ok || !revRes.ok) throw new Error("Ma'lumot xatosi");
        
        const prodData = await prodRes.json();
        // Faqat yangi mahsulotlarni filtrlaymiz
        const latestOnly = prodData.filter(product => product.is_latest === true);
        setProducts(latestOnly.slice(0, 8)); // 8 tagacha ko'rsatish
        setReviews(await revRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getProductStats = (productId) => {
    const pRev = reviews.filter(r => r.product_id === productId);
    const count = pRev.length;
    const avg = count > 0 ? (pRev.reduce((acc, r) => acc + r.rating, 0) / count).toFixed(1) : "5.0";
    return { count, avg };
  };

  if (loading) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-black italic text-red-400 tracking-widest uppercase">Yuklanmoqda...</p>
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black text-red-900 italic uppercase tracking-tighter">Yangi Kelganlar</h2>
          <div className="h-1.5 w-20 bg-red-600 rounded-full mt-2"></div>
        </div>
        <Link to="/cart" className="text-red-600 font-bold hover:underline flex items-center gap-2 text-sm sm:text-base">
          Savatga o'tish <FaCartShopping />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
        {products.map((product) => {
          const imageUrls = product.images?.map(img => img.image_url) || [];
          const { avg } = getProductStats(product.id);
          const isFavorite = favorites.some(fav => fav.id === product.id);
          const discount = product.discount;
          const hasDiscount = isDiscountValid(discount);

          let currentPrice = parseFloat(product.price);
          if (hasDiscount) {
            if (discount.percent) {
              currentPrice = currentPrice * (1 - parseFloat(discount.percent) / 100);
            } else if (discount.amount) {
              currentPrice = Math.max(0, currentPrice - parseFloat(discount.amount));
            }
          }

          return (
            <div key={product.id} className="group bg-white rounded-2xl border border-red-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col relative overflow-hidden">
              <div className="h-40 sm:h-60 lg:h-72 relative">
                <Link to={`/product/${product.id}`} className="w-full h-full block">
                  <ImageSwiper images={imageUrls.length > 0 ? imageUrls : ["https://geostudy.uz/img/pictures/cifvooipg_rf1.jpeg"]} />
                </Link>

                {/* Sevimli (Like) tugmasi - REAL TIME */}
                <button
                aria-label={isFavorite ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo‘shish"}
  title={isFavorite ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo‘shish"}
                  onClick={() => toggleFavorite(product)}
                  className={`absolute top-3 right-3 p-2 backdrop-blur-sm rounded-full z-10 shadow-md transition-all active:scale-90 hover:scale-110 ${
                    isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-red-400"
                  }`}
                >
                  {isFavorite ? <FaHeart /> : <FaRegHeart />}
                </button>

                {hasDiscount && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm flex items-center gap-1 animate-pulse">
                      <FaPercent size={7} />
                      {discount.percent ? `${Math.round(discount.percent)}%` : `-${Number(discount.amount).toLocaleString()}`}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3 sm:p-5 flex flex-col flex-grow">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-sm sm:text-lg font-bold text-red-800 line-clamp-1 hover:text-red-600 transition uppercase italic">{product.name}</h3>
                </Link>
                
                <div className="flex items-center gap-1 my-2">
                  <div className="flex text-yellow-400 text-[10px] sm:text-xs">
                    {[...Array(5)].map((_, i) => <FaStar key={i} className={i < Math.round(avg) ? "text-yellow-400" : "text-red-200"} />)}
                  </div>
                  <span className="text-red-700 text-[10px] font-bold">({avg})</span>
                </div>

                <div className="mt-auto">
                  <div className="flex flex-col mb-4">
                    <span className="text-red-600 font-black text-base sm:text-xl">
                      {currentPrice.toLocaleString()} so'm
                    </span>
                    {hasDiscount && (
                      <span className="text-slate-600 text-[10px] line-through decoration-slate-400">
                        {parseFloat(product.price).toLocaleString()} so'm
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart({
                      ...product,
                      price: currentPrice,
                      image: imageUrls[0],
                      quantity: 1
                    })}
                    className="w-full bg-red-900 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 active:scale-95 transition-all font-black text-[10px] uppercase tracking-widest shadow-md"
                  >
                    <FaCartShopping /> SAVATGA
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-20 flex flex-col items-center">
        <Link to="/" className="group">
          <Suspense fallback={null}>
  <LottiePlayer
    autoplay
    loop
    src={dropDown}
    className="w-32 sm:w-44 transition-transform group-hover:scale-110"
  />
</Suspense>

          <p className="text-center text-red-700 font-black uppercase tracking-widest text-xs -mt-5">Barchasini ko'rish</p>
        </Link>
      </div>
    </section>
  );
};

export default Products;