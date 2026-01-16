export default async function handler(req, res) {
  try {
    const siteUrl = "https://www.tailorshop.uz";

    const productsApi = "https://tailorback2025-production.up.railway.app/api/products";
    const categoriesApi = "https://tailorback2025-production.up.railway.app/api/categories";

    const [productsRes, categoriesRes] = await Promise.all([
      fetch(productsApi),
      fetch(categoriesApi)
    ]);

    const products = await productsRes.json();
    const categories = await categoriesRes.json();

    const today = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // ✅ Statik sahifalar (search yo‘q)
    const staticPages = [
      { loc: `${siteUrl}/`, changefreq: "daily", priority: "1.0" },
      { loc: `${siteUrl}/yana`, changefreq: "weekly", priority: "0.9" },
      { loc: `${siteUrl}/catalog`, changefreq: "weekly", priority: "0.9" },
      { loc: `${siteUrl}/all-products`, changefreq: "daily", priority: "0.9" }
    ];

    for (const page of staticPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${page.loc}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // ✅ Categories (API)
    if (Array.isArray(categories)) {
      for (const c of categories) {
        if (!c?.id) continue;

        const lastmod = c.updatedAt
          ? new Date(c.updatedAt).toISOString().split("T")[0]
          : today;

        xml += `  <url>\n`;
        xml += `    <loc>${siteUrl}/category/${c.id}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }
    }

    // ✅ Products (API)
    if (Array.isArray(products)) {
      for (const p of products) {
        if (!p?.id) continue;
        if (p.is_active === false) continue;

        const lastmod = p.updatedAt
          ? new Date(p.updatedAt).toISOString().split("T")[0]
          : today;

        xml += `  <url>\n`;
        xml += `    <loc>${siteUrl}/product/${p.id}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      }
    }

    xml += `</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(xml);
  } catch (err) {
    res.status(500).send("Sitemap error");
  }
}
