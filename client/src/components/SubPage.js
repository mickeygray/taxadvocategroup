import React from "react";
import { Link, useParams } from "react-router-dom";
import SEO from "./SEO";
import { serviceSchema, breadcrumbSchema } from "../utils/structuredData";

const SubPage = ({ heroImage, heroTitle, breadcrumb, title, body }) => {
  const { category, slug } = useParams();
  const canonical = `/${category}/${slug}`;
  const description = body[0] ? body[0].substring(0, 160) : title;
  return (
    <>
      <SEO
        title={`${title} | Tax Advocate Group`}
        description={description}
        canonical={canonical}
        structuredData={[
          serviceSchema(title, description, category === "tax-relief" ? "Tax Relief" : category === "tax-resolution" ? "Tax Resolution" : "Tax Negotiation"),
          breadcrumbSchema(breadcrumb.map((b) => ({ name: b.label, path: b.link || canonical }))),
        ]}
      />
      {/* Hero Section */}
      <section
        className="subpage-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay"></div>
        <div className="subpage-hero-content">
          <h1>{heroTitle}</h1>
          <nav className="breadcrumbs">
            {breadcrumb.map((item, index) => (
              <span key={index}>
                {item.link ? (
                  <Link to={item.link}>{item.label}</Link>
                ) : (
                  item.label
                )}
                {index < breadcrumb.length - 1 && " / "}
              </span>
            ))}
          </nav>
        </div>
      </section>

      {/* Breadcrumb */}

      <main className="subpage-container">
        {/* Page Title & Body Copy */}
        <section className="subpage-content">
          <h2 className="page-title">{title}</h2>
          {body.map((paragraph, index) => (
            <p key={index} className="page-body">
              {paragraph}
            </p>
          ))}
        </section>
      </main>
    </>
  );
};

export default SubPage;
