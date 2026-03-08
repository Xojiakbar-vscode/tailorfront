import React, { useState, useEffect, useMemo } from 'react';
import { FaRocket } from 'react-icons/fa';
import ProductCard from '../ProductCard'; 

const NewProductsPage = ({ addToCart, toggleFavorite, favorites, cartItems }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const API_URL = "https://tailorback2025-production.up.railway.app/api/products";

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Faqat is_active: true va is_latest: true bo'lganlarni olamiz
        const newProducts = data.filter(p => p.is_active && p.is_latest);

        setProducts(newProducts);
      } catch (error) {
        console.error('Xatolik:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  // Kategoriyalarni hisoblash (useMemo renderni tezlashtiradi)
  const categories = useMemo(() => {
    const uniqueCats = [
      { id: 'all', name: 'Barchasi' },
      ...Object.values(
        products.reduce((acc, p) => {
          if (p.category?.id) {
            acc[p.category.id] = { id: p.category.id, name: p.category.name };
          }
          return acc;
        }, {})
      )
    ];
    return uniqueCats;
  }, [products]);

  // Tanlangan kategoriya bo'yicha filtrlash
  const filteredProducts = useMemo(() => {
    return selectedCategory === 'all'
      ? products
      : products.filter(p => p.category?.id === parseInt(selectedCategory));
  }, [selectedCategory, products]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <div className="relative h-[200px] bg-gray-900 overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-red-600 rounded-full blur-[80px]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <div className="flex items-center gap-3 mb-2">
            <FaRocket className="text-red-500 text-2xl" />
            <span className="text-red-500 font-bold tracking-[3px] text-xs uppercase">Yangi kelganlar</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
            NEW <span className="text-red-600">ARRIVALS</span>
          </h1>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-start md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'bg-gray-900 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid - Eng tezkor render */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium italic">Hozircha yangi mahsulotlar belgilanmagan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                cartItems={cartItems}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewProductsPage;