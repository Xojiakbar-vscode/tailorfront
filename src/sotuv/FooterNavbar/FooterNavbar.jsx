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

/* 📱 Mobilga mos yumshoq bounce */
const iosBounce = {
  type: "spring",
  stiffness: 420,
  damping: 22,
  mass: 0.7,
};

const FooterNavbar = ({ cartItems = [], favorites = [] }) => {
  const location = useLocation();

  const cartCount = cartItems.reduce(
    (t, i) => t + (i.quantity || 1),
    0
  );
  const favoriteCount = favorites.length;

  const navItems = [
    { id: 1, label: "Home", icon: <AiOutlineHome />, path: "/" },
    { id: 2, label: "About", icon: <AiOutlineInfoCircle />, path: "/yana" },
    { id: 3, label: "Katalog", icon: <AiOutlineAppstore />, path: "/catalog" },
    { id: 4, label: "Search", icon: <AiOutlineSearch />, path: "/search" },
    { id: 5, label: "Like", icon: <AiOutlineHeart />, path: "/favorites", badge: favoriteCount },
    { id: 6, label: "Cart", icon: <AiOutlineShoppingCart />, path: "/cart", badge: cartCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden">
      <div className="mx-2 mb-2 rounded-[2.2rem] bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_-10px_25px_rgba(0,0,0,0.12)] px-1.5 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.id} to={item.path} className="relative">
                <motion.div
                  whileTap={{ scale: 0.85, y: 6 }}   // kamroq cho‘kish
                  animate={{
                    scale: isActive ? [1, 1.12, 0.98, 1] : 1,
                    y: isActive ? [0, -6, 3, 0] : 0,
                  }}
                  transition={iosBounce}
                  className={`flex flex-col items-center ${
                    isActive ? "text-red-600" : "text-gray-400"
                  }`}
                >
                  {/* ICON + PILL */}
                  <div className="relative flex items-center justify-center w-12 h-12">
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 rounded-full bg-red-100/80"
                          transition={iosBounce}
                        />
                      )}
                    </AnimatePresence>

                    <span className="relative z-10 text-[22px]">
                      {item.icon}
                    </span>

                    {/* BADGE */}
                    <AnimatePresence>
                      {item.badge > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 600, damping: 20 }}
                          className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full ring-2 ring-white"
                        >
                          {item.badge > 99 ? "99+" : item.badge}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* LABEL */}
                  <span className="text-[9px] font-semibold uppercase tracking-tight mt-0.5">
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
