import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaSyncAlt,
  FaSpinner,
  FaPercent,
  FaFire,
  FaBolt,
  FaGift,
  FaTruck,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaBoxOpen,
  FaTags,
  FaEye
} from "react-icons/fa";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import dropDown from "../../assets/oG99I91tLW.json";

const API_BASE = "https://tailorback2025-production.up.railway.app/api";
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const PLACEHOLDER_IMAGE = "/placeholder.jpg";

// Cache for API responses
const cache = new Map();

// ================= UTILITY FUNCTIONS =================
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

// ================= SKELETON LOADER COMPONENT =================
const Skeleton = ({ className }) => (
  <div className={`bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-2xl ${className}`} />
);

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-[1.8rem] p-4 border border-gray-100">
    <Skeleton className="w-full aspect-[4/5] rounded-2xl mb-4" />
    <Skeleton className="h-5 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2 mb-3" />
    <Skeleton className="h-10 w-full rounded-xl" />
  </div>
);

// ================= LAZY IMAGE COMPONENT =================
const LazyImage = React.memo(({ src, alt, className, onLoad }) => {
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

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-xs">Rasm yuklanmadi</span>
        </div>
      )}
      <img
        ref={imgRef}
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E"
        data-src={src}
        alt={alt}
        className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

// ================= IMAGE SWIPER WITH LOADING STATE =================
const ImageSwiper = React.memo(({ images = [], productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedIndices, setLoadedIndices] = useState(new Set());
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4500);
    
    return () => clearInterval(intervalRef.current);
  }, [images.length, isHovered]);

  const handleImageLoad = useCallback((index) => {
    setLoadedIndices((prev) => new Set(prev).add(index));
  }, []);

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
        <LazyImage src={PLACEHOLDER_IMAGE} alt={productName} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-full bg-gray-50 overflow-hidden rounded-t-[1.5rem] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0 relative">
            {!loadedIndices.has(idx) && (
              <Skeleton className="absolute inset-0 z-0" />
            )}
            <LazyImage
              src={img}
              alt={`${productName}-${idx}`}
              className={`w-full h-full object-cover relative z-10 transition-opacity duration-300 ${
                loadedIndices.has(idx) ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => handleImageLoad(idx)}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white z-20"
            aria-label="Oldingi rasm"
          >
            <FaChevronLeft size={12} className="text-gray-800" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white z-20"
            aria-label="Keyingi rasm"
          >
            <FaChevronRight size={12} className="text-gray-800" />
          </button>
          
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
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
          
          <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[8px] px-2 py-0.5 rounded-full z-20">
            {currentIndex + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
});

ImageSwiper.displayName = 'ImageSwiper';

// ================= COUNTDOWN TIMER =================
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
    <div className="flex items-center gap-1 bg-gradient-to-r from-red-600 to-red-500 text-white px-2 py-1 rounded-lg text-[8px] font-bold shadow-lg">
      <FaClock size={8} />
      <span>{String(timeLeft.hours).padStart(2, '0')}:</span>
      <span>{String(timeLeft.minutes).padStart(2, '0')}:</span>
      <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
    </div>
  );
};

// ================= PRODUCT CARD =================
const ProductCard = React.memo(({ product, avg, toggleFavorite, isFavorite, addToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const imageUrls = useMemo(() => 
    product.images?.map((img) => img.image_url).filter(Boolean) || [], 
    [product.images]
  );
  
  const originalPrice = useMemo(() => 
    Number(product.price_uzs || product.price) || 0, 
    [product.price_uzs, product.price]
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
      ...product, 
      price: finalPrice,
      originalPrice,
      image: imageUrls[0] || PLACEHOLDER_IMAGE,
      quantity: 1
    });
  }, [product, finalPrice, originalPrice, imageUrls, addToCart]);

  const handleToggleFavorite = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  }, [product, toggleFavorite]);

  return (
    <div 
      className="group bg-white rounded-[1.8rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full mb-6 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="relative block">
        <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden rounded-t-[1.8rem] bg-gray-100">
          <ImageSwiper images={imageUrls} productName={product.name} />
          
          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 p-2.5 rounded-xl z-30 shadow-lg transition-all active:scale-75 ${
              isFavorite 
                ? "bg-red-500 text-white shadow-red-200" 
                : "bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white"
            }`}
            aria-label={isFavorite ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
          >
            {isFavorite ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5">
            {isDiscountActive && (
              <span className="bg-gradient-to-r from-red-600 to-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg animate-pulse">
                <FaPercent size={8} /> -{discountPercentage}%
              </span>
            )}
            {product.is_best_seller && (
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
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 z-20 animate-fadeIn">
              <span className="text-white text-[8px] font-bold uppercase tracking-wider flex items-center gap-1">
                <FaEye size={8} /> Tezkor ko'rish
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 line-clamp-2 hover:text-red-600 transition-colors leading-snug min-h-[2.4rem]">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-1 my-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={i < Math.round(avg) ? "text-yellow-400" : "text-gray-200"} 
                size={10} 
              />
            ))}
          </div>
          <span className="text-gray-400 text-[9px] font-bold tracking-tighter">
            ({avg})
          </span>
          {product.review_count > 0 && (
            <span className="text-gray-300 text-[8px] ml-1">
              ({product.review_count})
            </span>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-red-600 font-black text-[17px] sm:text-[19px] tracking-tighter">
                {formatPrice(finalPrice)}
              </span>
              {isDiscountActive && (
                <span className="text-gray-400 text-[10px] line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full mt-3 bg-slate-900 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all font-bold text-[10px] uppercase tracking-widest active:scale-95 shadow-md shadow-gray-100 group/btn"
          >
            <FaShoppingCart size={12} className="group-hover/btn:animate-bounce" />
            SAVATGA
          </button>

          {/* Delivery Info */}
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

// ================= CATEGORY SECTION =================
const CategorySection = React.memo(({ 
  category, 
  products, 
  addToCart, 
  getStats, 
  favorites, 
  toggleFavorite, 
  onRefresh, 
  isRefreshing, 
  refreshSeed 
}) => {
  const swiperRef = useRef(null);
  
  const selectedProducts = useMemo(() => {
    // Shuffle products and take first 8
    return [...products]
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
  }, [products, refreshSeed]);

  const hasDiscounts = useMemo(() => 
    products.some(p => p.discount?.is_active),
    [products]
  );

  if (!selectedProducts.length) return null;

  return (
    <div className="mb-24 last:mb-0 relative">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/30 to-transparent pointer-events-none" />
      
      <div className="relative">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-3">
            {hasDiscounts && (
              <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
                <FaTags className="text-red-600" size={14} />
              </div>
            )}
            <h2 className="text-lg sm:text-2xl font-black italic uppercase text-slate-900 tracking-tight border-l-4 border-red-600 pl-3">
              {category.name}
            </h2>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
              {category.products.length}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Custom Navigation */}
            <div className="hidden md:flex gap-2">
              <button 
                onClick={() => swiperRef.current?.slidePrev()}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-red-600 hover:text-red-600 transition-colors"
              >
                <FaChevronLeft size={12} />
              </button>
              <button 
                onClick={() => swiperRef.current?.slideNext()}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-red-600 hover:text-red-600 transition-colors"
              >
                <FaChevronRight size={12} />
              </button>
            </div>
            
            <button
              onClick={() => onRefresh(category.id)}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 text-gray-400 hover:text-red-600 transition-colors group"
              aria-label="Mahsulotlarni yangilash"
            >
              <FaSyncAlt 
                className={`${isRefreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} 
                size={12} 
              />
              <span className="text-[9px] font-bold uppercase tracking-widest italic hidden sm:inline">
                Yangilash
              </span>
            </button>
          </div>
        </div>

        {/* Products Swiper */}
        <Swiper
          ref={swiperRef}
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={12}
          slidesPerView={2}
          speed={500}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ 
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-gray-300 !opacity-100',
            bulletActiveClass: '!bg-red-600'
          }}
          breakpoints={{
            640: { slidesPerView: 2.2, spaceBetween: 15 },
            768: { slidesPerView: 3, spaceBetween: 18 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
            1280: { slidesPerView: 4.5, spaceBetween: 22 }
          }}
          className="!pb-10 custom-swiper"
        >
          {selectedProducts.map((product) => (
            <SwiperSlide key={`${refreshSeed}-${product.id}`}>
              <ProductCard
                product={product}
                {...getStats(product.id)}
                addToCart={addToCart}
                toggleFavorite={toggleFavorite}
                isFavorite={favorites?.some((f) => f.id === product.id)}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Category Link Button */}
        <div className="flex justify-center mt-6">
          <Link 
            to={`/category/${category.slug}`} 
            className="group flex items-center gap-2 bg-gray-50 hover:bg-slate-900 text-slate-900 hover:text-white px-8 py-3.5 rounded-full border border-gray-200 transition-all duration-300 active:scale-95 shadow-sm hover:shadow-xl"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              "{category.name}" hammasini ko'rish
            </span>
            <div className="w-6 h-6 bg-white group-hover:bg-red-600 rounded-full flex items-center justify-center transition-colors shadow-sm">
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-slate-900 group-hover:text-white transform group-hover:translate-x-0.5 transition-transform"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
});

CategorySection.displayName = 'CategorySection';

// ================= MAIN COMPONENT =================
const Products = ({ addToCart, favorites = [], toggleFavorite }) => {
  const [data, setData] = useState({ products: [], categories: [], reviews: [] });
  const [loading, setLoading] = useState(true);
  const [refreshSeeds, setRefreshSeeds] = useState({});
  const [refreshingId, setRefreshingId] = useState(null);
  const [error, setError] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check cache
        const cacheKey = 'products_page_data';
        const cached = cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setData(cached.data);
          setLoading(false);
          return;
        }

        const [pRes, cRes, rRes] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/categories`),
          fetch(`${API_BASE}/reviews`),
        ]);

        if (!pRes.ok || !cRes.ok || !rRes.ok) {
          throw new Error('Network response was not ok');
        }

        const pData = await pRes.json();
        const cData = await cRes.json();
        const rData = await rRes.json();

        const newData = {
          products: Array.isArray(pData) ? pData.filter(x => x.is_active !== false) : [],
          categories: Array.isArray(cData) ? buildCategoryTree(cData) : [],
          reviews: Array.isArray(rData) ? rData : []
        };

        setData(newData);
        
        // Cache the response
        cache.set(cacheKey, {
          data: newData,
          timestamp: Date.now()
        });

      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Build category tree
  const buildCategoryTree = (categories) => {
    const categoryMap = {};
    const rootCategories = [];
    
    categories.forEach(cat => {
      categoryMap[cat.id] = { ...cat, children: [] };
    });
    
    categories.forEach(cat => {
      if (cat.parent_id === null) {
        rootCategories.push(categoryMap[cat.id]);
      } else if (categoryMap[cat.parent_id]) {
        categoryMap[cat.parent_id].children.push(categoryMap[cat.id]);
      }
    });
    
    // Sort by name
    const sortCategories = (cats) => {
      cats.sort((a, b) => a.name.localeCompare(b.name));
      cats.forEach(cat => {
        if (cat.children.length > 0) {
          sortCategories(cat.children);
        }
      });
    };
    sortCategories(rootCategories);
    
    return rootCategories;
  };

  // Get product stats
  const getStats = useCallback((productId) => {
    const productReviews = data.reviews.filter(r => r.product_id === productId);
    
    const avg = productReviews.length > 0
      ? (productReviews.reduce((a, b) => a + b.rating, 0) / productReviews.length).toFixed(1)
      : "5.0";

    return { avg };
  }, [data.reviews]);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const flattenCategories = (categories) => {
      let flat = [];
      categories.forEach(cat => {
        flat.push(cat);
        if (cat.children && cat.children.length > 0) {
          flat = flat.concat(flattenCategories(cat.children));
        }
      });
      return flat;
    };

    const flatCategories = flattenCategories(data.categories);
    
    return flatCategories
      .map(cat => ({
        ...cat,
        products: data.products.filter(p => p.category_id === cat.id)
      }))
      .filter(cat => cat.products.length > 0)
      .sort((a, b) => b.products.length - a.products.length);
  }, [data]);

  // Handle refresh
  const handleRefresh = useCallback((categoryId) => {
    setRefreshingId(categoryId);
    setTimeout(() => {
      setRefreshSeeds(prev => ({ ...prev, [categoryId]: Date.now() }));
      setRefreshingId(null);
    }, 500);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-red-600 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>
        <span className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">
          Yuklanmoqda
        </span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 rounded-3xl p-8">
          <h3 className="text-xl font-black text-red-600 mb-2">Xatolik yuz berdi</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero Section */}
   

      {/* Categories Sections */}
      {productsByCategory.length > 0 ? (
        productsByCategory.map((cat) => (
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
        ))
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <FaBoxOpen className="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-gray-800 mb-2">Mahsulotlar mavjud emas</h3>
          <p className="text-gray-500">Hozircha hech qanday mahsulot qo'shilmagan</p>
        </div>
      )}
      
      {/* Catalog Button */}
      <div className="mt-16 flex flex-col items-center">
        <Link 
          to="/all-products" 
          className="group flex flex-col items-center active:scale-95 transition-transform"
        >
          <Player 
            autoplay 
            loop 
            src={dropDown} 
            className="w-32 sm:w-40"
          />
          <span className="bg-slate-950 text-white px-12 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] -mt-5 z-20 hover:bg-red-600 transition-all shadow-2xl hover:shadow-red-600/30">
            Katalogni ko'rish
          </span>
        </Link>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .custom-swiper .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          transition: all 0.3s;
        }
        .custom-swiper .swiper-pagination-bullet-active {
          width: 20px;
          border-radius: 4px;
          background: #ef4444 !important;
        }
        
        .swiper-button-prev:after,
        .swiper-button-next:after {
          font-size: 14px;
          font-weight: bold;
        }
      `}</style>
    </section>
  );
};

export default React.memo(Products);
