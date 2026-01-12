import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import { CiGrid41 } from "react-icons/ci";

// Rasmlar
import TailorLogo from "../../images/TailorLogo.png";
import Like from "../../images/Live.png";
import Savat from "../../images/Savat.png";

const Header = ({ cartItems = [], favorites = [] }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // 🧮 HISOBLASH
  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );
  const favoriteCount = favorites.length;

  // 🔄 MAHSULOTLARNI YUKLASH
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://tailorback2025-production.up.railway.app/api/products"
        );
        const data = await res.json();
        setAllProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Xatolik:", err);
      }
    };
    fetchProducts();
  }, []);

  // 🔒 SEARCH OCHIQ PAYTIDA SCROLL O‘CHIRISH
  useEffect(() => {
    document.body.style.overflow = isSearchOpen ? "hidden" : "unset";
  }, [isSearchOpen]);

  // 🔍 QIDIRUV FILTER
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(
        allProducts.filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, allProducts]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-red-50 py-2 lg:py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between relative h-10 lg:h-14">

          {/* LEFT — KATALOG + LIKE (faqat ≥1024px) */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/catalog" className="flex flex-col items-center group no-underline">
              <CiGrid41 className="w-8 h-8 text-red-700 group-hover:text-red-500 transition-colors" />
              <span className="text-[10px] font-bold text-red-400 uppercase">
                Katalog
              </span>
            </Link>

            <Link
              to="/favorites"
              className="relative group flex flex-col items-center no-underline"
            >
              <div className="relative p-1">
                <img
                  src={Like}
                  alt="Like"
                  className="w-7 h-7 object-contain transition-transform group-hover:scale-110"
                />
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                    {favoriteCount > 99 ? "99+" : favoriteCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-red-400 uppercase">
                Saralangan
              </span>
            </Link>
          </div>

          {/* CENTER — LOGO */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
          >
            <img
              src={TailorLogo}
              alt="Logo"
              className="h-8 sm:h-10 lg:h-12 object-contain"
            />
          </Link>

          {/* RIGHT — SEARCH + CART (faqat ≥1024px) */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex flex-col items-center group"
            >
              <div className="p-2 bg-red-50 rounded-full group-hover:bg-red-100 transition">
                <FaSearch className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-[10px] font-bold text-red-400 uppercase">
                Qidiruv
              </span>
            </button>

            <Link
              to="/cart"
              className="relative group flex flex-col items-center no-underline"
            >
              <div className="relative p-1">
                <img
                  src={Savat}
                  alt="Savat"
                  className="w-8 h-8 object-contain transition-transform group-hover:scale-110"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-red-400 uppercase">
                Savat
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* 🔍 FULLSCREEN SEARCH */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
          <div className="p-4 border-b flex items-center gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600" />
              <input
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Mahsulotni qidiring..."
                className="w-full pl-12 pr-4 py-3 bg-red-50 rounded-xl font-semibold outline-none border-2 border-transparent focus:border-red-600"
              />
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-3 bg-red-50 rounded-full hover:bg-red-600 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="bg-white p-2 rounded-xl border hover:shadow-lg"
                >
                  <img
                    src={p.images?.[0]?.image_url}
                    alt={p.name}
                    className="w-full aspect-square object-cover rounded-lg mb-2"
                  />
                  <h4 className="text-[11px] font-bold truncate">
                    {p.name}
                  </h4>
                  <p className="text-red-600 font-black text-xs">
                    {Number(p.price).toLocaleString()} so'm
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
