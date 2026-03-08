import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaHeart,
  FaRegHeart,
  FaTruck,
  FaShieldHalved,
  FaRegCommentDots,
  FaArrowLeft,
  FaCheck,
  FaCartShopping,
  FaPercent,
  
  FaWhatsapp,
  FaTelegram,
  FaFacebookF,
  FaTwitter,
  FaCopy,
  FaRuler,
  FaWeightHanging,
  FaPalette,
  FaBoxOpen,
  FaCalendar,
  FaChevronLeft,
  FaChevronRight,
  FaMinus,
  FaPlus,
  
  FaStore,
  FaCreditCard,
  FaRotateLeft,
  FaTruckFast,
  FaClock,
  FaShieldHeart
} from "react-icons/fa6";
import { toast, Toaster } from "react-hot-toast";
import { FaShareAlt, FaShoppingBag } from "react-icons/fa";
const API_BASE = "https://tailorback2025-production.up.railway.app/api";
const FALLBACK_IMAGE = "https://geostudy.uz/img/pictures/cifvooipg_rf1.jpeg";
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Cache for API responses
const cache = new Map();

// ================= UTILITY FUNCTIONS =================
const formatPrice = (price) => {
  const num = Number(price) || 0;
  return num.toLocaleString('uz-UZ').replace(/,/g, ' ');
};

const calculateFinalPrice = (product) => {
  if (!product) return 0;
  
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
  if (!product) return 0;
  
  const originalPrice = Number(product.price_uzs || product.price || 0);
  const finalPrice = calculateFinalPrice(product);
  
  if (originalPrice > 0 && finalPrice < originalPrice) {
    return Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
  }
  
  return product.discount?.percent || 0;
};

const getDiscountedAmount = (product) => {
  if (!product) return 0;
  
  const originalPrice = Number(product.price_uzs || product.price || 0);
  const finalPrice = calculateFinalPrice(product);
  
  return originalPrice - finalPrice;
};

// ================= PREMIUM IMAGE GALLERY =================
const PremiumImageGallery = ({ images, productName, onImageChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const galleryRef = useRef(null);
  const zoomRef = useRef(null);

  const imageList = useMemo(() => 
    images.length > 0 ? images : [FALLBACK_IMAGE],
    [images]
  );

  useEffect(() => {
    if (!imageList.length) return;
    
    const interval = setInterval(() => {
      if (!isZoomed && !isFullscreen) {
        setCurrentIndex(prev => (prev + 1) % imageList.length);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [imageList.length, isZoomed, isFullscreen]);

  const handlePrev = useCallback((e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? imageList.length - 1 : prev - 1));
  }, [imageList.length]);

  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % imageList.length);
  }, [imageList.length]);

  const handleMouseMove = useCallback((e) => {
    if (!zoomRef.current || !isZoomed) return;
    
    const rect = zoomRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  }, [isZoomed]);

  const toggleFullscreen = useCallback(() => {
    if (!galleryRef.current) return;
    
    if (!isFullscreen) {
      if (galleryRef.current.requestFullscreen) {
        galleryRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={galleryRef}
      className="relative w-full h-full bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden group"
    >
      {/* Main Image */}
      <div 
        ref={zoomRef}
        className="relative w-full h-full cursor-crosshair"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onClick={toggleFullscreen}
      >
        <img
          src={imageList[currentIndex]}
          alt={`${productName} - ${currentIndex + 1}`}
          className={`w-full h-full object-contain transition-all duration-500 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={isZoomed ? {
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
          } : {}}
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
        />
      </div>

      {/* Navigation Arrows */}
      {imageList.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white shadow-xl z-20"
          >
            <FaChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white shadow-xl z-20"
          >
            <FaChevronRight size={16} />
          </button>
        </>
      )}

      {/* Image Counter */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold z-20">
        {currentIndex + 1} / {imageList.length}
      </div>

      {/* Thumbnails */}
      {imageList.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2 z-20">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                idx === currentIndex 
                  ? 'border-red-600 shadow-xl scale-110' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ================= QUANTITY SELECTOR =================
const QuantitySelector = ({ quantity, onChange, max = 99, min = 1 }) => {
  const handleDecrease = useCallback(() => {
    if (quantity > min) onChange(quantity - 1);
  }, [quantity, min, onChange]);

  const handleIncrease = useCallback(() => {
    if (quantity < max) onChange(quantity + 1);
  }, [quantity, max, onChange]);

  return (
    <div className="flex items-center h-14 bg-gray-50 rounded-2xl border border-gray-100">
      <button
        onClick={handleDecrease}
        disabled={quantity <= min}
        className="w-14 h-full flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-l-2xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FaMinus size={12} />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={quantity}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if (!isNaN(val) && val >= min && val <= max) {
            onChange(val);
          }
        }}
        className="w-16 h-full text-center font-bold text-gray-900 bg-transparent border-x border-gray-200 outline-none"
      />
      <button
        onClick={handleIncrease}
        disabled={quantity >= max}
        className="w-14 h-full flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-r-2xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FaPlus size={12} />
      </button>
    </div>
  );
};

// ================= SHARE BUTTONS =================
const ShareButtons = ({ product }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;
  const shareText = `${product.name} - TailorShop.uz da ${formatPrice(calculateFinalPrice(product))} SO'M`;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link nusxalandi!');
  }, [shareUrl]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`)}
        className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
      >
        <FaWhatsapp size={16} />
      </button>
      <button
        onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`)}
        className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
      >
        <FaTelegram size={16} />
      </button>
      <button
        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)}
        className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"
      >
        <FaFacebookF size={16} />
      </button>
      <button
        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`)}
        className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center hover:bg-sky-600 hover:text-white transition-colors"
      >
        <FaTwitter size={16} />
      </button>
      <button
        onClick={handleCopy}
        className="w-10 h-10 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-600 hover:text-white transition-colors relative"
      >
        <FaCopy size={16} />
        {copied && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] px-2 py-1 rounded whitespace-nowrap">
            Nusxalandi
          </span>
        )}
      </button>
    </div>
  );
};

// ================= REVIEW CARD =================
const ReviewCard = ({ review }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center text-red-600 font-black uppercase">
            {review.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h5 className="font-black text-sm text-gray-900">{review.name || 'Foydalanuvchi'}</h5>
            <span className="text-[8px] text-gray-400 uppercase tracking-wider">
              {new Date(review.createdAt).toLocaleDateString('uz-UZ')}
            </span>
          </div>
        </div>
      </div>
      <div className="flex text-amber-400 text-xs">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className={i < review.rating ? "fill-current" : "text-gray-200"} />
        ))}
      </div>
    </div>
    <p className="text-gray-600 text-sm leading-relaxed">"{review.comment}"</p>
  </div>
);

// ================= RELATED PRODUCT CARD =================
const RelatedProductCard = ({ product, addToCart, toggleFavorite, isFavorite }) => {
  const finalPrice = calculateFinalPrice(product);
  const hasDiscount = product.discount?.is_active && finalPrice < Number(product.price_uzs || product.price || 0);
  const discountPercentage = getDiscountPercentage(product);
  const imageUrl = product.images?.[0]?.image_url || FALLBACK_IMAGE;

  return (
    <div className="group relative bg-white rounded-3xl p-4 border border-gray-100 hover:border-red-100 hover:shadow-2xl transition-all duration-500">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
              <FaPercent size={7} /> -{discountPercentage}%
            </div>
          )}
        </div>
        
        <h3 className="font-black text-gray-900 text-xs mb-2 line-clamp-2 group-hover:text-red-600 transition-colors min-h-[2.5rem]">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-red-600 font-black text-sm">
              {formatPrice(finalPrice)} <small className="text-[8px]">SO'M</small>
            </span>
            {hasDiscount && (
              <p className="text-gray-400 text-[8px] line-through">
                {formatPrice(product.price_uzs || product.price || 0)} SO'M
              </p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart({
                ...product,
                price: finalPrice,
                image: imageUrl,
                quantity: 1
              });
            }}
            className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <FaCartShopping size={14} />
          </button>
        </div>
      </Link>
      
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(product);
        }}
        className="absolute top-6 right-6 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md hover:scale-110 transition-transform"
      >
        {isFavorite ? <FaHeart className="text-red-600 text-sm" /> : <FaRegHeart className="text-gray-400 text-sm" />}
      </button>
    </div>
  );
};

// ================= MAIN PRODUCT DETAIL COMPONENT =================
const ProductDetail = ({ addToCart, favorites = [], toggleFavorite }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  const abortControllerRef = useRef();
  const isMounted = useRef(true);

  const isFavorite = useMemo(() => 
    favorites.some((fav) => fav.id === parseInt(id)),
    [favorites, id]
  );

  const finalPrice = useMemo(() => 
    calculateFinalPrice(product),
    [product]
  );

  const originalPrice = useMemo(() => 
    Number(product?.price_uzs || product?.price || 0),
    [product]
  );

  const hasDiscount = useMemo(() => 
    product?.discount?.is_active && finalPrice < originalPrice,
    [product, finalPrice, originalPrice]
  );

  const discountPercentage = useMemo(() => 
    getDiscountPercentage(product),
    [product]
  );

  const discountedAmount = useMemo(() => 
    getDiscountedAmount(product),
    [product]
  );

  const averageRating = useMemo(() => {
    if (!reviews.length) return 5;
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  // Fetch product data
  useEffect(() => {
    isMounted.current = true;
    
    const fetchData = async () => {
      try {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        const cacheKey = `product_${id}`;
        const cached = cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          if (isMounted.current) {
            setProduct(cached.data.product);
            setReviews(cached.data.reviews);
            setRelatedProducts(cached.data.related);
            setLoading(false);
          }
          return;
        }

        const [prodRes, revRes, allProdsRes] = await Promise.all([
          fetch(`${API_BASE}/products/${id}`, { signal }),
          fetch(`${API_BASE}/reviews`, { signal }),
          fetch(`${API_BASE}/products`, { signal })
        ]);

        const prodData = await prodRes.json();
        const revData = await revRes.json();
        const allProdsData = await allProdsRes.json();

        if (!isMounted.current) return;

        if (prodData && prodData.is_active !== false) {
          setProduct(prodData);
          
          const productReviews = revData.filter(rev => rev.product_id === parseInt(id));
          setReviews(productReviews);
          
          // Get related products (same category, exclude current)
          const related = allProdsData
            .filter(p => 
              p.category_id === prodData.category_id && 
              p.id !== prodData.id && 
              p.is_active !== false
            )
            .slice(0, 8);
          setRelatedProducts(related);

          // Cache the response
          cache.set(cacheKey, {
            data: {
              product: prodData,
              reviews: productReviews,
              related
            },
            timestamp: Date.now()
          });

          // Add to recently viewed
          const viewed = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
          const updated = [prodData, ...viewed.filter(v => v.id !== prodData.id)].slice(0, 10);
          localStorage.setItem('recently_viewed', JSON.stringify(updated));
          setRecentlyViewed(updated);
        } else {
          setProduct(null);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error("Xatolik:", err);
        toast.error('Ma\'lumotlarni yuklashda xatolik yuz berdi');
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchData();
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [id]);

  // Load recently viewed from localStorage
  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
    setRecentlyViewed(viewed);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      originalPrice,
      image: product.images?.[0]?.image_url || FALLBACK_IMAGE,
      quantity,
      color: selectedColor,
      size: selectedSize,
      discount: hasDiscount ? discountPercentage : null
    });
    
    toast.success(`${quantity} ta mahsulot savatga qo'shildi`, {
      icon: '🛒',
      duration: 3000
    });
  }, [product, finalPrice, originalPrice, quantity, selectedColor, selectedSize, hasDiscount, discountPercentage, addToCart]);

  const handleBuyNow = useCallback(() => {
    handleAddToCart();
    navigate('/cart');
  }, [handleAddToCart, navigate]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: parseInt(id),
          name: reviewForm.name || 'Anonim',
          rating: parseInt(reviewForm.rating),
          comment: reviewForm.comment,
          createdAt: new Date().toISOString()
        })
      });
      
      if (res.ok) {
        setReviewForm({ name: "", rating: 5, comment: "" });
        
        // Refresh reviews
        const revRes = await fetch(`${API_BASE}/reviews`);
        const revData = await revRes.json();
        setReviews(revData.filter(rev => rev.product_id === parseInt(id)));
        
        toast.success('Fikringiz uchun rahmat!');
      }
    } catch (err) {
      toast.error('Sharh yuborishda xatolik');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-red-600 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>
        <p className="mt-6 text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase animate-pulse">
          Mahsulot yuklanmoqda...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBoxOpen size={48} className="text-red-300" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight">
            Mahsulot topilmadi
          </h2>
          <p className="text-gray-500 mb-8">
            Siz qidirgan mahsulot mavjud emas yoki o'chirilgan bo'lishi mumkin.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all shadow-xl"
          >
            <FaArrowLeft /> Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  const imageUrls = product.images?.map(img => img.image_url) || [];

  return (
    <>
      <Helmet>
        <title>{product.name} | TailorShop.uz</title>
        <meta name="description" content={product.description?.substring(0, 160) || "TailorShop.uz - Tikuvchilik furnituralari do'koni"} />
        <meta property="og:title" content={`${product.name} | TailorShop.uz`} />
        <meta property="og:description" content={product.description?.substring(0, 160)} />
        <meta property="og:image" content={imageUrls[0] || FALLBACK_IMAGE} />
        <meta property="og:url" content={`https://tailorshop.uz/product/${id}`} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={finalPrice.toString()} />
        <meta property="product:price:currency" content="UZS" />
        <link rel="canonical" href={`https://tailorshop.uz/product/${id}`} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": imageUrls,
            "sku": `TS-${product.id}`,
            "mpn": product.id.toString(),
            "brand": {
              "@type": "Brand",
              "name": "TailorShop"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://tailorshop.uz/product/${id}`,
              "priceCurrency": "UZS",
              "price": finalPrice,
              "priceValidUntil": product.discount?.valid_until || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
              "itemCondition": "https://schema.org/NewCondition",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": reviews.length > 0 ? {
              "@type": "AggregateRating",
              "ratingValue": averageRating,
              "reviewCount": reviews.length
            } : undefined,
            "review": reviews.slice(0, 5).map(rev => ({
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": rev.rating
              },
              "author": {
                "@type": "Person",
                "name": rev.name
              },
              "reviewBody": rev.comment
            }))
          })}
        </script>
      </Helmet>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#1e293b',
            fontWeight: 'bold',
            fontSize: '12px',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }
        }}
      />

      <div className="bg-[#fcfcfc] min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 pt-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 overflow-x-auto pb-2 no-scrollbar">
            <Link to="/" className="hover:text-red-600 whitespace-nowrap">Bosh sahifa</Link>
            <span className="text-gray-300">/</span>
            <Link to="/all-products" className="hover:text-red-600 whitespace-nowrap">Katalog</Link>
            {product.category && (
              <>
                <span className="text-gray-300">/</span>
                <Link to={`/category/${product.category.id}`} className="hover:text-red-600 whitespace-nowrap">
                  {product.category.name}
                </Link>
              </>
            )}
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 italic whitespace-nowrap">{product.name}</span>
          </nav>

          {/* Main Product Section */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
            
            {/* Left: Image Gallery */}
            <div className="lg:col-span-7">
              <div className="sticky top-24 aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl shadow-gray-200/50">
                <PremiumImageGallery 
                  images={imageUrls} 
                  productName={product.name}
                />
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 space-y-6">
                
                {/* Badges */}
                <div className="flex items-center gap-3 flex-wrap">
                  {hasDiscount && (
                    <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 animate-pulse">
                      <FaPercent size={8} /> -{discountPercentage}% Chegirma
                    </span>
                  )}
                  {product.is_latest && (
                    <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full">
                      Yangi
                    </span>
                  )}
                  {product.is_best_seller && (
                    <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full">
                      Eng ko'p sotilgan
                    </span>
                  )}
                </div>

                {/* Title & Rating */}
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
                    {product.name}
                  </h1>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="flex text-amber-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < Math.round(averageRating) ? "fill-current" : "text-gray-200"} />
                        ))}
                      </div>
                      <span className="text-gray-400 text-xs font-medium ml-1">({averageRating})</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <button 
                      onClick={() => setActiveTab('reviews')}
                      className="text-gray-500 hover:text-red-600 text-xs font-bold transition-colors"
                    >
                      {reviews.length} ta sharh
                    </button>
                  </div>
                </div>

                {/* Price Section */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-3xl border border-gray-100">
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-wider">
                      {hasDiscount ? 'Chegirmali narx' : 'Mahsulot narxi'}
                    </span>
                    {hasDiscount && (
                      <span className="bg-green-100 text-green-700 text-[8px] font-black px-2 py-1 rounded-full">
                        {formatPrice(discountedAmount)} SO'M tejaysiz
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-end gap-4">
                    <div>
                      <span className="text-4xl md:text-5xl font-black text-red-600 leading-none">
                        {formatPrice(finalPrice)}
                      </span>
                      <span className="text-xs font-black text-gray-500 ml-1">SO'M</span>
                    </div>
                    {hasDiscount && (
                      <div className="mb-1">
                        <span className="text-lg text-gray-400 line-through font-medium">
                          {formatPrice(originalPrice)} SO'M
                        </span>
                      </div>
                    )}
                  </div>

                  {product.discount?.valid_until && (
                    <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-gray-500">
                      <FaClock size={10} className="text-orange-500" />
                      Chegirma amal qilish muddati: {new Date(product.discount.valid_until).toLocaleDateString('uz-UZ')}
                    </div>
                  )}
                </div>

                {/* Quantity & Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider min-w-[80px]">
                      Miqdori:
                    </span>
                    <QuantitySelector 
                      quantity={quantity} 
                      onChange={setQuantity}
                      max={product.quantity || 99}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95 shadow-xl"
                    >
                      <FaCartShopping size={16} />
                      Savatga
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-gray-900 transition-all active:scale-95 shadow-xl"
                    >
                      <FaShoppingBag size={16} />
                      Hoziroq sotib olish
                    </button>
                  </div>
                </div>

                {/* Product Meta */}
                <div className="grid grid-cols-2 gap-3">
                  {product.unit && (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100">
                      <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                        <FaBoxOpen size={16} />
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">O'lchov</span>
                        <p className="text-xs font-black text-gray-900">{product.unit}</p>
                      </div>
                    </div>
                  )}
                  
                  {product.min_order && (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100">
                      <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                        <FaWeightHanging size={16} />
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Min. buyurtma</span>
                        <p className="text-xs font-black text-gray-900">{product.min_order} {product.unit}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                      <FaTruckFast size={16} />
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Yetkazib berish</span>
                      <p className="text-xs font-black text-gray-900">1-3 kun</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                      <FaShieldHeart size={16} />
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Kafolat</span>
                      <p className="text-xs font-black text-gray-900">14 kun</p>
                    </div>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <FaShareAlt size={12} /> Ulashish:
                  </span>
                  <ShareButtons product={product} />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="border-t border-gray-100 pt-16">
            <div className="flex justify-center gap-8 mb-12 overflow-x-auto pb-2 no-scrollbar">
              {[
                { id: 'description', label: 'Mahsulot tavsifi', icon: <FaBoxOpen /> },
                { id: 'specifications', label: 'Texnik xususiyatlar', icon: <FaRuler /> },
                { id: 'reviews', label: `Fikrlar (${reviews.length})`, icon: <FaRegCommentDots /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all relative ${
                    activeTab === tab.id 
                      ? 'text-red-600 bg-red-50' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            <div className="min-h-[400px]">
              {activeTab === 'description' && (
                <div className="grid md:grid-cols-2 gap-12 animate-fadeIn">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                      Batafsil ma'lumot
                    </h3>
                    <div className="prose prose-lg max-w-none">
                      {product.description ? (
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {product.description}
                        </p>
                      ) : (
                        <p className="text-gray-400 italic">
                          Ushbu mahsulot haqida batafsil ma'lumot mavjud emas.
                        </p>
                      )}
                    </div>
                    
                    {/* Key Features */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      {[
                        'Premium sifat',
                        '100% kafolat',
                        'Tezkor yetkazish',
                        'Qaytarish imkoniyati'
                      ].map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-gray-700 text-xs font-bold">
                          <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                            <FaCheck size={8} />
                          </div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                    <h4 className="text-sm font-black text-gray-900 mb-6 flex items-center gap-2">
                      <FaShieldHalved className="text-red-600" />
                      Nima uchun aynan biz?
                    </h4>
                    <ul className="space-y-4">
                      {[
                        { icon: FaStore, text: 'Faqat sifatli mahsulotlar' },
                        { icon: FaTruck, text: 'Toshkent bo\'ylab 24 soatda yetkazish' },
                        { icon: FaCreditCard, text: 'Qulay to\'lov tizimlari' },
                        { icon: FaRotateLeft, text: '14 kun ichida qaytarish imkoniyati' }
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-gray-600 text-sm">
                          <item.icon className="text-red-600 flex-shrink-0" size={18} />
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid md:grid-cols-2 gap-12 animate-fadeIn">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl text-white">
                    <h4 className="text-sm font-black mb-8 flex items-center gap-2 border-b border-white/10 pb-4">
                      <FaRuler className="text-red-400" />
                      TEXNIK PARAMETRLAR
                    </h4>
                    <dl className="space-y-6">
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-400 text-[10px] font-black uppercase tracking-wider">Katalog kodi:</dt>
                        <dd className="text-sm font-black text-white">#TS-{product.id}</dd>
                      </div>
                      {product.category && (
                        <div className="flex justify-between items-center">
                          <dt className="text-gray-400 text-[10px] font-black uppercase tracking-wider">Kategoriya:</dt>
                          <dd className="text-sm font-black text-white">{product.category.name}</dd>
                        </div>
                      )}
                      {product.color && product.color !== '#  ' && (
                        <div className="flex justify-between items-center">
                          <dt className="text-gray-400 text-[10px] font-black uppercase tracking-wider">Rangi:</dt>
                          <dd className="flex items-center gap-2">
                            <span className="text-sm font-black text-white">{product.color}</span>
                            {product.color.startsWith('#') && (
                              <div className="w-5 h-5 rounded-full border-2 border-white" style={{ backgroundColor: product.color }} />
                            )}
                          </dd>
                        </div>
                      )}
                      {product.unit && (
                        <div className="flex justify-between items-center">
                          <dt className="text-gray-400 text-[10px] font-black uppercase tracking-wider">O'lchov birligi:</dt>
                          <dd className="text-sm font-black text-white">{product.unit}</dd>
                        </div>
                      )}
                      {product.min_order && (
                        <div className="flex justify-between items-center">
                          <dt className="text-gray-400 text-[10px] font-black uppercase tracking-wider">Minimal buyurtma:</dt>
                          <dd className="text-sm font-black text-red-400">{product.min_order} {product.unit}</dd>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-400 text-[10px] font-black uppercase tracking-wider">Mavjudlik:</dt>
                        <dd className="text-sm font-black text-green-400">Omborda bor</dd>
                      </div>
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-400 text-[10px] font-black uppercase tracking-wider">Qo'shilgan sana:</dt>
                        <dd className="text-sm font-black text-white">
                          {new Date(product.createdAt).toLocaleDateString('uz-UZ')}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div className="bg-white rounded-3xl p-8 border border-gray-100">
                    <h4 className="text-sm font-black text-gray-900 mb-6">Qo'shimcha ma'lumotlar</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <FaPalette className="text-red-600 text-xl" />
                        <div>
                          <p className="text-[8px] font-black text-gray-400 uppercase">Rang variantlari</p>
                          <p className="text-xs font-black text-gray-900">
                            {product.color && product.color !== '#  ' ? product.color : 'Standart'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <FaWeightHanging className="text-red-600 text-xl" />
                        <div>
                          <p className="text-[8px] font-black text-gray-400 uppercase">Og'irlik</p>
                          <p className="text-xs font-black text-gray-900">Ma'lumot mavjud emas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="grid lg:grid-cols-12 gap-8 animate-fadeIn">
                  {/* Review Form */}
                  <div className="lg:col-span-5">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 sticky top-24">
                      <h4 className="text-sm font-black text-gray-900 mb-6 flex items-center gap-2">
                        <FaRegCommentDots className="text-red-600" />
                        Fikr qoldirish
                      </h4>
                      
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                          <label className="text-[8px] font-black text-gray-400 uppercase block mb-2">
                            Ismingiz
                          </label>
                          <input
                            type="text"
                            placeholder="Ismingizni kiriting"
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-xl outline-none text-xs font-medium transition-all"
                            value={reviewForm.name}
                            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="text-[8px] font-black text-gray-400 uppercase block mb-2">
                            Baholang
                          </label>
                          <div className="flex gap-2">
                            {[5,4,3,2,1].map(rating => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setReviewForm({ ...reviewForm, rating })}
                                className={`w-12 h-12 rounded-xl border-2 transition-all ${
                                  reviewForm.rating === rating
                                    ? 'border-red-600 bg-red-50 text-red-600'
                                    : 'border-gray-200 text-gray-400 hover:border-red-300'
                                }`}
                              >
                                <div className="flex flex-col items-center">
                                  <span className="text-xs font-black">{rating}</span>
                                  <FaStar size={8} className={reviewForm.rating === rating ? 'fill-current' : ''} />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-[8px] font-black text-gray-400 uppercase block mb-2">
                            Fikringiz
                          </label>
                          <textarea
                            rows="4"
                            placeholder="Mahsulot haqida fikringizni yozing..."
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-600 rounded-xl outline-none text-xs font-medium transition-all resize-none"
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            required
                          />
                        </div>
                        
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-gray-900 transition-all disabled:opacity-50"
                        >
                          {isSubmitting ? 'Yuborilmoqda...' : 'Fikrni yuborish'}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="lg:col-span-7 space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <FaRegCommentDots size={40} className="text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium mb-2">Hozircha sharhlar yo'q</p>
                        <p className="text-gray-400 text-xs">Birinchi bo'lib fikr bildiring!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-24">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">
                    O'xshash mahsulotlar
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
                    Sizga ham yoqishi mumkin
                  </h2>
                </div>
                <Link 
                  to={`/category/${product.category_id}`}
                  className="flex items-center gap-2 text-gray-900 font-black text-xs uppercase hover:text-red-600 transition-colors"
                >
                  Hammasini ko'rish <FaChevronRight size={10} />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedProducts.map((item) => (
                  <RelatedProductCard
                    key={item.id}
                    product={item}
                    addToCart={addToCart}
                    toggleFavorite={toggleFavorite}
                    isFavorite={favorites.some(f => f.id === item.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && recentlyViewed[0]?.id !== product.id && (
            <div className="mt-16">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-6">
                So'nggi ko'rilganlar
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {recentlyViewed.slice(0, 5).map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    className="group block"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2">
                      <img
                        src={item.images?.[0]?.image_url || FALLBACK_IMAGE}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="text-[10px] font-black text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                      {item.name}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .prose {
          max-width: 65ch;
          color: #4b5563;
        }
        
        .prose p {
          margin-bottom: 1.5em;
          line-height: 1.8;
        }
        
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </>
  );
};

export default React.memo(ProductDetail);