import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt, FaPhone, FaTelegram, FaInstagram,
  FaYoutube, FaChevronUp, FaShieldAlt, FaTruck,
  FaHeadset, FaStar, FaFacebookF, FaClock
} from 'react-icons/fa';
import { IoLocationSharp } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const navSections = useMemo(() => [
    {
      title: "Xarid",
      links: [
        { name: "Bosh sahifa", path: "/" },
        { name: "Katalog", path: "/catalog" },
        { name: "Aksiyalar", path: "/sales" },
        { name: "Yangi mahsulotlar", path: "/new" }
      ]
    },
    {
      title: "Ma'lumotlar",
      links: [
        { name: "Biz haqimizda", path: "/about" },
        { name: "Yetkazib berish", path: "/delivery" },
        { name: "To'lov usullari", path: "/payment" },
        { name: "Maxfiylik siyosati", path: "/privacy" }
      ]
    },
    {
      title: "Yordam",
      links: [
        { name: "FAQ", path: "/faq" },
        { name: "Qaytarish", path: "/return" },
        { name: "Bog'lanish", path: "/contact" }
      ]
    }
  ], []);

  const features = [
    { icon: FaTruck, title: "Yetkazib berish", desc: "O'zbekiston bo'ylab", color: "text-blue-600" },
    { icon: FaShieldAlt, title: "Kafolat", desc: "Sifatli mahsulotlar", color: "text-green-600" },
    { icon: FaHeadset, title: "Yordam", desc: "24/7 aloqadamiz", color: "text-purple-600" },
    { icon: FaStar, title: "Premium", desc: "Professional tanlov", color: "text-yellow-600" }
  ];
  const socialLinks = [
    { icon: FaTelegram, url: "https://t.me/tailorshopnamangan1" },
    { icon: FaInstagram, url: "https://www.instagram.com/tailor_shop_namangan?igsh=MzRlODBiNWFlZA==" },
    // { icon: FaYoutube, url: "https://youtube.com/@tailorshop" },
    { icon: FaFacebookF, url: "https://www.facebook.com/profile.php?id=100086293105820" }
  ];

  return (
    <footer className="bg-white text-gray-700 pt-16 border-t border-gray-100 relative">
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-36 lg:bottom-[15px] right-6 z-50 bg-red-600 text-white p-4 rounded-full shadow-2xl hover:bg-red-700 transition-colors"
          >
            <FaChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4">
        {/* 1. Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16 pb-12 border-b border-gray-50">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-2">
              <f.icon className={`text-3xl ${f.color}`} />
              <h4 className="font-bold text-sm uppercase tracking-wider">{f.title}</h4>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* 2. Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="text-3xl font-black italic tracking-tighter">
              TAILOR<span className="text-red-600">SHOP</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Professional tikuvchilik mahsulotlari va butlovchi qismlari yetkazib beruvchi yetakchi do'kon. Sifat va ishonch kafolati.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((item, i) => {
                const Icon = item.icon;

                return (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white transition-all"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {navSections.map((section, idx) => (
              <div key={idx}>
                <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-gray-900">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link to={link.path} className="text-sm text-gray-500 hover:text-red-600 transition-colors">{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 text-gray-900">Kontaktlar</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-red-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Namangan sh. Istiqlol ko'chasi, 1</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-red-600 flex-shrink-0" />
                <a href="tel:+998913560408" className="text-sm font-bold hover:text-red-600">+998 91 356 04 08</a>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-red-600 flex-shrink-0" />
                <span className="text-sm">Du - Sha: 09:00 - 18:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Map Section */}
        <div className="w-full h-[250px] rounded-3xl overflow-hidden mb-12 border border-gray-100 relative">
          {!showMap ? (
            <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center text-white p-4">
              <IoLocationSharp className="text-red-500 text-5xl mb-4 animate-bounce" />
              <button
                onClick={() => setShowMap(true)}
                className="bg-white text-gray-900 px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-red-600 hover:text-white transition-all"
              >
                Xaritani ko'rish
              </button>
            </div>
          ) : (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3012.345678901234!2d71.672345!3d41.001234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzA0LjQiTiA3McKwNDAnMjAuNCJF!5e0!3m2!1suz!2s!4v1234567890123"
              className="w-full h-full grayscale border-0"
              allowFullScreen loading="lazy"
              title="TailorShop Location"
            />
          )}
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-100 py-8 text-center">
        <p className="text-xs text-gray-500">
          © {currentYear} <span className="font-bold text-gray-800">TailorShop.uz</span>. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
