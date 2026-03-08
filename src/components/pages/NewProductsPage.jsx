import React, { useState, useEffect } from "react";
import ProductCard from "../ProductCard";
import { FaRocket } from "react-icons/fa";

const NewProductsPage = ({ addToCart, toggleFavorite, favorites }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://tailorback2025-production.up.railway.app/api/products")
      .then((res) => res.json())
      .then((data) => {
        // Faqat yangi (is_latest) va aktiv mahsulotlar
        const filtered = data.filter((p) => p.is_active && p.is_latest);
        setProducts(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center animate-pulse text-red-600 font-black italic">YUKLANMOQDA...</div>;

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      <div className="bg-slate-900 py-16 mb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-red-600 mb-2 font-black uppercase text-xs tracking-[0.3em]">
            <FaRocket /> Fresh Collection
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
            Yangi <span className="text-red-600">Kelganlar.</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
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
      </div>
    </div>
  );
};

export default NewProductsPage;