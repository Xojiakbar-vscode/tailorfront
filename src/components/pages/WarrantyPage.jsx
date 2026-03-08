// pages/WarrantyPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaCheckCircle, FaClock, FaTools, FaFileAlt, FaHeadset } from 'react-icons/fa';

const WarrantyPage = () => {
  const warrantyItems = [
    {
      period: '6 oy',
      products: 'Kichik ehtiyot qismlar, aksessuarlar',
      color: 'bg-yellow-50',
      border: 'border-yellow-200'
    },
    {
      period: '1 yil',
      products: 'Tikuv mashinalari, overloklar',
      color: 'bg-blue-50',
      border: 'border-blue-200'
    },
    {
      period: '2 yil',
      products: 'Professional uskunalar',
      color: 'bg-green-50',
      border: 'border-green-200'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <FaShieldAlt className="text-6xl mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-black mb-4">KAFOLAT</h1>
            <p className="text-xl opacity-90">Mahsulotlarimiz sifatiga ishonch</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Warranty Periods */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {warrantyItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${item.color} border ${item.border} rounded-3xl p-8 text-center`}
            >
              <div className="text-4xl font-black text-gray-800 mb-2">{item.period}</div>
              <p className="text-gray-600">{item.products}</p>
            </motion.div>
          ))}
        </div>

        {/* Warranty Conditions */}
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black mb-6">KAFOLAT SHARTLARI</h2>
            <div className="space-y-4">
              {[
                'Kafolat muddati sotib olingan kundan boshlanadi',
                'Kafolat faqat ishlab chiqarish nuqsonlariga taalluqli',
                'Mahsulot pasporti va chek saqlanishi shart',
                'Kafolat xizmati uchun do\'konimizga murojaat qiling'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-4">KAFOLATGA KIRMAYDI</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                Mexanik shikastlanishlar
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                Noto'g'ri ishlatish oqibatidagi nuqsonlar
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                Tabiiy eskirish
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600">•</span>
                Suv yoki namlik ta'siri
              </li>
            </ul>
          </motion.div>
        </div>


      </div>
    </div>
  );
};

export default WarrantyPage;