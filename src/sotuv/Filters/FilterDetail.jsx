import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
  FaArrowLeft, FaBoxes, FaLayerGroup,
  FaShoppingCart, FaHeart, FaRegHeart
} from "react-icons/fa";

const CategoryDetail = ({ addToCart, favorites, toggleFavorite }) => {
  const { slug } = useParams(); // ✅ slug
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        // ✅ 1) category ni slug bilan olamiz
        const catRes = await fetch(`https://tailorback2025-production.up.railway.app/api/categories/slug/${slug}`);
        const catData = await catRes.json();

        if (!catRes.ok) {
          throw new Error(catData?.error || "Kategoriya topilmadi");
        }

        setCategory(catData);

        // ✅ 2) products ni category_id orqali olamiz
        const prodRes = await fetch(
          `https://tailorback2025-production.up.railway.app/api/products?category_id=${catData.id}`
        );
        const prodData = await prodRes.json();

        if (!prodRes.ok) {
          throw new Error(prodData?.error || "Mahsulotlarni olishda xatolik");
        }

        setProducts(prodData);
      } catch (error) {
        console.error("Xatolik:", error);
        setCategory(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCategoryData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-700"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 font-bold">Kategoriya topilmadi</p>
        <Link to="/" className="text-red-600 font-black underline">
          Asosiy sahifaga qaytish
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category?.name} | TailorShop.uz – Furnitura Katalogi</title>

        <meta
          name="description"
          content={`${category?.name} furnitura mahsulotlari. TailorShop.uz Namanganda joylashgan tikuvchilik do‘koni. Ulgurji va chakana savdo.`}
        />

        <link
          rel="canonical"
          href={`https://www.tailorshop.uz/category/${slug}`}
        />

        {/* Open Graph */}
        <meta property="og:title" content={`${category?.name} | TailorShop.uz`} />
        <meta
          property="og:description"
          content={`${category?.name} bo‘limidagi barcha furnitura mahsulotlari`}
        />
        <meta
          property="og:url"
          content={`https://www.tailorshop.uz/category/${slug}`}
        />
        <meta property="og:image" content="https://www.tailorshop.uz/Logo.png" />

        {/* Category Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: category?.name,
            url: `https://www.tailorshop.uz/category/${slug}`,
          })}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-10 pb-32">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-800 font-bold mb-6 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] uppercase font-black tracking-widest">
              ASOSIY SAHIFA
            </span>
          </Link>

          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-red-950">
            <span className="text-red-600">#</span> {category?.name}
          </h1>
        </div>

        {/* --- 1-QISM: ICHKI BO'LIMLAR --- */}
        {category?.children && category.children.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-black text-red-900 mb-8 flex items-center gap-3 uppercase">
              <FaLayerGroup className="text-red-600" /> ICHKI BO'LIMLAR
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  to={`/category/${child.slug}`} // ✅ slug
                  className="bg-white border border-red-100 hover:border-red-500 rounded-[2rem] p-6 flex flex-col items-center text-center transition-all hover:shadow-xl group"
                >
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-red-600 transition-colors">
                    <FaLayerGroup className="text-red-600 group-hover:text-white" />
                  </div>
                  <h3 className="font-black text-[10px] uppercase italic">
                    {child.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* --- 2-QISM: MAHSULOTLAR --- */}
        <div>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-red-900 flex items-center gap-3 uppercase">
              <FaBoxes className="text-red-600" /> MAHSULOTLAR
            </h2>

            <span className="bg-red-600 text-white px-4 py-1 rounded-full font-black text-[10px]">
              {products.length} TA
            </span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {products.map((product) => {
                const isFav = favorites?.some((f) => f.id === product.id);

                return (
                  <div key={product.id} className="group flex flex-col h-full">
                    {/* Mahsulot Rasmi */}
                    <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-md">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={
                            product.images?.[0]?.image_url ||
                            "https://geostudy.uz/img/pictures/cifvooipg_rf1.jpegx500"
                          }
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </Link>

                      {/* Like Tugmasi */}
                      <button
                        onClick={() => toggleFavorite(product)}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-md active:scale-90 transition-all"
                      >
                        {isFav ? (
                          <FaHeart className="text-red-600" />
                        ) : (
                          <FaRegHeart className="text-gray-400" />
                        )}
                      </button>
                    </div>

                    {/* Ma'lumotlar va Savat Tugmasi */}
                    <div className="mt-4 px-2 flex flex-col flex-grow">
                      <span className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">
                        {product.unit || "Model 2025"}
                      </span>

                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-bold text-gray-950 text-lg leading-tight mb-2 group-hover:text-red-600 transition-colors line-clamp-2 italic uppercase">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="mt-auto">
                        <p className="text-red-700 font-black text-xl mb-3">
                          {Math.round(product.price).toLocaleString()}{" "}
                          <span className="text-xs">SO'M</span>
                        </p>

                        <button
                          onClick={() => addToCart(product)}
                          className="w-full bg-slate-900 hover:bg-red-600 text-white py-3 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg active:scale-95 group/btn"
                        >
                          <FaShoppingCart
                            className="group-hover/btn:animate-bounce"
                            size={16}
                          />
                          <span className="font-black text-[11px] uppercase tracking-tighter">
                            Savatga qo'shish
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-black italic">
                MAHSULOTLAR TOPILMADI
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryDetail;
