import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaTelegram, 
  FaInstagram, FaWhatsapp, FaClock, FaUser, FaPaperPlane 
} from 'react-icons/fa';

const API_URL = "https://tailorback2025-production.up.railway.app/api/contacts";

const ContactPage = () => {
  const [formData, setFormData] = useState({ full_name: '', phone: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus({ type: 'success', message: 'Xabaringiz muvaffaqiyatli yuborildi!' });
        setFormData({ full_name: '', phone: '', message: '' });
      } else { throw new Error(); }
    } catch {
      setStatus({ type: 'error', message: 'Xatolik yuz berdi. Qayta urinib ko\'ring.' });
    } finally {
      setIsSending(false);
      setTimeout(() => setStatus({ type: null, message: '' }), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-gray-900 mb-4"
          >
            BIZ BILAN <span className="text-red-600">BOG'LANING</span>
          </motion.h1>
          <p className="text-gray-600">Savollaringiz bormi? Bizga yozing yoki qo'ng'iroq qiling.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chap tomon: Kontakt ma'lumotlar */}
          <div className="space-y-4">
            {[
              { icon: FaPhone, title: "Telefon", val: "+998 91 356 04 08", link: "tel:+998913560408", color: "text-blue-600" },
              { icon: FaTelegram, title: "Telegram", val: "@tailorshop_admin", link: "https://t.me/TAILORSHOPNAMANGAN", color: "text-sky-500" },
              { icon: FaMapMarkerAlt, title: "Manzil", val: "Namangan sh., Istiqlol ko'chasi, 1", color: "text-red-600" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center ${item.color} text-xl`}>
                  <item.icon />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{item.title}</p>
                  {item.link ? (
                    <a href={item.link} className="font-bold text-gray-800 hover:text-red-600 transition-colors">{item.val}</a>
                  ) : (
                    <p className="font-bold text-gray-800">{item.val}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* O'ng tomon: Aloqa formasi */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">To'liq ismingiz</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" name="full_name" required value={formData.full_name} onChange={handleChange}
                        className="w-full bg-gray-50 border-transparent focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 rounded-xl py-3.5 pl-11 pr-4 transition-all outline-none"
                        placeholder="Masalan: Ali Valiyev"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Telefon raqamingiz</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                        className="w-full bg-gray-50 border-transparent focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 rounded-xl py-3.5 pl-11 pr-4 transition-all outline-none"
                        placeholder="+998 90 123 45 67"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Xabaringiz</label>
                  <textarea 
                    name="message" rows="4" required value={formData.message} onChange={handleChange}
                    className="w-full bg-gray-50 border-transparent focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 rounded-xl py-4 px-5 transition-all outline-none resize-none"
                    placeholder="Savolingizni bu yerga yozing..."
                  />
                </div>

                <button 
                  disabled={isSending}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isSending ? "Yuborilmoqda..." : (
                    <> <FaPaperPlane /> Xabarni yuborish </>
                  )}
                </button>

                {status.type && (
                  <motion.p 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`text-center font-bold text-sm ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {status.message}
                  </motion.p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;