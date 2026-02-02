import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiOutlineAppstore,
  AiOutlineInfoCircle,
} from "react-icons/ai";

/* 📱 iOS uslubidagi yumshoq animatsiya */
const iosBounce = {
  type: "spring",
  stiffness: 400,
  damping: 25,
};

const FooterNavbar = ({ cartItems = [], favorites = [] }) => {
  const location = useLocation();

  const cartCount = cartItems.reduce((t, i) => t + (i.quantity || 1), 0);
  const favoriteCount = favorites.length;

  const navItems = [
    { id: 1, label: "Home", icon: <AiOutlineHome />, path: "/" },
    { id: 2, label: "Catalog", icon: <AiOutlineAppstore />, path: "/catalog" },
    { id: 3, label: "Search", icon: <AiOutlineSearch />, path: "/search" },
    { id: 4, label: "Like", icon: <AiOutlineHeart />, path: "/favorites", badge: favoriteCount },
    { id: 5, label: "Cart", icon: <AiOutlineShoppingCart />, path: "/cart", badge: cartCount },
    { id: 6, label: "Yana", icon: <AiOutlineInfoCircle />, path: "/yana" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden">
      {/* 🧊 Glassmorphism bar */}
      <div className="
        mx-3 mb-4 
        rounded-[2rem] 
        backdrop-blur-2xl 
        bg-white/50 
        border border-white/40 
        shadow-[0_10px_40px_rgba(0,0,0,0.1)] 
        px-2 py-3
      ">
        <div className="flex justify-around items-end">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.id} to={item.path} className="relative flex-1 no-underline">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center justify-center transition-colors duration-300 ${
                    isActive ? "text-red-600" : "text-slate-500"
                  }`}
                >
                  {/* Active Indicator (Tepadagi chiziqcha) */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="active-dot"
                        className="absolute -top-1 w-1 h-1 rounded-full bg-red-600"
                        transition={iosBounce}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon Area */}
                  <div className="relative flex items-center justify-center w-10 h-10">
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="footer-pill"
                          className="absolute inset-0 rounded-2xl bg-red-50"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={iosBounce}
                        />
                      )}
                    </AnimatePresence>

                    <span className={`relative z-10 text-[24px] ${isActive ? "drop-shadow-sm" : ""}`}>
                      {item.icon}
                    </span>

                    {/* Badge */}
                    <AnimatePresence>
                      {item.badge > 0 && (
                        <motion.span
                          initial={{ scale: 0, y: 5 }}
                          animate={{ scale: 1, y: 0 }}
                          className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black min-w-[17px] h-[17px] flex items-center justify-center rounded-full border-2 border-white shadow-sm z-20"
                        >
                          {item.badge > 9 ? "9+" : item.badge}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Label */}
                  <span className={`text-[9px] font-bold uppercase tracking-tighter mt-1 transition-all ${
                    isActive ? "opacity-100 scale-105" : "opacity-60 scale-100"
                  }`}>
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default FooterNavbar;