import React, { useEffect, useState } from 'react'
import HomeNav from '../HomeNav/HomeNav'
import About from '../About/About'
import ProductCards from '../ProductCard/ProductCard'
import Delivery from '../Delivery/Delivery'
import Footer from '../Footer/Footer'

const Home = ({ addToCart, favorites, toggleFavorite }) => {
  return (
    <div>
      <HomeNav />
      <About />
      {/* <Delivery /> */}
      <ProductCards addToCart={addToCart}
        favorites={favorites}
        toggleFavorite={toggleFavorite} />
      <Footer />
    </div>
  )
}

export default Home