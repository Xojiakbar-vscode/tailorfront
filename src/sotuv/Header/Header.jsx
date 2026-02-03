import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { CiGrid41 } from "react-icons/ci";

// Rasmlar (Yo'llarni tekshirib oling)
import TailorLogo from "../../assets/img1.svg"; 
import Like from "../../images/Live.png";
import Savat from "../../images/Savat.png";

const iosBounce = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

const Header = ({ cartItems = [], favorites = [] }) => {
  const location = useLocation();

  const cartCount = cartItems.reduce((t, i) => t + (i.quantity || 1), 0);
  const favoriteCount = favorites.length;

  const itemsLeft = [
    {
      id: "catalog",
      label: "Katalog",
      path: "/catalog",
      icon: <CiGrid41 className="w-6 h-6" />,
    },
    {
      id: "favorites",
      label: "Like",
      path: "/favorites",
      icon: <img src={Like} alt="Like" className="w-6 h-6 object-contain" />,
      badge: favoriteCount,
    },
  ];

  const itemsRight = [
    {
      id: "search",
      label: "Qidiruv",
      path: "/search",
      icon: <FaSearch className="w-5 h-5" />,
    },
    {
      id: "cart",
      label: "Savat",
      path: "/cart",
      icon: <img src={Savat} alt="Savat" className="w-7 h-7 object-contain" />,
      badge: cartCount,
    },
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;

    return (
      <Link to={item.path} className="relative group no-underline">
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`flex flex-col items-center transition-colors duration-300 ${
            isActive ? "text-red-600" : "text-slate-700 hover:text-red-500"
          }`}
        >
          <div className="relative w-11 h-11 flex items-center justify-center">
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 rounded-2xl bg-white/80 shadow-sm"
                transition={iosBounce}
              />
            )}
            <span className="relative z-10">{item.icon}</span>

            {/* Badge */}
            <AnimatePresence>
              {item.badge > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white z-20"
                >
                  {item.badge > 99 ? "9" : item.badge}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">
            {item.label}
          </span>
        </motion.div>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 left-0  w-full z-[100] ">
      {/* 🧊 Ultra Glass Container */}
      <div className="
        w-full
        backdrop-blur-xl 
        bg-white/40 
        border-b border-white/20 
        shadow-[0_2px_20px_rgba(0,0,0,0.02)]
      ">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-between h-16 lg:h-24">

            {/* LEFT SECTION - 1024px dan pastda butunlay yo'qoladi */}
            <div className="hidden lg:flex items-center gap-10 flex-1">
              {itemsLeft.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>

            {/* LOGO - Har doim markazda (Mobil va Desktopda) */}
            <div className="flex justify-center flex-1 lg:flex-none">
              <Link to="/yana">
                <motion.img
                  src={TailorLogo}
                  alt="TailorShop Logo"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.04 }}
                  className="h-10 sm:h-12 lg:h-16 w-auto object-contain filter drop-shadow-sm"
                />
              </Link>
            </div>

            {/* RIGHT SECTION - 1024px dan pastda butunlay yo'qoladi */}
            <div className="hidden lg:flex items-center justify-end gap-10 flex-1">
              {itemsRight.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;