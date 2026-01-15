import React, { useState } from "react";
import {
  FaInstagram,
  FaTelegram,
  FaPhoneAlt,
  FaPaperPlane,
  FaUser,
  FaCommentAlt,
} from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";

const API_URL = "https://tailorback2025-production.up.railway.app/api/contacts";

const Footer = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
const [showMap, setShowMap] = useState(false);
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        alert("Xabaringiz muvaffaqiyatli yuborildi!");
        setFormData({ full_name: "", phone: "", message: "" });
      } else {
        throw new Error();
      }
    } catch (error) {
      alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <footer className="bg-white text-red-700 border-t border-red-100">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-12">
          
          {/* Form Section */}
          <div className="flex flex-col justify-center">
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl lg:text-4xl font-black uppercase italic tracking-tighter flex items-center justify-center lg:justify-start gap-3">
                <FaPaperPlane className="text-red-700" />
                Murojaat uchun
              </h2>
              <p className="text-red-700 font-medium mt-2">Taklif va xabaringizni qoldiring</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto lg:mx-0 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-red-700 opacity-50" />
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Ismingiz"
                    className="w-full border-2 border-red-700/20 rounded-2xl py-4 pl-12 pr-6 focus:border-red-700 outline-none transition-all bg-red-50/50"
                  />
                </div>

                <div className="relative">
                  <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-red-700 opacity-50" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Telefon"
                    className="w-full border-2 border-red-700/20 rounded-2xl py-4 pl-12 pr-6 focus:border-red-700 outline-none transition-all bg-red-50/50"
                  />
                </div>
              </div>

              <div className="relative">
                <FaCommentAlt className="absolute left-4 top-5 text-red-700 opacity-50" />
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Xabaringiz matnini yozing..."
                  className="w-full border-2 border-red-700/20 rounded-3xl py-4 pl-12 pr-6 focus:border-red-700 outline-none transition-all bg-red-50/50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-red-700 text-white py-5 px-8 text-sm font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black active:scale-95 transition-all shadow-xl disabled:bg-red-300"
              >
                {isSending ? "Yuborilmoqda..." : "Xabarni jo'natish"}
              </button>
            </form>
          </div>

          {/* Map Section */}
          <div className="flex flex-col">
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl lg:text-4xl font-black uppercase italic tracking-tighter flex items-center justify-center lg:justify-start gap-3">
                <IoLocationSharp className="text-red-700" />
                Manzilimiz
              </h2>
              <p className="text-red-700 font-medium mt-2">Namangan shahri, Tailor Shop markazi</p>
            </div>

            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-red-50 h-[400px] group">
<div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-red-50 h-[400px] flex items-center justify-center bg-red-50">
  {!showMap ? (
    <button
      onClick={() => setShowMap(true)}
      className="px-8 py-5 bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl"
    >
      Xaritani ko‘rsatish
    </button>
  ) : (
    <iframe
      title="Tailor Shop Namangan Location"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12042.772034763268!2d71.65171446951922!3d41.010092033507505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bb4d005b7de89b%3A0x84658e3671b49eb4!2sTailor%20shop%20Namangan!5e0!3m2!1sru!2s!4v1768476804826!5m2!1sru!2s"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="w-full h-full border-0"
      allowFullScreen
    />
  )}
</div>

            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-red-100 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-4">
            <a href="https://www.instagram.com/tailor_shop_namangan?igsh=NnBmdWYxazF0ZXg2" aria-label="Tailor Shop Instagram sahifasi"
  title="Instagram" target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center bg-red-50 rounded-xl text-red-700 hover:bg-red-700 hover:text-white transition-all shadow-sm">
              <FaInstagram size={20} />
            </a>
            <a href="https://t.me/tailorshopnamangan1" target="_blank" rel="noreferrer" aria-label="Tailor Shop Telegram kanali"
  title="Telegram" className="w-12 h-12 flex items-center justify-center bg-red-50 rounded-xl text-red-700 hover:bg-red-700 hover:text-white transition-all shadow-sm">
              <FaTelegram size={20} />
            </a>
            <a href="tel:+998913560408" className="px-4 h-12 flex items-center justify-center bg-red-50 rounded-xl text-red-700 font-bold hover:bg-red-700 hover:text-white transition-all shadow-sm">
              <FaPhoneAlt size={16} className="mr-2" /> +998 91 356 04 08
            </a>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-red-700">
            © 2026 Tailor Shop Namangan. <span className="text-red-700">Premium Quality.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;