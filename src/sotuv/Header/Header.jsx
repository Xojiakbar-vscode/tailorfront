import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { CiGrid41 } from "react-icons/ci";

// Rasmlar
import TailorLogo from "../../images/TailorLogo.png";
import Like from "../../images/Live.png";
import Savat from "../../images/Savat.png";

/* 🧊 iOS uslubidagi yumshoq animatsiya */
const iosBounce = {
  type: "spring",
  stiffness: 420,
  damping: 22,
  mass: 0.7,
};

const Header = ({ cartItems = [], favorites = [] }) => {
  const location = useLocation();

  const cartCount = cartItems.reduce(
    (t, i) => t + (i.quantity || 1),
    0
  );
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
      icon: <img src={Like} alt="Like" className="w-6 h-6" />,
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
      icon: <img src={Savat} alt="Cart" className="w-7 h-7" />,
      badge: cartCount,
    },
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;

    return (
      <Link to={item.path} className="relative no-underline">
        <motion.div
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            scale: isActive ? [1, 1.12, 0.98, 1] : 1,
            y: isActive ? [0, -6, 3, 0] : 0,
          }}
          transition={iosBounce}
          className={`relative flex flex-col items-center ${
            isActive ? "text-red-600" : "text-red-400"
          }`}
        >
          {/* ICON + ACTIVE PILL */}
          <div className="relative w-11 h-11 flex items-center justify-center">
            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="header-active-pill"
                  className="absolute inset-0 rounded-full bg-red-100/80"
                  transition={iosBounce}
                />
              )}
            </AnimatePresence>

            <span className="relative z-10">{item.icon}</span>

            {/* BADGE */}
            <AnimatePresence>
              {item.badge > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 600,
                    damping: 18,
                  }}
                  className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black min-w-[16px] h-[16px] flex items-center justify-center rounded-full ring-2 ring-white"
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* LABEL */}
          <span className="text-[10px] font-black uppercase mt-1">
            {item.label}
          </span>
        </motion.div>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* GLASS BAR */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.06)] py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between relative h-12 lg:h-16">

            {/* LEFT (desktop) */}
            <div className="hidden lg:flex items-center gap-8">
              {itemsLeft.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>

            {/* CENTER LOGO */}
            <Link
              to="/yana"
              className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
            >
              <motion.img
                src={TailorLogo}
                alt="Logo"
                whileHover={{ scale: 1.05 }}
                transition={iosBounce}
                className="h-9 sm:h-11 lg:h-12 object-contain drop-shadow-sm"
              />
            </Link>

            {/* RIGHT (desktop) */}
            <div className="hidden lg:flex items-center gap-8">
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
