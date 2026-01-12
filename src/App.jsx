import { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import FooterNavbar from "./sotuv/FooterNavbar/FooterNavbar";

// TOAST IMPORT
import { Toaster, toast } from "react-hot-toast";

// Lazy imports
const Home = lazy(() => import("./components/Home/Home"));
const SotuvHome = lazy(() => import("./sotuv/Home/SotuvHome"));
const Catalog = lazy(() => import("./sotuv/Catalog/Catalog"));
const Cart = lazy(() => import("./sotuv/Cart/Cart"));
const ProductDetail = lazy(() => import("./components/ProductCard/ProductDetail"));
const CategoryDetail = lazy(() => import("./sotuv/Filters/FilterDetail"));
const Favorites = lazy(() => import("./sotuv/Favorites/Favorites"));
const SearchPage = lazy(() => import("./sotuv/Search/SearchPage"));

const App = () => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // --- SAVATGA QO'SHISH (TOAST BILAN) ---
  const addToCart = (product) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item.id === product.id);

      // Chiroyli Yashil Toast
      toast.success(`${product.name} savatga qo'shildi!`, {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '12px',
          fontSize: '14px'
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10B981',
        },
      });

      if (exist) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // --- SEVIMLILARGA QO'SHISH/O'CHIRISH (TOAST BILAN) ---
  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const isExist = prev.find((item) => item.id === product.id);

      if (isExist) {
        // Qizil Toast - Olib tashlanganda
        toast.error("Sevimlilardan olib tashlandi", {
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#EF4444',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '12px',
            fontSize: '14px'
          },
        });
        return prev.filter((item) => item.id !== product.id);
      } else {
        // Yashil Toast - Qo'shilganda
        toast.success("Sevimlilarga qo'shildi!", {
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#059669',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '12px',
            fontSize: '14px'
          },
        });
        return [...prev, product];
      }
    });
  };

  return (
    <Router>
      {/* TOASTER KONTEYNERI */}
      <Toaster reverseOrder={false} gutter={8} />

      <ScrollToTop />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Yuklanmoqda...</span>
          </div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<SotuvHome addToCart={addToCart} favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/yana" element={<Home addToCart={addToCart} favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/search" element={<SearchPage favorites={favorites} toggleFavorite={toggleFavorite} addToCart={addToCart} />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/favorites" element={<Favorites favorites={favorites} toggleFavorite={toggleFavorite} addToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} toggleFavorite={toggleFavorite} favorites={favorites} />} />
          <Route
            path="/category/:id"
            element={<CategoryDetail addToCart={addToCart} favorites={favorites} toggleFavorite={toggleFavorite} />}
          />
        </Routes>
        <FooterNavbar cartItems={cartItems} favorites={favorites} />
      </Suspense>
    </Router>
  );
};

export default App;