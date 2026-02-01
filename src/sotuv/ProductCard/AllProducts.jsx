import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaArrowLeft, FaSearch, FaFilter, FaTimes, FaStar, 
  FaShoppingCart, FaHeart, FaRegHeart, FaPercent, 
  FaChevronDown, FaUndoAlt
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
  const [priceRange, setPriceRange] = useState([0, 20000000]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  
  const location = useLocation();

  useEffect(() => {
    fetchAllData();
    const searchParams = new URLSearchParams(location.search);
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) setSelectedCategory(categoryFromUrl);
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
      
      // IS_ACTIVE TEKSHIRUVI: Faqat aktiv mahsulotlarni filtrlab olamiz
      const activeProducts = productsData.filter(p => p.is_active !== false);
      
      setProducts(activeProducts);
      setFilteredProducts(activeProducts);
      setCategories(categoriesData.filter(cat => cat.parent_id === null));
      
      const maxPrice = activeProducts.length > 0 
        ? Math.max(...activeProducts.map(p => Number(p.price_uzs || p.price || 0))) 
        : 20000000;
      setPriceRange([0, maxPrice]);
    } catch (error) {
      console.error('Xatolik:', error);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const calculateFinalPrice = (product) => {
    let price = Number(product.price_uzs || product.price || 0);
    const discount = product.discount;
    if (discount && discount.is_active !== false) {
      if (discount.percent) price = price * (1 - Number(discount.percent) / 100);
      else if (discount.amount) price = Math.max(0, price - Number(discount.amount));
    }
    return price;
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
      filtered = filtered.filter(product => product.category_id === parseInt(selectedCategory));
    }

    filtered = filtered.filter(product => {
      const p = Number(product.price_uzs || product.price || 0);
      return p >= priceRange[0] && p <= priceRange[1];
    });

    if (selectedTags.length > 0) {
      filtered = filtered.filter(product => {
        const productTags = [
          product.is_latest && 'latest',
          product.is_popular && 'popular',
          (product.discount && product.discount.is_active) && 'discount'
        ].filter(Boolean);
        return selectedTags.some(tag => productTags.includes(tag));
      });
    }

    switch (sortBy) {
      case 'price_low': filtered.sort((a, b) => calculateFinalPrice(a) - calculateFinalPrice(b)); break;
      case 'price_high': filtered.sort((a, b) => calculateFinalPrice(b) - calculateFinalPrice(a)); break;
      case 'newest': filtered.sort((a, b) => (b.is_latest ? 1 : 0) - (a.is_latest ? 1 : 0)); break;
      default: break;
    }

    setFilteredProducts(filtered);
    setPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const getCurrentProducts = () => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  };

  const getPaginationRange = () => {
    const delta = 1; 
    const range = [];
    const rangeWithDots = [];
    let l;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) range.push(i);
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
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('default');
    setSelectedTags([]);
    if (products.length > 0) {
      setPriceRange([0, Math.max(...products.map(p => Number(p.price_uzs || p.price || 0)))]);
    }
  };

  const formatPrice = (price) => Number(price).toLocaleString('uz-UZ') + " SO'M";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-8 text-gray-400 font-black tracking-[0.3em] uppercase text-[10px] animate-pulse">TailorShop Yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Barcha Mahsulotlar | TailorShop.uz – Furnitura Katalogi</title>
        <meta name="description" content="TailorShop.uz katalogida ip, tugma, zamok va barcha turdagi tikuvchilik furnituralarini hamyonbop narxlarda toping." />
        <link rel="canonical" href="https://www.tailorshop.uz/all-products" />
        <meta property="og:title" content="Barcha Mahsulotlar | TailorShop.uz" />
        <meta property="og:description" content="Eng sifatli tikuvchilik anjomlari va aksessuarlari." />
        <meta property="og:url" content="https://www.tailorshop.uz/all-products" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Barcha Mahsulotlar Katalogi",
            "description": "TailorShop tikuvchilik furnituralari to'plami",
            "url": "https://www.tailorshop.uz/all-products"
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-[#fafafa] text-slate-900 pb-20 font-sans">
        <header className="sticky top-0 z-[110] bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform group">
                <div className="bg-red-600 p-2.5 rounded-2xl shadow-lg shadow-red-200 group-hover:rotate-[-10deg] transition-all">
                  <FaArrowLeft className="text-white text-sm" />
                </div>
                <h1 className="text-2xl font-black uppercase italic tracking-tighter">Katalog</h1>
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all active:scale-90 text-sm font-bold ${
                    showFilters ? 'bg-red-600 border-red-600 text-white shadow-xl shadow-red-200' : 'bg-white border-gray-200 text-gray-700'
                  }`}
                >
                  <FaFilter className={showFilters ? 'rotate-180 transition-transform' : ''} />
                  <span className="hidden sm:inline">Filtrlar</span>
                </button>
              </div>
            </div>
            
            <div className="relative group max-w-4xl mx-auto w-full">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" />
              <input
                type="text"
                placeholder="Mahsulotlarni qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-12 py-4 bg-gray-100 border-2 border-transparent focus:bg-white focus:border-red-600/10 focus:ring-4 focus:ring-red-600/5 rounded-[1.8rem] outline-none text-sm font-bold transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-600 transition-colors">
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className={`lg:w-72 lg:block transition-all duration-500 ${showFilters ? 'block animate-fadeIn' : 'hidden'}`}>
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 sticky top-40 border border-gray-50">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black uppercase text-xs tracking-widest text-red-600">Filtrlash</h3>
                  <button onClick={resetFilters} className="text-gray-300 hover:text-red-600 transition-colors active:rotate-180 duration-500">
                    <FaUndoAlt size={14}/>
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Kategoriyalar */}
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4 flex items-center justify-between">
                      Kategoriyalar <FaChevronDown size={8} />
                    </h4>
                    <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      <button 
                        onClick={() => setSelectedCategory('all')} 
                        className={`text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase transition-all ${selectedCategory === 'all' ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                      >
                        Barchasi
                      </button>
                      {categories.map(cat => (
                        <button 
                          key={cat.id} 
                          onClick={() => setSelectedCategory(cat.id.toString())} 
                          className={`text-left px-4 py-3 rounded-xl text-[11px] font-black uppercase transition-all ${selectedCategory === cat.id.toString() ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Narx */}
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4">Maksimal Narx</h4>
                    <input
                      type="range"
                      min="0"
                      max={products.length > 0 ? Math.max(...products.map(p => Number(p.price_uzs || p.price || 0))) : 20000000}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-red-600 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="mt-3 text-[11px] font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-xl inline-block">
                      {formatPrice(priceRange[1])}
                    </div>
                  </div>

                  {/* Saralash */}
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4">Tartib</h4>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-red-600/20"
                    >
                      <option value="default">Odatiy</option>
                      <option value="price_low">Arzonroq</option>
                      <option value="price_high">Qimmatroq</option>
                      <option value="newest">Eng yangi</option>
                    </select>
                  </div>
                </div>
              </div>
            </aside>

            {/* Mahsulotlar Gridi */}
            <section className="flex-1">
              <div className="flex items-center justify-between mb-8 px-2">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  Natijalar: <span className="text-red-600">{filteredProducts.length}</span> ta mahsulot
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 animate-fadeIn">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaSearch className="text-gray-200 text-4xl" />
                  </div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter text-gray-800">Ma'lumot topilmadi</h3>
                  <button onClick={resetFilters} className="mt-6 px-8 py-4 bg-gray-950 text-white rounded-2xl font-black uppercase text-[10px] hover:bg-red-600 transition-all shadow-xl">Filtrlarni tozalash</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                  {getCurrentProducts().map((product, idx) => {
                    const finalPrice = calculateFinalPrice(product);
                    const isDiscountActive = product.discount && product.discount.is_active !== false;
                    const isFavorite = favorites.some(fav => fav.id === product.id);
                    const mainImg = product.images?.[0]?.image_url || "https://geostudy.uz/img/pictures/cifvooipg_rf1.jpeg";

                    return (
                      <div 
                        key={product.id} 
                        className="group bg-white rounded-[2.2rem] p-2 sm:p-4 border border-transparent hover:border-red-600/10 transition-all duration-500 flex flex-col h-full shadow-sm hover:shadow-2xl hover:-translate-y-2 animate-slideUp"
                        style={{ animationDelay: `${idx * 60}ms` }}
                      >
                        <div className="relative aspect-[3/4] rounded-[1.8rem] overflow-hidden mb-4 bg-gray-50">
                          <Link to={`/product/${product.id}`}>
                            <img 
                              src={mainImg} 
                              alt={product.name} 
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                            />
                          </Link>
                          
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {isDiscountActive && (
                              <div className="bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg animate-pulse shadow-lg flex items-center gap-1">
                                <FaPercent size={8}/> {Math.round(product.discount.percent || 0)}%
                              </div>
                            )}
                            {product.is_latest && (
                              <span className="bg-black text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-lg">NEW</span>
                            )}
                          </div>

                          <button
                            onClick={() => toggleFavorite(product)}
                            className={`absolute top-3 right-3 p-3 rounded-2xl backdrop-blur-md transition-all active:scale-75 shadow-lg ${isFavorite ? 'bg-red-600 text-white' : 'bg-white/90 text-gray-400 hover:text-red-600'}`}
                          >
                            {isFavorite ? <FaHeart size={14}/> : <FaRegHeart size={14}/>}
                          </button>
                        </div>

                        <div className="flex flex-col flex-grow px-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] italic">Tailor Premium</span>
                            <div className="flex items-center gap-1 text-[10px] font-black text-orange-400"><FaStar size={10}/> 5.0</div>
                          </div>
                          <Link to={`/product/${product.id}`}>
                            <h3 className="text-[13px] sm:text-[15px] font-black text-gray-900 line-clamp-2 mb-4 uppercase italic leading-tight group-hover:text-red-600 transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          
                          <div className="mt-auto">
                            <div className="mb-4">
                              <p className="text-base sm:text-xl font-black text-red-600 tracking-tighter leading-none">{formatPrice(finalPrice)}</p>
                              {isDiscountActive && (
                                <p className="text-[10px] text-gray-400 line-through font-bold mt-1">{formatPrice(product.price_uzs || product.price)}</p>
                              )}
                            </div>

                            <button
                              onClick={() => addToCart({ ...product, price: finalPrice, quantity: 1, image: mainImg })}
                              className="w-full py-4 bg-gray-950 text-white rounded-[1.3rem] flex items-center justify-center gap-2 hover:bg-red-600 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-red-600/30 group/btn"
                            >
                              <FaShoppingCart size={14} className="group-hover/btn:animate-bounce" />
                              <span className="text-[10px] font-black uppercase italic">Savatga Qo'shish</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-20 flex justify-center items-center gap-2 sm:gap-3">
                  <button 
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="w-12 h-12 rounded-2xl border border-gray-100 bg-white text-gray-400 flex items-center justify-center disabled:opacity-20 active:scale-75 transition-all shadow-sm"
                  >←</button>
                  {getPaginationRange().map((p, i) => (
                    <button
                      key={i}
                      disabled={p === '...'}
                      onClick={() => p !== '...' && handlePageChange(p)}
                      className={`w-12 h-12 rounded-2xl text-[11px] font-black transition-all active:scale-75 ${
                        page === p ? 'bg-red-600 text-white shadow-xl shadow-red-200' : 'bg-white text-gray-400 border border-gray-100 hover:border-red-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className="w-12 h-12 rounded-2xl border border-gray-100 bg-white text-gray-400 flex items-center justify-center disabled:opacity-20 active:scale-75 transition-all shadow-sm"
                  >→</button>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fee2e2; border-radius: 10px; }
      `}</style>
    </>
  );
};

export default AllProducts;