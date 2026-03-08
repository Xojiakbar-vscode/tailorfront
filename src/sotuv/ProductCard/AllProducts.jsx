import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaArrowLeft, FaSearch, FaFilter, FaTimes, FaStar, 
  FaShoppingCart, FaHeart, FaRegHeart, FaPercent, 
  FaChevronDown, FaUndoAlt, FaChevronRight, FaSpinner,
  FaCheck, FaBars, FaThLarge, FaSortAmountDown
} from 'react-icons/fa';

const API_URL = "https://tailorback2025-production.up.railway.app/api/products";
const CATEGORIES_URL = "https://tailorback2025-production.up.railway.app/api/categories";
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Cache for API responses
const cache = new Map();
const DEBOUNCE_DELAY = 500;
const ITEMS_PER_PAGE = 12;

// ================= UTILITY FUNCTIONS =================
const formatPrice = (price) => {
  const num = Number(price) || 0;
  return num.toLocaleString('uz-UZ') + " SO'M";
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// ================= LAZY IMAGE COMPONENT =================
const LazyImage = React.memo(({ src, alt, className, onLoad, onError }) => {
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
      { rootMargin: "50px 0px", threshold: 0.01 }
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

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
      {!isLoaded && !error && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        </div>
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
        className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

// ================= CATEGORY TREE COMPONENT =================
const CategoryTree = React.memo(({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  expandedCategories, 
  onToggleExpand,
  productCountByCategory 
}) => {
  
  const renderCategory = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.includes(category.id);
    const isSelected = selectedCategory === category.id.toString();
    const productCount = productCountByCategory[category.id] || 0;
    
    return (
      <div key={category.id} className="w-full">
        <div 
          className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl text-xs font-bold uppercase transition-all mb-1 ${
            isSelected 
              ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-100' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          style={{ paddingLeft: `${Math.min(level * 20 + 16, 60)}px` }}
        >
          <button
            onClick={() => onSelectCategory(category.id.toString())}
            className="flex-1 text-left truncate"
            title={category.name}
          >
            {category.name}
            {productCount > 0 && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                isSelected ? 'bg-red-400' : 'bg-gray-200'
              }`}>
                {productCount}
              </span>
            )}
          </button>
          
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(category.id);
              }}
              className={`p-1.5 rounded-lg transition-all duration-300 ${
                isSelected ? 'hover:bg-red-700' : 'hover:bg-gray-200'
              }`}
              aria-label={isExpanded ? "Yopish" : "Ochish"}
            >
              <FaChevronDown 
                className={`transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`} 
                size={10} 
              />
            </button>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-4 mt-1 border-l-2 border-red-100 pl-2">
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar pr-2">
      <button 
        onClick={() => onSelectCategory('all')} 
        className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold uppercase transition-all mb-2 ${
          selectedCategory === 'all' 
            ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-100' 
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
        }`}
      >
        Barcha mahsulotlar
        {productCountByCategory.total > 0 && (
          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
            selectedCategory === 'all' ? 'bg-red-400' : 'bg-gray-200'
          }`}>
            {productCountByCategory.total}
          </span>
        )}
      </button>
      
      {categories.map(category => renderCategory(category))}
    </div>
  );
});

CategoryTree.displayName = 'CategoryTree';

// ================= PRODUCT CARD COMPONENT =================
const ProductCard = React.memo(({ product, isFavorite, onToggleFavorite, onAddToCart, index, viewMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const finalPrice = useMemo(() => {
    let price = Number(product.price_uzs || product.price || 0);
    const discount = product.discount;
    if (discount?.is_active) {
      if (discount.percent) {
        price = price * (1 - Math.min(Number(discount.percent), 100) / 100);
      } else if (discount.amount) {
        price = Math.max(0, price - Number(discount.amount));
      }
    }
    return Math.round(price);
  }, [product]);

  const originalPrice = useMemo(() => 
    Number(product.price_uzs || product.price || 0),
    [product]
  );

  const isDiscountActive = useMemo(() => 
    product.discount?.is_active && (product.discount.percent || product.discount.amount),
    [product.discount]
  );

  const discountPercentage = useMemo(() => {
    if (!isDiscountActive) return 0;
    if (product.discount?.percent) return Number(product.discount.percent);
    if (product.discount?.amount) {
      return Math.round((Number(product.discount.amount) / originalPrice) * 100);
    }
    return 0;
  }, [isDiscountActive, product.discount, originalPrice]);

  const mainImg = useMemo(() => {
    if (product.images?.length > 0) {
      return product.images[0].image_url;
    }
    return "https://geostudy.uz/img/pictures/cifvooipg_rf1.jpeg";
  }, [product.images]);

  const hoverImg = useMemo(() => {
    if (product.images?.length > 1) {
      return product.images[1].image_url;
    }
    return mainImg;
  }, [product.images, mainImg]);

  const handleAddToCart = useCallback(() => {
    onAddToCart({
      ...product,
      finalPrice,
      image: mainImg,
      quantity: 1
    });
  }, [product, finalPrice, mainImg, onAddToCart]);

  const handleFavoriteToggle = useCallback(() => {
    onToggleFavorite(product);
  }, [product, onToggleFavorite]);

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white rounded-3xl p-4 border border-gray-100 hover:border-red-600/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 animate-fadeIn group"
        style={{ animationDelay: `${index * 50}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="relative w-full sm:w-48 h-48 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
            <Link to={`/product/${product.id}`} className="block w-full h-full">
              <LazyImage 
                src={isHovered ? hoverImg : mainImg} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
            </Link>
            
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isDiscountActive && (
                <div className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
                  <FaPercent size={8}/> -{discountPercentage}%
                </div>
              )}
              {product.is_latest && (
                <span className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg">
                  YANGI
                </span>
              )}
            </div>

            <button
              onClick={handleFavoriteToggle}
              className={`absolute top-3 right-3 p-3 rounded-xl backdrop-blur-md transition-all active:scale-75 shadow-lg ${
                isFavorite 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white/90 text-gray-400 hover:text-red-600'
              }`}
              aria-label={isFavorite ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
            >
              {isFavorite ? <FaHeart size={14}/> : <FaRegHeart size={14}/>}
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Tailor Premium
                </span>
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mt-1 group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-50 px-2 py-1 rounded-lg">
                <FaStar size={12}/> 5.0
              </div>
            </div>

            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {product.description}
              </p>
            )}

            <div className="mt-auto">
              <div className="flex items-baseline gap-3 mb-4">
                <p className="text-2xl font-black text-red-600">
                  {formatPrice(finalPrice)}
                </p>
                {isDiscountActive && (
                  <p className="text-sm text-gray-400 line-through">
                    {formatPrice(originalPrice)}
                  </p>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full sm:w-auto px-8 py-4 bg-gray-950 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-red-600/30 group/btn"
              >
                <FaShoppingCart size={14} className="group-hover/btn:animate-bounce" />
                <span className="text-xs font-bold uppercase">Savatga Qo'shish</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group bg-white rounded-3xl p-3 sm:p-4 border border-transparent hover:border-red-600/20 transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-2xl hover:-translate-y-2 animate-slideUp"
      style={{ animationDelay: `${index * 60}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-gray-50">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <LazyImage 
            src={isHovered && product.images?.length > 1 ? hoverImg : mainImg} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          />
        </Link>
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isDiscountActive && (
            <div className="bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded-lg animate-pulse shadow-lg flex items-center gap-1">
              <FaPercent size={8}/> -{discountPercentage}%
            </div>
          )}
          {product.is_latest && (
            <span className="bg-black text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg">
              NEW
            </span>
          )}
        </div>

        <button
          onClick={handleFavoriteToggle}
          className={`absolute top-3 right-3 p-3 rounded-xl backdrop-blur-md transition-all active:scale-75 shadow-lg ${
            isFavorite 
              ? 'bg-red-600 text-white' 
              : 'bg-white/90 text-gray-400 hover:text-red-600'
          }`}
          aria-label={isFavorite ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
        >
          {isFavorite ? <FaHeart size={14}/> : <FaRegHeart size={14}/>}
        </button>
      </div>

      <div className="flex flex-col flex-grow px-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">
            Tailor
          </span>
          <div className="flex items-center gap-1 text-[9px] font-bold text-orange-400">
            <FaStar size={9}/> 5.0
          </div>
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 mb-3 leading-tight group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto">
          <div className="mb-3">
            <p className="text-base sm:text-lg font-black text-red-600">
              {formatPrice(finalPrice)}
            </p>
            {isDiscountActive && (
              <p className="text-[9px] text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full py-3.5 bg-gray-950 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all duration-300 active:scale-95 text-[9px] font-bold uppercase shadow-lg hover:shadow-red-600/30 group/btn"
          >
            <FaShoppingCart size={12} className="group-hover/btn:animate-bounce" />
            Savatga Qo'shish
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

// ================= SKELETON LOADER =================
const SkeletonLoader = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white rounded-3xl p-4">
        <div className="aspect-[3/4] bg-gray-200 rounded-2xl mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-8 bg-gray-200 rounded-xl" />
      </div>
    ))}
  </div>
);

// ================= MAIN COMPONENT =================
const AllProducts = ({ addToCart, favorites = [], toggleFavorite }) => {
  // State declarations
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [maxPrice, setMaxPrice] = useState(20000000);
  const [productCountByCategory, setProductCountByCategory] = useState({ total: 0 });
  
  // Refs
  const abortControllerRef = useRef();
  const isMounted = useRef(true);
  const searchInputRef = useRef(null);
  const productsRef = useRef(null);

  const location = useLocation();

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Get all child category IDs recursively
  const getAllChildIds = useCallback((categoryId, allCats = categories) => {
    const category = allCats.find(c => c.id === parseInt(categoryId));
    if (!category) return [];
    
    let ids = [parseInt(categoryId)];
    
    if (category.children && category.children.length > 0) {
      category.children.forEach(child => {
        ids.push(child.id);
        const childIds = getAllChildIds(child.id, allCats);
        ids = [...ids, ...childIds];
      });
    }
    
    return [...new Set(ids)];
  }, [categories]);

  // Calculate product counts by category
  const calculateCategoryCounts = useCallback((productsList) => {
    const counts = { total: productsList.length };
    
    productsList.forEach(product => {
      const catId = product.category_id;
      counts[catId] = (counts[catId] || 0) + 1;
    });
    
    return counts;
  }, []);

  // Initial data fetch
  useEffect(() => {
    isMounted.current = true;
    
    const searchParams = new URLSearchParams(location.search);
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    
    fetchAllData();
    
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [location]);

  // Apply filters when dependencies change
  useEffect(() => {
    if (products.length > 0) {
      applyFilters();
    }
  }, [debouncedSearchTerm, selectedCategory, sortBy, priceRange, selectedTags, products]);

  const fetchAllData = async () => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      
      // Check cache
      const cacheKey = 'all_products_data';
      const cached = cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        if (isMounted.current) {
          setProducts(cached.data.products);
          setCategories(cached.data.categories);
          
          const maxP = cached.data.products.length > 0 
            ? Math.max(...cached.data.products.map(p => Number(p.price_uzs || p.price || 0))) 
            : 20000000;
          setMaxPrice(maxP);
          setPriceRange([0, maxP]);
          
          setProductCountByCategory(calculateCategoryCounts(cached.data.products));
          setLoading(false);
          setInitialLoad(false);
        }
        return;
      }

      const [productsRes, categoriesRes] = await Promise.all([
        fetch(API_URL, { signal }),
        fetch(CATEGORIES_URL, { signal })
      ]);
      
      if (!productsRes.ok || !categoriesRes.ok) {
        throw new Error('Network response was not ok');
      }
      
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      
      // Build category tree
      const categoryMap = {};
      const rootCategories = [];
      
      categoriesData.forEach(cat => {
        categoryMap[cat.id] = { ...cat, children: [] };
      });
      
      categoriesData.forEach(cat => {
        if (cat.parent_id === null) {
          rootCategories.push(categoryMap[cat.id]);
        } else if (categoryMap[cat.parent_id]) {
          categoryMap[cat.parent_id].children.push(categoryMap[cat.id]);
        }
      });
      
      // Sort categories by name
      const sortCategories = (cats) => {
        cats.sort((a, b) => a.name.localeCompare(b.name));
        cats.forEach(cat => {
          if (cat.children.length > 0) {
            sortCategories(cat.children);
          }
        });
      };
      sortCategories(rootCategories);
      
      // Filter active products
      const activeProducts = productsData.filter(p => p.is_active !== false);
      
      if (!isMounted.current) return;
      
      setProducts(activeProducts);
      setFilteredProducts(activeProducts);
      setCategories(rootCategories);
      
      const maxP = activeProducts.length > 0 
        ? Math.max(...activeProducts.map(p => Number(p.price_uzs || p.price || 0))) 
        : 20000000;
      setMaxPrice(maxP);
      setPriceRange([0, maxP]);

      setProductCountByCategory(calculateCategoryCounts(activeProducts));

      // Cache the response
      cache.set(cacheKey, {
        data: {
          products: activeProducts,
          categories: rootCategories
        },
        timestamp: Date.now()
      });
      
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Xatolik:', error);
      
      if (isMounted.current) {
        // Show error UI
        setProducts([]);
        setFilteredProducts([]);
      }
    } finally {
      if (isMounted.current) {
        setTimeout(() => {
          setLoading(false);
          setInitialLoad(false);
        }, 500);
      }
    }
  };

  const calculateFinalPrice = useCallback((product) => {
    let price = Number(product.price_uzs || product.price || 0);
    const discount = product.discount;
    if (discount?.is_active) {
      if (discount.percent) {
        price = price * (1 - Math.min(Number(discount.percent), 100) / 100);
      } else if (discount.amount) {
        price = Math.max(0, price - Number(discount.amount));
      }
    }
    return Math.round(price);
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...products];

    // Search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      const categoryIds = getAllChildIds(selectedCategory, categories);
      filtered = filtered.filter(product => 
        categoryIds.includes(product.category_id)
      );
    }

    // Price filter
    filtered = filtered.filter(product => {
      const p = Number(product.price_uzs || product.price || 0);
      return p >= priceRange[0] && p <= priceRange[1];
    });

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(product => {
        const productTags = [];
        if (product.is_latest) productTags.push('latest');
        if (product.is_popular) productTags.push('popular');
        if (product.discount?.is_active) productTags.push('discount');
        
        return selectedTags.some(tag => productTags.includes(tag));
      });
    }

    // Sorting
    switch (sortBy) {
      case 'price_low': 
        filtered.sort((a, b) => calculateFinalPrice(a) - calculateFinalPrice(b)); 
        break;
      case 'price_high': 
        filtered.sort((a, b) => calculateFinalPrice(b) - calculateFinalPrice(a)); 
        break;
      case 'newest': 
        filtered.sort((a, b) => {
          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          return dateB - dateA;
        }); 
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default: break;
    }

    if (isMounted.current) {
      setFilteredProducts(filtered);
      setPage(1);
    }
  }, [products, debouncedSearchTerm, selectedCategory, sortBy, priceRange, selectedTags, categories, calculateFinalPrice, getAllChildIds]);

  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setShowFilters(false);
    
    // Update URL
    const url = new URL(window.location);
    if (categoryId === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', categoryId);
    }
    window.history.pushState({}, '', url);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleToggleExpand = useCallback((categoryId) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const handleAddToCart = useCallback((product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.finalPrice || calculateFinalPrice(product),
      image: product.image || product.images?.[0]?.image_url,
      quantity: 1
    });
    
    // Show success feedback
    const event = new CustomEvent('cart-updated', { 
      detail: { message: 'Mahsulot savatga qo\'shildi' } 
    });
    window.dispatchEvent(event);
  }, [addToCart, calculateFinalPrice]);

  const handleToggleFavorite = useCallback((product) => {
    toggleFavorite(product);
    
    // Show feedback
    const isFav = favorites.some(f => f.id === product.id);
    const event = new CustomEvent('favorite-updated', { 
      detail: { 
        message: isFav ? 'Sevimlilardan olib tashlandi' : 'Sevimlilarga qo\'shildi'
      } 
    });
    window.dispatchEvent(event);
  }, [toggleFavorite, favorites]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedCategory('all');
    setSortBy('default');
    setSelectedTags([]);
    setExpandedCategories([]);
    setPriceRange([0, maxPrice]);
    
    // Update URL
    const url = new URL(window.location);
    url.searchParams.delete('category');
    window.history.pushState({}, '', url);
    
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
  }, [maxPrice]);

  const handlePriceChange = useCallback((value) => {
    setPriceRange([priceRange[0], parseInt(value)]);
  }, [priceRange]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  
  const currentProducts = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  const paginationRange = useMemo(() => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;
    
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }
    
    for (let i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      l = i;
    }
    
    return rangeWithDots;
  }, [totalPages, page]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage === '...') return;
    setPage(newPage);
    
    // Smooth scroll to products
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const sortOptions = [
    { value: 'default', label: 'Odatiy' },
    { value: 'price_low', label: 'Narxi: arzondan qimmatga' },
    { value: 'price_high', label: 'Narxi: qimmatdan arzonga' },
    { value: 'newest', label: 'Eng yangilar' },
    { value: 'name_asc', label: 'Nomi: A dan Z gacha' },
    { value: 'name_desc', label: 'Nomi: Z dan A gacha' }
  ];

  const tagOptions = [
    { value: 'latest', label: 'Yangi', color: 'bg-blue-500' },
    { value: 'popular', label: 'Ommabop', color: 'bg-orange-500' },
    { value: 'discount', label: 'Chegirma', color: 'bg-green-500' }
  ];

  // Loading state
  if (initialLoad) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-red-600 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>
        <p className="mt-6 text-gray-400 font-bold tracking-widest uppercase text-xs animate-pulse">
          TailorShop yuklanmoqda...
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Barcha mahsulotlar | TailorShop.uz – Furnitura katalogi</title>
        <meta name="description" content="TailorShop.uz katalogida ip, tugma, zamok va barcha turdagi tikuvchilik furnituralarini toping. 5000+ mahsulot, tezkor yetkazib berish." />
        <link rel="canonical" href="https://tailorshop.uz/all-products" />
        <meta property="og:title" content="Barcha mahsulotlar | TailorShop.uz" />
        <meta property="og:description" content="Eng sifatli tikuvchilik anjomlari va aksessuarlari." />
        <meta property="og:url" content="https://tailorshop.uz/all-products" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://tailorshop.uz/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TailorShop.uz – Tikuvchilik furnituralari" />
        <meta name="twitter:description" content="Barcha turdagi tikuvchilik anjomlari" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Barcha Mahsulotlar Katalogi",
            "description": "TailorShop tikuvchilik furnituralari to'plami",
            "url": "https://tailorshop.uz/all-products",
            "numberOfItems": filteredProducts.length,
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": filteredProducts.slice(0, 10).map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `https://tailorshop.uz/product/${product.id}`,
                "name": product.name
              }))
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20" ref={productsRef}>
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform group flex-shrink-0">
                <div className="bg-red-600 p-2.5 rounded-xl shadow-lg shadow-red-200 group-hover:rotate-[-10deg] transition-all">
                  <FaArrowLeft className="text-white text-sm" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter">Katalog</h1>
              </Link>

              <div className="flex-1 max-w-2xl relative group">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Mahsulotlarni qidirish..."
                  defaultValue={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-gray-100 border-2 border-transparent focus:bg-white focus:border-red-600/20 focus:ring-4 focus:ring-red-600/5 rounded-2xl outline-none text-sm font-medium transition-all"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <FaTimes size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="hidden sm:flex p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  aria-label={viewMode === 'grid' ? 'Ro\'yxat ko\'rinishi' : 'Katak ko\'rinishi'}
                >
                  {viewMode === 'grid' ? <FaBars size={16} /> : <FaThLarge size={16} />}
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all active:scale-95 text-sm font-bold ${
                    showFilters 
                      ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-200' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaFilter className={showFilters ? 'rotate-180 transition-transform' : ''} />
                  <span className="hidden sm:inline">Filtrlar</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar */}
            <aside className={`lg:w-80 lg:block transition-all duration-500 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-gray-200/50 sticky top-24 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black uppercase text-xs tracking-wider text-red-600 flex items-center gap-2">
                    <FaFilter size={12} />
                    Filtrlar
                  </h3>
                  <button 
                    onClick={resetFilters} 
                    className="text-gray-300 hover:text-red-600 transition-colors active:rotate-180 duration-500 text-sm flex items-center gap-1"
                    title="Filtrlarni tozalash"
                  >
                    <FaUndoAlt size={12}/>
                    <span className="text-[10px] font-medium">Tozalash</span>
                  </button>
                </div>

                <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar pr-2">
                  {/* Categories */}
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-red-600 rounded-full"></span>
                      Kategoriyalar
                    </h4>
                    
                    <CategoryTree
                      categories={categories}
                      selectedCategory={selectedCategory}
                      onSelectCategory={handleCategorySelect}
                      expandedCategories={expandedCategories}
                      onToggleExpand={handleToggleExpand}
                      productCountByCategory={productCountByCategory}
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-red-600 rounded-full"></span>
                      Narx oralig'i
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-600">Min: {formatPrice(priceRange[0])}</span>
                        <span className="text-xs font-bold text-red-600">Max: {formatPrice(priceRange[1])}</span>
                      </div>
                      
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        step="1000"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        className="w-full accent-red-600 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                      />
                      
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="0"
                          max={priceRange[1]}
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value) || 0, priceRange[1]), priceRange[1]])}
                          className="w-full px-3 py-2 bg-gray-50 rounded-xl text-xs font-bold border border-gray-200 focus:border-red-600 outline-none"
                          placeholder="Min"
                        />
                        <input
                          type="number"
                          min={priceRange[0]}
                          max={maxPrice}
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Math.min(parseInt(e.target.value) || maxPrice, maxPrice)])}
                          className="w-full px-3 py-2 bg-gray-50 rounded-xl text-xs font-bold border border-gray-200 focus:border-red-600 outline-none"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-red-600 rounded-full"></span>
                      Maxsus teglar
                    </h4>
                    
                    <div className="flex flex-wrap gap-2">
                      {tagOptions.map(tag => (
                        <button
                          key={tag.value}
                          onClick={() => setSelectedTags(prev =>
                            prev.includes(tag.value) 
                              ? prev.filter(t => t !== tag.value)
                              : [...prev, tag.value]
                          )}
                          className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase transition-all flex items-center gap-1 ${
                            selectedTags.includes(tag.value)
                              ? `${tag.color} text-white shadow-lg`
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {selectedTags.includes(tag.value) && <FaCheck size={8} />}
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-red-600 rounded-full"></span>
                      <FaSortAmountDown size={10} />
                      Saralash
                    </h4>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-red-600/20 appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        backgroundSize: '14px'
                      }}
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Active Filters Summary */}
                  {(selectedCategory !== 'all' || searchTerm || sortBy !== 'default' || selectedTags.length > 0) && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-[9px] font-bold text-gray-400 mb-2">Faol filtrlar:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedCategory !== 'all' && (
                          <span className="text-[8px] bg-red-50 text-red-600 px-2 py-1 rounded-full font-bold">
                            Kategoriya
                          </span>
                        )}
                        {searchTerm && (
                          <span className="text-[8px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold truncate max-w-[100px]">
                            "{searchTerm}"
                          </span>
                        )}
                        {selectedTags.map(tag => (
                          <span key={tag} className="text-[8px] bg-green-50 text-green-600 px-2 py-1 rounded-full font-bold">
                            {tagOptions.find(t => t.value === tag)?.label}
                          </span>
                        ))}
                        {sortBy !== 'default' && (
                          <span className="text-[8px] bg-purple-50 text-purple-600 px-2 py-1 rounded-full font-bold">
                            Saralash
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <section className="flex-1">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <p className="text-xs font-bold text-gray-500">
                  <span className="text-red-600 text-lg font-black">{filteredProducts.length}</span> ta mahsulot
                </p>
                
                <div className="flex items-center gap-2">
                  {loading && (
                    <FaSpinner className="animate-spin text-red-600" size={14} />
                  )}
                  
                  {/* Mobile view toggle */}
                  <button
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="sm:hidden p-2 rounded-xl bg-gray-100 text-gray-600"
                  >
                    {viewMode === 'grid' ? <FaBars size={14} /> : <FaThLarge size={14} />}
                  </button>
                </div>
              </div>

              {loading ? (
                <SkeletonLoader />
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 sm:py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 animate-fadeIn">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FaSearch className="text-gray-300 text-3xl sm:text-4xl" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black uppercase italic tracking-tighter text-gray-800 mb-2">
                    Mahsulot topilmadi
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-6 max-w-md mx-auto px-4">
                    Qidiruv so'rovingiz bo'yicha hech qanday mahsulot topilmadi. Boshqa filtr yoki qidiruv so'zini sinab ko'ring.
                  </p>
                  <button 
                    onClick={resetFilters} 
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-950 text-white rounded-xl font-black uppercase text-[10px] sm:text-xs hover:bg-red-600 transition-all shadow-xl inline-flex items-center gap-2"
                  >
                    <FaUndoAlt size={12} />
                    Filtrlarni tozalash
                  </button>
                </div>
              ) : (
                <>
                  <div className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6' 
                      : 'flex flex-col gap-4'
                  }>
                    {currentProducts.map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isFavorite={favorites.some(fav => fav.id === product.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onAddToCart={handleAddToCart}
                        index={idx}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-10 sm:mt-16 flex justify-center items-center gap-1 sm:gap-2">
                      <button 
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)}
                        className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl border border-gray-200 bg-white text-gray-500 flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all shadow-sm hover:border-red-600 hover:text-red-600"
                        aria-label="Oldingi sahifa"
                      >
                        ←
                      </button>
                      
                      {paginationRange.map((p, i) => (
                        <button
                          key={i}
                          disabled={p === '...'}
                          onClick={() => handlePageChange(p)}
                          className={`min-w-[2rem] sm:min-w-[2.5rem] h-9 sm:h-11 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                            page === p 
                              ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-200' 
                              : p === '...'
                                ? 'bg-transparent cursor-default text-gray-400'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-red-600 hover:text-red-600'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      
                      <button 
                        disabled={page === totalPages}
                        onClick={() => handlePageChange(page + 1)}
                        className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl border border-gray-200 bg-white text-gray-500 flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all shadow-sm hover:border-red-600 hover:text-red-600"
                        aria-label="Keyingi sahifa"
                      >
                        →
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer {
          animation: shimmer 2s infinite;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fee2e2;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #fecaca;
        }
        
        input[type=range] {
          -webkit-appearance: none;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background: #ef4444;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
          transition: all 0.2s;
          border: 2px solid white;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          background: #dc2626;
        }
        
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
        
        @media (max-width: 640px) {
          .animate-slideUp {
            animation-duration: 0.4s;
          }
        }
      `}</style>
    </>
  );
};

export default React.memo(AllProducts);