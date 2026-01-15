import React from "react";
import { Helmet } from "react-helmet-async";

import HomeNav from "../HomeNav/HomeNav";
import About from "../About/About";
import ProductCards from "../ProductCard/ProductCard";
import Footer from "../Footer/Footer";

const Home = ({ addToCart, favorites, toggleFavorite }) => {
  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>
          TailorShop.uz – Namangandagi Furnitura Do‘koni | Ip, Tugma, Zamok
        </title>

        <meta
          name="description"
          content="Namangandagi TailorShop.uz furnitura do‘koni. Tikuvchilik uchun ip, tugma, zamok, rezina va boshqa mahsulotlar. Ulgurji va chakana."
        />

        <link rel="canonical" href="https://www.tailorshop.uz/" />

        <meta property="og:title" content="TailorShop.uz – Furnitura Do‘koni" />
        <meta
          property="og:description"
          content="Tikuvchilar uchun barcha furnitura mahsulotlari"
        />
        <meta
          property="og:image"
          content="https://www.tailorshop.uz/Logo.png"
        />
      </Helmet>

      {/* UI */}
      <HomeNav />
      <About />
      <ProductCards
        addToCart={addToCart}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
      <Footer />
    </>
  );
};

export default Home;
