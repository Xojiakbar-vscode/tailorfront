import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineSearch, AiOutlineArrowLeft, AiOutlineClose } from "react-icons/ai";
import { FaStar, FaShoppingCart, FaFire } from "react-icons/fa";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Ma'lumotlarni yuklash va is_active filtrlash
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://tailorback2025-production.up.railway.app/api/products");
        const data = await res.json();
        
        // Faqat aktiv mahsulotlarni qidiruvga qo'shish
        const activeProducts = (Array.isArray(data) ? data : []).filter(
          (p) => p.is_active !== false
        );
        
        setAllProducts(activeProducts);
      } catch (err) {
        console.error("Xatolik:", err);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchProducts();
  }, []);

  // Qidiruvni filtrlash (Optimallashtirilgan)
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    
    return allProducts.filter((product) =>
      product.name.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term)
    );
  }, [searchTerm, allProducts]);

  const formatPrice = (price) => Number(price).toLocaleString('uz-UZ') + " SO'M";

  return (
    <>
      <Helmet>
        <title>Qidiruv | TailorShop.uz – Mahsulotlarni topish</title>
        <meta name="description" content="TailorShop.uz dan o'zingizga kerakli tikuvchilik mahsulotlarini tez va oson qidirib toping." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-[#fafafa] pb-24 font-sans">
        {/* Header - Professional Search Bar */}
        <div className="sticky top-0 z-[110] bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-sm p-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="p-3 bg-gray-50 text-red-600 rounded-2xl active:scale-90 transition-all hover:bg-red-50"
            >
              <AiOutlineArrowLeft size={22} />
            </button>
            
            <div className="flex-1 relative group">
              <AiOutlineSearch 
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" 
                size={22} 
              />
              <input
                autoFocus
                type="text"
                placeholder="Mahsulot nomini yozing..."
                className="w-full pl-14 pr-12 py-4 bg-gray-100 border-2 border-transparent focus:bg-white focus:border-red-600/10 focus:ring-4 focus:ring-red-600/5 rounded-2xl outline-none text-sm font-black transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 p-2 transition-colors"
                >
                  <AiOutlineClose size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Natijalar qismi */}
        <div className="p-4 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-16 h-16 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Qidirilmoqda...</p>
            </div>
          ) : searchTerm.trim() === "" ? (
            <div className="text-center py-32 animate-fadeIn">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AiOutlineSearch size={40} className="text-red-200" />
              </div>
              <h3 className="text-gray-900 font-black uppercase italic tracking-tighter text-lg">Nima qidiramiz?</h3>
              <p className="text-gray-400 text-xs mt-2 font-medium">Mahsulot nomini kiritishingiz bilan natijalar ko'rinadi</p>
              
              <div className="mt-10 flex flex-wrap justify-center gap-2">
                {['Ip', 'Tugma', 'Qaychi', 'Zamok', 'Lenta'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[11px] font-black uppercase text-gray-500 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-2 mb-8 px-2">
                <FaFire className="text-orange-500" />
                <h2 className="text-gray-900 font-black uppercase italic tracking-tighter">
                  Topilgan natijalar: <span className="text-red-600">{filteredProducts.length}</span>
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {filteredProducts.map((product, idx) => (
                  <Link 
                    key={product.id} 
                    to={`/product/${product.id}`}
                    className="group bg-white rounded-[2rem] p-3 shadow-sm border border-transparent hover:border-red-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-slideUp"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-4 bg-gray-50 relative">
                      <img 
                        src={product.images?.[0]?.image_url || "https://geostudy.uz/img/pictures/cifvooipg_rf1.jpeg"} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {product.discount?.is_active && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-lg">
                          -{Math.round(product.discount.percent)}%
                        </div>
                      )}
                    </div>
                    
                    <div className="px-1">
                      <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Premium</span>
                      <h4 className="text-[13px] font-black text-gray-900 uppercase truncate mt-0.5 group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-red-600 font-black text-sm tracking-tighter">
                          {formatPrice(product.price_uzs || product.price)}
                        </p>
                        <div className="p-2 bg-gray-950 text-white rounded-xl group-hover:bg-red-600 transition-colors">
                          <FaShoppingCart size={12} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-32 animate-fadeIn">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AiOutlineClose size={40} className="text-gray-200" />
              </div>
              <p className="text-gray-900 font-black italic uppercase text-sm tracking-tighter">
                Afsuski, hech narsa topilmadi
              </p>
              <p className="text-gray-400 text-xs mt-2">Boshqa so'zlar bilan qidirib ko'ring</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </>
  );
};

export default SearchPage;