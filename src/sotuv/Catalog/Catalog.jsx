import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import KatalogIcon from '../../images/Katalog.png';
import CatalogImage from '../../images/Catalogmod.png';

const API_URL = "https://tailorback2025-production.up.railway.app/api/categories";

const Catalog = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Faqat asosiy kategoriyalarni saralab olamiz (parent_id: null)
        const parentCategories = data.filter(cat => cat.parent_id === null);
        setCategories(parentCategories);
      } catch (error) {
        console.error("Katalog yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Ma'lumotlarni ikkita ustunga teng bo'lish funksiyasi
  const midIndex = Math.ceil(categories.length / 2);
  const leftColumnItems = categories.slice(0, midIndex);
  const rightColumnItems = categories.slice(midIndex);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <FaArrowLeft className="text-lg" />
              <span className="font-medium uppercase tracking-widest text-xs">Asosiy</span>
            </Link>

            <div className="flex items-center gap-3">
              <img src={KatalogIcon} alt="Katalog" className="w-8 h-8" />
              <h1 className="text-xl font-black uppercase italic tracking-tighter text-red-900">Katalog</h1>
            </div>

            <div className="w-20 hidden sm:block"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Catalog List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-3">
                {leftColumnItems.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => navigate(`/category/${cat.id}`)}
                    className="w-full text-left px-5 py-4 bg-red-50 hover:bg-red-700 hover:text-white rounded-2xl transition-all duration-300 text-red-800 font-bold uppercase text-xs tracking-wider border border-transparent hover:shadow-lg hover:shadow-red-200"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {rightColumnItems.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => navigate(`/category/${cat.id}`)}
                    className="w-full text-left px-5 py-4 bg-red-50 hover:bg-red-700 hover:text-white rounded-2xl transition-all duration-300 text-red-800 font-bold uppercase text-xs tracking-wider border border-transparent hover:shadow-lg hover:shadow-red-200"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Banner Section */}
            <div className="hidden lg:flex flex-col items-center justify-start sticky top-24 h-fit">
              <div className="relative group">

                <img 
                  src={CatalogImage} 
                  alt="Premium Catalog" 
                  className="relative w-full max-w-sm h-auto rounded-[2rem]  object-cover"
                />
              </div>
              <div className="mt-8 text-center max-w-sm">
                <h3 className="text-3xl font-black text-red-900 mb-4 uppercase italic tracking-tighter">
                  Sifatli mahsulotlar to'plami
                </h3>
                <p className="text-red-500 font-medium leading-relaxed">
                  Tailor Shop katalogida faqat professional tikuvchilar uchun sinalgan va saralangan aksessuarlar mavjud. 
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;