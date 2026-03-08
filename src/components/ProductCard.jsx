import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaPercent, FaEye } from "react-icons/fa";

const FALLBACK_IMAGE = "https://geostudy.uz/img/pictures/cifvooipg_rf1.jpeg";

const ProductCard = ({ product, addToCart, toggleFavorite, favorites = [], cartItems = [] }) => {
  const isLiked = favorites.some((item) => item.id === product.id);
  const imageUrl = product.images?.[0]?.image_url || FALLBACK_IMAGE;

  // Chegirmali narxni hisoblash
  const calculateFinalPrice = (p) => {
    let price = Number(p.price_uzs || p.price || 0);
    const discount = p.discount;
    if (discount && discount.is_active !== false) {
      if (discount.percent) {
        price = price * (1 - Number(discount.percent) / 100);
      } else if (discount.amount) {
        price = Math.max(0, price - Number(discount.amount));
      }
    }
    return price;
  };

  const finalPrice = calculateFinalPrice(product);
  const originalPrice = Number(product.price_uzs || product.price || 0);
  const isDiscounted = finalPrice < originalPrice;

  const formatPrice = (price) => Number(price).toLocaleString('uz-UZ') + " SO'M";

  return (
    <div className="group bg-white flex flex-col h-full border border-transparent hover:border-red-600/5 rounded-[2.5rem] transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2.2rem] bg-gray-50 m-2">
        <Link to={`/product/${product.id}`}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </Link>

        {isDiscounted && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1 animate-pulse">
            <FaPercent size={8}/> 
            {Math.round(((originalPrice - finalPrice) / originalPrice) * 100)}%
          </div>
        )}

        <button
          onClick={() => toggleFavorite(product)}
          className={`absolute top-4 right-4 w-11 h-11 backdrop-blur-md rounded-2xl shadow-xl transition-all active:scale-75 flex items-center justify-center ${
            isLiked ? "bg-red-600 text-white" : "bg-white/90 text-gray-400"
          }`}
        >
          <FaHeart size={14} />
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
};

export default ProductCard;