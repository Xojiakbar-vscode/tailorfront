import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'; 
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete, AiOutlineClose, AiOutlineArrowRight, AiOutlineShopping } from "react-icons/ai";
import { FaCheckCircle, FaUser, FaShoppingCart, FaTruck, FaPhoneAlt, FaTicketAlt, FaMapMarkerAlt, FaCreditCard } from "react-icons/fa";

// --- KONSTANTALAR ---
const BOT_TOKEN = '8158426663:AAFumz1P2o3WtWH1NQme5pGI1sMl9SiN6bw';
const CHAT_ID = '353486841';
const API_URL = "https://tailorback2025-production.up.railway.app/api/orders";
const DISCOUNT_API_URL = "https://tailorback2025-production.up.railway.app/api/discounts";

const cities = ["Toshkent shahri", "Toshkent viloyati", "Namangan", "Andijon", "Farg'ona", "Samarqand", "Buxoro", "Navoiy", "Qarshi", "Termiz", "Jizzax", "Guliston", "Nukus"];

// --- ORDER MODAL KOMPONENTI ---
const OrderModal = ({ isOpen, onClose, onSubmit, orderForm, handleInputChange, finalTotal, isSending, cartItems }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white w-full max-w-4xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col mx-2 sm:mx-4 my-4 sm:my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg sm:rounded-xl">
                <FaTruck className="text-lg sm:text-xl" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">Buyurtma rasmiylashtirish</h3>
                <p className="text-red-100 text-xs sm:text-sm mt-0.5 sm:mt-1">Ma'lumotlaringizni to'ldiring</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <AiOutlineClose size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Mahsulotlar ro'yxati - Mobil: ustida, Desktop: chapda */}
          <div className="w-full lg:w-2/5 border-b lg:border-b-0 lg:border-r border-gray-100 p-4 sm:p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-700 flex items-center gap-2">
                <AiOutlineShopping />
                Savatingiz <span className="text-red-600">({cartItems.length})</span>
              </h4>
              <button 
                onClick={onClose}
                className="lg:hidden text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Yopish
              </button>
            </div>
            
            {/* Mobil: Horizontal scroll ro'yxati */}
            <div className="lg:hidden mb-4 overflow-x-auto pb-2">
              <div className="flex space-x-3 min-w-max">
                {cartItems.map((item, index) => (
                  <div key={item.id} className="flex-shrink-0 w-40 bg-red-50 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-xs truncate">{item.name}</p>
                        <p className="text-red-600 font-bold text-sm mt-1">
                          {((item.discountedPrice || item.price) * item.quantity).toLocaleString()} so'm
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Vertical ro'yxati */}
            <div className="hidden lg:block space-y-3">
              {cartItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                  <div className="w-12 h-12 bg-red-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-red-600 font-bold text-sm">
                        {(item.discountedPrice || item.price).toLocaleString()} so'm
                      </span>
                      <span className="text-gray-500 text-xs">×{item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Umumiy summa */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="flex justify-between text-gray-600 mb-2 text-sm sm:text-base">
                <span>Mahsulotlar:</span>
                <span className="font-medium">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)} dona
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800 text-sm sm:text-base">Jami summa:</span>
                <span className="text-lg sm:text-xl font-bold text-red-600">
                  {finalTotal.toLocaleString()} so'm
                </span>
              </div>
            </div>
          </div>

          {/* Form qismi */}
          <div className="w-full lg:w-3/5 p-4 sm:p-6 overflow-y-auto">
            <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    <FaUser className="inline mr-2 text-red-500" />
                    To'liq ismingiz
                  </label>
                  <input 
                    type="text" 
                    name="fullName" 
                    required 
                    value={orderForm.fullName} 
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                    placeholder="Ali Valiyev"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    <FaPhoneAlt className="inline mr-2 text-red-500" />
                    Telefon raqamingiz
                  </label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    value={orderForm.phone} 
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                    placeholder="+998 90 123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-red-500" />
                    Viloyat
                  </label>
                  <select 
                    name="city" 
                    required 
                    value={orderForm.city} 
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                  >
                    <option value="">Tanlang</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    <FaCreditCard className="inline mr-2 text-red-500" />
                    To'lov usuli
                  </label>
                  <select 
                    name="paymentMethod" 
                    value={orderForm.paymentMethod} 
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                  >
                    <option value="naqd">Naqd pul</option>
                    <option value="karta">Karta orqali</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                    Yetkazib berish manzili
                  </label>
                  <textarea 
                    name="address" 
                    required 
                    value={orderForm.address} 
                    onChange={handleInputChange} 
                    rows="2"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition resize-none"
                    placeholder="Ko'cha nomi, uy raqami, kvartira..."
                  />
                </div>
              </div>

              {/* Mobil va Desktop uchun alohida tugmalar */}
              <div className="pt-4 sm:pt-6 border-t border-gray-200">
                {/* Mobil: Stacked layout */}
                <div className="lg:hidden space-y-4">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Jami to'lov:</p>
                    <p className="text-2xl font-bold text-red-600">
                      {finalTotal.toLocaleString()} so'm
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={onClose}
                      className="py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Ortga
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSending}
                      className="py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSending ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                          Yuborilmoqda
                        </>
                      ) : (
                        <>
                          Tasdiqlash
                          <AiOutlineArrowRight />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Desktop: Horizontal layout */}
                <div className="hidden lg:flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Jami to'lov:</p>
                    <p className="text-3xl font-bold text-red-600">
                      {finalTotal.toLocaleString()} so'm
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                      Ortga
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSending}
                      className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSending ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                          Yuborilmoqda...
                        </>
                      ) : (
                        <>
                          Buyurtma berish
                          <AiOutlineArrowRight />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-gray-400 text-xs text-center mt-4">
                  Tasdiqlaganingizdan so'ng, operatorimiz tez orada siz bilan bog'lanadi
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ASOSIY CART COMPONENT ---
const Cart = ({ cartItems, setCartItems }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [orderForm, setOrderForm] = useState({ 
    fullName: "", 
    phone: "", 
    address: "", 
    city: "", 
    paymentMethod: "naqd" 
  });

  // Promokod statelari
  const [promoCode, setPromoCode] = useState("");
  const [discountInfo, setDiscountInfo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [isPromoLoading, setIsPromoLoading] = useState(false);

  const cartTotal = cartItems.reduce((total, item) => total + (item.discountedPrice || item.price) * item.quantity, 0);

  // Chegirmani hisoblash
  let discountValue = 0;
  if (discountInfo) {
    if (discountInfo.percent) {
      discountValue = (cartTotal * parseFloat(discountInfo.percent)) / 100;
    } else if (discountInfo.amount) {
      discountValue = parseFloat(discountInfo.amount);
    }
  }

  const finalTotal = Math.max(0, cartTotal - discountValue);

  const updateQuantity = (id, q) => {
    if (q < 1) return;
    const updated = cartItems.map(item => item.id === id ? { ...item, quantity: q } : item);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeFromCart = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleInputChange = (e) => setOrderForm({ ...orderForm, [e.target.name]: e.target.value });

  // PROMOKODNI TEKSHIRISH
  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    setIsPromoLoading(true);
    setPromoError("");
    
    try {
      const res = await fetch(`${DISCOUNT_API_URL}/search?query=${promoCode}`);
      const data = await res.json();

      const found = Array.isArray(data) ? data.find(d => d.promo_code === promoCode && d.is_active) : null;

      if (res.ok && found) {
        setDiscountInfo(found);
        setPromoError("");
      } else {
        setPromoError("Promokod xato yoki muddati o'tgan");
        setDiscountInfo(null);
      }
    } catch (err) {
      setPromoError("Aloqa xatosi");
    } finally {
      setIsPromoLoading(false);
    }
  };

  const sendToTelegram = async (data) => {
    const list = data.items.map((it, i) => `${i + 1}. ${it.name} (${it.quantity} ta)`).join('\n');
    const promoText = discountInfo ? `${discountInfo.promo_code} (-${discountInfo.percent || discountInfo.amount}${discountInfo.percent ? '%' : ' so\'m'})` : 'Yo\'q';
    
    const msg = `🚀 *YANGI BUYURTMA*\n\n👤 Mijoz: ${data.customer.fullName}\n📞 Tel: ${data.customer.phone}\n📍 Manzil: ${data.customer.city}, ${data.customer.address}\n💰 Jami: ${Math.round(data.total).toLocaleString()} so'm\n🏷 Promokod: ${promoText}\n📦 Mahsulotlar:\n${list}\n\n🆔 ID: ${data.order_id}`;
    
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: 'Markdown' })
      });
    } catch (e) { console.error("TG Error", e); }
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setIsSending(true);

    const serverBody = {
      customer_name: orderForm.fullName,
      customer_phone: orderForm.phone,
      total_price: finalTotal,
      promo_code: discountInfo?.promo_code || null,
      items: cartItems.map(item => ({ 
        product_id: item.id, 
        quantity: item.quantity 
      }))
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serverBody)
      });

      if (!res.ok) throw new Error("Server xatosi");

      const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      await sendToTelegram({ ...orderForm, items: cartItems, total: finalTotal, order_id: orderId, customer: orderForm });

      setOrderData({ id: orderId });
      setOrderSuccess(true);
      setCartItems([]);
      localStorage.removeItem("cart");
      setIsModalOpen(false);
    } catch (err) {
      alert("Buyurtmani yuborishda xatolik.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {orderSuccess ? (
          <div className="max-w-md mx-auto text-center bg-white p-6 sm:p-8 lg:p-12 rounded-xl sm:rounded-2xl shadow-lg border border-green-100">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <FaCheckCircle className="text-green-600 text-3xl sm:text-4xl" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Buyurtmangiz qabul qilindi!</h2>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">Buyurtma raqamingiz:</p>
            <p className="text-lg sm:text-xl font-bold text-red-600 mb-6 sm:mb-8 bg-red-50 py-2 px-4 rounded-lg inline-block">
              {orderData?.id}
            </p>
            <Link 
              to="/" 
              className="inline-block w-full sm:w-auto bg-red-600 text-white px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-md"
            >
              Asosiy sahifaga qaytish
            </Link>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12 sm:py-20 px-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <FaShoppingCart className="text-red-300 text-4xl sm:text-6xl" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Savat bo'sh</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
              Hali savatingizga mahsulot qo'shmagansiz. Mahsulotlarni ko'rib chiqing va savatingizni to'ldiring.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-red-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg text-sm sm:text-base"
            >
              Mahsulotlar sahifasiga o'tish
              <AiOutlineArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              {/* Savat sarlavhasi */}
              <div className="mb-6 sm:mb-8 px-2 sm:px-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Savat</h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  {cartItems.length} ta mahsulot, {cartItems.reduce((sum, item) => sum + item.quantity, 0)} dona
                </p>
              </div>

              {/* Mahsulotlar ro'yxati */}
              <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{item.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-2 sm:gap-0">
                          <div className="flex items-center gap-2 sm:gap-4">
                            <div className="flex items-center bg-gray-100 rounded-lg">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                              >
                                <AiOutlineMinus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <span className="px-2 sm:px-3 font-medium text-sm sm:text-base">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                              >
                                <AiOutlinePlus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                              <AiOutlineDelete size={16} className="sm:w-5 sm:h-5" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-base sm:text-lg font-bold text-red-600">
                              {((item.discountedPrice || item.price) * item.quantity).toLocaleString()} so'm
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              birligi: {(item.discountedPrice || item.price).toLocaleString()} so'm
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>


            </div>

            {/* Xulosa paneli */}
            <div className="lg:col-span-1 px-2 sm:px-0">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 sticky top-4 sm:top-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Buyurtma xulosasi</h2>
                
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Mahsulotlar:</span>
                    <span>{cartTotal.toLocaleString()} so'm</span>
                  </div>
                  
                  {discountInfo && (
                    <div className="flex justify-between text-green-600 text-sm sm:text-base">
                      <span>Chegirma:</span>
                      <span>-{discountValue.toLocaleString()} so'm</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Yetkazish:</span>
                    <span className="text-green-600 font-medium">Bepul</span>
                  </div>
                  
                  <div className="pt-3 sm:pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-base sm:text-lg font-bold text-gray-800">Jami:</span>
                      <div className="text-right">
                        <p className="text-xl sm:text-2xl font-bold text-red-600">
                          {finalTotal.toLocaleString()} so'm
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {discountInfo ? `${discountInfo.percent || ''}% chegirma bilan` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg sm:rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FaShoppingCart className="text-lg" />
                  Buyurtma berish
                  <AiOutlineArrowRight />
                </button>

                <p className="text-gray-400 text-xs text-center mt-3 sm:mt-4">
                  Yetkazib berish 1-3 ish kunida amalga oshiriladi
                </p>
              </div>

              {/* Davom etish tugmasi */}
              <Link 
                to="/"
                className="mt-3 sm:mt-4 block w-full py-2.5 sm:py-3 text-center border border-gray-300 rounded-lg sm:rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Xaridni davom ettirish
              </Link>
            </div>
          </div>
        )}
      </div>

      <OrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={submitOrder} 
        orderForm={orderForm} 
        handleInputChange={handleInputChange} 
        finalTotal={finalTotal} 
        isSending={isSending}
        cartItems={cartItems}
      />
    </div>
  );
};

export default Cart;