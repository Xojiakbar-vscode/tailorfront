import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { FaStar, FaShoppingCart, FaHeart, FaPercent, FaRegHeart } from "react-icons/fa";

// Swiper stillari
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import dropDown from "../../assets/oG99I91tLW.json";

// --- 1. IMAGE SWIPER (Mahsulot ichidagi rasmlar aylanishi) ---
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

// --- 2. YAGONA MAHSULOT KARTASI ---
const ProductCard = ({ product, avg, toggleFavorite, isFavorite, addToCart }) => {
  const imageUrls = product.images?.map(img => img.image_url) || [];
  
  // Narxni price_uzs dan olish (JSON dagi price_uzs ishlatiladi)
  const currentPrice = Number(product.price_uzs) || 0;
  const discount = product.discount;
  const isDiscountActive = discount && discount.is_active !== false;

  return (
    <div className="group bg-white rounded-2xl border border-red-50 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col relative overflow-hidden h-full mb-12">
      <div className="h-48 sm:h-64 relative block">
        <Link to={`/product/${product.id}`} className="w-full h-full block">
          <ImageSwiper images={imageUrls.length > 0 ? imageUrls : ["https://geostudy.uz/img/pictures/cifvooipg_rf1.jpeg"]} productName={product.name}/>
        </Link>
        
        <button
          onClick={() => toggleFavorite(product)}
          className={`absolute top-3 right-3 p-2.5 backdrop-blur-md rounded-full z-10 shadow-sm transition-all active:scale-90 ${
            isFavorite ? "bg-red-500 text-white" : "bg-white/90 text-red-400"
          }`}
        >
          {isFavorite ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
        </button>

        {isDiscountActive && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
              <FaPercent size={8} /> {discount.percent ? `${Math.round(discount.percent)}%` : 'SALE'}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm sm:text-base font-bold text-slate-800 line-clamp-1 hover:text-red-600 uppercase italic transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 my-2">
          <div className="flex text-yellow-400 text-[10px]">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.round(avg) ? "text-yellow-400" : "text-gray-200"} />
            ))}
          </div>
          <span className="text-gray-400 text-[10px] font-bold">({avg})</span>
        </div>

        <div className="mt-auto">
          <div className="flex flex-col mb-4">
            <span className="text-red-600 font-black text-lg">
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
            className="w-full bg-slate-900 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all font-black text-[10px] uppercase tracking-widest active:scale-95"
          >
            <FaShoppingCart size={14} /> SAVATGA
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 3. SWIPER BO'LIMI (ProductSection) ---
const ProductSection = ({ title, products = [], addToCart, getStats, favorites, toggleFavorite, accentColor }) => {
  // Xatolikni oldini olish uchun (undefined tekshiruvi)
  if (!products || products.length === 0) return null;

  return (
    <div className="mb-20">
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 italic uppercase tracking-tighter">{title}</h2>
          <div className={`h-1.5 w-16 ${accentColor} rounded-full mt-2`}></div>
        </div>
      </div>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={15}
        slidesPerView={2}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
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
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// --- 4. ASOSIY KOMPONENT (Products) ---
const Products = ({ addToCart, favorites = [], toggleFavorite }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, rRes] = await Promise.all([
          fetch("https://tailorback2025-production.up.railway.app/api/products"),
          fetch("https://tailorback2025-production.up.railway.app/api/reviews")
        ]);
        
        const pData = await pRes.json();
        
        // 1. FAQAT ACTIVE TRUE BO'LGANLARNI FILTRLASH
        const activeOnly = Array.isArray(pData) ? pData.filter(item => item.is_active === true) : [];
        
        setAllProducts(activeOnly);
        setReviews(await rRes.json());
      } catch (e) {
        console.error("Ma'lumotlarni yuklashda xatolik:", e);
      } finally {
        setLoading(false);
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

  // Kategoriyalarga ajratish
  const latest = allProducts.filter(p => p.is_latest);
  const popular = allProducts.filter(p => p.is_popular);
  const discounts = allProducts.filter(p => p.discount?.is_active);
  const bestSeller = allProducts.filter(p => p.is_best_seller);

  if (loading) return (
    <div className="py-24 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-black text-red-600 uppercase tracking-widest animate-pulse italic">Yuklanmoqda...</p>
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 overflow-hidden bg-white">
      {/* Bo'limlarni chiqarish */}
      <ProductSection 
        title="Chegirmalar" 
        products={discounts} 
        accentColor="bg-red-600"
        {...{addToCart, getStats, favorites, toggleFavorite}}
      />

      <ProductSection 
        title="Yangi kelganlar" 
        products={latest} 
        accentColor="bg-blue-600"
        {...{addToCart, getStats, favorites, toggleFavorite}}
      />

      <ProductSection 
        title="Eng ko'p sotilgan" 
        products={bestSeller} 
        accentColor="bg-green-600"
        {...{addToCart, getStats, favorites, toggleFavorite}}
      />

      <ProductSection 
        title="Trenddagilar" 
        products={popular} 
        accentColor="bg-orange-500"
        {...{addToCart, getStats, favorites, toggleFavorite}}
      />

      {/* Footer Animation */}
      <div className="mt-12 flex flex-col items-center">
        <Link to="/all-products" className="group relative flex flex-col items-center">
          <Player 
            autoplay 
            loop 
            src={dropDown} 
            className="w-32 sm:w-40 transition-transform group-hover:scale-110" 
          />
          <span className="bg-red-900 text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl -mt-6 z-10 transition-all group-hover:bg-red-600">
            Barcha mahsulotlar
          </span>
        </Link>
      </div>
    </section>
  );
};

export default Products;