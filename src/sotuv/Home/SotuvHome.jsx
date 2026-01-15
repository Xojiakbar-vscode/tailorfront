import React from "react";
import { Helmet } from "react-helmet-async";

import Swiper from "../Swiper/Swiper";
import Filters from "../Filters/Filters";
import Products from "../ProductCard/ProductCard";
import AdBanner from "../AdBanner/AdBanner";

const SotuvHome = ({ addToCart, favorites, toggleFavorite }) => {
  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>
          TailorShop.uz – Furnitura Do‘koni | Tikuvchilar uchun mahsulotlar
        </title>

        <meta
          name="description"
          content="Tikuvchilar uchun ip, tugma, zamok, rezina va boshqa furnitura mahsulotlari. TailorShop.uz"
        />

        <link rel="canonical" href="https://www.tailorshop.uz/" />

        <meta property="og:title" content="TailorShop.uz – Furnitura Do‘koni" />
        <meta
          property="og:description"
          content="Tikuvchilar uchun furnitura mahsulotlari"
        />
        <meta
          property="og:image"
          content="https://www.tailorshop.uz/Logo.png"
        />
      </Helmet>

      {/* UI */}
      <div className="pb-5">
        <Swiper />
        <Filters />
        <Products
          addToCart={addToCart}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
        <AdBanner />
      </div>
    </>
  );
};

export default SotuvHome;
