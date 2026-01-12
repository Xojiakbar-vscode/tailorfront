import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChevronDown, FaChevronRight, FaSearch, FaFilter, FaStar } from 'react-icons/fa';
import { RiShirtLine } from 'react-icons/ri';
import { GiClothes } from 'react-icons/gi';
import KatalogIcon from '../../images/Katalog.png';
import CatalogImage from '../../images/Catalogmod.png';

const API_URL = "https://tailorback2025-production.up.railway.app/api/categories";

const Catalog = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeParent, setActiveParent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Ranglar palitrasi ikonka fonlari uchun
  const colors = [
    'from-red-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-purple-500 to-violet-500',
    'from-orange-500 to-amber-500',
    'from-indigo-500 to-blue-500'
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // IYerarxiyani qurish: Parentlar va ularning childlarini filterlash
        const parentCategories = data.filter(cat => cat.parent_id === null);
        const enrichedCategories = parentCategories.map(parent => ({
          ...parent,
          children: data.filter(child => child.parent_id === parent.id)
        }));

        setCategories(enrichedCategories);
      } catch (error) {
        console.error("Katalog yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toggleAccordion = (id) => {
    setActiveParent(activeParent === id ? null : id);
  };

  // Qidiruv mantiqi
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.children?.some(child => child.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const midIndex = Math.ceil(filteredCategories.length / 2);
  const leftColumnItems = filteredCategories.slice(0, midIndex);
  const rightColumnItems = filteredCategories.slice(midIndex);

  // --- Kategoriya Kartochkasi Komponenti ---
  const CategoryItem = ({ cat, index }) => {
    const hasChildren = cat.children && cat.children.length > 0;
    const isOpen = activeParent === cat.id;
    const colorIndex = index % colors.length;

    return (
      <div className="mb-6 group">
        <div
          className={`relative overflow-hidden rounded-[2.5rem] cursor-pointer transition-all duration-500 border-2 ${isOpen
              ? 'border-red-500 bg-white shadow-2xl shadow-red-100 -translate-y-1'
              : 'border-transparent bg-white shadow-lg hover:shadow-xl hover:border-slate-200'
            }`}
          onClick={() => hasChildren ? toggleAccordion(cat.id) : navigate(`/category/${cat.id}`)}
        >
          <div className={`p-5 flex items-center justify-between transition-all duration-300 ${isOpen ? 'bg-red-50/30' : ''}`}>
            <div className="flex items-center gap-5">
              {/* Dinamik Ikonka */}
              <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-xl transform transition-all duration-500 ${isOpen ? 'rotate-[10deg] scale-110' : 'group-hover:rotate-[-5deg]'}`}>
                <div className={`absolute inset-0 opacity-20 blur-lg rounded-2xl bg-gradient-to-br ${colors[colorIndex]}`}></div>
                <div className={`relative w-full h-full rounded-2xl bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center border border-white/20 shadow-inner`}>
                  <GiClothes className="text-white text-2xl sm:text-3xl drop-shadow-md" />
                </div>
                {hasChildren && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce-slow">
                    {cat.children.length}
                  </span>
                )}
              </div>

              {/* Matn */}
              <div>
                <h3 className={`font-black uppercase italic tracking-tighter text-lg sm:text-xl transition-colors duration-300 ${isOpen ? 'text-red-700' : 'text-slate-800'}`}>
                  {cat.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`h-1 rounded-full bg-red-600 transition-all duration-500 ${isOpen ? 'w-12' : 'w-6'}`}></div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {cat.children?.length || 0} tur mavjud
                  </span>
                </div>
              </div>
            </div>

            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-500 border ${isOpen ? 'bg-red-600 text-white border-red-600 shadow-lg' : 'bg-slate-50 text-slate-300 border-slate-100 group-hover:text-red-500'
              }`}>
              <FaChevronDown className={`text-xs transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>

        {/* Dropdown Content */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="bg-slate-50/50 rounded-[2rem] border border-slate-100 p-3 sm:p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cat.children?.map((child) => (
                <button
                  key={child.id}
                  onClick={() => navigate(`/category/${child.id}`)}
                  className="group relative flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-red-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                    <RiShirtLine className="text-slate-400 group-hover:text-red-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-tight">{child.name}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">Mahsulotlarni ko'rish</p>
                  </div>
                  <FaChevronRight className="text-slate-200 group-hover:text-red-500 transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate(`/category/${cat.id}`)}
              className="w-full py-4 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:border-red-300 hover:text-red-600 transition-all flex items-center justify-center gap-2"
            >
              Barcha {cat.name} bo'limiga o'tish <FaChevronRight size={10} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* --- Sticky Header --- */}
      <div className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <Link to="/" className="p-3 bg-slate-50 rounded-2xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all group">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center gap-3 flex-1 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-pink-600 p-2 shadow-lg shadow-red-200 hidden sm:block">
              <img src={KatalogIcon} alt="Icon" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter text-slate-900">
              Katalog<span className="text-red-600">.</span>
            </h1>
          </div>

          <div className="relative group flex-1 max-w-[200px] sm:max-w-xs">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-500/5 focus:border-red-200 outline-none transition-all text-sm font-bold"
            />
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-400">Yuklanmoqda...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Kategoriyalar (8 ustun) */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <div className="flex flex-col">
                  {leftColumnItems.map((cat, index) => (
                    <CategoryItem key={cat.id} cat={cat} index={index} />
                  ))}
                </div>
                <div className="flex flex-col">
                  {rightColumnItems.map((cat, index) => (
                    <CategoryItem key={cat.id} cat={cat} index={index + leftColumnItems.length} />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar (4 ustun) */}
            <div className="lg:col-span-4 pb-10 lg:block">
              <div className="sticky top-32  space-y-8">
                <div className="hidden lg:block relative group bg-white rounded-[3rem] p-5 shadow-2xl border border-slate-50 overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"></div>
                  <div className="relative rounded-[2.5rem] overflow-hidden mb-6 h-72">
                    <img src={CatalogImage} alt="Premium" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6">
                      <span className="px-4 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Premium Sifat</span>
                    </div>
                  </div>
                  <div className="px-2">
                    <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-4">
                      Tikuvchilik <br /> Olami <span className="text-red-600">.</span>
                    </h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                      Eng sara tikuv ashyolari va professional aksessuarlar to'plami. Sifat bizning ustunligimizdir.
                    </p>
                    <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                      <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                          </div>
                        ))}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="text-slate-900 block font-black">1.2K+ Mijozlar</span>
                        Sodiq mijozlarimiz
                      </div>
                    </div>
                  </div>
                </div>

                <Link to="/all-products" className="flex items-center justify-between p-6  bg-slate-900 text-white rounded-[2.5rem] hover:bg-red-600 transition-all duration-500 group shadow-2xl shadow-slate-200">
                  <span className="font-black uppercase italic tracking-widest text-xs">Barcha Mahsulotlar</span>
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:translate-x-2 transition-transform">
                    <FaChevronRight />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Catalog;