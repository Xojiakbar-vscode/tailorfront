// pages/PaymentPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaCreditCard, FaMoneyBill, FaMobile, FaUniversity, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import { SiClickup, SiPaypal } from 'react-icons/si';

const PaymentPage = () => {
  const paymentMethods = [
    {
      icon: FaMoneyBill,
      title: 'Naqd pul',
      description: 'Mahsulotni olganda to\'lov',
      color: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: FaCreditCard,
      title: 'Plastik karta',
      description: 'Uzcard, Humo, VISA',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: FaMobile,
      title: 'Click / Payme',
      description: 'Mobil ilova orqali',
      color: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: FaUniversity,
      title: 'Bank o\'tkazmasi',
      description: 'Hisob raqamiga',
      color: 'bg-gray-50',
      iconColor: 'text-gray-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <FaCreditCard className="text-6xl mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-black mb-4">TO'LOV USULLARI</h1>
            <p className="text-xl opacity-90">Siz uchun qulay to'lov turlari</p>
          </motion.div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {paymentMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${method.color} rounded-3xl p-8 text-center hover:shadow-xl transition-shadow`}
            >
              <method.icon className={`text-5xl ${method.iconColor} mx-auto mb-4`} />
              <h3 className="font-bold mb-2">{method.title}</h3>
              <p className="text-sm text-gray-600">{method.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black mb-6">XAVFSIZ TO'LOV</h2>
            <p className="text-gray-600 mb-8">
              Barcha to'lovlar xavfsiz va himoyalangan. Sizning ma'lumotlaringiz uchinchi shaxslarga berilmaydi.
            </p>
            <div className="space-y-4">
              {[
                'Ma\'lumotlar shifrlangan',
                'Xalqaro xavfsizlik standartlari',
                '3D Secure himoyasi',
                'To\'lov kafolati'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-600" />
                  <span>{item}</span>
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
            <h3 className="text-2xl font-bold mb-4">Qo'shimcha ma'lumot</h3>
            <p className="text-gray-600 mb-4">
              Agar to'lov jarayonida muammo yuzaga kelsa, bizning operatorlarimizga murojaat qiling.
            </p>
            <div className="bg-white rounded-xl p-4 flex items-center gap-3">
              <FaShieldAlt className="text-2xl text-red-600" />
              <div>
                <p className="font-bold">Bog'lanish</p>
                <p className="text-sm text-gray-600">+998 91 356 04 08</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;