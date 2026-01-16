export default async function handler(req, res) {
  try {
    const siteUrl = "https://www.tailorshop.uz";

    const productsApi = "https://tailorback2025-production.up.railway.app/api/products";
    const bannersApi = "https://tailorback2025-production.up.railway.app/api/banners";

    const [productsRes, bannersRes] = await Promise.all([
      fetch(productsApi),
      fetch(bannersApi)
    ]);

    const products = await productsRes.json();
    const banners = await bannersRes.json();

    const escapeXml = (str = "") =>
      String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

    const today = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // ===================== BANNERS (HOME PAGE) =====================
    // ✅ status true/false farqsiz, rasm bo'lsa qo'shamiz
    const allBanners = Array.isArray(banners)
      ? banners.filter((b) => b?.image_url)
      : [];

    if (allBanners.length > 0) {
      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>1.0</priority>\n`;

      for (const b of allBanners) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${escapeXml(b.image_url)}</image:loc>\n`;
        xml += `      <image:title>${escapeXml(b.title || "TailorShop Banner")}</image:title>\n`;
        xml += `    </image:image>\n`;
      }

      xml += `  </url>\n`;
    }

    // ===================== PRODUCTS =====================
    for (const p of products) {
      if (!p?.id) continue;
      if (p.is_active === false) continue;

      if (!Array.isArray(p.images) || p.images.length === 0) continue;

      const lastmod = p.updatedAt
        ? new Date(p.updatedAt).toISOString().split("T")[0]
        : today;

      xml += `  <url>\n`;
      xml += `    <loc>${siteUrl}/product/${p.id}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;

      for (const img of p.images) {
        if (!img?.image_url) continue;

        xml += `    <image:image>\n`;
        xml += `      <image:loc>${escapeXml(img.image_url)}</image:loc>\n`;
        xml += `      <image:title>${escapeXml(p.name || "TailorShop Product")}</image:title>\n`;

        if (img.alt_text && img.alt_text.trim() !== "") {
          xml += `      <image:caption>${escapeXml(img.alt_text)}</image:caption>\n`;
        }

        xml += `    </image:image>\n`;
      }

      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(xml);
  } catch (err) {
    res.status(500).send("Image sitemap error");
  }
}
