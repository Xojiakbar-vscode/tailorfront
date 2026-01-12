import React, { useEffect, useState } from "react";
import axios from "axios";

const AdBanner = () => {
  const [adBanners, setAdBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get("https://tailorback2025-production.up.railway.app/api/banners");
        
        // Faqat statusi false bo'lganlarni filtrlash
        const inactiveBanners = response.data.filter(item => item.status === false);
        
        setAdBanners(inactiveBanners);
      } catch (error) {
        console.error("Reklamalarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (loading || adBanners.length === 0) {
    return null; 
  }

  return (
    <section className="w-[90%] mx-auto my-12" data-aos="fade-down">
      {/* Sarlavha qismi */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 uppercase tracking-wider">
          Reklamalar
        </h2>
        <div className="h-[2px] flex-1 bg-gray-200"></div>
      </div>

      {/* Bannerlar tarmog'i */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {adBanners.map((ad) => (
          <div 
            key={ad.id} 
            className="group relative overflow-hidden rounded-2xl shadow-md transition-all duration-500 hover:shadow-2xl"
          >
            {/* Rasm */}
            <img
              src={ad.image_url}
              alt={ad.title || "Reklama"}
              className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Overlay: Faqat sarlavha uchun (Hoverda chiqadi) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
              <h3 className="text-white text-xl font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {ad.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdBanner;