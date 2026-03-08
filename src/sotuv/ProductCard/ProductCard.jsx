import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { 
  FaStar, FaShoppingCart, FaHeart, FaPercent, FaRegHeart, 
  FaFire, FaBolt, FaClock, FaGift, FaTruck, FaShieldAlt,
  FaChevronLeft, FaChevronRight, FaSpinner
} from "react-icons/fa";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import dropDown from "../../assets/oG99I91tLW.json";

const API_BASE = "https://tailorback2025-production.up.railway.app/api";
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const PLACEHOLDER_IMAGE = "https://geostudy.uz/img/pictures/cifvooipg_rf1.jpeg";

// Cache for API responses
const cache = new Map();

/* ================= UTILITY FUNCTIONS ================= */
const formatPrice = (price) => {
  const num = Number(price) || 0;
  return num.toLocaleString('uz-UZ') + " SO'M";
};

const calculateFinalPrice = (product) => {
  let price = Number(product.price_uzs || product.price || 0);
  const discount = product.discount;
  
  if (discount && discount.is_active !== false) {
    if (discount.percent) {
      price = price * (1 - Math.min(Number(discount.percent), 100) / 100);
    } else if (discount.amount) {
      price = Math.max(0, price - Number(discount.amount));
    }
  }
  
  return Math.round(price);
};

const getDiscountPercentage = (product) => {
  const originalPrice = Number(product.price_uzs || product.price || 0);
  const finalPrice = calculateFinalPrice(product);
  
  if (originalPrice > 0 && finalPrice < originalPrice) {
    return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
  }
  
  return product.discount?.percent || 0;
};

/* ================= LAZY IMAGE COMPONENT ================= */
const LazyImage = React.memo(({ src, alt, className, onError }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = src;
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: "50px", threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  const handleError = (e) => {
    setError(true);
    e.target.src = PLACEHOLDER_IMAGE;
    onError?.();
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E"
        data-src={src}
        alt={alt}
        className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

/* ================= IMAGE SWIPER ================= */
const ImageSwiper = React.memo(({ images = [], productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [images.length, isHovered]);

  const handlePrev = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  if (!images.length) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <LazyImage 
          src={PLACEHOLDER_IMAGE} 
          alt={productName} 
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-gray-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0">
            <LazyImage
              src={img}
              alt={`${productName} - ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white z-10"
            aria-label="Oldingi rasm"
          >
            <FaChevronLeft size={12} className="text-gray-800" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white z-10"
            aria-label="Keyingi rasm"
          >
            <FaChevronRight size={12} className="text-gray-800" />
          </button>
          
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'bg-red-600 w-4' 
                    : 'bg-white/80 hover:bg-white'
                }`}
                aria-label={`Rasm ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
});

ImageSwiper.displayName = 'ImageSwiper';

/* ================= COUNTDOWN TIMER ================= */
const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(expiryDate) - new Date();
      
      if (difference <= 0) {
        return { expired: true };
      }

      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  if (timeLeft.expired) return null;

  return (
    <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded-lg text-[8px] font-bold">
      <FaClock size={8} />
      <span>{String(timeLeft.hours).padStart(2, '0')}:</span>
      <span>{String(timeLeft.minutes).padStart(2, '0')}:</span>
      <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
    </div>
  );
};

/* ================= PRODUCT CARD ================= */
const ProductCard = React.memo(({
  product,
  avg,
  toggleFavorite,
  isFavorite,
  addToCart,
  showBadge = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const imageUrls = useMemo(() => 
    product.images?.map(img => img.image_url).filter(Boolean) || [],
    [product.images]
  );

  const originalPrice = useMemo(() => 
    Number(product.price_uzs || product.price || 0),
    [product]
  );

  const finalPrice = useMemo(() => 
    calculateFinalPrice(product),
    [product]
  );

  const discount = product.discount;
  const isDiscountActive = useMemo(() => 
    discount && discount.is_active !== false && finalPrice < originalPrice,
    [discount, finalPrice, originalPrice]
  );

  const discountPercentage = useMemo(() => 
    getDiscountPercentage(product),
    [product]
  );

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      originalPrice,
      image: imageUrls[0] || PLACEHOLDER_IMAGE,
      quantity: 1,
      discount: isDiscountActive ? discountPercentage : null
    });
  }, [product, finalPrice, originalPrice, imageUrls, isDiscountActive, discountPercentage, addToCart]);

  const handleToggleFavorite = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  }, [product, toggleFavorite]);

  return (
    <div 
      className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col relative overflow-hidden h-full animate-fadeIn"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="relative block h-48 sm:h-64 overflow-hidden bg-gray-50">
        <ImageSwiper
          images={imageUrls}
          productName={product.name}
        />

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 p-3 backdrop-blur-md rounded-xl z-20 shadow-lg transition-all active:scale-75 ${
            isFavorite
              ? "bg-red-500 text-white"
              : "bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white"
          }`}
          aria-label={isFavorite ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
        >
          {isFavorite ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {isDiscountActive && (
            <span className="bg-gradient-to-r from-red-600 to-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg animate-pulse">
              <FaPercent size={8} />
              -{discountPercentage}%
            </span>
          )}

          {showBadge && (
            <span className="bg-gradient-to-r from-orange-500 to-orange-400 text-white text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
              <FaFire size={8} /> TOP
            </span>
          )}

          {product.is_latest && (
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
              <FaBolt size={8} /> YANGI
            </span>
          )}

          {product.discount?.expiry_date && (
            <CountdownTimer expiryDate={product.discount.expiry_date} />
          )}
        </div>

        {/* Quick View on Hover */}
        {isHovered && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 z-10 animate-fadeIn">
            <span className="text-white text-[9px] font-bold uppercase tracking-wider">
              Tezkor ko'rish
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
    

        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-bold text-slate-800 line-clamp-2 hover:text-red-600 transition-colors leading-tight mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {avg && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-[10px]">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.round(avg) ? "text-yellow-400" : "text-gray-200"}
                />
              ))}
            </div>
            <span className="text-gray-400 text-[9px] font-medium">({avg})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-red-600 font-black text-xl tracking-tight">
              {formatPrice(finalPrice)}
            </span>
            {isDiscountActive && (
              <span className="text-gray-400 text-xs line-through font-medium">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full mt-3 bg-slate-900 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all duration-300 font-bold text-[9px] uppercase tracking-wider active:scale-95 shadow-lg hover:shadow-red-600/30 group/btn"
          >
            <FaShoppingCart size={12} className="group-hover/btn:animate-bounce" />
            Savatga qo'shish
          </button>

          {/* Delivery Info */}
    
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

/* ================= PRODUCT SECTION ================= */
const ProductSection = React.memo(({
  title,
  icon,
  products = [],
  addToCart,
  getStats,
  favorites,
  toggleFavorite,
  accentColor = "red",
  showBadge = false,
  viewAllLink
}) => {
  if (!products.length) return null;

  const swiperRef = useRef(null);

  return (
    <div className="mb-16 last:mb-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`w-8 h-8 rounded-xl bg-${accentColor}-100 flex items-center justify-center`}>
              {icon}
            </div>
          )}
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
            {title}
          </h2>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
            {products.length}
          </span>
        </div>

        {viewAllLink && (
          <Link 
            to={viewAllLink}
            className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1"
          >
            Barchasi <FaChevronRight size={8} />
          </Link>
        )}
      </div>

      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={16}
        slidesPerView={2}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-gray-300 !opacity-100',
          bulletActiveClass: '!bg-red-600'
        }}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 16 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
          1280: { slidesPerView: 5, spaceBetween: 24 }
        }}
        className="!pb-12 product-swiper"
      >
        {products.map(product => (
          <SwiperSlide key={product.id}>
            <ProductCard
              product={product}
              {...getStats(product.id)}
              addToCart={addToCart}
              toggleFavorite={toggleFavorite}
              isFavorite={favorites?.some(f => f.id === product.id)}
              showBadge={showBadge}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      {products.length > 4 && (
        <>
          <button className="swiper-button-prev !hidden md:!flex !w-10 !h-10 !bg-white !rounded-full !shadow-lg after:!text-xs after:!text-gray-600 hover:after:!text-red-600 transition-all !-left-4 !top-1/2" />
          <button className="swiper-button-next !hidden md:!flex !w-10 !h-10 !bg-white !rounded-full !shadow-lg after:!text-xs after:!text-gray-600 hover:after:!text-red-600 transition-all !-right-4 !top-1/2" />
        </>
      )}
    </div>
  );
});

ProductSection.displayName = 'ProductSection';

/* ================= SKELETON LOADER ================= */
const ProductSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-white rounded-3xl p-4 animate-pulse">
        <div className="h-48 bg-gray-200 rounded-2xl mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-8 bg-gray-200 rounded-xl" />
      </div>
    ))}
  </div>
);

/* ================= MAIN COMPONENT ================= */
const Products = ({ addToCart, favorites = [], toggleFavorite }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Fetch Data */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check cache
        const cacheKey = 'products_data';
        const cached = cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setAllProducts(cached.data.products);
          setReviews(cached.data.reviews);
          setLoading(false);
          return;
        }

        const [pRes, rRes] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/reviews`)
        ]);

        if (!pRes.ok || !rRes.ok) {
          throw new Error('Network response was not ok');
        }

        const pData = await pRes.json();
        const rData = await rRes.json();

        const activeOnly = Array.isArray(pData)
          ? pData.filter(p => p.is_active !== false)
          : [];

        const reviewsArray = Array.isArray(rData) ? rData : [];

        setAllProducts(activeOnly);
        setReviews(reviewsArray);

        // Cache the response
        cache.set(cacheKey, {
          data: { products: activeOnly, reviews: reviewsArray },
          timestamp: Date.now()
        });

      } catch (err) {
        console.error('Xatolik:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* Get Product Stats */
  const getStats = useCallback((productId) => {
    const productReviews = reviews.filter(r => r.product_id === productId);
    
    const avg = productReviews.length > 0
      ? (productReviews.reduce((a, b) => a + b.rating, 0) / productReviews.length).toFixed(1)
      : "5.0";

    return { avg };
  }, [reviews]);

  /* Categorize Products with Discounts */
  const categorized = useMemo(() => {
    const categories = {
      discounts: [],     // Mahsulotlar chegirma bilan
      best: [],          // Eng ko'p sotilganlar
      latest: [],        // Yangi kelganlar
      popular: [],       // Ommabop
      featured: [],      // Tanlanganlar
      regular: []        // Oddiy mahsulotlar
    };

    allProducts.forEach(product => {
      // Check for active discount
      const hasActiveDiscount = product.discount?.is_active && 
        (product.discount.percent || product.discount.amount);

      if (hasActiveDiscount) {
        categories.discounts.push(product);
      }

      // Other categories
      if (product.is_best_seller) categories.best.push(product);
      if (product.is_latest) categories.latest.push(product);
      if (product.is_popular) categories.popular.push(product);
      if (product.is_featured) categories.featured.push(product);
      
      // Regular products (no special tags)
      if (!hasActiveDiscount && 
          !product.is_best_seller && 
          !product.is_latest && 
          !product.is_popular && 
          !product.is_featured) {
        categories.regular.push(product);
      }
    });

    // Sort discounts by percentage (highest first)
    categories.discounts.sort((a, b) => {
      const percentA = getDiscountPercentage(a);
      const percentB = getDiscountPercentage(b);
      return percentB - percentA;
    });

    return categories;
  }, [allProducts]);

  const { discounts, best, latest, popular, featured, regular } = categorized;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 rounded-3xl p-8">
          <h3 className="text-xl font-black text-red-600 mb-2">Xatolik yuz berdi</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      {/* Hero Section with Lottie */}
    

      {loading ? (
        <ProductSkeleton />
      ) : (
        <>
          {/* Discount Section - First Priority */}
          {discounts.length > 0 && (
            <ProductSection
              title="Chegirmadagi mahsulotlar"
              icon={<FaPercent className="text-red-600" />}
              products={discounts}
              addToCart={addToCart}
              getStats={getStats}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              accentColor="red"
              showBadge={true}
              viewAllLink="/all-products?discount=true"
            />
          )}

          {/* Best Sellers */}
          {best.length > 0 && (
            <ProductSection
              title="Eng ko'p sotilganlar"
              icon={<FaFire className="text-orange-500" />}
              products={best}
              addToCart={addToCart}
              getStats={getStats}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              accentColor="orange"
              showBadge={true}
            />
          )}

          {/* Latest Products */}
          {latest.length > 0 && (
            <ProductSection
              title="Yangi kelganlar"
              icon={<FaBolt className="text-blue-500" />}
              products={latest}
              addToCart={addToCart}
              getStats={getStats}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              accentColor="blue"
            />
          )}

          {/* Popular Products */}
          {popular.length > 0 && (
            <ProductSection
              title="Trenddagi mahsulotlar"
              icon={<FaGift className="text-purple-500" />}
              products={popular}
              addToCart={addToCart}
              getStats={getStats}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              accentColor="purple"
            />
          )}

          {/* Featured Products */}
          {featured.length > 0 && (
            <ProductSection
              title="Tanlanganlar"
              products={featured}
              addToCart={addToCart}
              getStats={getStats}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              accentColor="green"
            />
          )}

      </>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .product-swiper .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          transition: all 0.3s;
        }
        .product-swiper .swiper-pagination-bullet-active {
          width: 20px;
          border-radius: 4px;
          background: #ef4444 !important;
        }
        
        .swiper-button-prev:after,
        .swiper-button-next:after {
          font-size: 14px;
          font-weight: bold;
        }
        
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          transform: scale(1.1);
        }
        
        .swiper-button-prev:disabled,
        .swiper-button-next:disabled {
          opacity: 0;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
};

export default React.memo(Products);