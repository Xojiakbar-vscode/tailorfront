import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineSearch, AiOutlineArrowLeft, AiOutlineClose } from "react-icons/ai";
import { FaStar, FaShoppingCart } from "react-icons/fa";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Ma'lumotlarni yuklash
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://tailorback2025-production.up.railway.app/api/products");
        const data = await res.json();
        setAllProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Xatolik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Qidiruvni filtrlash (Optimallashtirilgan)
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allProducts]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header - Qidiruv paneli */}
      <div className="sticky top-0 z-50 bg-white p-4 shadow-sm flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 text-red-600 active:scale-90 transition-transform"
        >
          <AiOutlineArrowLeft size={24} />
        </button>
        
        <div className="flex-1 relative">
          <AiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600" size={20} />
          <input
            autoFocus
            type="text"
            placeholder="Mahsulot yoki brendni qidiring..."
            className="w-full pl-12 pr-10 py-3 bg-red-50 rounded-2xl focus:outline-none text-base font-bold border-2 border-transparent focus:border-red-600 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1"
            >
              <AiOutlineClose size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Natijalar qismi */}
      <div className="p-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
          </div>
        ) : searchTerm.trim() === "" ? (
          // Qidiruv boshlanmagandagi holat (Tavsiya etilgan mahsulotlar bo'lishi mumkin)
          <div className="text-center py-20">
            <AiOutlineSearch size={80} className="mx-auto text-red-100 mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm italic">
              Izlash uchun biror narsa yozing...
            </p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-red-900 font-black uppercase italic text-sm">Natijalar: {filteredProducts.length}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <Link 
                  key={product.id} 
                  to={`/product/${product.id}`}
                  className="bg-white rounded-[1.5rem] p-2 shadow-sm border border-red-50 active:scale-95 transition-transform"
                >
                  <div className="aspect-[4/5] rounded-xl overflow-hidden mb-2">
                    <img 
                      src={product.images?.[0]?.image_url || "https://via.placeholder.com/300"} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="px-1">
                    <h4 className="text-[11px] font-black text-red-900 uppercase truncate">{product.name}</h4>
                    <div className="flex items-center gap-1 my-1">
                      <FaStar className="text-yellow-400 text-[8px]" />
                      <span className="text-[9px] font-bold text-gray-400">5.0</span>
                    </div>
                    <p className="text-red-600 font-black text-sm">{Number(product.price).toLocaleString()} so'm</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-red-400 font-black italic uppercase text-xs">Hech narsa topilmadi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;