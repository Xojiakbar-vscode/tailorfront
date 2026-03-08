import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaShoppingCart, FaHeart, FaEye, FaStar, 
  FaFire, FaCheckCircle 
} from 'react-icons/fa';

const ProductCard = ({ 
  product, 
  addToCart, 
  toggleFavorite, 
  favorites = [], 
  cartItems = [] 
}) => {
  const isLiked = favorites.some(item => item.id === product.id);
  const isInCart = cartItems.some(item => item.id === product.id);

  const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price);

  const originalPrice = product.discount_percent 
    ? product.price_uzs / (1 - product.discount_percent / 100) 
    : null;

  return (
    <div className="group relative bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      
      {/* Badges */}
      <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1.5">
        {product.discount_percent > 0 && (
          <span className="bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-md flex items-center gap-1 shadow-sm uppercase">
            <FaFire size={8} /> -{product.discount_percent}%
          </span>
        )}
        {product.is_latest && (
          <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-md shadow-sm uppercase tracking-wider">
            Yangi
          </span>
        )}
      </div>

      {/* Like Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(product);
        }}
        className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
          isLiked ? 'bg-red-500 text-white shadow-red-200 shadow-lg' : 'bg-white/90 text-gray-400 hover:text-red-500 shadow-md'
        }`}
      >
        <FaHeart size={14} className={isLiked ? 'scale-110' : 'scale-100'} />
      </button>

      {/* Image Section */}
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-gray-50">
        <img
          loading="lazy"
          src={product.images?.[0]?.image_url || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/95 px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-1.5 font-bold text-gray-900 text-[10px] transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <FaEye size={12} className="text-red-500" /> KO'RISH
          </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest truncate max-w-[70%]">
            {product.category?.name || "Premium"}
          </span>
          <div className="flex items-center gap-0.5">
            <FaStar className="text-yellow-400" size={9} />
            <span className="text-[9px] font-bold text-gray-400">4.9</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`} className="block mb-2 flex-grow">
          <h3 className="font-bold text-gray-800 text-xs md:text-sm line-clamp-2 hover:text-red-600 transition-colors leading-tight h-8 md:h-10">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-50">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-[9px] text-gray-400 line-through">
                {formatPrice(Math.round(originalPrice))}
              </span>
            )}
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm md:text-base font-black text-gray-900">
                {formatPrice(product.price_uzs)}
              </span>
              <span className="text-[8px] font-bold text-gray-400 uppercase">uzs</span>
            </div>
          </div>

          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isInCart 
                ? 'bg-emerald-500 text-white rotate-[360deg]' 
                : 'bg-gray-900 text-white hover:bg-red-600'
            }`}
          >
            {isInCart ? <FaCheckCircle size={18} /> : <FaShoppingCart size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);