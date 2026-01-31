import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import {
  FaStar,
  FaHeart,
  FaRegHeart,
  FaTruck,
  FaShieldHalved ,
  FaRegCommentDots,
  FaArrowLeft,
  FaCheck
} from "react-icons/fa6";

import { FaCartShopping } from "react-icons/fa6";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

// 1. Premium Swiper Komponenti
const DetailSwiper = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative w-full h-full group overflow-hidden bg-gray-50 rounded-[2.5rem]">
      <div
        className="flex h-full rounded-xl transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${productName} – TailorShop.uz furnitura mahsuloti`}
            className="w-full h-full rounded-xl object-cover md:object-cover flex-shrink-0"
          />
        ))}
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentIndex ? "w-10 bg-red-600" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Yordamchi funksiya: Chegirmani hisoblash
const isDiscountValid = (discount) => {
  if (!discount || discount.is_active === false) return false;
  if (discount.valid_until) {
    const now = new Date();
    const expiry = new Date(discount.valid_until);
    if (expiry < now) return false;
  }
  return discount.percent || discount.amount;
};

// 2. Asosiy Mahsulot Tafsiloti Sahifasi
const ProductDetail = ({ addToCart, favorites = [], toggleFavorite }) => {
  const { slug } = useParams();  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("desc");
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sevimlilar ro'yxatida borligini tekshirish
  const isFavorite = favorites.some((fav) => fav.id === parseInt(id));

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, revRes, allProdsRes] = await Promise.all([
        fetch(`https://tailorback2025-production.up.railway.app/api/products/${id}`),
        fetch(`https://tailorback2025-production.up.railway.app/api/reviews`),
        fetch(`https://tailorback2025-production.up.railway.app/api/products`)
      ]);

      const prodData = await prodRes.json();
      const revData = await revRes.json();
      const allProdsData = await allProdsRes.json();

      setProduct(prodData);
      setReviews(revData.filter(rev => rev.product_id === parseInt(id)));

      if (prodData && allProdsData) {
        const related = allProdsData.filter(
          (p) => p.category_id === prodData.category_id && p.id !== prodData.id
        ).slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (err) {
      console.error("Xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`https://tailorback2025-production.up.railway.app/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: parseInt(id),
          ...reviewForm,
          rating: parseInt(reviewForm.rating)
        })
      });
      if (res.ok) {
        setReviewForm({ name: "", rating: 5, comment: "" });
        fetchData();
      }
    } catch (err) {
      alert("Sharh yuborishda xatolik");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-[3px] border-red-100 border-t-red-600 rounded-full animate-spin mb-4"></div>
      <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Yuklanmoqda...</p>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <h2 className="text-4xl font-black text-slate-900 italic uppercase">Mahsulot topilmadi</h2>
      <Link to="/" className="flex items-center gap-2 text-red-600 font-bold hover:underline">
        <FaArrowLeft /> Bosh sahifaga qaytish
      </Link>
    </div>
  );

  const hasDiscount = isDiscountValid(product.discount);
  const originalPrice = parseFloat(product.price);
  let finalPrice = originalPrice;

  if (hasDiscount) {
    const d = product.discount;
    if (d.percent) {
      finalPrice = originalPrice * (1 - parseFloat(d.percent) / 100);
    } else if (d.amount) {
      finalPrice = Math.max(0, originalPrice - parseFloat(d.amount));
    }
  }

  const imageUrls = product.images?.map(img => img.image_url) || ["https://media.licdn.com/dms/image/v2/D5612AQE8NiooxTxA3w/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1695825196046?e=2147483647&v=beta&t=2zU71mKLxGihkNQB5eMDjCgbD7srasN1gyEqowXMGV4"];


  return (
  
  <>
    <Helmet>
      <title>{product.name} | TailorShop.uz</title>

      <meta
        name="description"
        content={`${product.name} – Namangandagi furnitura do‘koni TailorShop.uz. ${
          product.description
            ? product.description.substring(0, 140)
            : "Ip, tugma, zamok va boshqa tikuvchilik mahsulotlari. Ulgurji va chakana."
        }`}
      />

      <link
        rel="canonical"
        href={`https://www.tailorshop.uz/product/${product.id}`}
      />

      {/* Open Graph */}
      <meta property="og:title" content={`${product.name} | TailorShop.uz`} />
      <meta
        property="og:description"
        content={product.description || "Namangandagi furnitura do‘koni TailorShop.uz"}
      />
      <meta property="og:type" content="product" />
      <meta
        property="og:url"
        content={`https://www.tailorshop.uz/product/${product.id}`}
      />
      <meta property="og:image" content={imageUrls[0]} />

      {/* Product Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "image": imageUrls,
          "description": product.description,
          "sku": product.id,
          "brand": {
            "@type": "Brand",
            "name": "TailorShop.uz"
          },
          "offers": {
            "@type": "Offer",
            "url": `https://www.tailorshop.uz/product/${product.id}`,
            "priceCurrency": "UZS",
            "price": Math.round(finalPrice),
            "availability": "https://schema.org/InStock"
          }
        })}
      </script>
    </Helmet>



    <div className="bg-[#fcfcfc] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* Yuqori qism: Rasm va Asosiy ma'lumotlar */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 mb-24">
          
          {/* Chap: Galereya */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 aspect-[4/5] md:aspect-square rounded-[2.5rem] relative group shadow-2xl shadow-slate-200">
              <DetailSwiper images={imageUrls} productName={product.name} />
              
              {/* Sevimli (Like) Tugmasi */}
              <button 
              aria-label={isFavorite ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo‘shish"}
  title={isFavorite ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo‘shish"}
                onClick={() => toggleFavorite(product)}
                className="absolute top-6 right-6 z-20 w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-xl hover:scale-110 active:scale-90 transition-all"
              >
                {isFavorite ? (
                  <FaHeart className="text-red-600 animate-pulse" />
                ) : (
                  <FaRegHeart className="text-slate-400" />
                )}
              </button>

              {hasDiscount && (
                <div className="absolute top-6 left-6 bg-red-600 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl animate-bounce z-20">
                  {product.discount.percent
                    ? `-${Math.round(product.discount.percent)}%`
                    : `-${Number(product.discount.amount).toLocaleString()} so'm`}
                </div>
              )}
            </div>
          </div>

          {/* O'ng: Mahsulot ma'lumotlari */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-slate-900 uppercase italic mb-4 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400 text-xs">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className={i < 4 ? "text-amber-400" : "text-slate-200"} />)}
                </div>
                <span className="text-slate-400 text-[10px] font-bold">({reviews.length} ta sharh)</span>
              </div>
            </div>

            {/* Narx paneli */}
            <div className="bg-white p-8 rounded-[2.5rem] mb-10 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-2">Sotuvdagi narxi:</span>
              <div className="flex items-end gap-4">
                <span className="text-4xl md:text-5xl font-black text-red-600 leading-none">
                  {Math.round(finalPrice).toLocaleString()} <small className="text-lg">so'm</small>
                </span>
                {hasDiscount && (
                  <span className="text-slate-300 line-through text-xl font-bold italic">
                    {Math.round(originalPrice).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Miqdor va Savat */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center bg-slate-100 rounded-3xl p-1.5 border border-slate-200">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm hover:text-red-600 transition-all">
                  <AiOutlineMinus />
                </button>
                <span className="px-8 font-black text-2xl text-slate-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm hover:text-red-600 transition-all">
                  <AiOutlinePlus />
                </button>
              </div>

              <button
                onClick={() => addToCart({
                  id: product.id,
                  name: product.name,
                  price: finalPrice,
                  quantity: quantity,
                  image: imageUrls[0],
                  variant: { Rangi: product.color, Olchami: product.unit }
                })}
                className="flex-grow h-16 bg-red-900 text-white rounded-3xl flex items-center justify-center gap-4 font-black text-sm uppercase tracking-widest hover:bg-red-600 active:scale-95 transition-all shadow-xl shadow-red-100"
              >
                <FaCartShopping  /> Savatga qo'shish
              </button>
            </div>

            {/* Ishonch belgilari */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-3xl">
                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center text-xl"><FaTruck /></div>
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider leading-tight">Tezkor<br />yetkazish</span>
              </div>
              <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-3xl">
                <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center text-xl"><FaShieldHalved  /></div>
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider leading-tight">Sifatli<br />kafolat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tablar va Tavsif */}
        <div className="border-t border-slate-100 pt-20">
          <div className="flex gap-8 mb-16 overflow-x-auto pb-4 no-scrollbar border-b border-slate-50">
            {["desc", "reviews"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`text-sm font-black uppercase tracking-[0.2em] transition-all pb-6 relative whitespace-nowrap ${
                  activeTab === t ? "text-red-600" : "text-slate-300 hover:text-slate-500"
                }`}
              >
                {t === "desc" ? "Mahsulot tavsifi" : `Xaridorlar fikri (${reviews.length})`}
                {activeTab === t && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-full"></div>}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {activeTab === "desc" ? (
              <div className="grid lg:grid-cols-3 gap-16 animate-fadeIn">
                <div className="lg:col-span-2 space-y-8">
                  <h4 className="text-3xl font-black text-slate-900 italic uppercase">Asosiy xususiyatlar</h4>
                  <p className="text-slate-500 text-xl leading-loose font-medium max-w-4xl">
                    {product.description || "Ushbu mahsulot eng so'nggi texnologiyalar asosida yuqori sifatli materiallardan tayyorlangan."}
                  </p>
                  <div className="grid grid-cols-2 gap-6 pt-6">
                    {['Premium Sifat', 'Eksklyuziv Dizayn', 'Chidamlilik', 'Garantiya'].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-slate-800 font-bold uppercase text-xs">
                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                          <FaCheck size={10} />
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 p-10 rounded-[3rem] h-fit border border-slate-100">
                  <h5 className="font-black text-slate-900 uppercase mb-8 border-b border-slate-200 pb-5 tracking-widest text-sm italic">Texnik Ma'lumotlar</h5>
                  <ul className="space-y-6">
                    <li className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                      <span className="text-slate-400">Rangi:</span>
                      <span className="text-slate-900">{product.color || "Standart"}</span>
                    </li>
                    <li className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                      <span className="text-slate-400">O'lchov birligi:</span>
                      <span className="text-slate-900">{product.unit || "Dona"}</span>
                    </li>
                    <li className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                      <span className="text-slate-400">Min. buyurtma:</span>
                      <span className="text-slate-900">{product.min_order} {product.unit}</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              /* Sharhlar qismi */
              <div className="grid lg:grid-cols-12 gap-16 animate-fadeIn">
                <div className="lg:col-span-4">
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-50 sticky top-24">
                    <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3 uppercase italic">
                      <FaRegCommentDots className="text-red-600" /> Sharh yozish
                    </h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-5">
                      <input
                        type="text"
                        placeholder="ISMINGIZ"
                        className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-red-600 focus:bg-white outline-none font-bold text-[10px] tracking-widest transition-all"
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        required
                      />
                      <select
                        className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-red-600 outline-none font-black text-[10px] transition-all cursor-pointer"
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                      >
                        <option value="5">⭐⭐⭐⭐⭐ A'LO</option>
                        <option value="4">⭐⭐⭐⭐ YAXSHI</option>
                        <option value="3">⭐⭐⭐ O'RTA</option>
                      </select>
                      <textarea
                        rows="4"
                        placeholder="FIKRINGIZNI YOZING..."
                        className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-red-600 focus:bg-white outline-none font-bold text-[10px] transition-all"
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        required
                      ></textarea>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-slate-200"
                      >
                        {isSubmitting ? "Yuborilmoqda..." : "Yuborish"}
                      </button>
                    </form>
                  </div>
                </div>
                <div className="lg:col-span-8 space-y-6">
                  {reviews.length > 0 ? reviews.map((rev) => (
                    <div key={rev.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h5 className="font-black text-slate-900 uppercase text-sm tracking-widest">{rev.name}</h5>
                        <div className="flex text-amber-400 text-[10px]">
                          {[...Array(parseInt(rev.rating))].map((_, i) => <FaStar key={i} />)}
                        </div>
                      </div>
                      <p className="text-slate-500 font-medium italic text-sm">"{rev.comment}"</p>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                      <FaRegCommentDots size={40} className="text-slate-300 mb-4" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Hozircha sharhlar mavjud emas</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* O'xshash Mahsulotlar */}
        {relatedProducts.length > 0 && (
          <div className="mt-40">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] mb-3 block italic">Sizga yoqishi mumkin</span>
                <h2 className="text-4xl font-black text-slate-900 uppercase italic leading-none">O'xshash mahsulotlar</h2>
              </div>
              <Link to="/" className="text-slate-900 font-black text-[10px] uppercase tracking-widest border-b-2 border-red-600 pb-2 hover:text-red-600 transition-all">
                Hammasini ko'rish
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => {
                const itemDiscountValid = isDiscountValid(item.discount);
                let itemPrice = parseFloat(item.price);
                if (itemDiscountValid) {
                  if (item.discount.percent) {
                    itemPrice = itemPrice * (1 - parseFloat(item.discount.percent) / 100);
                  } else if (item.discount.amount) {
                    itemPrice = Math.max(0, itemPrice - parseFloat(item.discount.amount));
                  }
                }
                const isFavItem = favorites.some(f => f.id === item.id);
                
                return (
                  <div key={item.id} className="group bg-white rounded-[2rem] p-3 border border-slate-100 hover:shadow-2xl transition-all duration-500 relative">
                    <Link to={`/product/${item.id}`}>
                      <div className="aspect-square rounded-[1.5rem] overflow-hidden mb-5 bg-slate-50 relative">
                        <img src={item.images?.[0]?.image_url || "https://media.licdn.com/dms/image/v2/D5612AQE8NiooxTxA3w/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1695825196046?e=2147483647&v=beta&t=2zU71mKLxGihkNQB5eMDjCgbD7srasN1gyEqowXMGV4"} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        {itemDiscountValid && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-bold px-2 py-1 rounded-lg">SALE</div>
                        )}
                      </div>
                      <div className="px-2 pb-2">
                        <h3 className="font-black text-slate-900 uppercase text-[11px] mb-3 truncate group-hover:text-red-600 transition-colors">{item.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-red-600 font-black text-xs">
                            {Math.round(itemPrice).toLocaleString()} <small className="text-[9px]">so'm</small>
                          </span>
                          <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-red-600 transition-colors shadow-lg">
                            <FaCartShopping  size={12} />
                          </div>
                        </div>
                      </div>
                    </Link>
                    {/* O'xshash mahsulotlar uchun kichik Like tugmasi */}
                    <button 
                      onClick={() => toggleFavorite(item)}
                      className="absolute top-5 right-5 z-10 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all"
                    >
                      {isFavItem ? <FaHeart className="text-red-600 text-xs" /> : <FaRegHeart className="text-slate-400 text-xs" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ProductDetail;