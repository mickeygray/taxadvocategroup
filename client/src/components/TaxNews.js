import { Link } from "react-router-dom";
import useBlogData from "./useBlogData";
import SEO from "./SEO";
import { orgSchema } from "../utils/structuredData";

const TaxNews = () => {
  const { blogs } = useBlogData();

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
          backgroundImage: `url("/images/contact-hero.png")`,
        }}
      >
        <div className="tax-news-overlay"></div>
        <div className="tax-news-content">
          <h1>Tax News</h1>
          <nav className="tax-news-breadcrumbs">
            <Link to="/">Home</Link> <span>/</span> <span>Tax News</span>
          </nav>
        </div>
      </header>

      {/* Featured Article */}
      {blogs.length > 0 && (
        <div className="tax-news-content-container">
          <div className="tax-news-featured">
            <div className="tax-news-featured-image">
              <img src={blogs[0].image} alt={blogs[0].title} />
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
              <img src={blog.image} alt={blog.title} />
              <h2>{blog.title}</h2>
              <p>{blog.teaser}</p>
              <Link to={`/tax-news/${blog.id}`} className="read-more">
                Read More &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaxNews;
