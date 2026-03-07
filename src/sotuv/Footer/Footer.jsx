import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaMapMarkerAlt, FaPhone, FaTelegram, FaInstagram, 
  FaYoutube, FaChevronUp, FaShieldAlt, FaTruck, 
  FaHeadset, FaStar, FaFacebookF, FaWhatsapp, 
  FaRegEnvelope, FaUser, FaClock
} from 'react-icons/fa';
import { IoLocationSharp } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = "https://tailorback2025-production.up.railway.app/api/contacts";

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [formData, setFormData] = useState({ full_name: "", phone: "", message: "" });
  
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  // Scroll visibility logic
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (status.type) setStatus({ type: null, message: "" });
  }, [status.type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ type: "success", message: "Xabaringiz yuborildi!" });
        setFormData({ full_name: "", phone: "", message: "" });
      } else {
        throw new Error();
      }
    } catch {
      setStatus({ type: "error", message: "Xatolik! Qaytadan urinib ko'ring." });
    } finally {
      setIsSending(false);
      setTimeout(() => setStatus({ type: null, message: "" }), 5000);
    }
  };

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
        { name: "Kafolat", path: "/warranty" },
        { name: "Bog'lanish", path: "/contact" }
      ]
    }
  ], []);

  const features = [
    { icon: FaTruck, title: "Yetkazib berish", desc: "O'zbekiston bo'ylab", color: "text-blue-600" },
    { icon: FaShieldAlt, title: "Kafolat", desc: "Sifatli mahsulotlar", color: "text-green-600" },
    { icon: FaHeadset, title: "Qo'llab-quvvatlash", desc: "24/7 aloqadamiz", color: "text-purple-600" },
    { icon: FaStar, title: "Premium", desc: "Professional tanlov", color: "text-yellow-600" }
  ];

  return (
    <footer className="bg-white text-gray-700 pt-16 border-t border-gray-100 relative">
      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 bg-red-600 text-white p-4 rounded-full shadow-2xl hover:bg-red-700 transition-colors"
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
          {/* Brand & Contacts */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="text-3xl font-black italic tracking-tighter">
              TAILOR<span className="text-red-600">SHOP</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Professional tikuvchilik uskunalari va butlovchi qismlari yetkazib beruvchi yetakchi do'kon.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <FaMapMarkerAlt className="text-red-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm">Namangan sh., Kosonsoy ko'chasi, 45-uy</span>
              </div>
              <div className="flex items-center gap-3 group">
                <FaPhone className="text-red-600 group-hover:scale-110 transition-transform" />
                <a href="tel:+998913560408" className="text-sm font-bold hover:text-red-600">+998 91 356 04 08</a>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-red-600" />
                <span className="text-sm text-gray-500">Du - Sha: 09:00 - 20:00</span>
              </div>
            </div>

            <div className="flex gap-3">
              {[FaTelegram, FaInstagram, FaYoutube, FaFacebookF].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-8">
            {navSections.slice(0, 2).map((section, idx) => (
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

          {/* Contact Form */}
          <div className="lg:col-span-4 bg-gray-50 rounded-3xl p-6 shadow-inner">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <FaRegEnvelope className="text-red-600" /> Savollaringiz bormi?
            </h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <FaUser className="absolute left-4 top-4 text-gray-400" size={12} />
                <input 
                  type="text" name="full_name" placeholder="Ismingiz" required
                  value={formData.full_name} onChange={handleInputChange}
                  className="w-full bg-white border-0 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <div className="relative">
                <FaPhone className="absolute left-4 top-4 text-gray-400" size={12} />
                <input 
                  type="tel" name="phone" placeholder="Telefon" required
                  value={formData.phone} onChange={handleInputChange}
                  className="w-full bg-white border-0 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <textarea 
                name="message" rows="2" placeholder="Xabar..." required
                value={formData.message} onChange={handleInputChange}
                className="w-full bg-white border-0 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none"
              />
              <button 
                disabled={isSending}
                className="w-full bg-red-600 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200"
              >
                {isSending ? "Yuborilmoqda..." : "Yuborish"}
              </button>
              {status.type && (
                <p className={`text-[10px] text-center font-bold ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* 3. Map Section (Optional but integrated) */}
        <div className="w-full h-[300px] rounded-3xl overflow-hidden mb-12 border border-gray-100 shadow-sm relative">
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3012.000000000000!2d71.5!3d41.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzAwLjAiTiA3McKwMzAnMDAuMCJF!5e0!3m2!1suz!2s!4v1234567890"
              className="w-full h-full grayscale border-0"
              allowFullScreen loading="lazy"
              title="TailorShop Location"
            />
           )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-50 border-t  border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 text-center  md:text-left">
            © {currentYear} <span className="font-bold text-gray-800 tracking-tight">TailorShop.uz</span>. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);