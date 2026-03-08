// pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaHome, FaSearch } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <div className="text-9xl font-black text-gray-200 mb-4">404</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FaExclamationTriangle className="text-6xl text-red-600 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-black mb-4">
            SAHIFA TOPILMADI
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Qidirgan sahifangiz mavjud emas yoki o'chirilgan bo'lishi mumkin.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors"
            >
              <FaHome /> Bosh sahifaga
            </Link>
            <Link
              to="/catalog"
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
            >
              <FaSearch /> Katalogga o'tish
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;