// pages/SalesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPercent, FaClock, FaFire, FaTag } from 'react-icons/fa';
import ProductCard from '../ProductCard';

const API_URL = "https://tailorback2025-production.up.railway.app/api/products";

const SalesPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, big, new

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}?discount=true`);
      const data = await response.json();
      setProducts(data.filter(p => p.discount_id !== null));
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const discountCategories = [
    { id: 'all', name: 'Barchasi', icon: FaTag },
    { id: 'big', name: 'Katta chegirma', icon: FaFire },
    { id: 'new', name: 'Yangi aksiyalar', icon: FaClock }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FaPercent className="text-6xl mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-black mb-4">AKSIYALAR</h1>
            <p className="text-xl opacity-90">Eng sara mahsulotlar eng qulay narxlarda</p>
          </motion.div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {discountCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                filter === cat.id
                  ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                  : 'bg-white text-gray-700 hover:bg-red-50'
              }`}
            >
              <cat.icon />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">Hozircha aksiyalar mavjud emas</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} showDiscount={true} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPercent className="text-2xl text-red-600" />
                </div>
                <h3 className="font-bold mb-2">Chegirma 50% gacha</h3>
                <p className="text-sm text-gray-600">Eng sara mahsulotlarda</p>
              </div>
              <div>
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaClock className="text-2xl text-red-600" />
                </div>
                <h3 className="font-bold mb-2">Cheklangan vaqt</h3>
                <p className="text-sm text-gray-600">Aksiyalar muddati cheklangan</p>
              </div>
              <div>
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFire className="text-2xl text-red-600" />
                </div>
                <h3 className="font-bold mb-2">Eng ko'p sotilgan</h3>
                <p className="text-sm text-gray-600">Mijozlar tanlovi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;