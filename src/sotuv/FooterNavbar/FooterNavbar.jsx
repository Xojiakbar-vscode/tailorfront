import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  AiOutlineHome, 
  AiOutlineSearch, 
  AiOutlineShoppingCart, 
  AiOutlineHeart,
  AiOutlineAppstore, 
  AiOutlineInfoCircle 
} from "react-icons/ai";

const FooterNavbar = ({ cartItems = [], favorites = [] }) => {
  const location = useLocation();

  // 🔹 useEffect faqat komponent ichida bo'ladi
  useEffect(() => {
    console.log("Sevimlilar yangilandi:", favorites.length);
  }, [favorites]);

  // Savat va sevimlilar soni
  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );
  const favoriteCount = favorites.length;

  const navItems = [
    { id: 1, label: "Home", icon: <AiOutlineHome size={22} />, path: "/" },
    { id: 2, label: "About", icon: <AiOutlineInfoCircle size={22} />, path: "/yana" },
    { id: 3, label: "Katalog", icon: <AiOutlineAppstore size={22} />, path: "/catalog" },
    { id: 4, label: "Search", icon: <AiOutlineSearch size={22} />, path: "/search" },
    { id: 5, label: "Like", icon: <AiOutlineHeart size={22} />, path: "/favorites", badge: favoriteCount },
    { id: 6, label: "Cart", icon: <AiOutlineShoppingCart size={22} />, path: "/cart", badge: cartCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-red-100 py-2 pb-3 px-1 z-[60] lg:hidden">
      <div className="flex justify-around items-end">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center gap-1 min-w-[50px] relative ${
                isActive ? "text-red-600" : "text-gray-500"
              }`}
            >
              <div className="relative p-1">
                {item.icon}

                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black min-w-[16px] h-4 flex items-center justify-center rounded-full">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>

              <span className="text-[9px] font-bold uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default FooterNavbar;
