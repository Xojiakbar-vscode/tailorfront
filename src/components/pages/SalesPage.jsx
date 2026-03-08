import React, { useState, useEffect } from "react";
import ProductCard from "../ProductCard";
import { FaFire } from "react-icons/fa";

const SalesPage = ({ addToCart, toggleFavorite, favorites }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://tailorback2025-production.up.railway.app/api/products")
      .then((res) => res.json())
      .then((data) => {
        // Faqat chegirmasi bor mahsulotlar (percent yoki amount mavjud bo'lsa)
        const sales = data.filter((p) => 
          p.is_active && 
          p.discount && 
          p.discount.is_active !== false && 
          (p.discount.percent > 0 || p.discount.amount > 0)
        );
        setProducts(sales);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-red-600 font-black italic">YUKLANMOQDA...</div>;

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      <div className="bg-red-600 py-16 mb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-white/80 mb-2 font-black uppercase text-xs tracking-[0.3em]">
            <FaFire /> Hot Deals
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
            Maxsus <span className="text-slate-900">Chegirmalar.</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                addToCart={addToCart} 
                toggleFavorite={toggleFavorite} 
                favorites={favorites} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm">
            <p className="text-slate-400 font-bold uppercase tracking-widest italic">Hozirda chegirmalar mavjud emas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPage;