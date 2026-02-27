import { Link } from "react-router-dom";
import blogData from "../data/blogData";
import SEO from "./SEO";
import { orgSchema } from "../utils/structuredData";

const TaxNews = () => {
  const blogs = blogData;

  return (
    <div className="tax-news-container">
      <SEO
        title="Tax News & Insights | Tax Advocate Group"
        description="Stay informed with the latest tax news, IRS updates, and expert insights from Tax Advocate Group. Tips for individuals and businesses navigating tax challenges."
        canonical="/tax-news"
        structuredData={[orgSchema]}
      />
      {/* Hero with overlay */}
      <header
        className="tax-news-hero"
        style={{
          backgroundImage: `url("/images/hero-19.png")`,
        }}
      >
        <div className="tax-news-overlay"></div>
        <div className="tax-news-content">
          <h1>Tax News &amp; Insights</h1>
          <p className="tax-news-hero-sub">
            Expert guidance on IRS issues, tax relief, and financial strategy
          </p>
          <nav className="tax-news-breadcrumbs">
            <Link to="/">Home</Link> <span>/</span> <span>Tax News</span>
          </nav>
        </div>
      </header>

      {/* Featured Article */}
      {blogs.length > 0 && (
        <div className="tax-news-content-container">
          <div className="tax-news-featured">
            <div className="tax-news-featured-accent">
              <img
                src="/images/tax-advocate-group-logo-small.png"
                alt="Tax Advocate Group"
                className="tax-news-featured-logo"
              />
              <span className="tax-news-featured-tag">Featured</span>
            </div>
            <div className="tax-news-featured-body">
              <h2>{blogs[0].title}</h2>
              <p>{blogs[0].teaser}</p>
              <Link to={`/tax-news/${blogs[0].id}`} className="read-more">
                Read Full Article &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      <div className="tax-news-content-container">
        <div className="tax-news-grid">
          {blogs.slice(1).map((blog) => (
            <div key={blog.id} className="tax-news-card">
              <div className="tax-news-card-bar"></div>
              <div className="tax-news-card-body">
                <h2>{blog.title}</h2>
                <p>{blog.teaser}</p>
                <Link to={`/tax-news/${blog.id}`} className="read-more">
                  Read More &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaxNews;
