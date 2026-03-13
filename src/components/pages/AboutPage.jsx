// pages/AboutPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaUsers, FaRocket, FaShieldAlt, FaHandshake, 
  FaStar, FaAward, FaHeart, FaChartLine 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const stats = [
    { icon: FaUsers, value: '1000+', label: 'Mamnun mijozlar' },
    { icon: FaRocket, value: '2000+', label: 'Mahsulotlar' },
    { icon: FaAward, value: '30+', label: 'Yillik tajriba' },
    { icon: FaHeart, value: '98%', label: 'Mijozlar tavsiyasi' }
  ];

  const values = [
    {
      icon: FaShieldAlt,
      title: 'Ishonchlilik',
      description: 'Har bir mahsulot sifat nazoratidan o\'tadi'
    },
    {
      icon: FaHandshake,
      title: 'Halollik',
      description: 'Shaffof narxlar va to\'liq ma\'lumot'
    },
    {
      icon: FaStar,
      title: 'Sifat',
      description: 'Faqat eng yaxshi materiallar va mahsulotlar'
    },
    {
      icon: FaChartLine,
      title: 'Rivojlanish',
      description: 'Doimiy yangilanish va takomillashuv'
    }
  ];

  const team = [
    {
      name: 'Aziz Karimov',
      position: 'Asoschi & CEO',
      image: '/team/ceo.jpg',
      experience: '10+ yil'
    },
    {
      name: 'Dilnoza Rahimova',
      position: 'Marketing direktori',
      image: '/team/marketing.jpg',
      experience: '8+ yil'
    },
    {
      name: 'Jahongir Aliyev',
      position: 'Texnik direktor',
      image: '/team/tech.jpg',
      experience: '12+ yil'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-r from-red-600 to-red-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-black mb-6">BIZ <span className="text-yellow-300">HAQIMIZDA</span></h1>
            <p className="text-xl opacity-90 leading-relaxed">
              TailorShop - tikuvchilik sohasida sifat va ishonch ramzi. 
              Biz mijozlarimizga eng yaxshi mahsulot va xizmatlarni taqdim etamiz.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-shadow"
            >
              <stat.icon className="text-4xl text-red-600 mx-auto mb-3" />
              <div className="text-3xl font-black text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              BIZNING <span className="text-red-600">HIKOYAMIZ</span>
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              1996-yilda Namangan shahrida boshlangan bu yo'l bugungi kunda O'zbekiston bo'ylab 
              minglab mijozlarga xizmat ko'rsatadigan kompaniyaga aylandi.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Bizning maqsadimiz - tikuvchilik sohasidagi mutaxassislar va usta-hunarmandlarga 
              eng sifatli mahsulotlarni eng qulay narxlarda yetkazib berish.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Har bir mahsulot sinchkovlik bilan tanlanadi va sifat nazoratidan o'tkaziladi. 
              Biz mijozlarimizning ishonchi va mamnuniyatini qadrlaymiz.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Maqsadimiz</h3>
              <p className="text-lg opacity-90 mb-6">
                Tikuvchilik sohasidagi mutaxassislarga eng yaxshi vositalarni taqdim etish 
                orqali ularning mahoratini oshirish va sifatli mahsulot yaratishga ko'maklashish.
              </p>
              <h3 className="text-2xl font-bold mb-4"></h3>
              <p className="text-lg opacity-90">
                O'zbekistonning yetakchi tikuvchilik anjomlari yetkazib beruvchisi bo'lish 
                va xalqaro bozorga chiqish.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              ASOSIY <span className="text-red-600">QADRIYATLAR</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Bizni boshqalardan ajratib turadigan tamoyillar
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div className="bg-red-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-3xl text-red-600" />
                </div>
                <h3 className="font-bold mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              BIZ BILAN HAMKORLIK QILING
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Eng sifatli mahsulotlar va eng yaxshi xizmat
            </p>
            <Link 
              to="/contact" 
              className="inline-block bg-white text-red-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              Bog'lanish
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
