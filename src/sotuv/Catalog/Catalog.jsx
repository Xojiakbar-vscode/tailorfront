import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaArrowLeft,
  FaChevronDown,
  FaChevronRight,
  FaSearch,
  FaSpinner,
  FaExclamationCircle,
  FaTimes,
  FaLayerGroup,
  FaBoxes,
} from "react-icons/fa";

import CatalogImage from "../../images/Catalogmod.png";
import KatalogIcon from "../../images/Katalog.png";

const API_URL = "https://tailorback2025-production.up.railway.app/api/categories";

// ================= LAZY IMAGE COMPONENT =================
const LazyImage = ({ src, alt, className }) => {
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
    <div className="relative w-full h-full">
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <FaLayerGroup className="text-gray-400" size={24} />
        </div>
      )}
      <img
        ref={imgRef}
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E"
        data-src={src}
        alt={alt}
        className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
};

// ================= CATEGORY ACCORDION ITEM =================
const CategoryAccordion = React.memo(({ category, isOpen, onToggle, onNavigate, searchTerm }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Filter children based on search term
  const filteredChildren = useMemo(() => {
    if (!searchTerm) return category.children;
    return category.children.filter(child =>
      child.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [category.children, searchTerm]);

  const handleParentClick = useCallback(() => {
    onToggle(category.id);
  }, [category.id, onToggle]);

  const handleChildClick = useCallback((child) => {
    onNavigate(child.slug || child.id);
  }, [onNavigate]);

  const handleAllProductsClick = useCallback(() => {
    onNavigate(category.slug || category.id);
  }, [category.slug, category.id, onNavigate]);

  if (searchTerm && filteredChildren.length === 0 && !category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
    return null;
  }

  return (
    <div 
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-red-200 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Parent Category Button */}
      <button
        onClick={handleParentClick}
        className={`
          w-full flex items-center justify-between px-5 py-4
          transition-all duration-300
          ${isOpen ? 'bg-red-50' : isHovered ? 'bg-gray-50' : 'bg-white'}
        `}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {/* Category Icon */}
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            transition-all duration-300
            ${isOpen ? 'bg-red-600' : isHovered ? 'bg-red-100' : 'bg-gray-100'}
          `}>
            <FaLayerGroup className={isOpen ? 'text-white' : 'text-red-500'} size={16} />
          </div>
          
          <div className="text-left">
            <h3 className={`
              font-bold text-base transition-colors duration-300
              ${isOpen ? 'text-red-700' : 'text-gray-800'}
            `}>
              {category.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {category.children.length} ta bo'lim
            </p>
          </div>
        </div>

        <FaChevronDown
          className={`
            transition-all duration-300
            ${isOpen ? 'rotate-180 text-red-600' : 'text-gray-400'}
          `}
          size={16}
        />
      </button>

      {/* Children Categories */}
      {isOpen && (
        <div className="bg-gray-50 border-t border-gray-200 animate-slideDown">
          {filteredChildren.map((child, index) => (
            <button
              key={child.id}
              onClick={() => handleChildClick(child)}
              className={`
                w-full flex items-center justify-between px-16 py-3.5
                text-sm transition-all duration-200
                hover:bg-white hover:pl-20 group
                border-b border-gray-100 last:border-b-0
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                {child.name}
              </span>
              <FaChevronRight 
                className="text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" 
                size={12} 
              />
            </button>
          ))}

          {/* All Products Button */}
          <button
            onClick={handleAllProductsClick}
            className="
              w-full px-16 py-4
              text-xs font-bold uppercase tracking-wider
              bg-white border-t border-gray-200
              text-red-600 hover:text-red-700
              hover:bg-red-50 transition-all duration-200
              flex items-center justify-between group
            "
          >
            <span className="flex items-center gap-2">
              <FaBoxes size={12} />
              Barcha {category.name}
            </span>
            <FaChevronRight 
              className="text-red-400 group-hover:translate-x-1 transition-transform" 
              size={12} 
            />
          </button>
        </div>
      )}
    </div>
  );
});

// ================= SEARCH INPUT =================
const SearchInput = ({ value, onChange, onClear }) => {
  const inputRef = useRef(null);

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative group">
      <FaSearch 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" 
        size={16} 
      />
      <input
        ref={inputRef}
        type="text"
        placeholder="Kategoriya qidirish... (Ctrl+K)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full pl-11 pr-12 py-3
          bg-gray-50 border border-gray-200
          rounded-xl text-sm
          focus:bg-white focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100
          transition-all duration-300
          placeholder:text-gray-400
        "
      />
      {value && (
        <button
          onClick={onClear}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            p-1.5 rounded-full bg-gray-200 hover:bg-gray-300
            transition-colors
          "
          aria-label="Tozalash"
        >
          <FaTimes size={10} className="text-gray-600" />
        </button>
      )}
    </div>
  );
};

// ================= LOADING SKELETON =================
const LoadingSkeleton = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-white rounded-full"></div>
      </div>
    </div>
    <p className="mt-4 text-gray-500 font-medium text-sm animate-pulse">
      Yuklanmoqda...
    </p>
  </div>
);

// ================= ERROR DISPLAY =================
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="min-h-screen flex flex-col items-center justify-center px-4">
    <div className="bg-red-50 rounded-2xl p-8 max-w-md text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaExclamationCircle className="text-red-600" size={32} />
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Xatolik yuz berdi</h2>
      <p className="text-gray-600 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="
          px-6 py-3 bg-red-600 text-white rounded-xl
          font-medium hover:bg-red-700
          transition-colors focus:outline-none focus:ring-2 focus:ring-red-300
        "
      >
        Qayta urinish
      </button>
    </div>
  </div>
);

// ================= SIDEBAR CARD =================
const SidebarCard = () => (
  <div className="hidden lg:block bg-white rounded-[2rem] border border-gray-200 shadow-xl overflow-hidden group">
    <div className="relative h-64 overflow-hidden">
      <LazyImage
        src={CatalogImage}
        alt="TailorShop.uz katalogi — tikuvchilik furnitura mahsulotlari"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-red-900/20 to-transparent"></div>
      
      {/* Badge */}
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-red-600 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
          Premium sifat
        </span>
      </div>

      {/* Title Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-2xl font-black text-white mb-2 drop-shadow-lg">
          Tikuvchilik Olami
        </h3>
        <p className="text-sm text-white/90 leading-relaxed max-w-xs">
          Eng sifatli tikuv ashyolari va professional mahsulotlar jamlanmasi.
        </p>
      </div>
    </div>

    {/* Stats */}
    <div className="p-6 grid grid-cols-2 gap-4">
      <div>
        <p className="text-2xl font-black text-red-600">500+</p>
        <p className="text-xs text-gray-500">mahsulotlar</p>
      </div>
      <div>
        <p className="text-2xl font-black text-red-600">50+</p>
        <p className="text-xs text-gray-500">kategoriyalar</p>
      </div>
    </div>
  </div>
);

// ================= MAIN CATALOG COMPONENT =================
const Catalog = () => {
  const [categories, setCategories] = useState([]);
  const [activeParent, setActiveParent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const contentRef = useRef(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(API_URL, { signal: controller.signal });
        
        if (!res.ok) {
          throw new Error("Kategoriyalarni yuklab bo'lmadi");
        }
        
        const data = await res.json();

        const parents = data.filter((c) => c.parent_id === null);
        const structured = parents
          .map((p) => ({
            ...p,
            children: data.filter((c) => c.parent_id === p.id),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCategories(structured);
        
        clearTimeout(timeoutId);
      } catch (err) {
        if (err.name === 'AbortError') {
          setError("So'rov vaqti tugadi. Internet aloqasini tekshiring");
        } else {
          setError(err.message || "Ma'lumotlarni yuklashda xatolik");
        }
        console.error("Xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.children.some((child) =>
          child.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [categories, searchTerm]);

  // Toggle accordion
  const toggleAccordion = useCallback((id) => {
    setActiveParent((prev) => (prev === id ? null : id));
  }, []);

  // Navigate to category
  const handleNavigate = useCallback((slugOrId) => {
    navigate(`/category/${slugOrId}`);
  }, [navigate]);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  // Handle retry
  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && searchTerm) {
        setSearchTerm('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} onRetry={handleRetry} />;

  return (
    <>
      <Helmet>
        <title>Katalog | TailorShop.uz – Namangandagi Furnitura Do'koni</title>
        <meta
          name="description"
          content="TailorShop.uz katalogi: ip, tugma, zamok, rezina va boshqa tikuvchilik furnitura mahsulotlari. Namanganda ulgurji va chakana savdo."
        />
        <link rel="canonical" href="https://www.tailorshop.uz/catalog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Katalog | TailorShop.uz" />
        <meta property="og:description" content="Tikuvchilar uchun furnitura mahsulotlari katalogi" />
        <meta property="og:url" content="https://www.tailorshop.uz/catalog" />
        <meta property="og:image" content="https://www.tailorshop.uz/Logo.png" />
        
        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Furnitura Katalogi",
            "url": "https://www.tailorshop.uz/catalog",
            "description": "Tikuvchilik uchun barcha turdagi furnitura mahsulotlari",
            "provider": {
              "@type": "LocalBusiness",
              "name": "TailorShop.uz",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Namangan",
                "addressCountry": "UZ"
              }
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-white to-red-50/30">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-red-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
            {/* Back Button */}
            <Link
              to="/"
              className="
                p-2.5 rounded-xl bg-red-50 text-red-600
                hover:bg-red-100 hover:scale-105
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-red-300
              "
              aria-label="Bosh sahifaga qaytish"
            >
              <FaArrowLeft size={16} />
            </Link>

            {/* Logo and Title */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-500 rounded-xl p-2 shadow-lg hidden sm:block">
                <img
                  src={KatalogIcon}
                  alt="TailorShop.uz"
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <h1 className="text-xl sm:text-2xl font-black uppercase italic bg-gradient-to-r from-red-700 to-red-500 bg-clip-text text-transparent">
                Katalog
              </h1>
            </div>

            {/* Search */}
            <div className="w-48 sm:w-64 md:w-80">
              <SearchInput 
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={handleClearSearch}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div ref={contentRef} className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Categories Section */}
            <div className="lg:col-span-8 space-y-4">
              {/* Results count */}
              {searchTerm && (
                <div className="flex items-center justify-between mb-4 px-2">
                  <p className="text-sm text-gray-500">
                    {filteredCategories.length} ta kategoriya topildi
                  </p>
                  <button
                    onClick={handleClearSearch}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Filtrni tozalash
                  </button>
                </div>
              )}

              {/* Categories list */}
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <CategoryAccordion
                    key={category.id}
                    category={category}
                    isOpen={activeParent === category.id}
                    onToggle={toggleAccordion}
                    onNavigate={handleNavigate}
                    searchTerm={searchTerm}
                  />
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                  <FaSearch className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Hech narsa topilmadi</p>
                  <button
                    onClick={handleClearSearch}
                    className="mt-4 text-red-600 hover:text-red-700 text-sm underline"
                  >
                    Qidiruvni tozalash
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <SidebarCard />

              {/* All Products Button */}
              <div className="sticky bottom-4 lg:bottom-auto lg:top-24">
                <Link
                  to="/all-products"
                  className="
                    flex items-center justify-between
                    w-full px-6 py-5
                    bg-gradient-to-r from-red-600 to-red-500
                    text-white rounded-2xl
                    font-black uppercase tracking-widest text-sm
                    hover:from-red-700 hover:to-red-600
                    transition-all duration-300
                    shadow-xl shadow-red-200
                    group
                  "
                >
                  <span className="flex items-center gap-3">
                    <FaBoxes size={16} />
                    Barcha Mahsulotlar
                  </span>
                  <FaChevronRight className="group-hover:translate-x-1 transition-transform" size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #fecaca;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #fca5a5;
        }
      `}</style>
    </>
  );
};

export default React.memo(Catalog);