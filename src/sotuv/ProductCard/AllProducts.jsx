import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaArrowLeft, FaSearch, FaFilter, FaSortAmountDown, 
  FaTimes, FaStar, FaShoppingCart, FaHeart, 
  FaRegHeart, FaPercent, FaChevronDown, FaUndoAlt
} from 'react-icons/fa';
import { GiClothes } from 'react-icons/gi';

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
  const itemsPerPage = 12;
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAllData();
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
      const mainCategories = categoriesData.filter(cat => cat.parent_id === null);
      setCategories(mainCategories);
      
      const maxPrice = productsData.length > 0 ? Math.max(...productsData.map(p => p.price)) : 10000000;
      setPriceRange([0, maxPrice]);
    } catch (error) {
      console.error('Xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category_id === parseInt(selectedCategory)
      );
    }

    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

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

    switch (sortBy) {
      case 'price_low': filtered.sort((a, b) => calculateFinalPrice(a) - calculateFinalPrice(b)); break;
      case 'price_high': filtered.sort((a, b) => calculateFinalPrice(b) - calculateFinalPrice(a)); break;
      case 'name_asc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name_desc': filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'popular': filtered.sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0)); break;
      case 'newest': filtered.sort((a, b) => (b.is_latest ? 1 : 0) - (a.is_latest ? 1 : 0)); break;
      default: break;
    }

    setFilteredProducts(filtered);
    setPage(1);
  };

  const calculateFinalPrice = (product) => {
    let price = Number(product.price);
    const discount = product.discount;
    if (discount && discount.is_active !== false) {
      if (discount.percent) price = price * (1 - Number(discount.percent) / 100);
      else if (discount.amount) price = Math.max(0, price - Number(discount.amount));
    }
    return price;
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const getCurrentProducts = () => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('default');
    setPriceRange([0, Math.max(...products.map(p => p.price))]);
    setSelectedTags([]);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const formatPrice = (price) => price.toLocaleString('uz-UZ') + ' so\'m';

  const tags = [
    { id: 'latest', label: 'Yangi', color: 'bg-blue-500' },
    { id: 'popular', label: 'Trend', color: 'bg-orange-500' },
    { id: 'featured', label: 'Tanlangan', color: 'bg-purple-500' },
    { id: 'best_seller', label: 'TOP', color: 'bg-green-500' },
    { id: 'discount', label: 'Aksiya', color: 'bg-red-500' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
          <GiClothes className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-red-600 animate-pulse" />
        </div>
        <p className="mt-6 text-gray-500 font-medium tracking-widest uppercase text-xs">Yuklanmoqda...</p>
      </div>
    );
  }

  return (
     <>
    <Helmet>
      <title>
        Barcha Mahsulotlar | TailorShop.uz – Furnitura Katalogi
      </title>

      <meta
        name="description"
        content="TailorShop.uz barcha mahsulotlari: ip, tugma, zamok, rezina va boshqa tikuvchilik furnituralari. Ulgurji va chakana narxlarda."
      />

      <link
        rel="canonical"
        href="https://www.tailorshop.uz/all-products"
      />

      {/* ❗ FILTER & PAGINATION SEO HIMOYASI */}
      <meta
        name="robots"
        content={
          location.search
            ? "noindex, follow"
            : "index, follow"
        }
      />

      {/* Open Graph */}
      <meta
        property="og:title"
        content="Barcha Mahsulotlar | TailorShop.uz"
      />
      <meta
        property="og:description"
        content="Tikuvchilar uchun barcha furnitura mahsulotlari"
      />
      <meta
        property="og:url"
        content="https://www.tailorshop.uz/all-products"
      />
      <meta
        property="og:image"
        content="https://www.tailorshop.uz/Logo.png"
      />

      {/* Collection Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Barcha Mahsulotlar",
          "url": "https://www.tailorshop.uz/all-products"
        })}
      </script>
    </Helmet>
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col py-4 gap-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="p-2.5 rounded-xl bg-white shadow-sm border border-gray-100 group-hover:border-red-200 transition-all">
                  <FaArrowLeft className="text-gray-600 group-hover:text-red-600 transition-colors" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Katalog
                </h1>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-semibold ${
                    showFilters ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-200' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {showFilters ? <FaTimes /> : <FaFilter />}
                  <span className="hidden sm:inline">Filtrlar</span>
                </button>
              </div>
            </div>

            {/* Premium Search Bar */}
            <div className="relative group max-w-3xl mx-auto w-full">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
              <input
                type="text"
                placeholder="Nima qidiramiz? (ip, tugma...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-gray-100/50 border-transparent border focus:bg-white focus:border-red-200 focus:ring-4 focus:ring-red-500/5 rounded-2xl transition-all outline-none text-sm font-medium"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors">
                  <FaTimes className="text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Enhanced Filters Sidebar */}
          <aside className={`lg:w-72 flex-shrink-0 space-y-6 transition-all duration-300 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-40">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold">Filtrlash</h3>
                <button onClick={resetFilters} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Tozalash">
                  <FaUndoAlt size={14} />
                </button>
              </div>

              {/* Categories Section */}
              <div className="mb-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center justify-between">
                  Kategoriyalar <FaChevronDown size={10} />
                </h4>
                <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${
                      selectedCategory === 'all' ? 'bg-red-50 text-red-600 font-bold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>Barchasi</span>
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full">{products.length}</span>
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id.toString())}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${
                        selectedCategory === cat.id.toString() ? 'bg-red-50 text-red-600 font-bold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="truncate mr-2">{cat.name}</span>
                      <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full">
                        {products.filter(p => p.category_id === cat.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Section */}
              <div className="mb-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Narx chegarasi</h4>
                <input
                  type="range"
                  min="0"
                  max={products.length > 0 ? Math.max(...products.map(p => p.price)) : 10000000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between mt-3 text-[11px] font-bold text-gray-500">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span className="text-red-600">{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              {/* Tags Section */}
              <div className="mb-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Saralash teglari</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                        selectedTags.includes(tag.id) ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sorting Select */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Tartiblash</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20 outline-none"
                >
                  <option value="default">Odatiy</option>
                  <option value="price_low">Arzonroq</option>
                  <option value="price_high">Qimmatroq</option>
                  <option value="popular">Ommabop</option>
                  <option value="newest">Eng yangi</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Section */}
          <section className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm font-medium text-gray-500">
                Natijalar: <span className="text-gray-900 font-bold">{filteredProducts.length}</span> ta mahsulot
              </p>
              <div className="h-px flex-1 mx-6 bg-gray-200 hidden sm:block"></div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaSearch className="text-gray-300 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Ma'lumot topilmadi</h3>
                <p className="text-gray-500 mt-2 mb-8">Qidiruv parametrlarini o'zgartirib ko'ring</p>
                <button onClick={resetFilters} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all">
                  Hammasini ko'rsatish
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {getCurrentProducts().map(product => {
                    const finalPrice = calculateFinalPrice(product);
                    const isDiscountActive = product.discount && product.discount.is_active !== false;
                    const isFavorite = favorites.some(fav => fav.id === product.id);

                    return (
                      <div key={product.id} className="group relative bg-white rounded-[2rem] p-3 border border-transparent hover:border-red-100 hover:shadow-[0_20px_50px_rgba(239,68,68,0.05)] transition-all duration-500">
                        {/* Image Container */}
                        <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-4">
                          <Link to={`/product/${product.id}`}>
                            <img
                              src={product.images?.[0]?.image_url || "https://geostudy.uz/img/pictures/cifvooipg_rf1.jpeg"}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          </Link>
                          
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {isDiscountActive && (
                              <div className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                                <FaPercent size={8} />
                                {product.discount.percent ? `${Math.round(product.discount.percent)}%` : 'AKSIYA'}
                              </div>
                            )}
                            {product.is_latest && (
                              <div className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg">YANGI</div>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <button
                            onClick={() => toggleFavorite(product)}
                            className={`absolute top-3 right-3 p-3 rounded-2xl backdrop-blur-md transition-all ${
                              isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500 shadow-sm'
                            }`}
                          >
                            {isFavorite ? <FaHeart /> : <FaRegHeart />}
                          </button>
                        </div>

                        {/* Content */}
                        <div className="px-2 pb-2">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Premium Collection</span>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-orange-500">
                              <FaStar /> 4.5
                            </div>
                          </div>
                          
                          <Link to={`/product/${product.id}`}>
                            <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1 mb-3">
                              {product.name}
                            </h3>
                          </Link>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-lg font-black text-gray-900">
                                {formatPrice(finalPrice)}
                              </div>
                              {isDiscountActive && (
                                <div className="text-xs text-gray-400 line-through font-medium">
                                  {formatPrice(Number(product.price))}
                                </div>
                              )}
                            </div>
                            
                            <button
                              onClick={() => addToCart({ ...product, price: finalPrice, quantity: 1, image: product.images?.[0]?.image_url })}
                              className="p-4 bg-gray-900 text-white rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-gray-200 hover:shadow-red-200 active:scale-90"
                            >
                              <FaShoppingCart size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Modern Pagination */}
                {totalPages > 1 && (
                  <div className="mt-16 flex justify-center items-center gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-lg disabled:opacity-30 transition-all"
                    >
                      ←
                    </button>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setPage(i + 1)}
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                            page === i + 1 ? 'bg-red-600 text-white shadow-md shadow-red-100' : 'text-gray-400 hover:text-gray-900'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-lg disabled:opacity-30 transition-all"
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
      
      {/* Footer Spacing for mobile */}
      <div className="h-20 lg:hidden"></div>
    </div>
    </>
  );
};

export default AllProducts;