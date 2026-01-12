import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSearch, 
  FaFilter, 
  FaSortAmountDown, 
  FaSortAmountUp,
  FaTimes,
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaPercent,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { GiClothes } from 'react-icons/gi';
import { RiShirtLine } from 'react-icons/ri';

const API_URL = "https://tailorback2025-production.up.railway.app/api/products";
const CATEGORIES_URL = "https://tailorback2025-production.up.railway.app/api/categories";

const AllProducts = ({ addToCart, favorites = [], toggleFavorite }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAllData();
    
    // Agar URL dan category parametri kelsa
    const searchParams = new URLSearchParams(location.search);
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [location]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, sortBy, priceRange, selectedTags, products]);

  const fetchAllData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(API_URL),
        fetch(CATEGORIES_URL)
      ]);
      
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      
      // Asosiy kategoriyalarni olish
      const mainCategories = categoriesData.filter(cat => cat.parent_id === null);
      setCategories(mainCategories);
      
      // Maxsimal narxni topish
      const maxPrice = Math.max(...productsData.map(p => p.price));
      setPriceRange([0, maxPrice]);
      
      setTotalPages(Math.ceil(productsData.length / itemsPerPage));
    } catch (error) {
      console.error('Ma\'lumot yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category_id === parseInt(selectedCategory)
      );
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Tags filter (agar tags bo'lsa)
    if (selectedTags.length > 0) {
      filtered = filtered.filter(product => {
        const productTags = [
          product.is_latest && 'latest',
          product.is_popular && 'popular',
          product.is_featured && 'featured',
          product.is_best_seller && 'best_seller',
          (product.discount && product.discount.is_active) && 'discount'
        ].filter(Boolean);
        
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
      case 'name_asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.is_latest ? 1 : 0) - (a.is_latest ? 1 : 0));
        break;
      default:
        // Default tartib
        break;
    }

    setFilteredProducts(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setPage(1); // Har safar filter o'zgarganda 1-sahifaga qaytish
  };

  const calculateFinalPrice = (product) => {
    let price = Number(product.price);
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

  const getCurrentProducts = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('default');
    setPriceRange([0, Math.max(...products.map(p => p.price))]);
    setSelectedTags([]);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const formatPrice = (price) => {
    return price.toLocaleString('uz-UZ') + ' so\'m';
  };

  const tags = [
    { id: 'latest', label: 'Yangi', color: 'bg-blue-500' },
    { id: 'popular', label: 'Trend', color: 'bg-orange-500' },
    { id: 'featured', label: 'Tanlangan', color: 'bg-purple-500' },
    { id: 'best_seller', label: 'Ko\'p sotilgan', color: 'bg-green-500' },
    { id: 'discount', label: 'Chegirma', color: 'bg-red-500' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Mahsulotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors group">
              <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-50 transition-colors">
                <FaArrowLeft className="text-lg group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span className="font-semibold text-sm hidden sm:block">Orqaga</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                <GiClothes className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Barcha Mahsulotlar</h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {filteredProducts.length} ta mahsulot topildi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-gray-600"
              >
                {showFilters ? <FaTimes /> : <FaFilter />}
                <span className="hidden sm:inline">Filtrlar</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative max-w-2xl mx-auto">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Mahsulot nomi bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Filtrlar</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Tozalash
                </button>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-700 mb-4 flex items-center justify-between">
                  Kategoriyalar
                  <FaChevronDown className="text-gray-400" />
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === 'all' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50 text-gray-600'}`}
                  >
                    Barchasi ({products.length})
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between ${selectedCategory === category.id.toString() ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                      <span>{category.name}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {products.filter(p => p.category_id === category.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-700 mb-4">Narx oralig'i</h4>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max={Math.max(...products.map(p => p.price))}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-600">{formatPrice(priceRange[0])}</span>
                    <span className="text-sm text-gray-600">{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-700 mb-4">Xususiyatlar</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${selectedTags.includes(tag.id) ? `${tag.color} text-white` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {selectedTags.includes(tag.id) && <FaTimes className="text-xs" />}
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-4">Saralash</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 text-sm"
                >
                  <option value="default">Standart tartib</option>
                  <option value="price_low">Arzondan qimmatga</option>
                  <option value="price_high">Qimmatdan arzonga</option>
                  <option value="name_asc">Nom bo'yicha (A-Z)</option>
                  <option value="name_desc">Nom bo'yicha (Z-A)</option>
                  <option value="popular">Trenddagi</option>
                  <option value="newest">Yangi kelgan</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== 'all' || selectedTags.length > 0 || priceRange[1] < Math.max(...products.map(p => p.price))) && (
              <div className="mt-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
                <h4 className="font-semibold text-red-700 mb-3">Faol filtrlar:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory !== 'all' && (
                    <span className="bg-white border border-red-200 text-red-600 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {categories.find(c => c.id === parseInt(selectedCategory))?.name}
                      <button onClick={() => setSelectedCategory('all')}>
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  )}
                  {selectedTags.map(tag => (
                    <span key={tag} className="bg-white border border-red-200 text-red-600 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {tags.find(t => t.id === tag)?.label}
                      <button onClick={() => toggleTag(tag)}>
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  ))}
                  {priceRange[1] < Math.max(...products.map(p => p.price)) && (
                    <span className="bg-white border border-red-200 text-red-600 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      Narx: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                      <button onClick={() => setPriceRange([0, Math.max(...products.map(p => p.price))])}>
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Info */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">{filteredProducts.length}</span> ta mahsulot topildi
                </p>
                {selectedCategory !== 'all' && (
                  <p className="text-sm text-gray-500 mt-1">
                    Kategoriya: {categories.find(c => c.id === parseInt(selectedCategory))?.name}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaFilter />
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 text-sm"
                >
                  <option value="default">Standart tartib</option>
                  <option value="price_low">Arzondan qimmatga</option>
                  <option value="price_high">Qimmatdan arzonga</option>
                  <option value="name_asc">Nom bo'yicha (A-Z)</option>
                  <option value="name_desc">Nom bo'yicha (Z-A)</option>
                  <option value="popular">Trenddagi</option>
                  <option value="newest">Yangi kelgan</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <FaSearch className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Hech narsa topilmadi</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Siz qidirgan mahsulotlar mavjud emas. Filtrlarni o'zgartirib ko'ring yoki boshqa so'z bilan qidiring.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCurrentProducts().map(product => {
                    const finalPrice = calculateFinalPrice(product);
                    const discount = product.discount;
                    const isDiscountActive = discount && discount.is_active !== false;
                    
                    return (
                      <div key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                        {/* Product Image */}
                        <div className="relative h-48 sm:h-56 overflow-hidden">
                          <Link to={`/product/${product.id}`}>
                            <img
                              src={product.images?.[0]?.image_url || "https://via.placeholder.com/400"}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </Link>
                          
                          {/* Favorite Button */}
                          <button
                            onClick={() => toggleFavorite(product)}
                            className={`absolute top-3 right-3 p-2 backdrop-blur-sm rounded-full z-10 shadow-sm transition-all hover:scale-110 ${
                              favorites.some(fav => fav.id === product.id)
                                ? "bg-red-500 text-white"
                                : "bg-white/80 text-red-400"
                            }`}
                          >
                            {favorites.some(fav => fav.id === product.id) ? <FaHeart /> : <FaRegHeart />}
                          </button>

                          {/* Discount Badge */}
                          {isDiscountActive && (
                            <div className="absolute top-3 left-3">
                              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                <FaPercent size={10} />
                                {discount.percent 
                                  ? `${Math.round(discount.percent)}%`
                                  : `${Math.round(discount.amount).toLocaleString()} so'm`
                                }
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-5">
                          <Link to={`/product/${product.id}`}>
                            <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>
                          
                          <div className="flex items-center gap-1 mb-3">
                            <div className="flex text-yellow-400 text-sm">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={i < 4 ? "text-yellow-400" : "text-gray-200"} />
                              ))}
                            </div>
                            <span className="text-gray-400 text-sm">(4.5)</span>
                          </div>

                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-xl font-bold text-gray-900">
                                {formatPrice(finalPrice)}
                              </p>
                              {isDiscountActive && (
                                <p className="text-sm text-gray-400 line-through">
                                  {formatPrice(Number(product.price))}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => addToCart({ 
                                ...product, 
                                price: finalPrice, 
                                quantity: 1, 
                                image: product.images?.[0]?.image_url 
                              })}
                              className="p-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
                            >
                              <FaShoppingCart />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        ←
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              page === pageNum
                                ? 'bg-red-600 text-white'
                                : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;