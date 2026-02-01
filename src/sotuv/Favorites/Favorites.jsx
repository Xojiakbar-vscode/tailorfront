import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FaTrash, FaShoppingCart, FaPercent } from "react-icons/fa";
import { BsArrowLeft, BsBagHeart } from "react-icons/bs";

const FALLBACK_IMAGE = "https://geostudy.uz/img/pictures/cifvooipg_rf1.jpeg";

const Favorites = ({ favorites = [], toggleFavorite, addToCart }) => {
  
  // Chegirmali narxni hisoblash (Percent va Amount uchun)
  const calculateFinalPrice = (product) => {
    let price = Number(product.price_uzs || product.price || 0);
    const discount = product.discount;

    if (discount && discount.is_active !== false) {
      if (discount.percent) {
        price = price * (1 - Number(discount.percent) / 100);
      } else if (discount.amount) {
        price = Math.max(0, price - Number(discount.amount));
      }
    }
    return price;
  };

  const formatPrice = (price) => Number(price).toLocaleString('uz-UZ') + " SO'M";

  /* =======================
      BO'SH HOLAT (EMPTY)
  ======================= */
  if (favorites.length === 0) {
    return (
      <>
        <Helmet>
          <title>{`Saralanganlar bo'sh | TailorShop.uz`}</title>
        </Helmet>
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-white animate-fadeIn">
          <div className="relative mb-10">
            <div className="absolute -inset-12 bg-red-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
            <BsBagHeart className="relative text-red-200 text-[140px] sm:text-[180px]" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">
            Sevimlilar bo‘sh <span className="text-red-600">.</span>
          </h2>

          <p className="text-slate-400 max-w-sm mb-10 text-sm sm:text-base font-medium">
            Sizga yoqqan mahsulotlar shu yerda saqlanadi. Hozircha hech narsa tanlanmagan.
          </p>

          <Link
            to="/all-products"
            className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all active:scale-95 shadow-2xl shadow-slate-200"
          >
            <BsArrowLeft size={18} />
            Katalogga qaytish
          </Link>
        </div>
      </>
    );
  }

  /* =======================
      ASOSIY RO'YXAT
  ======================= */
  return (
    <>
      <Helmet>
        {/* String xatoligini oldini olish uchun backtick ishlatildi */}
        <title>{`Saralanganlar (${favorites.length}) | TailorShop.uz`}</title>
        <meta name="description" content="Sizga yoqqan va keyinchalik sotib olish uchun saqlab qo'yilgan mahsulotlar ro'yxati." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-14 pb-[calc(100px+env(safe-area-inset-bottom))] bg-[#fafafa]">
        {/* HEADER */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-x-0 -top-10 hidden sm:block text-[100px] font-black text-slate-100/50 uppercase italic tracking-tighter select-none">
            FAVORITES
          </div>

          <h1 className="relative text-4xl sm:text-6xl font-black uppercase italic text-slate-900 tracking-tighter">
            Saralanganlar{" "}
            <span className="text-red-600">({favorites.length})</span>
          </h1>

          <div className="h-1.5 w-24 bg-red-600 rounded-full mx-auto mt-6"></div>
          <p className="mt-6 text-slate-400 text-[10px] uppercase tracking-[0.4em] font-black italic">
            Tanlangan mahsulotlar ro'yxati
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
          {favorites.map((product, idx) => {
            const finalPrice = calculateFinalPrice(product);
            const originalPrice = Number(product.price_uzs || product.price || 0);
            const isDiscounted = finalPrice < originalPrice;
            const imageUrl = product.images?.[0]?.image_url || FALLBACK_IMAGE;

            return (
              <div
                key={product.id}
                className="group bg-white flex flex-col h-full border border-transparent hover:border-red-600/5 rounded-[2.5rem] transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 animate-slideUp"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2.2rem] bg-gray-50 m-2">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </Link>

                  {/* Chegirma Badge */}
                  {isDiscounted && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1 animate-pulse">
                      <FaPercent size={8}/> 
                      {Math.round(((originalPrice - finalPrice) / originalPrice) * 100)}%
                    </div>
                  )}

                  <button
                    onClick={() => toggleFavorite(product)}
                    className="absolute top-4 right-4 w-11 h-11 bg-white/90 backdrop-blur-md text-red-600 rounded-2xl shadow-xl hover:bg-red-600 hover:text-white transition-all active:scale-75 flex items-center justify-center group/trash"
                  >
                    <FaTrash size={14} className="group-hover/trash:rotate-12" />
                  </button>
                </div>

                <div className="pt-4 px-5 pb-6 flex flex-col flex-grow">
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1 italic">Tailor Choice</span>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-black text-slate-900 uppercase italic text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-auto pt-6">
                    <div className="mb-4">
                      <p className="text-lg sm:text-2xl font-black text-red-600 tracking-tighter leading-none">
                        {formatPrice(finalPrice)}
                      </p>
                      {isDiscounted && (
                        <p className="text-[11px] text-gray-400 line-through font-bold mt-1">
                          {formatPrice(originalPrice)}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        addToCart({
                          ...product,
                          quantity: 1,
                          image: imageUrl,
                          price: finalPrice, 
                        })
                      }
                      className="w-full bg-slate-950 text-white py-4 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-red-600 transition-all duration-300 text-[10px] font-black uppercase tracking-widest active:scale-95 shadow-xl shadow-slate-200 group/btn"
                    >
                      <FaShoppingCart size={15} className="group-hover/btn:animate-bounce" />
                      Savatga
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </>
  );
};

export default Favorites;