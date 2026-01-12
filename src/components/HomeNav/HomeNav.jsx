import React, { useState, useEffect } from "react";
import logoImg from "../../assets/img2.svg";
import CartModal from "../../sotuv/Cart/Cart";
import bgImg from "../../assets/image.png";
import AOS from 'aos';
import 'aos/dist/aos.css';

const HomeNav = () => {
  const [showCartModal, setShowCartModal] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* Header qismi - Bo'sh qoldirildi yoki boshqa elementlar uchun saqlandi */}
      <header className="w-full absolute top-0 left-0 right-0 z-50 py-4 md:py-6">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            {/* Bu yerda menyu va profil bor edi, ular olib tashlandi */}
          </div>
        </div>
      </header>

      {/* Hero bo'limi */}
      <section className="min-h-screen flex flex-col justify-between items-center text-center px-4 md:px-6 text-red-900 py-8 md:py-12">
        {/* Logo */}
        <div className="flex-1 flex items-end justify-center" data-aos="fade-down" data-aos-delay="200">
          <img 
            src={logoImg} 
            alt="Tailor Shop Logo" 
            loading="lazy"
            className="h-48 md:h-56 lg:h-64 xl:h-72 mx-auto transform hover:scale-105 transition-transform duration-500" 
          />
        </div>

        {/* Matnlar */}
        <div className="flex-1 flex flex-col justify-center items-center space-y-8 md:space-y-12">
          <div data-aos="fade-up" data-aos-delay="400">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Tikuvchilik uchun
              hammasi bir joyda!
            </h1>
          </div>

          <div data-aos="fade-up" data-aos-delay="600">
            <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-relaxed">
              Eng sifatli mahsulotlar —
              Tailor Shop Namangan da.
            </p>
          </div>
        </div>

        {/* Since 2016 */}
        <div className="flex-1 flex items-start justify-center" data-aos="fade-in" data-aos-delay="800">
          <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light">
            Since 1996
          </p>
        </div>
      </section>

      {/* Cart Modal */}
      {showCartModal && (
        <CartModal onClose={() => setShowCartModal(false)} />
      )}
    </div>
  );
};

export default HomeNav;