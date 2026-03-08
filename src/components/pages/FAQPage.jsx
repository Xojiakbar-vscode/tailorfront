// pages/FAQPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaSearch, FaTruck, FaCreditCard, FaUndo, FaShieldAlt } from 'react-icons/fa';
import { Link } from "react-router-dom";
const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('delivery');
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState({});

  const categories = [
    { id: 'delivery', name: 'Yetkazib berish', icon: FaTruck },
    { id: 'payment', name: 'To\'lov', icon: FaCreditCard },
    { id: 'return', name: 'Qaytarish', icon: FaUndo },
    { id: 'warranty', name: 'Kafolat', icon: FaShieldAlt }
  ];

  const faqData = {
    delivery: [
      {
        question: 'Yetkazib berish qancha vaqt oladi?',
        answer: 'Yetkazib berish muddati manzilingizga qarab 1-3 ish kunini tashkil etadi. Toshkent shahri bo\'ylab 1 kun, viloyatlarga 2-3 kun.'
      },
      {
        question: 'Yetkazib berish narxi qancha?',
        answer: 'Yetkazib berish narxi: Taksi yoki BTS pochta orqali'
      },
      {
        question: 'Qaysi hududlarga yetkazib berasizlar?',
        answer: 'O\'zbekiston bo\'ylab barcha hududlarga yetkazib beramiz. Toshkent, viloyat markazlari va tumanlarga.'
      }
    ],
    payment: [
      {
        question: 'Qanday to\'lov turlari mavjud?',
        answer: 'Naqd pul, plastik karta orqali (Uzcard, Humo), Click, Payme va bank o\'tkazmasi orqali to\'lov qilishingiz mumkin.'
      },
      {
        question: 'Oldindan to\'lov qilish shartmi?',
        answer: 'Buyurtmaning 50% oldindan to\'lov qilish shart. Qolgan qismini mahsulotni olgandan so\'ng to\'lashingiz mumkin.'
      }
    ],
    return: [
      {
        question: 'Mahsulotni qaytarish mumkinmi?',
        answer: 'Ha, agar mahsulot sifatsiz bo\'lsa yoki sizga mos kelmasa, 14 kun ichida qaytarishingiz mumkin.'
      }
    ],
    warranty: [
      {
        question: 'Mahsulotlarga kafolat bormi?',
        answer: 'Barcha mahsulotlarga 6 oydan 2 yilgacha kafolat beriladi.'
      }
    ]
  };

  const toggleItem = (categoryId, index) => {
    setOpenItems(prev => ({
      ...prev,
      [`${categoryId}-${index}`]: !prev[`${categoryId}-${index}`]
    }));
  };

  const filteredFAQs = (category) => {
    if (!searchTerm) return faqData[category];
    return faqData[category].filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4">KO'P SO'RALADIGAN <span className="text-red-500">SAVOLLAR</span></h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Sizni qiziqtirgan savollarga javoblar
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-3xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-full shadow-xl p-1 flex items-center">
          <FaSearch className="text-gray-400 ml-4" />
          <input
            type="text"
            placeholder="Savolingizni yozing..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-full focus:outline-none"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all ${
                activeCategory === cat.id
                  ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <cat.icon />
              <span className="font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {filteredFAQs(activeCategory).map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleItem(activeCategory, index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">{item.question}</span>
                  <FaChevronDown
                    className={`transition-transform ${
                      openItems[`${activeCategory}-${index}`] ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openItems[`${activeCategory}-${index}`] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 bg-gray-50 text-gray-600">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {filteredFAQs(activeCategory).length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Hech narsa topilmadi</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Still Have Questions */}
        <div className="mt-12 text-center bg-gray-50 rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-2">Savolingiz qoldimi?</h3>
          <p className="text-gray-600 mb-6">Biz bilan bog'lanishingiz mumkin</p>
          <Link
            to="/contact"
            className="inline-block bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors"
          >
            Bog'lanish
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;