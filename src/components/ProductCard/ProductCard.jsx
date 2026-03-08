import React, { useState, useEffect } from "react";
import { FaStar, FaCartShopping, FaHeart, FaRegHeart, FaPercent } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";

const LottiePlayer = lazy(() =>
  import("@lottiefiles/react-lottie-player").then(m => ({ default: m.Player }))
);

import dropDown from "../../assets/oG99I91tLW.json";

const FALLBACK_IMAGE = "https://geostudy.uz/img/pictures/cifvooipg_rf1.jpeg";

// Image Swiper Komponenti
const ImageSwiper = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

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
            alt={`${productName}`} 
            className="w-full h-full object-cover flex-shrink-0" 
            loading={idx === 0 ? "eager" : "lazy"} 
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          />
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

const Products = ({ addToCart, favorites = [], toggleFavorite }) => {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          fetch("https://tailorback2025-production.up.railway.app/api/products"),
          fetch("https://tailorback2025-production.up.railway.app/api/reviews")
        ]);
        const prodData = await prodRes.json();
        const revData = await revRes.json();

        // Faqat aktiv va eng yangi 8 ta mahsulot
        const filtered = prodData.filter(p => p.is_active === true && p.is_latest === true);
        setProducts(filtered.slice(0, 8));
        setReviews(revData);
      } catch (err) {
        console.error("Xatolik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Chegirmali narxni hisoblash funksiyasi
  const calculateFinalPrice = (product) => {
    let price = Number(product.price_uzs || 0);
    const discount = product.discount;
    if (discount && discount.is_active !== false) {
      if (discount.percent) {
        price = price * (1 - Number(discount.percent) / 100);
      } else if (discount.amount) {
        price = Math.max(0, price - Number(discount.amount));
      }
    }
    return price;
  };

  const getProductStats = (productId) => {
    const pRev = reviews.filter(r => r.product_id === productId);
    const avg = pRev.length > 0 ? (pRev.reduce((acc, r) => acc + r.rating, 0) / pRev.length).toFixed(1) : "5.0";
    return { avg };
  };

  const formatPrice = (price) => Number(price).toLocaleString('uz-UZ') + " SO'M";

  if (loading) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-black italic text-red-400 tracking-widest uppercase animate-pulse">Yuklanmoqda...</p>
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 italic uppercase tracking-tighter">Yangi Kelganlar</h2>
          <div className="h-1.5 w-20 bg-red-600 rounded-full mt-2"></div>
        </div>
        <Link to="/all-products" className="text-red-600 font-black italic uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors flex items-center gap-2">
          Barchasini ko'rish <FaCartShopping />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
        {products.map((product) => {
          const imageUrls = product.images?.map(img => img.image_url) || [];
          const mainImage = imageUrls[0] || FALLBACK_IMAGE;
          const { avg } = getProductStats(product.id);
          const isFavorite = favorites.some(fav => fav.id === product.id);
          
          const originalPrice = Number(product.price_uzs || 0);
          const finalPrice = calculateFinalPrice(product);
          const hasDiscount = finalPrice < originalPrice;

          return (
            <div key={product.id} className="group bg-white rounded-[2rem] border border-transparent hover:border-red-50 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col relative overflow-hidden animate-fadeIn">
              
              {/* Image Section */}
              <div className="h-48 sm:h-72 lg:h-80 relative">
                <Link to={`/product/${product.id}`} className="w-full h-full block">
                  <ImageSwiper images={imageUrls.length > 0 ? imageUrls : [FALLBACK_IMAGE]} productName={product.name}/>
                </Link>

                <button
                  onClick={() => toggleFavorite(product)}
                  className={`absolute top-4 right-4 w-10 h-10 backdrop-blur-md rounded-2xl z-10 shadow-lg transition-all active:scale-75 flex items-center justify-center ${
                    isFavorite ? "bg-red-600 text-white" : "bg-white/90 text-red-400"
                  }`}
                >
                  {isFavorite ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
                </button>

                {hasDiscount && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1 animate-pulse">
                      <FaPercent size={8} />
                      {product.discount?.percent ? `${Math.round(product.discount.percent)}%` : 'SALE'}
                    </span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 line-clamp-2 hover:text-red-600 transition uppercase italic leading-tight min-h-[40px]">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center gap-1.5 my-3">
                  <div className="flex text-yellow-400 text-[10px]">
                    {[...Array(5)].map((_, i) => <FaStar key={i} className={i < Math.round(avg) ? "fill-current" : "text-gray-200"} />)}
                  </div>
                  <span className="text-gray-300 text-[9px] font-black italic tracking-widest uppercase">({avg} Rating)</span>
                </div>

                <div className="mt-auto">
                  <div className="flex flex-col mb-5">
                    <span className="text-red-600 font-black text-lg sm:text-2xl tracking-tighter leading-none">
                      {formatPrice(finalPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-[11px] text-gray-400 line-through font-bold mt-1">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart({
                      ...product,
                      price: finalPrice, // Savatga chegirmali narx ketadi
                      image: mainImage,
                      quantity: 1
                    })}
                    className="w-full bg-slate-950 text-white py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-600 active:scale-95 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-100 group/btn"
                  >
                    <FaCartShopping className="group-hover/btn:animate-bounce" /> 
                    Savatga qo'shish
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 flex flex-col items-center">
        <Link to="/all-products" className="group flex flex-col items-center">
          <Suspense fallback={<div className="h-32 w-32 bg-gray-50 rounded-full animate-pulse" />}>
            <LottiePlayer autoplay loop src={dropDown} className="w-32 sm:w-44 transition-transform group-hover:scale-110" />
          </Suspense>
          <p className="text-center text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] italic -mt-5 group-hover:text-red-600 transition-colors">
            Katalogga o'tish
          </p>
        </Link>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
      `}</style>
    </section>
  );
};

export default Products;