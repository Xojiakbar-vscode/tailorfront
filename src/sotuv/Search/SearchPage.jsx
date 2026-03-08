import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AiOutlineSearch,
  AiOutlineArrowLeft,
  AiOutlineClose,
  AiOutlineHistory,
  AiOutlineDelete
} from "react-icons/ai";
import {
  FaStar,
  FaShoppingCart,
  FaFire,
  FaPercent,
  FaRegHeart,
  FaHeart,
  FaFilter,
  FaTruck,
  FaShieldAlt,
  FaSpinner,
  FaChevronDown,
  FaUndoAlt,
  FaCheck
} from "react-icons/fa";

const API_BASE = "https://tailorback2025-production.up.railway.app/api";
const PLACEHOLDER_IMAGE = "https://geostudy.uz/img/pictures/cifvooipg_rf1.jpeg";
const SEARCH_HISTORY_KEY = "tailor_search_history";
const MAX_HISTORY_ITEMS = 10;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

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

// ================= OPTIMIZED LAZY IMAGE =================
const LazyImage = React.memo(({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setError(true);
          setIsLoaded(true);
        }}
        loading="lazy"
        decoding="async"
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

// ================= FILTER SIDEBAR =================
const FilterSidebar = React.memo(({
  show,
  onClose,
  filters,
  onFilterChange,
  categories,
  selectedCategory,
  onCategorySelect,
  onToggleExpand,
  expandedCategories,
  productCountByCategory,
  priceRange,
  onPriceChange,
  maxPrice,
  sortBy,
  onResetFilters
}) => {
  if (!show) return null;

  const tagOptions = [
    { value: 'discount', label: 'Chegirma' },
    { value: 'bestSeller', label: 'Ommabop' },
    { value: 'latest', label: 'Yangi' }
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl animate-slideLeft p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
            <FaFilter size={14} className="text-red-600" />
            Filtrlar
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <AiOutlineClose size={18} />
          </button>
        </div>

        {/* Kategoriyalar */}
        <div className="mb-6">
          <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-red-600 rounded-full"></span>
            Kategoriyalar
          </h4>
          <CategoryTree
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={onCategorySelect}
            expandedCategories={expandedCategories}
            onToggleExpand={onToggleExpand}
            productCountByCategory={productCountByCategory}
          />
        </div>

        {/* Narx oralig'i */}
        <div className="mb-6">
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
              onChange={(e) => onPriceChange([0, parseInt(e.target.value)])}
              className="w-full accent-red-600 h-1.5 bg-gray-100 rounded-lg"
            />
            
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min="0"
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) => onPriceChange([Math.min(parseInt(e.target.value) || 0, priceRange[1]), priceRange[1]])}
                className="w-full px-3 py-2 bg-gray-50 rounded-xl text-xs font-bold border border-gray-200 focus:border-red-600 outline-none"
                placeholder="Min"
              />
              <input
                type="number"
                min={priceRange[0]}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => onPriceChange([priceRange[0], Math.min(parseInt(e.target.value) || maxPrice, maxPrice)])}
                className="w-full px-3 py-2 bg-gray-50 rounded-xl text-xs font-bold border border-gray-200 focus:border-red-600 outline-none"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* Maxsus teglar */}
        <div className="mb-6">
          <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-red-600 rounded-full"></span>
            Maxsus teglar
          </h4>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map(tag => (
              <button
                key={tag.value}
                onClick={() => onFilterChange(tag.value)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase transition-all flex items-center gap-1 ${
                  filters.includes(tag.value)
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filters.includes(tag.value) && <FaCheck size={8} />}
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Saralash */}
        <div className="mb-6">
          <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-red-600 rounded-full"></span>
            Saralash
          </h4>
          <select
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-red-600/20 appearance-none cursor-pointer"
            onChange={(e) => onFilterChange('sort', e.target.value)}
            value={sortBy}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '14px'
            }}
          >
            <option value="default">Odatiy</option>
            <option value="price_low">Narx: arzondan qimmatga</option>
            <option value="price_high">Narx: qimmatdan arzonga</option>
            <option value="newest">Eng yangilar</option>
          </select>
        </div>

        {/* Reset Filters */}
        <button
          onClick={onResetFilters}
          className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <FaUndoAlt size={12} />
          Filtrlarni tozalash
        </button>
      </div>
    </div>
  );
});

FilterSidebar.displayName = 'FilterSidebar';

// ================= SEARCH HISTORY COMPONENT =================
const SearchHistory = React.memo(({ history, onSelect, onClear, onRemove }) => {
  if (!history.length) return null;

  return (
    <div className="mb-8 bg-white rounded-2xl p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AiOutlineHistory className="text-gray-400" size={18} />
          <h3 className="text-xs font-black text-gray-600 uppercase tracking-wider">
            So'nggi qidiruvlar
          </h3>
        </div>
        <button
          onClick={onClear}
          className="text-gray-400 hover:text-red-600 transition-colors text-[9px] font-bold uppercase flex items-center gap-1"
        >
          <AiOutlineDelete size={12} />
          Tozalash
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {history.map((term, idx) => (
          <div
            key={idx}
            className="group flex items-center gap-1 bg-gray-50 hover:bg-red-50 px-3 py-1.5 rounded-full transition-all"
          >
            <button
              onClick={() => onSelect(term)}
              className="text-xs font-medium text-gray-600 group-hover:text-red-600"
            >
              {term}
            </button>
            <button
              onClick={() => onRemove(term)}
              className="text-gray-300 hover:text-red-600 transition-colors"
              aria-label="O'chirish"
            >
              <AiOutlineClose size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

SearchHistory.displayName = 'SearchHistory';

// ================= PRODUCT CARD =================
const ProductCard = React.memo(({
  product,
  index,
  searchTerm,
  addToCart,
  favoriteIds,
  toggleFavorite
}) => {
  const imageUrl = product.images?.[0]?.image_url || PLACEHOLDER_IMAGE;
  const originalPrice = Number(product.price_uzs || product.price || 0);
  const finalPrice = calculateFinalPrice(product);
  const isDiscountActive = product.discount?.is_active && finalPrice < originalPrice;
  const discountPercentage = getDiscountPercentage(product);
  const isFavorite = favoriteIds.has(product.id);

  // Highlight text function
  const highlightText = (text) => {
    if (!searchTerm || !text) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase()
        ? <mark key={i} className="bg-yellow-200 text-gray-900 px-0.5 rounded">{part}</mark>
        : part
    );
  };

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      ...product,
      price: finalPrice,
      image: imageUrl,
      quantity: 1
    });
  }, [product, finalPrice, imageUrl, addToCart]);

  const handleToggleFavorite = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  }, [product, toggleFavorite]);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-[2rem] p-3 shadow-sm border border-transparent hover:border-red-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 block"
      style={{ animationDelay: `${Math.min(index, 20) * 50}ms` }}
    >
      <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-4 bg-gray-50">
        <LazyImage
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {isDiscountActive && (
            <div className="bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
              <FaPercent size={7} /> -{discountPercentage}%
            </div>
          )}
          {product.is_best_seller && (
            <div className="bg-orange-500 text-white text-[8px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
              <FaFire size={7} /> TOP
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-2 right-2 p-2 rounded-xl backdrop-blur-md transition-all active:scale-75 z-10 ${isFavorite
            ? 'bg-red-500 text-white'
            : 'bg-white/90 text-gray-400 hover:text-red-500'
            }`}
          aria-label={isFavorite ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
        >
          {isFavorite ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
        </button>

        {/* Quick Add to Cart */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="flex items-center justify-between text-white">
            <span className="text-[8px] font-bold uppercase tracking-wider">
              Tezkor qo'shish
            </span>
            <button
              onClick={handleAddToCart}
              className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              <FaShoppingCart size={12} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-1">
        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">
          Tailor Premium
        </span>

        <h4 className="text-[13px] font-black text-gray-900 line-clamp-2 mt-0.5 group-hover:text-red-600 transition-colors min-h-[2.5rem]">
          {searchTerm ? highlightText(product.name) : product.name}
        </h4>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex text-[8px]">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.round(product.avg_rating || 5) ? "text-yellow-400" : "text-gray-200"}
                size={8}
              />
            ))}
          </div>
          <span className="text-gray-400 text-[7px] font-medium">
            ({product.review_count || 0})
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <p className="text-red-600 font-black text-sm tracking-tighter">
              {formatPrice(finalPrice)}
            </p>
            {isDiscountActive && (
              <p className="text-gray-400 text-[8px] line-through">
                {formatPrice(originalPrice)}
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2.5 bg-gray-950 text-white rounded-xl group-hover:bg-red-600 transition-colors shadow-lg"
            aria-label="Savatga qo'shish"
          >
            <FaShoppingCart size={12} />
          </button>
        </div>

        {/* Delivery Info */}
        <div className="flex items-center gap-2 mt-2 text-[6px] text-gray-400">
          <span className="flex items-center gap-1">
            <FaTruck size={6} /> 24 soat
          </span>
          <span className="flex items-center gap-1">
            <FaShieldAlt size={6} /> Kafolat
          </span>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

// ================= SKELETON LOADER =================
const SearchSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 animate-pulse">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="bg-white rounded-[2rem] p-3">
        <div className="aspect-[4/5] bg-gray-200 rounded-[1.5rem] mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-8 bg-gray-200 rounded-xl" />
      </div>
    ))}
  </div>
);

// ================= GET ALL CHILD CATEGORY IDS =================
const getAllChildIds = (categoryId, allCats) => {
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
};

// ================= BUILD CATEGORY TREE =================
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
  
  return rootCategories;
};

// ================= MAIN SEARCH PAGE =================
const SearchPage = ({ addToCart, favorites = [], toggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [productCountByCategory, setProductCountByCategory] = useState({ total: 0 });

  const navigate = useNavigate();
  const location = useLocation();
  const abortControllerRef = useRef();
  const isMounted = useRef(true);

  // OPTIMIZATION: Favorite IDs Set (O(1) lookup)
  const favoriteIds = useMemo(() => {
    return new Set(favorites.map(f => f.id));
  }, [favorites]);

  // Load search history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (saved) {
        setSearchHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load search history:", error);
    }
  }, []);

  // Get search term from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [location]);

  // Fetch products and categories
  useEffect(() => {
    isMounted.current = true;
    
    const fetchData = async () => {
      try {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;
        
        // Check cache
        const cacheKey = 'search_page_data';
        const cached = cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          if (isMounted.current) {
            setAllProducts(cached.data.products);
            setCategories(cached.data.categories);
            
            const maxP = cached.data.products.length > 0 
              ? Math.max(...cached.data.products.map(p => p.price)) 
              : 0;
            setMaxPrice(maxP);
            setPriceRange([0, maxP]);
            
            setProductCountByCategory(cached.data.counts);
            setPopularSearches(cached.data.popular);
            setLoading(false);
          }
          return;
        }

        const [pRes, cRes, rRes] = await Promise.all([
          fetch(`${API_BASE}/products`, { signal }),
          fetch(`${API_BASE}/categories`, { signal }),
          fetch(`${API_BASE}/reviews`, { signal })
        ]);

        const pData = await pRes.json();
        const cData = await cRes.json();
        const rData = await rRes.json();

        // Create rating map
        const ratingMap = {};
        if (Array.isArray(rData)) {
          rData.forEach(r => {
            if (!ratingMap[r.product_id]) {
              ratingMap[r.product_id] = { sum: 0, count: 0 };
            }
            ratingMap[r.product_id].sum += r.rating;
            ratingMap[r.product_id].count++;
          });
        }

        // Normalize products
        const activeProducts = (Array.isArray(pData) ? pData : [])
          .filter(p => p.is_active !== false)
          .map(p => {
            const rating = ratingMap[p.id];
            return {
              ...p,
              price: Number(p.price_uzs || p.price || 0),
              avg_rating: rating ? (rating.sum / rating.count).toFixed(1) : "5.0",
              review_count: rating ? rating.count : 0
            };
          });

        // Build category tree
        const categoryTree = buildCategoryTree(Array.isArray(cData) ? cData : []);

        // Calculate product counts by category
        const counts = { total: activeProducts.length };
        activeProducts.forEach(product => {
          const catId = product.category_id;
          counts[catId] = (counts[catId] || 0) + 1;
        });

        // Calculate popular searches
        const wordCounts = {};
        activeProducts.forEach(p => {
          p.name.toLowerCase().split(" ").forEach(word => {
            if (word.length > 2) {
              wordCounts[word] = (wordCounts[word] || 0) + 1;
            }
          });
        });

        const popular = Object.entries(wordCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([word]) => word);

        if (!isMounted.current) return;

        // Calculate max price
        const maxP = activeProducts.length > 0
          ? Math.max(...activeProducts.map(p => p.price))
          : 0;
        setMaxPrice(maxP);
        setPriceRange([0, maxP]);

        setAllProducts(activeProducts);
        setFilteredProducts(activeProducts);
        setCategories(categoryTree);
        setProductCountByCategory(counts);
        setPopularSearches(popular);

        // Cache the response
        cache.set(cacheKey, {
          data: {
            products: activeProducts,
            categories: categoryTree,
            counts,
            popular
          },
          timestamp: Date.now()
        });

      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error("Xatolik:", err);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Apply filters
  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts];
    const term = searchTerm.trim().toLowerCase();

    // Search filter
    if (term) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
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
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Tags filter
    if (activeFilters.includes('discount')) {
      filtered = filtered.filter(p => p.discount?.is_active);
    }
    if (activeFilters.includes('bestSeller')) {
      filtered = filtered.filter(p => p.is_best_seller);
    }
    if (activeFilters.includes('latest')) {
      filtered = filtered.filter(p => p.is_latest);
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
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        // Default - keep as is
        break;
    }

    setFilteredProducts(filtered);
  }, [allProducts, searchTerm, selectedCategory, priceRange, activeFilters, sortBy, categories]);

  // Save search term to history
  const saveToHistory = useCallback((term) => {
    if (!term.trim()) return;

    setSearchHistory(prev => {
      const filtered = prev.filter(t => t !== term);
      const updated = [term, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Handle search submit
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    saveToHistory(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  }, [saveToHistory, navigate]);

  // Handle filter changes
  const handleFilterChange = useCallback((filter, value) => {
    if (filter === 'sort') {
      setSortBy(value);
    } else {
      setActiveFilters(prev =>
        prev.includes(filter)
          ? prev.filter(f => f !== filter)
          : [...prev, filter]
      );
    }
  }, []);

  // Handle category select
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
  }, []);

  // Handle toggle expand category
  const handleToggleExpand = useCallback((categoryId) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  // Handle price change
  const handlePriceChange = useCallback((newRange) => {
    setPriceRange(newRange);
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSelectedCategory('all');
    setActiveFilters([]);
    setPriceRange([0, maxPrice]);
    setSortBy('default');
    setExpandedCategories([]);
    
    // Update URL
    const url = new URL(window.location);
    url.searchParams.delete('category');
    window.history.pushState({}, '', url);
  }, [maxPrice]);

  // Clear history
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  }, []);

  // Remove history item
  const removeHistoryItem = useCallback((term) => {
    setSearchHistory(prev => {
      const updated = prev.filter(t => t !== term);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-red-600 mx-auto mb-4" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
            Yuklanmoqda...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {searchTerm
            ? `${searchTerm} - Qidiruv natijalari | TailorShop.uz`
            : 'Qidiruv | TailorShop.uz'}
        </title>
        <meta name="description" content="TailorShop.uz dan o'zingizga kerakli tikuvchilik mahsulotlarini tez va oson qidirib toping." />
      </Helmet>

      <div className="min-h-screen bg-[#fafafa] pb-24 font-sans">
        {/* Header */}
        <div className="sticky top-0 z-[110] bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-sm p-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-gray-50 text-red-600 rounded-2xl active:scale-90 transition-all hover:bg-red-50"
              aria-label="Orqaga"
            >
              <AiOutlineArrowLeft size={22} />
            </button>

            <div className="flex-1 relative group max-w-3xl">
              <AiOutlineSearch
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors"
                size={22}
              />
              <input
                autoFocus
                type="text"
                placeholder="Mahsulot nomini yozing..."
                className="w-full pl-14 pr-24 py-4 bg-gray-100 border-2 border-transparent focus:bg-white focus:border-red-600/10 focus:ring-4 focus:ring-red-600/5 rounded-2xl outline-none text-sm font-black transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchTerm.trim()) {
                    saveToHistory(searchTerm);
                  }
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-24 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 p-2 transition-colors"
                  aria-label="Tozalash"
                >
                  <AiOutlineClose size={18} />
                </button>
              )}
              <button
                onClick={() => setShowFilters(true)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl transition-all text-sm font-bold flex items-center gap-2 ${
                  activeFilters.length > 0 || selectedCategory !== 'all'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label="Filtrlar"
              >
                <FaFilter size={14} />
                <span className="hidden sm:inline">Filtrlar</span>
                {(activeFilters.length > 0 || selectedCategory !== 'all') && (
                  <span className="w-5 h-5 bg-white text-red-600 rounded-full text-[10px] font-bold flex items-center justify-center">
                    {activeFilters.length + (selectedCategory !== 'all' ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filter Sidebar */}
        <FilterSidebar
          show={showFilters}
          onClose={() => setShowFilters(false)}
          filters={activeFilters}
          onFilterChange={handleFilterChange}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          onToggleExpand={handleToggleExpand}
          expandedCategories={expandedCategories}
          productCountByCategory={productCountByCategory}
          priceRange={priceRange}
          onPriceChange={handlePriceChange}
          maxPrice={maxPrice}
          sortBy={sortBy}
          onResetFilters={resetFilters}
        />

        {/* Results Section */}
        <div className="p-4 max-w-7xl mx-auto">
          {/* Search History */}
          {!searchTerm && searchHistory.length > 0 && (
            <SearchHistory
              history={searchHistory}
              onSelect={handleSearch}
              onClear={clearHistory}
              onRemove={removeHistoryItem}
            />
          )}

          {/* Popular Searches */}
          {!searchTerm && popularSearches.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-black text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FaFire className="text-orange-500" size={14} />
                Ommabop qidiruvlar
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(term)}
                    className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-medium text-gray-600 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
                  >
                    #{term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {(selectedCategory !== 'all' || activeFilters.length > 0 || sortBy !== 'default') && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-[9px] font-bold text-gray-400 uppercase">
                Faol filtrlar:
              </span>
              {selectedCategory !== 'all' && (
                <span className="bg-red-50 text-red-600 text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  Kategoriya
                  <button onClick={() => setSelectedCategory('all')}>
                    <AiOutlineClose size={8} />
                  </button>
                </span>
              )}
              {activeFilters.map(filter => (
                <span key={filter} className="bg-red-50 text-red-600 text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  {filter === 'discount' && 'Chegirma'}
                  {filter === 'bestSeller' && 'Ommabop'}
                  {filter === 'latest' && 'Yangi'}
                  <button onClick={() => setActiveFilters(prev => prev.filter(f => f !== filter))}>
                    <AiOutlineClose size={8} />
                  </button>
                </span>
              ))}
              {sortBy !== 'default' && (
                <span className="bg-red-50 text-red-600 text-[9px] font-bold px-2 py-1 rounded-full">
                  Saralangan
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-[9px] text-gray-400 hover:text-red-600 underline ml-2"
              >
                Tozalash
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FaFire className="text-orange-500" size={16} />
              <h2 className="text-gray-900 font-black uppercase tracking-tighter">
                {filteredProducts.length} ta mahsulot topildi
              </h2>
            </div>
            {searchTerm && (
              <p className="text-xs text-gray-400">
                "{searchTerm}" bo'yicha
              </p>
            )}
          </div>

          {/* Search Results */}
          {loading ? (
            <SearchSkeleton />
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={idx}
                  searchTerm={searchTerm}
                  addToCart={addToCart}
                  favoriteIds={favoriteIds}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fadeIn">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AiOutlineClose size={40} className="text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-black italic uppercase text-lg tracking-tighter">
                Hech narsa topilmadi
              </h3>
              <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
                {searchTerm ? `"${searchTerm}" bo'yicha` : 'Ushbu filtrlar bo\'yicha'} mahsulot topilmadi. Boshqa so'zlar bilan qidirib ko'ring.
              </p>

              {popularSearches.length > 0 && (
                <div className="mt-8">
                  <p className="text-xs text-gray-500 mb-3">Sizga qiziqarli bo'lishi mumkin:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {popularSearches.slice(0, 4).map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearch(term)}
                        className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-medium text-gray-600 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-slideLeft { animation: slideLeft 0.3s ease-out; }
        
        mark {
          background-color: #fef3c7;
          padding: 0 2px;
          border-radius: 2px;
          color: #1f2937;
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
      `}</style>
    </>
  );
};

export default React.memo(SearchPage);