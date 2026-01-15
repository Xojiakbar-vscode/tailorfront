import React from 'react'
import Swiper from '../Swiper/Swiper';
import Filters from '../Filters/Filters';
import Products from '../ProductCard/ProductCard'; // Komponent nomi Products bo'lsa
import AdBanner from '../AdBanner/AdBanner';

const SotuvHome = ({ addToCart, cartItems, favorites, toggleFavorite }) => {
  return (
    <div className="pb-5"> {/* FooterNavbar ostida qolib ketmasligi uchun */}

      <Swiper />
      <Filters />
      <Products 
        addToCart={addToCart}
        favorites={favorites}
        toggleFavorite={toggleFavorite} 
      />
      <AdBanner />
    </div>
  )
}

export default SotuvHome