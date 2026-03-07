import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaArrowLeft, FaBoxes, FaLayerGroup,
  FaShoppingCart, FaHeart, FaRegHeart,
  FaFilter, FaSort, FaSortAmountDown,
  FaSortAmountUp, FaSpinner, FaImage,
  FaTimes, FaChevronDown, FaChevronUp,
  FaTags, FaList, FaStar
} from "react-icons/fa";

const API_BASE = "https://tailorback2025-production.up.railway.app/api";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache for API responses
const cache = new Map();

// ================= LAZY IMAGE COMPONENT =================
const LazyImage = ({ src, alt, className, onLoad }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef();
  const observerRef = useRef();

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = src;
            observerRef.current.unobserve(img);
          }
        });
      },
      { rootMargin: "50px", threshold: 0.1 }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src]);

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <FaImage className="text-gray-300 text-3xl" />
        </div>
      )}
      <img
        ref={imgRef}
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E"
        data-src={src}
        alt={alt}
        className={`${className} ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"} transition-all duration-500`}
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
};

// ================= PRODUCT CARD =================
const ProductCard = React.memo(({ product, isFavorite, onToggleFavorite, onAddToCart }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const mainImage = useMemo(() => 
    product.images?.[0]?.image_url || product.image || "/placeholder-product.jpg",
    [product.images, product.image]
  );

  const currentPrice = useMemo(() => 
    Number(product.price_uzs || product.price) || 0,
    [product.price_uzs, product.price]
  );

  const discount = product.discount;
  const hasDiscount = discount && discount.is_active;

  const discountedPrice = useMemo(() => {
    if (hasDiscount && discount.percent) {
      return currentPrice - (currentPrice * discount.percent / 100);
    }
    return null;
  }, [hasDiscount, discount, currentPrice]);

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link to={`/product/${product.id}`} className="block w-full h-full" prefetch="intent">
          <LazyImage
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onLoad={() => setImageLoaded(true)}
          />
        </Link>

        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(product)}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 active:scale-90 ${
            isFavorite 
              ? "bg-red-500 text-white" 
              : "bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500"
          }`}
          aria-label={isFavorite ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
        >
          {isFavorite ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
        </button>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
              <FaStar className="text-yellow-300" size={8} />
              -{Math.round(discount.percent)}%
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category/Unit */}
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
          {product.unit || "Tailor Premium"}
        </span>

        {/* Title */}
        <Link to={`/product/${product.id}`} prefetch="intent">
          <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 hover:text-red-500 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mb-3">
          {discountedPrice ? (
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-lg font-black text-red-600">
                {discountedPrice.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400 line-through">
                {currentPrice.toLocaleString()}
              </span>
              <span className="text-[8px] text-gray-500">so'm</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-gray-900">
                {currentPrice.toLocaleString()}
              </span>
              <span className="text-[9px] text-gray-500">so'm</span>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product, currentPrice, mainImage)}
          className="w-full bg-gray-900 hover:bg-red-500 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-bold text-[10px] uppercase tracking-wider active:scale-95"
        >
          <FaShoppingCart size={12} />
          <span>Savatga</span>
        </button>
      </div>
    </div>
  );
});

// ================= SUBCATEGORY CARD =================
const SubcategoryCard = React.memo(({ subcategory, onClick, isActive }) => {
  return (
    <button
      onClick={() => onClick(subcategory.id)}
      className={`group flex flex-col items-center text-center p-4 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'bg-red-50 border-2 border-red-500 shadow-lg' 
          : 'bg-white border border-gray-200 hover:border-red-300 hover:shadow-md'
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-colors ${
        isActive ? 'bg-red-500' : 'bg-gray-100 group-hover:bg-red-100'
      }`}>
        <FaTags className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-red-500'} size={18} />
      </div>
      <h4 className={`text-xs font-bold line-clamp-2 ${isActive ? 'text-red-600' : 'text-gray-700'}`}>
        {subcategory.name}
      </h4>
      {subcategory.productCount > 0 && (
        <span className={`text-[9px] font-medium mt-1 px-2 py-0.5 rounded-full ${
          isActive ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
        }`}>
          {subcategory.productCount}
        </span>
      )}
    </button>
  );
});

// ================= CATEGORY DETAIL =================
const CategoryDetail = ({ addToCart, favorites = [], toggleFavorite }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Use refs to track if component is mounted
  const isMounted = useRef(true);
  
  // State
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [showSubcategories, setShowSubcategories] = useState(true);
  
  // Sort and filter states
  const [sortBy, setSortBy] = useState('default');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  
  const productsPerPage = 12;
  const observerRef = useRef();
  const lastProductRef = useRef();
  const abortControllerRef = useRef();

  // Reset state when slug changes
  useEffect(() => {
    // Mark component as mounted
    isMounted.current = true;
    
    // Reset all states
    setCategory(null);
    setProducts([]);
    setLoading(true);
    setError(null);
    setSelectedSubcategory(null);
    setSortBy('default');
    setSortOrder('asc');
    setPage(1);
    setHasMore(true);
    setTotalProducts(0);
    
    // Fetch new data
    fetchCategoryData();
    
    // Cleanup function
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [slug]);

  // Fetch category data
  const fetchCategoryData = async () => {
    try {
      // Abort previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      
      setLoading(true);
      setError(null);
      
      // Check cache first
      const cacheKey = `category_${slug}`;
      const cached = cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        if (isMounted.current) {
          setCategory(cached.data.category);
          setProducts(cached.data.products);
          setTotalProducts(cached.data.total);
          setHasMore(cached.data.hasMore);
          setLoading(false);
        }
        return;
      }

      // Fetch category by slug
      const categoryResponse = await fetch(`${API_BASE}/categories/slug/${slug}`, { signal });
      
      if (!categoryResponse.ok) {
        throw new Error("Kategoriya topilmadi");
      }
      
      const categoryData = await categoryResponse.json();
      
      if (!isMounted.current) return;
      setCategory(categoryData);

      // Determine which categories to fetch products from
      let categoryIds = [categoryData.id];
      
      // If this is a parent category, include all child categories
      if (categoryData.children && categoryData.children.length > 0) {
        const childIds = categoryData.children.map(child => child.id);
        categoryIds = [...categoryIds, ...childIds];
      }

      // Fetch products
      const productResponse = await fetch(
        `${API_BASE}/products?${categoryIds.map(id => `category_id=${id}`).join('&')}&page=1&limit=${productsPerPage}`,
        { signal }
      );
      
      if (!productResponse.ok) {
        throw new Error("Mahsulotlarni olishda xatolik");
      }
      
      const productData = await productResponse.json();
      
      // Handle different response formats
      const productsArray = Array.isArray(productData) ? productData : productData.products || [];
      const total = productData.total || productsArray.length;
      
      // Filter only active products
      const activeProducts = productsArray.filter(p => p.is_active === true);
      
      if (!isMounted.current) return;
      
      setProducts(activeProducts);
      setTotalProducts(total);
      setHasMore(activeProducts.length === productsPerPage);

      // Cache the response
      cache.set(cacheKey, {
        data: {
          category: categoryData,
          products: activeProducts,
          total,
          hasMore: activeProducts.length === productsPerPage
        },
        timestamp: Date.now()
      });

    } catch (err) {
      if (err.name === 'AbortError') return;
      
      if (isMounted.current) {
        setError(err.message || "Xatolik yuz berdi");
      }
      console.error("Xatolik:", err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  // Load more products
  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore || !category) return;
    
    try {
      setLoading(true);
      
      const nextPage = page + 1;
      
      // Determine which categories to fetch products from
      let categoryIds = [category.id];
      if (category.children && category.children.length > 0) {
        const childIds = category.children.map(child => child.id);
        categoryIds = [...categoryIds, ...childIds];
      }
      
      const response = await fetch(
        `${API_BASE}/products?${categoryIds.map(id => `category_id=${id}`).join('&')}&page=${nextPage}&limit=${productsPerPage}`
      );
      
      if (!response.ok) return;
      
      const data = await response.json();
      
      // Handle different response formats
      const productsArray = Array.isArray(data) ? data : data.products || [];
      const activeProducts = productsArray.filter(p => p.is_active === true);
      
      if (!isMounted.current) return;
      
      setProducts(prev => [...prev, ...activeProducts]);
      setPage(nextPage);
      setHasMore(activeProducts.length === productsPerPage);
      
    } catch (err) {
      console.error("Yuklashda xatolik:", err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [category, page, hasMore, loading, productsPerPage]);

  // Filter products by selected subcategory
  const filteredProducts = useMemo(() => {
    if (!products.length) return [];
    
    let result = products;
    
    // Apply subcategory filter
    if (selectedSubcategory) {
      result = result.filter(p => p.category_id === selectedSubcategory);
    }
    
    // Apply sorting
    if (sortBy !== 'default') {
      result = [...result].sort((a, b) => {
        const aVal = sortBy === 'price' 
          ? Number(a.price_uzs || a.price) || 0
          : a.name;
        const bVal = sortBy === 'price'
          ? Number(b.price_uzs || b.price) || 0
          : b.name;
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }
    
    return result;
  }, [products, selectedSubcategory, sortBy, sortOrder]);

  // Infinite scroll observer
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    if (lastProductRef.current) {
      observer.observe(lastProductRef.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore, loadMoreProducts]);

  // Get subcategories with product counts
  const subcategoriesWithCounts = useMemo(() => {
    if (!category || !category.children) return [];
    
    return category.children.map(sub => ({
      ...sub,
      productCount: products.filter(p => p.category_id === sub.id).length
    })).filter(sub => sub.productCount > 0);
  }, [category, products]);

  const handleAddToCart = useCallback((product, price, image) => {
    addToCart({
      ...product,
      price: price,
      image: image,
      quantity: 1
    });
    
    // Show success feedback
    const btn = document.activeElement;
    btn.classList.add('bg-green-500');
    setTimeout(() => btn.classList.remove('bg-green-500'), 300);
  }, [addToCart]);

  const handleToggleFavorite = useCallback((product) => {
    toggleFavorite(product);
  }, [toggleFavorite]);

  const handleSortChange = useCallback((type) => {
    if (sortBy === type) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('asc');
    }
  }, [sortBy]);

  const handleSubcategoryClick = useCallback((subId) => {
    setSelectedSubcategory(prev => prev === subId ? null : subId);
    // Reset to first page when changing filter
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedSubcategory(null);
    setSortBy('default');
    setSortOrder('asc');
  }, []);

  // Loading state
  if (loading && page === 1 && !products.length) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Xatolik yuz berdi</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
          >
            Qayta urinish
          </button>
          <Link
            to="/"
            className="block mt-4 text-gray-500 hover:text-red-600 transition-colors"
          >
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  // Not found state
  if (!category && !loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Kategoriya topilmadi</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 font-bold"
          >
            <FaArrowLeft size={14} />
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    );
  }

  const isParentCategory = category?.children && category.children.length > 0;
  const displayProducts = filteredProducts;
  const displayTotal = selectedSubcategory ? displayProducts.length : totalProducts;

  return (
    <>
      <Helmet>
        <title>{category?.name} | TailorShop.uz – Tikuvchilik jihozlari</title>
        <meta
          name="description"
          content={`${category?.name} – ${isParentCategory ? 'Barcha turdagi' : ''} tikuvchilik uchun sifatli mahsulotlar. TailorShop.uz Namangan.`}
        />
        <meta property="og:title" content={`${category?.name} | TailorShop.uz`} />
        <meta property="og:description" content={`${category?.name} – Tikuvchilik uchun eng yaxshi tanlov`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://tailorshop.uz/category/${slug}`} />
        <link rel="canonical" href={`https://tailorshop.uz/category/${slug}`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-red-600 transition-colors">
            Bosh sahifa
          </Link>
          <span>/</span>
          {category?.parent && (
            <>
              <Link to={`/category/${category.parent.slug}`} className="hover:text-red-600 transition-colors">
                {category.parent.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900 font-medium">{category?.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors mb-4 group"
          >
            <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Orqaga</span>
          </Link>

          <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
            <span className="text-red-600">#</span> {category?.name}
          </h1>
          
          {category?.description && (
            <p className="mt-3 text-gray-600 max-w-2xl text-sm">{category.description}</p>
          )}

          {/* Total products */}
          <div className="mt-3 flex items-center gap-2">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold">
              {displayTotal} ta mahsulot
            </span>
            {selectedSubcategory && (
              <button
                onClick={clearFilters}
                className="text-gray-500 hover:text-red-600 text-xs underline"
              >
                Filtrni tozalash
              </button>
            )}
          </div>
        </div>

        {/* Subcategories - only show if this is a parent category and has children */}
        {isParentCategory && subcategoriesWithCounts.length > 0 && (
          <div className="mb-10">
            <button
              onClick={() => setShowSubcategories(!showSubcategories)}
              className="flex items-center gap-2 text-gray-700 font-bold mb-4"
            >
              <FaLayerGroup className="text-red-600" size={16} />
              <span className="text-sm uppercase tracking-wider">ICHKI KATEGORIYALAR</span>
              {showSubcategories ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>

            {showSubcategories && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {subcategoriesWithCounts.map((sub) => (
                  <SubcategoryCard
                    key={sub.id}
                    subcategory={sub}
                    onClick={handleSubcategoryClick}
                    isActive={selectedSubcategory === sub.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products Section */}
        <div>
          {/* Header with filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
              <FaBoxes className="text-red-600" size={16} />
              <span>MAHSULOTLAR</span>
              {selectedSubcategory && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (filtrlangan)
                </span>
              )}
            </h2>

            {/* Filter Controls */}
            <div className="flex items-center gap-2">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-xl text-xs font-medium"
              >
                <FaFilter size={12} />
                Saralash
              </button>

              {/* Sort buttons */}
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={() => handleSortChange('default')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    sortBy === 'default' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Standart
                </button>
                <button
                  onClick={() => handleSortChange('name')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 ${
                    sortBy === 'name' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Nomi
                  {sortBy === 'name' && (
                    sortOrder === 'asc' ? <FaSortAmountUp size={10} /> : <FaSortAmountDown size={10} />
                  )}
                </button>
                <button
                  onClick={() => handleSortChange('price')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 ${
                    sortBy === 'price' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Narx
                  {sortBy === 'price' && (
                    sortOrder === 'asc' ? <FaSortAmountUp size={10} /> : <FaSortAmountDown size={10} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filters Drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex items-end">
              <div className="bg-white w-full rounded-t-2xl p-5 animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold">Saralash</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      handleSortChange('default');
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm ${
                      sortBy === 'default' ? 'bg-red-50 text-red-600' : 'bg-gray-100'
                    }`}
                  >
                    Standart
                  </button>
                  <button
                    onClick={() => {
                      handleSortChange('name');
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm flex items-center justify-between ${
                      sortBy === 'name' ? 'bg-red-50 text-red-600' : 'bg-gray-100'
                    }`}
                  >
                    <span>Nomi</span>
                    {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button
                    onClick={() => {
                      handleSortChange('price');
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm flex items-center justify-between ${
                      sortBy === 'price' ? 'bg-red-50 text-red-600' : 'bg-gray-100'
                    }`}
                  >
                    <span>Narx</span>
                    {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {displayProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {displayProducts.map((product, index) => (
                  <div
                    key={product.id}
                    ref={index === displayProducts.length - 1 ? lastProductRef : null}
                  >
                    <ProductCard
                      product={product}
                      isFavorite={favorites?.some(f => f.id === product.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>

              {/* Loading more indicator */}
              {loading && page > 1 && (
                <div className="text-center py-6">
                  <FaSpinner className="animate-spin text-xl text-red-600 mx-auto" />
                </div>
              )}

              {/* No more products */}
              {!hasMore && displayProducts.length < totalProducts && (
                <p className="text-center text-gray-500 text-xs mt-6">
                  Barcha mahsulotlar ko'rsatildi
                </p>
              )}
            </>
          ) : (
            <div className="py-16 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <FaBoxes className="text-3xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-medium text-sm mb-3">
                {selectedSubcategory ? "Bu bo'limda mahsulotlar topilmadi" : "Mahsulotlar topilmadi"}
              </p>
              {selectedSubcategory && (
                <button
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-800 text-xs font-medium underline"
                >
                  Filtrni tozalash
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(CategoryDetail);