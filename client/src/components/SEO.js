import { useEffect } from "react";

const SEO = ({ title, description, canonical, structuredData, noindex }) => {
  useEffect(() => {
    // Set document title
    if (title) document.title = title;

    // Helper to upsert a <meta> tag
    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }

    if (title) {
      setMeta("property", "og:title", title);
      setMeta("name", "twitter:title", title);
    }

    const baseUrl = "https://www.taxadvocategroup.com";

    if (canonical) {
      setMeta("property", "og:url", `${baseUrl}${canonical}`);
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", `${baseUrl}${canonical}`);
    }

    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", "Tax Advocate Group");
    setMeta(
      "property",
      "og:image",
      `${baseUrl}/images/tax-advocate-group-logo-small.png`,
    );
    setMeta("name", "twitter:card", "summary_large_image");

    if (noindex) {
      setMeta("name", "robots", "noindex, nofollow");
    }

    // Inject structured data
    const scriptIds = [];
    if (structuredData) {
      const items = Array.isArray(structuredData)
        ? structuredData
        : [structuredData];
      items.forEach((sd, i) => {
        const id = `sd-json-ld-${i}`;
        let script = document.getElementById(id);
        if (!script) {
          script = document.createElement("script");
          script.id = id;
          script.type = "application/ld+json";
          document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(sd);
        scriptIds.push(id);
      });
    }

    return () => {
      scriptIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    };
  }, [title, description, canonical, structuredData, noindex]);

  return null;
};

export default SEO;
