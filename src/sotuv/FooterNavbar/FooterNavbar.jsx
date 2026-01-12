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

/* 🔥 Kuchli iOS-style bounce */
const iosBounce = {
  type: "spring",
  stiffness: 380, // pastroq → ko‘proq sakraydi
  damping: 14,    // kichikroq → tebranish ko‘p
  mass: 0.8,
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
    {
      id: 5,
      label: "Like",
      icon: <AiOutlineHeart />,
      path: "/favorites",
      badge: favoriteCount,
    },
    {
      id: 6,
      label: "Cart",
      icon: <AiOutlineShoppingCart />,
      path: "/cart",
      badge: cartCount,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden">
      {/* GLASS CONTAINER */}
      <div className="mx-3 mb-3 rounded-[2.8rem] bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_-20px_40px_rgba(0,0,0,0.12)] px-2 py-3">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.id} to={item.path} className="relative">
                {/* 🔥 SURSA O‘TADIGAN ICON */}
                <motion.div
                  whileTap={{ scale: 0.65, y: 10 }} // 👈 bosganda cho‘kadi
                  animate={{
                    scale: isActive
                      ? [1, 1.25, 0.95, 1.1, 1] // overshoot
                      : 1,
                    y: isActive
                      ? [0, -12, 6, -8, 0] // sakrab qaytish
                      : 0,
                  }}
                  transition={iosBounce}
                  className={`flex flex-col items-center gap-1 min-w-[56px] ${
                    isActive ? "text-red-600" : "text-gray-400"
                  }`}
                >
                  {/* ICON + ACTIVE PILL */}
                  <div className="relative flex items-center justify-center w-14 h-14">
                    {/* ACTIVE PILL */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: [0.8, 1.15, 0.95, 1] }}
                          transition={iosBounce}
                          className="absolute inset-0 rounded-full bg-red-100/80"
                        />
                      )}
                    </AnimatePresence>

                    {/* ICON */}
                    <span className="relative z-10 text-[24px]">
                      {item.icon}
                    </span>

                    {/* BADGE */}
                    <AnimatePresence>
                      {item.badge > 0 && (
                        <motion.span
                          initial={{ scale: 0, y: -6 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 700,
                            damping: 18,
                          }}
                          className="absolute -top-1 -right-1 z-20 bg-gradient-to-br from-red-500 to-red-700 text-white text-[10px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full ring-2 ring-white"
                        >
                          {item.badge > 99 ? "99+" : item.badge}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* LABEL */}
                  <span className="text-[10px] font-extrabold uppercase tracking-tight">
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
