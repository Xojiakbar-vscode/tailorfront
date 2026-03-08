// pages/PrivacyPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaUserSecret, FaDatabase, FaCookie, FaEnvelope } from 'react-icons/fa';

const PrivacyPage = () => {
  const sections = [
    {
      icon: FaDatabase,
      title: "MA'LUMOTLAR TO'PLAMI",
      content: "Biz sizning ismingiz, telefon raqamingiz, email manzilingiz va yetkazib berish manzilingizni to'playmiz. Bu ma'lumotlar faqat buyurtmani amalga oshirish va yetkazib berish uchun ishlatiladi."
    },
    {
      icon: FaLock,
      title: "MA'LUMOTLAR HIMOYASI",
      content: "Sizning shaxsiy ma'lumotlaringiz xavfsiz serverlarda saqlanadi va uchinchi shaxslarga berilmaydi. Barcha ma'lumotlar maxfiy hisoblanadi."
    },
    {
      icon: FaEnvelope,
      title: "MARKETING XABARLARI",
      content: "Siz rozilik bergan taqdirdagina reklama va yangiliklar xabarlarini yuboramiz. Istalgan vaqtda obunani bekor qilishingiz mumkin."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <FaShieldAlt className="text-6xl mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-black mb-4">MAXFIYLIK SIYOSATI</h1>
            <p className="text-xl opacity-90">Sizning ma'lumotlaringiz xavfsizligi kafolatlanadi</p>
          </motion.div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500 text-sm">
          Oxirgi yangilanish: {new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-3xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">KIRISH</h2>
          <p className="text-gray-700 leading-relaxed">
            TailorShop.uz saytiga xush kelibsiz! Biz sizning shaxsiy ma'lumotlaringizni himoya qilishga va 
            maxfiyligingizni ta'minlashga sodiqmiz. Ushbu Maxfiylik siyosati saytimizdan foydalanish paytida 
            ma'lumotlaringiz qanday to'planishi, ishlatilishi va himoya qilinishi haqida ma'lumot beradi.
          </p>
        </motion.div>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <section.icon className="text-2xl text-red-600" />
                </div>
                <h3 className="text-xl font-bold">{section.title}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed pl-16">{section.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-red-50 rounded-3xl p-8 text-center"
        >
          <FaUserSecret className="text-4xl text-red-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">SAVOLLAR?</h3>
          <p className="text-gray-700 mb-6">
            Agar maxfiylik siyosati haqida savollaringiz bo'lsa, biz bilan bog'lanishingiz mumkin
          </p>
          <a 
            href="/contact"
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors"
          >
            Bog'lanish
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;