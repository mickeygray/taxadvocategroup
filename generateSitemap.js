const fs = require("fs");
const { SitemapStream } = require("sitemap");
const { createWriteStream } = require("fs");

// Ensure /client/public directory exists
const publicPath = "./client/public";

if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}

const links = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/about-us", changefreq: "monthly", priority: 0.7 },
  { url: "/our-tax-services", changefreq: "monthly", priority: 0.7 },
  { url: "/contact-us", changefreq: "yearly", priority: 0.5 },
  { url: "/tax-news", changefreq: "weekly", priority: 0.6 },
];

// Add dynamic blog posts
const blogRoutes = ["understanding-tax-relief", "irs-negotiation-tips"];
blogRoutes.forEach((slug) => {
  links.push({
    url: `/tax-news/${slug}`,
    changefreq: "monthly",
    priority: 0.6,
  });
});

// Generate sitemap
async function generateSitemap() {
  const stream = new SitemapStream({
    hostname: "https://www.amitytaxgroup.com",
  });
  const writeStream = createWriteStream(`${publicPath}/sitemap.xml`);

  stream.pipe(writeStream);
  links.forEach((link) => stream.write(link));
  stream.end();

  stream.on("finish", () => {
    console.log("✅ Sitemap successfully generated in /client/public!");
  });
}

generateSitemap();
