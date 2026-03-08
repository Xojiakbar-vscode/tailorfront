// pages/ReturnPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaUndo, FaCheckCircle, FaTimesCircle, FaClock, FaBox, FaMoneyBill } from 'react-icons/fa';

const ReturnPage = () => {
  const conditions = [
    {
      icon: FaClock,
      title: '14 kun muddat',
      description: 'Mahsulotni sotib olgandan keyin 14 kun ichida qaytarishingiz mumkin'
    },
    {
      icon: FaBox,
      title: 'Asl holatda',
      description: 'Mahsulot asl o\'ramida va foydalanilmagan bo\'lishi kerak'
    },
    {
      icon: FaCheckCircle,
      title: 'Chek bilan',
      description: 'Sotuv cheki yoki kafolat taloni bilan birga'
    }
  ];

  const steps = [
    { number: '1', title: 'Murojaat qilish', desc: 'Do\'konimizga yoki operatorga murojaat qiling' },
    { number: '2', title: 'Tekshirish', desc: 'Mahsulot mutaxassis tomonidan tekshiriladi' },
    { number: '3', title: 'Qaror qabul qilish', desc: 'Qaytarish yoki almashtirish haqida qaror' },
    { number: '4', title: 'Pulni qaytarish', desc: 'Pul 3-5 ish kuni ichida qaytariladi' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <FaUndo className="text-6xl mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-black mb-4">MAHSULOTNI QAYTARISH</h1>
            <p className="text-xl opacity-90">Sizning huquqlaringiz himoyalangan</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Conditions */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {conditions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-3xl p-8 text-center hover:shadow-xl transition-shadow"
            >
              <item.icon className="text-5xl text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-center mb-12">QAYTARISH <span className="text-red-600">JARAYONI</span></h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-50 rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6">KO'P SO'RALADIGAN SAVOLLAR</h2>
          <div className="space-y-4">
            {[
              { q: 'Qanday mahsulotlarni qaytarish mumkin?', a: 'Sifatsiz yoki nuqsonli mahsulotlarni, shuningdek sizga mos kelmagan mahsulotlarni qaytarishingiz mumkin.' },
              { q: 'Pulni qancha vaqtda qaytarib olaman?', a: 'Pul mablag\'lari 3-5 ish kuni ichida qaytariladi.' },
              { q: 'Qaytarish uchun qanday hujjatlar kerak?', a: 'Sotuv cheki va mahsulot pasporti.' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-4">
                <p className="font-bold mb-2">{item.q}</p>
                <p className="text-sm text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPage;