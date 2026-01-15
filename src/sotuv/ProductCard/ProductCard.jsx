import { Player } from "@lottiefiles/react-lottie-player";
import React, { useState, useEffect } from "react";
import { FaStar, FaShoppingCart, FaHeart, FaChevronDown, FaPercent, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import dropDown from "../../assets/oG99I91tLW.json";

// Image Swiper Komponenti
const ImageSwiper = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-t-xl">
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <img key={idx} src={img} alt="Product" className="w-full h-full object-cover flex-shrink-0" />
        ))}
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, idx) => (
            <div key={idx} className={`h-1 rounded-full transition-all ${idx === currentIndex ? "w-4 bg-red-500" : "w-1.5 bg-white/60"}`} />
          ))}
        </div>
      )}
    </div>
  );
};

// Yagona Mahsulot Kartochkasi
const ProductCard = ({ product, avg, toggleFavorite, isFavorite, addToCart }) => {
  const imageUrls = product.images?.map(img => img.image_url) || [];
  const discount = product.discount;
  const isDiscountActive = discount && discount.is_active !== false && (discount.percent || discount.amount);

  let currentPrice = Number(product.price);
  if (isDiscountActive) {
    if (discount.percent) {
      currentPrice = currentPrice * (1 - Number(discount.percent) / 100);
    } else if (discount.amount) {
      currentPrice = Math.max(0, currentPrice - Number(discount.amount));
    }
  }

  return (
    <div className="group bg-white rounded-2xl border border-red-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col relative overflow-hidden">
      <div className="h-40 sm:h-60 lg:h-72 relative block">
        <Link to={`/product/${product.id}`} className="w-full h-full block">
          <ImageSwiper images={imageUrls.length > 0 ? imageUrls : ["https://geostudy.uz/img/pictures/cifvooipg_rf1.jpeg"]} />
        </Link>

        {/* Yurakcha (Favorite) tugmasi - REAL TIME ISHLAYDI */}
        <button
          onClick={() => toggleFavorite(product)}
          className={`absolute top-3 right-3 p-2 backdrop-blur-sm rounded-full z-10 shadow-sm transition-all hover:scale-110 ${
            isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-red-400"
          }`}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>

        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {isDiscountActive && (
            <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm animate-pulse flex items-center gap-1">
              <FaPercent size={7} />
              {discount.percent ? `${Math.round(discount.percent)}%` : `-${Number(discount.amount).toLocaleString()} so'm`}
            </span>
          )}
        </div>
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
            <span className="text-red-600 font-black text-base sm:text-xl">{currentPrice.toLocaleString()} so'm</span>
            {isDiscountActive && (
              <span className="text-slate-600 text-[10px] line-through decoration-slate-400">{Number(product.price).toLocaleString()} so'm</span>
            )}
          </div>
          <button
            onClick={() => addToCart({ ...product, price: currentPrice, quantity: 1, image: imageUrls[0] })}
            className="w-full bg-red-900 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all font-black text-[10px] tracking-widest uppercase shadow-md active:scale-95"
          >
            <FaShoppingCart /> SAVATGA
          </button>
        </div>
      </div>
    </div>
  );
};

// Bo'lim Komponenti
const ProductSection = ({ title, products, addToCart, getStats, favorites, toggleFavorite, initialCount = 4, accentColor = "bg-red-600" }) => {
  const [showAll, setShowAll] = useState(false);
  if (products.length === 0) return null;
  const visibleProducts = showAll ? products : products.slice(0, initialCount);

  return (
    <div className="mb-24">
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-2xl sm:text-4xl font-black text-red-900 italic uppercase tracking-tighter text-center">{title}</h2>
        <div className={`h-1.5 w-24 ${accentColor} rounded-full mt-2`}></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
        {visibleProducts.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            {...getStats(p.id)}
            addToCart={addToCart}
            toggleFavorite={toggleFavorite}
            isFavorite={favorites.some(fav => fav.id === p.id)}
          />
        ))}
      </div>

      {products.length > initialCount && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-3 px-8 py-3 rounded-full border-2 border-red-900 font-bold text-xs sm:text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:bg-red-900 hover:text-white shadow-lg active:scale-95"
          >
            {showAll ? "Yopish" : `Barcha ${title.toLowerCase()}ni ko'rish `}
            <FaChevronDown className={`transition-transform duration-500 ${showAll ? "rotate-180" : ""}`} />
          </button>
        </div>
      )}
    </div>
  );
};

// ASOSIY KOMPONENT: Favorites va toggleFavorite endi PROPS orqali keladi
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
        setAllProducts(await pRes.json());
        setReviews(await rRes.json());
      } catch (e) { 
        console.error("Ma'lumot yuklashda xato:", e); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  const getStats = (id) => {
    const pRev = reviews.filter(r => r.product_id === id);
    return { 
      count: pRev.length, 
      avg: pRev.length > 0 ? (pRev.reduce((a, b) => a + b.rating, 0) / pRev.length).toFixed(1) : "5.0" 
    };
  };

  // Guruhlarga ajratish
  const latest = allProducts.filter(p => p.is_latest);
  const popular = allProducts.filter(p => p.is_popular);
  const featured = allProducts.filter(p => p.is_featured);
  const bestSeller = allProducts.filter(p => p.is_best_seller);
  const discounts = allProducts.filter(p =>
    p.discount && p.discount.is_active !== false && (p.discount.percent || p.discount.amount)
  );
  const regular = allProducts.filter(p =>
    !p.is_latest && !p.is_popular && !p.is_featured && !p.is_best_seller &&
    !(p.discount && p.discount.is_active !== false && (p.discount.percent || p.discount.amount))
  );

  if (loading) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-black italic text-red-400 tracking-widest uppercase">YUKLANMOQDA...</p>
    </div>
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {[
        { title: "Chegirmalar", data: discounts, color: "bg-red-600" },
        { title: "Yangi kelganlar", data: latest, color: "bg-blue-500" },
        { title: "Trenddagi mahsulotlar", data: popular, color: "bg-orange-500" },
        { title: "Afzalikli mahsulotlar", data: featured, color: "bg-purple-500" },
        { title: "Eng ko'p sotilganlar", data: bestSeller, color: "bg-green-600" },
        { title: "Barcha mahsulotlar", data: regular, color: "bg-red-800", count: 8 },
      ].map((sec, idx) => (
        <ProductSection
          key={idx}
          title={sec.title}
          products={sec.data}
          addToCart={addToCart}
          getStats={getStats}
          favorites={favorites} // App.js dan kelgan prop
          toggleFavorite={toggleFavorite} // App.js dan kelgan prop
          accentColor={sec.color}
          initialCount={sec.count}
        />
      ))}

      <div className="mt-20 flex flex-col items-center">
        <Link to="/all-products" className="group">
          <Player autoplay loop src={dropDown} className="w-32 sm:w-44 transition-transform group-hover:scale-110" />
          <p className="text-center text-red-400 font-black uppercase tracking-widest text-xs -mt-5">Barchasini ko'rish</p>
        </Link>
      </div>
    </section>
  );
};

export default Products;