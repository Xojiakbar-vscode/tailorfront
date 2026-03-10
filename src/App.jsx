import { useEffect, useState, lazy, Suspense, useCallback, useMemo } from "react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import AOS from "aos";
import "aos/dist/aos.css";
import FooterNavbar from "./sotuv/FooterNavbar/FooterNavbar";
import AllProducts from "./sotuv/ProductCard/AllProducts";
import { Toaster, toast } from "react-hot-toast";
import Header from "./sotuv/Header/Header";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

// Lazy imports with preloading
const Home = lazy(() => import("./components/Home/Home"));
const SotuvHome = lazy(() => import("./sotuv/Home/SotuvHome"));
const Catalog = lazy(() => import("./sotuv/Catalog/Catalog"));
const Cart = lazy(() => import("./sotuv/Cart/Cart"));
const ProductDetail = lazy(() => import("./components/ProductCard/ProductDetail"));
const CategoryDetail = lazy(() => import("./sotuv/Filters/FilterDetail"));
const Favorites = lazy(() => import("./sotuv/Favorites/Favorites"));
const SearchPage = lazy(() => import("./sotuv/Search/SearchPage"));
const Footer = lazy(() => import("./sotuv/Footer/Footer"));

// Yangi sahifalar
const SalesPage = lazy(() => import("./components/pages/SalesPage"));
const NewProductsPage = lazy(() => import("./components/pages/NewProductsPage"));
const AboutPage = lazy(() => import("./components/pages/AboutPage"));
const ContactPage = lazy(() => import("./components/pages/ContactPage"));
const FAQPage = lazy(() => import("./components/pages/FAQPage"));
const DeliveryPage = lazy(() => import("./components/pages/DeliveryPage"));
const PaymentPage = lazy(() => import("./components/pages/PaymentPage"));
const WarrantyPage = lazy(() => import("./components/pages/WarrantyPage"));
const ReturnPage = lazy(() => import("./components/pages/ReturnPage"));
const PrivacyPage = lazy(() => import("./components/pages/PrivacyPage"));
const NotFoundPage = lazy(() => import("./components/pages/NotFoundPage"));


// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
    </div>
    <p className="mt-4 text-gray-400 text-sm font-medium animate-pulse">
      Yuklanmoqda...
    </p>
  </div>
);

const App = () => {
  // State with lazy initialization
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ 
      duration: 800, 
      once: true,
      offset: 100,
      easing: 'ease-out-cubic'
    });
  }, []);

  // Toast styles
  const toastStyles = useMemo(() => ({
    success: {
      duration: 2000,
      position: 'top-center',
      style: {
        background: '#10B981',
        color: '#fff',
        fontWeight: '600',
        borderRadius: '12px',
        fontSize: '14px',
        padding: '12px 20px',
        boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3)'
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
      },
    },
    error: {
      duration: 2000,
      position: 'top-center',
      style: {
        background: '#EF4444',
        color: '#fff',
        fontWeight: '600',
        borderRadius: '12px',
        fontSize: '14px',
        padding: '12px 20px',
        boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.3)'
      },
    },
    favoriteAdd: {
      duration: 2000,
      position: 'top-center',
      style: {
        background: '#059669',
        color: '#fff',
        fontWeight: '600',
        borderRadius: '12px',
        fontSize: '14px',
        padding: '12px 20px',
        boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.3)'
      },
    }
  }), []);

  // Add to cart handler
const addToCart = useCallback((product) => {
  if (!product?.id) return;

  setCartItems((prev) => {
    const exist = prev.find((item) => item.id === product.id);

    toast.success(
      `${product.name.slice(0, 30)}${product.name.length > 30 ? '...' : ''} savatga qo'shildi!`,
      toastStyles.success
    );

    if (exist) {
      return prev.map((item) =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) }
          : item
      );
    }

    return [...prev, { ...product, quantity: product.quantity || 1 }];
  });
}, [toastStyles]);

  // Toggle favorite handler
  const toggleFavorite = useCallback((product) => {
    if (!product?.id) return;

    setFavorites((prev) => {
      const isExist = prev.find((item) => item.id === product.id);

      if (isExist) {
        toast.error("Sevimlilardan olib tashlandi", toastStyles.error);
        return prev.filter((item) => item.id !== product.id);
      } else {
        toast.success("Sevimlilarga qo'shildi!", toastStyles.favoriteAdd);
        return [...prev, product];
      }
    });
  }, [toastStyles]);

  // Clear cart handler
  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.success("Savat tozalandi", toastStyles.success);
  }, [toastStyles]);

  // Remove from cart handler
  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    toast.success("Mahsulot savatdan olib tashlandi", toastStyles.success);
  }, [toastStyles]);

  // Update quantity handler
  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, [removeFromCart]);

  return (
    <ErrorBoundary>
      <Router>
        {/* Toaster container */}
        <Toaster 
          reverseOrder={false} 
          gutter={8}
          containerStyle={{
            top: 20,
            left: 20,
            bottom: 20,
            right: 20,
          }}
        />

        <ScrollToTop />
        
        <Suspense fallback={<LoadingSpinner />}>
          <Header
            cartItems={cartItems}
            favorites={favorites}
            cartCount={cartItems.reduce((total, item) => total + (item.quantity || 1), 0)}
            favoritesCount={favorites.length}
          />
          
          <Routes>
            {/* Asosiy sahifalar */}
            <Route 
              path="/" 
              element={
                <SotuvHome 
                  addToCart={addToCart} 
                  cartItems={cartItems} 
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite} 
                />
              } 
            />
            
            <Route 
              path="/yana" 
              element={
                <Home 
                  addToCart={addToCart} 
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite} 
                />
              } 
            />
            
            <Route 
              path="/search" 
              element={
                <SearchPage 
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite} 
                  addToCart={addToCart} 
                />
              } 
            />
            
            <Route path="/catalog" element={<Catalog />} />
            
            <Route 
              path="/cart" 
              element={
                <Cart 
                  cartItems={cartItems} 
                  setCartItems={setCartItems}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeFromCart}
                  onClearCart={clearCart}
                />
              } 
            />
            
            <Route 
              path="/favorites" 
              element={
                <Favorites 
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite} 
                  addToCart={addToCart} 
                />
              } 
            />
            
            <Route 
              path="/product/:id" 
              element={
                <ProductDetail 
                  addToCart={addToCart} 
                  toggleFavorite={toggleFavorite} 
                  favorites={favorites} 
                />
              } 
            />
            
            <Route 
              path="/all-products" 
              element={
                <AllProducts
                  addToCart={addToCart}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              } 
            />
            
            <Route 
              path="/category/:id" 
              element={
                <CategoryDetail 
                  addToCart={addToCart} 
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite} 
                />
              } 
            />

            {/* Yangi sahifalar - Xarid bo'limi */}
            <Route 
              path="/sales" 
              element={
                <SalesPage 
                  addToCart={addToCart}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              } 
            />
            
            <Route 
              path="/new" 
              element={
                <NewProductsPage 
                  addToCart={addToCart}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              } 
            />

            {/* Ma'lumotlar bo'limi */}
            <Route 
              path="/about" 
              element={<AboutPage />} 
            />
            
            <Route 
              path="/delivery" 
              element={<DeliveryPage />} 
            />
            
            <Route 
              path="/payment" 
              element={<PaymentPage />} 
            />
            
            <Route 
              path="/privacy" 
              element={<PrivacyPage />} 
            />

            {/* Yordam bo'limi */}
            <Route 
              path="/faq" 
              element={<FAQPage />} 
            />
            
            <Route 
              path="/return" 
              element={<ReturnPage />} 
            />
            
            <Route 
              path="/warranty" 
              element={<WarrantyPage />} 
            />
            
            <Route 
              path="/contact" 
              element={<ContactPage />} 
            />

            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
          <FooterNavbar 
            cartItems={cartItems} 
            favorites={favorites} 
            className="navbarfooter" 
          />
          <Footer />
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
};

export default React.memo(App);
