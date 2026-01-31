import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
  FaArrowLeft,
  FaChevronDown,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";

import CatalogImage from "../../images/Catalogmod.png";
import KatalogIcon from "../../images/Katalog.png";

const API_URL = "https://tailorback2025-production.up.railway.app/api/categories";

const Catalog = () => {
  const [categories, setCategories] = useState([]);
  const [activeParent, setActiveParent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 🔴 Kategoriyalarni olish
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        const parents = data.filter((c) => c.parent_id === null);
        const structured = parents.map((p) => ({
          ...p,
          children: data.filter((c) => c.parent_id === p.id),
        }));

        setCategories(structured);
      } catch (err) {
        console.error("Xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleAccordion = (id) => {
    setActiveParent((prev) => (prev === id ? null : id));
  };

  const filtered = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.children.some((child) =>
        child.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mb-4"></div>
        <p className="text-red-400 font-bold text-sm uppercase tracking-widest">
          Yuklanmoqda...
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Katalog | TailorShop.uz – Namangandagi Furnitura Do‘koni
        </title>

        <meta
          name="description"
          content="TailorShop.uz katalogi: ip, tugma, zamok, rezina va boshqa tikuvchilik furnitura mahsulotlari. Namanganda ulgurji va chakana savdo."
        />

        <link
          rel="canonical"
          href="https://www.tailorshop.uz/catalog"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Katalog | TailorShop.uz"
        />
        <meta
          property="og:description"
          content="Tikuvchilar uchun furnitura mahsulotlari katalogi"
        />
        <meta
          property="og:url"
          content="https://www.tailorshop.uz/catalog"
        />
        <meta
          property="og:image"
          content="https://www.tailorshop.uz/Logo.png"
        />

        {/* Catalog Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Furnitura Katalogi",
            "url": "https://www.tailorshop.uz/catalog"
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-[#FFFDFD]">
        {/* 🔴 HEADER */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-red-100">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
            <Link
              to="/"
              className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
            >
              <FaArrowLeft />
            </Link>

            <div className="flex items-center gap-2 flex-1">
              <div className="w-9 h-9 bg-red-600 rounded-xl p-2 hidden sm:block">
                <img
                  src={KatalogIcon}
                  alt="TailorShop.uz katalog belgisi"

                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
              <h1 className="text-xl font-black uppercase italic text-red-700">
                Katalog
              </h1>
            </div>

            <div className="relative w-48 sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-red-300" />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-red-50 focus:bg-white border border-transparent focus:border-red-300 outline-none text-sm font-semibold"
              />
            </div>
          </div>
        </div>

        {/* 🔴 CONTENT */}
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-2">
          {/* LEFT — CATEGORIES */}
          <div className="lg:col-span-8 space-y-4">
            {filtered.map((cat) => {
              const isOpen = activeParent === cat.id;

              return (
                <div
                  key={cat.id}
                  className="bg-white border border-red-100 rounded-2xl overflow-hidden"
                >
                  {/* PARENT */}
                  <button
                    onClick={() => toggleAccordion(cat.id)}
                    className="w-full  flex items-center justify-between px-6 py-2 hover:bg-red-50"
                  >
                    <div className="text-left">
                      <h3 className="font-black text-red-700 uppercase italic">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-red-400 font-bold">
                        {cat.children.length} ta bo‘lim
                      </p>
                    </div>
                    <FaChevronDown
                      className={`text-red-400 transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>


                  {/* CHILDREN */}
                  {isOpen && (
                    <div className="bg-red-50/50 border-t border-red-100">
                      {cat.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => navigate(`/category/${child.slug}`)} // ✅ slug
                          className="w-full flex items-center justify-between px-8 py-3 text-sm hover:bg-white"
                        >
                          <span className="font-semibold text-red-700">
                            {child.name}
                          </span>
                          <FaChevronRight className="text-red-300" />
                        </button>
                      ))}

                      {/* 🔴 ALL PRODUCTS */}
                      <button
                        onClick={() => navigate(`/category/${cat.slug}`)} // ✅ slug
                        className="w-full px-8 py-3 text-sm font-black uppercase tracking-widest text-red-600 bg-white border-t border-red-200 hover:bg-red-50"
                      >
                        Barcha {cat.name}
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* RIGHT — SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            {/* IMAGE CARD */}
            <div className="hidden lg:block bg-white rounded-[2.5rem] p-5 border border-red-100 shadow-xl">
              <div className="relative rounded-[2rem] overflow-hidden h-64 mb-5">
                <img
                  src={CatalogImage}
                  alt="TailorShop.uz katalogi — tikuvchilik furnitura mahsulotlari"

                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 to-transparent"></div>
                <span className="absolute bottom-4 left-4 px-4 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                  Premium
                </span>
              </div>

              <h3 className="text-2xl font-black uppercase italic text-red-700 mb-3">
                Tikuvchilik Olami
              </h3>
              <p className="text-sm text-red-400 leading-relaxed mb-6">
                Eng sifatli tikuv ashyolari va professional mahsulotlar jamlanmasi.
              </p>


            </div>
            <div className="pb-20">
              <Link
                to="/all-products"
                className="flex items-center justify-between px-6 py-4  bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition"
              >
                Barcha Mahsulotlar
                <FaChevronRight />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </>
  );
};

export default Catalog;
