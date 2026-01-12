import React from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { BsArrowLeft, BsBagHeart } from "react-icons/bs";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/600x800?text=No+Image";

const Favorites = ({ favorites = [], toggleFavorite, addToCart }) => {
  /* =======================
     EMPTY STATE
  ======================= */
  if (favorites.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-white">
        <div className="relative mb-10">
          <div className="absolute -inset-12 bg-red-100 rounded-full blur-3xl opacity-60"></div>
          <BsBagHeart className="relative text-red-200 text-[140px] sm:text-[180px]" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">
          Sevimlilar bo‘sh <span className="text-red-600">.</span>
        </h2>

        <p className="text-slate-400 max-w-sm mb-10 text-sm sm:text-base">
          Sizga yoqqan mahsulotlar shu yerda saqlanadi. Hozircha hech narsa
          tanlanmagan.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all active:scale-95"
        >
          <BsArrowLeft size={18} />
          Xaridni boshlash
        </Link>
      </div>
    );
  }

  /* =======================
     MAIN CONTENT
  ======================= */
  return (
    <div className="max-w-7xl mx-auto px-4 py-14 pb-[calc(90px+env(safe-area-inset-bottom))]">
      {/* HEADER */}
      <div className="text-center mb-16 relative">
        {/* katta orqa yozuv faqat desktop */}
        <div className="absolute inset-x-0 -top-10 hidden sm:block text-[90px] font-black text-slate-100 uppercase italic tracking-tight select-none">
          FAVORITES
        </div>

        <h1 className="relative text-4xl sm:text-6xl font-black uppercase italic text-slate-900">
          Saralanganlar{" "}
          <span className="text-red-600">({favorites.length})</span>
        </h1>

        <div className="h-1 w-20 bg-red-600 rounded-full mx-auto mt-6"></div>

        <p className="mt-5 text-slate-400 text-[11px] uppercase tracking-[0.3em] font-bold">
          Siz tanlagan mahsulotlar
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-10">
        {favorites.map((product) => {
          const imageUrl =
            product.images?.[0]?.image_url || FALLBACK_IMAGE;

          return (
            <div
              key={product.id}
              className="group bg-white flex flex-col h-full"
            >
              {/* IMAGE */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-slate-100 shadow-md transition-all group-hover:shadow-xl">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </Link>

                {/* REMOVE */}
                <button
                  onClick={() => toggleFavorite(product)}
                  className="absolute top-3 right-3 w-9 h-9 bg-white/90 text-red-600 rounded-xl shadow hover:bg-red-600 hover:text-white transition-all active:scale-90 flex items-center justify-center"
                  title="O‘chirish"
                >
                  <FaTrash size={13} />
                </button>
              </div>

              {/* INFO */}
              <div className="pt-5 px-1 flex flex-col flex-grow">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-bold text-slate-900 uppercase italic text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="mt-auto pt-4 space-y-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg sm:text-xl font-black text-slate-900">
                      {Number(product.price).toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      so‘m
                    </span>
                  </div>

                  {/* ADD TO CART */}
                  <button
                    onClick={() =>
                      addToCart({
                        ...product,
                        quantity: 1,
                        image: imageUrl,
                      })
                    }
                    className="w-full bg-slate-900 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all text-[11px] font-black uppercase tracking-widest active:scale-95"
                  >
                    <FaShoppingCart size={14} />
                    Savatga
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
