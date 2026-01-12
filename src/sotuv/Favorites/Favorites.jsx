import React from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaShoppingCart, FaHeartBroken, FaRegHeart } from "react-icons/fa";
import { BsArrowLeft, BsBagHeart } from "react-icons/bs";

const Favorites = ({ favorites, toggleFavorite, addToCart }) => {

  // --- BO'SH HOLAT UCHUN DIZAYN ---
  if (!favorites || favorites.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-white">
        <div className="relative mb-10 group">
          <div className="absolute -inset-10 bg-red-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          <BsBagHeart className="relative text-red-100 text-[150px] sm:text-[200px] animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-5xl drop-shadow-lg">✨</span>
          </div>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-4">
          Sevimlilar bo'sh <span className="text-red-600">.</span>
        </h2>
        <p className="text-slate-400 mt-2 mb-12 max-w-sm font-medium leading-relaxed">
          Sizga yoqqan mahsulotlar bu yerda saqlanadi. Hozircha hech qanday tanlov qilmadingiz.
        </p>
        <Link to="/" className="group relative inline-flex items-center gap-4 bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] overflow-hidden transition-all hover:bg-red-600 active:scale-95 shadow-2xl">
          <BsArrowLeft className="group-hover:-translate-x-2 transition-transform" size={18} />
          Xaridni boshlash
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 pb-40">
      {/* --- SAHIFA SARLAVHASI --- */}
      <div className="flex flex-col items-center mb-20 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-10 text-[100px] font-black text-slate-50/50 select-none uppercase italic tracking-tighter z-0">
          WISH LIST
        </div>
        <h1 className="relative z-10 text-5xl sm:text-7xl font-black text-slate-950 italic uppercase tracking-tighter">
          Saralanganlar <span className="text-red-600">({favorites.length})</span>
        </h1>
        <div className="h-1.5 w-20 bg-red-600 rounded-full mt-6 shadow-xl shadow-red-200"></div>
        <p className="mt-6 text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">
          Sizning tanlovingiz — bizning faxrimiz
        </p>
      </div>

      {/* --- MAHSULOTLAR GRIDI --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-10 md:gap-y-20">
        {favorites.map((product) => {
          const imageUrl = product.images?.[0]?.image_url || "https://via.placeholder.com/400x500";
          
          return (
            <div key={product.id} className="group flex flex-col h-full bg-white">
              
              {/* Rasm konteyneri (Hoverda silliq o'zgaradi) */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] bg-slate-50 shadow-sm transition-all duration-700 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)]">
                <Link to={`/product/${product.id}`} className="block w-full h-full">
                  <img 
                    src={imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" 
                  />
                </Link>
                
                {/* O'chirish (Trash) tugmasi */}
                <button 
                  onClick={() => toggleFavorite(product)}
                  className="absolute top-5 right-5 w-11 h-11 bg-white/80 backdrop-blur-md hover:bg-red-600 hover:text-white text-red-600 rounded-2xl shadow-lg transition-all flex items-center justify-center active:scale-75 group/trash"
                  title="O'chirish"
                >
                  <FaTrash className="group-hover/trash:rotate-12 transition-transform" size={16} />
                </button>

                {/* Rasmni ustiga borganda chiqadigan Quick View effekti (faqat Desktop) */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block"></div>
              </div>

              {/* Ma'lumotlar qismi */}
              <div className="pt-6 px-2 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em]">
                        {product.category_name || "Fashion 2025"}
                    </span>
                </div>

                <Link to={`/product/${product.id}`}>
                  <h3 className="font-bold text-slate-900 uppercase italic text-base md:text-lg mb-3 leading-tight group-hover:text-red-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="mt-auto space-y-4">
                  <div className="flex items-baseline gap-1">
                    <p className="text-slate-900 font-black text-2xl tracking-tighter">
                        {Math.round(product.price).toLocaleString()}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">so'm</span>
                  </div>
                  
                  {/* Savatga qo'shish tugmasi */}
                  <button 
                    onClick={() => addToCart({ ...product, quantity: 1, image: imageUrl })}
                    className="w-full bg-slate-950 text-white py-4 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-red-600 transition-all duration-500 text-[11px] font-black uppercase tracking-[0.1em] shadow-xl active:scale-95 group/btn"
                  >
                    <div className="relative w-5 h-5 overflow-hidden">
                        <FaShoppingCart className="absolute inset-0 transition-transform group-hover/btn:-translate-y-10" size={18} />
                        <FaShoppingCart className="absolute inset-0 translate-y-10 transition-transform group-hover/btn:translate-y-0" size={18} />
                    </div>
                    Savatga +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Favorites;