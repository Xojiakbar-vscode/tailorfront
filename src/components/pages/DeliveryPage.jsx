// pages/DeliveryPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaTruck, FaMapMarkerAlt, FaClock, FaBox, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const DeliveryPage = () => {
  const deliveryMethods = [
    {
      icon: FaTruck,
      title: 'Kuryer orqali',
      time: '1-3 kun',
      price: 'Taksi yoki BTS pochta orqali kelishilgan holda',
      description: 'Toshkent shahri va viloyat markazlariga'
    },
    {
      icon: FaBox,
      title: 'Olib ketish',
      time: 'Buyurtma berilgan kuni',
      price: 'BEPUL',
      description: 'Namangan shahridagi do\'konimizdan'
    }
  ];

  const steps = [
    { number: '1', title: 'Buyurtma berish', description: 'Mahsulotni tanlab, buyurtma qiling' },
    { number: '2', title: 'Tasdiqlash', description: 'Operator siz bilan bog\'lanadi' },
    { number: '3', title: 'Yetkazib berish', description: 'Buyurtma manzilingizga yetkaziladi' },
    { number: '4', title: 'To\'lov va qabul', description: 'Mahsulotni tekshirib, to\'lov qiling' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <FaTruck className="text-6xl mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-black mb-4">YETKAZIB BERISH</h1>
            <p className="text-xl opacity-90">O'zbekiston bo'ylab tez va ishonchli yetkazib berish</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Delivery Methods */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {deliveryMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-3xl p-8 hover:shadow-xl transition-shadow"
            >
              <method.icon className="text-5xl text-red-600 mb-4" />
              <h3 className="text-2xl font-bold mb-2">{method.title}</h3>
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                  {method.time}
                </span>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-bold">
                  {method.price}
                </span>
              </div>
              <p className="text-gray-600">{method.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-center mb-12">YETKAZIB BERISH <span className="text-red-600">JARAYONI</span></h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: FaClock, title: 'Tez yetkazish', desc: '1-3 ish kuni' },
            { icon: FaMapMarkerAlt, title: 'Keng hudud', desc: 'O\'zbekiston bo\'ylab' },
            { icon: FaShieldAlt, title: 'Xavfsizlik', desc: 'Mahsulot kafolati' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-red-50 rounded-2xl p-6 text-center"
            >
              <item.icon className="text-3xl text-red-600 mx-auto mb-3" />
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;