import { useParams, Link } from "react-router-dom";
import blogData from "../data/blogData";
import SEO from "./SEO";
import "./TaxNewsArticle.css";
import { orgSchema, blogPostingSchema, breadcrumbSchema } from "../utils/structuredData";

const topicWords = (post) =>
  new Set(post.id.split("-").filter((word) => word.length >= 4 && !/^(what|when|your|with|from|that|does|about|actually|know|202[0-9])$/.test(word)));

const TaxNewsArticle = () => {
  const { id } = useParams();
  const blog = blogData.find((b) => b.id === id);

  if (!blog) return <p>Blog not found.</p>;


  const path = `/tax-news/${blog.id}`;
  const terms = topicWords(blog);
  const related = blogData
    .filter((post) => post.id !== blog.id)
    .map((post) => ({ post, score: [...topicWords(post)].filter((word) => terms.has(word)).length }))
    .filter(({ score }) => score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Function to parse text with custom styles
  const parseText = (text) => {
    let parsed = text;

    // Convert ## to <h2>
    parsed = parsed.replace(/##\s*(.*?)\n/g, "<h2>$1</h2>");

    // Convert ### to <h3>
    parsed = parsed.replace(/###\s*(.*?)\n/g, "<h3>$1</h3>");

    // Convert unordered lists: lines starting with *
    parsed = parsed.replace(/(?:^|\n)\*(.*?)\n/g, "<li>$1</li>");
    parsed = parsed.replace(/<li>(.*?)<\/li>(?!<li>)/g, "<ul>$&</ul>");

    // Convert links [text](url)
    parsed = parsed.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Convert bold text **text**
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Convert italic text _text_ or *text*
    parsed = parsed.replace(/(?:\_|\*)(.*?)\1/g, "<em>$1</em>");

    // Wrap text in paragraphs for content separated by double new lines
    parsed = parsed.replace(/\n\n/g, "</p><p>");
    parsed = `<p>${parsed}</p>`;

    return parsed;
  };

  return (
    <article className="tax-news-detail" aria-labelledby="article-title">
      <SEO
        title={`${blog.contentTitle} | Tax Advocate Group`}
        description={blog.teaser}
        canonical={path}
        structuredData={[
          orgSchema,
          blogPostingSchema(blog),
          breadcrumbSchema([
            { path: "/", name: "Home" },
            { path: "/tax-news", name: "Tax News" },
            { path, name: blog.contentTitle },
          ]),
        ]}
      />
      {/* Hero with overlay */}
      <header
        className="tax-news-hero"
        style={{ backgroundImage: `url("/images/hero-19.png")` }}
      >
        <div className="tax-news-overlay"></div>
        <div className="tax-news-content">
          <h1 id="article-title">{blog.contentTitle}</h1>
          <nav className="tax-news-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link> <span>/</span>
            <Link to="/tax-news">Tax News</Link> <span>/</span>
            <span aria-current="page">{blog.title}</span>
          </nav>
        </div>
      </header>

      {/* Blog Content */}
      <div className="dynamic-article">
        {blog.teaser && <p className="blog-article-summary">{blog.teaser}</p>}
        {blog.contentBody.slice(0, 1).map((paragraph, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: parseText(paragraph) }} />
        ))}
        {blog.contentBody.slice(1).map((paragraph, index) => (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: parseText(paragraph) }}
          />
        ))}
        <aside className="blog-related-guides" aria-labelledby="blog-related-guides">
          <h2 id="blog-related-guides">Keep reading</h2>
          {related.length > 0 && (
            <ul>
              {related.map(({ post }) => (
                <li key={post.id}><Link to={`/tax-news/${post.id}`}>{post.contentTitle}</Link></li>
              ))}
            </ul>
          )}
          <Link to="/tax-news">Browse all tax news</Link>
        </aside>
      </div>
    </article>
  );
};

export default TaxNewsArticle;
