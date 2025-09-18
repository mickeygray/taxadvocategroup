import React, { useState, useContext, useEffect } from "react";
import leadContext from "../context/leadContext";
import { useNavigate } from "react-router-dom";
import PhoneLink from "./PhoneLink";

const LandingPopupForm = ({ onClose }) => {
  const navigate = useNavigate();
  const { sendLeadForm } = useContext(leadContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    debtAmount: "",
    filedAllTaxes: "",
    name: "",
    phone: "",
    email: "",
    bestTime: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = () => setStep(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendLeadForm(formData);

    navigate("/thank-you");
  };

  return (
    <div className="landing-popup-overlay">
      <div className="landing-popup-form">
        <button className="landing-popup-close" onClick={onClose}>
          ✕
        </button>
        {step === 1 && (
          <form onSubmit={(e) => e.preventDefault()}>
            <h2>How much do you owe?</h2>
            <select
              name="debtAmount"
              value={formData.debtAmount}
              onChange={handleChange}
              required
            >
              <option value="">Select an amount</option>
              <option value="<10000">Less than $10,000</option>
              <option value="10000-20000">$10,000 – $20,000</option>
              <option value="20000-50000">$20,000 – $50,000</option>
              <option value="50000-100000">$50,000 – $100,000</option>
              <option value=">100000">More than $100,000</option>
            </select>

            <h2>Have you filed all your taxes?</h2>
            <div className="landing-popup-radio-group">
              <label>
                <input
                  type="radio"
                  name="filedAllTaxes"
                  value="yes"
                  checked={formData.filedAllTaxes === "yes"}
                  onChange={handleChange}
                  required
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="filedAllTaxes"
                  value="no"
                  checked={formData.filedAllTaxes === "no"}
                  onChange={handleChange}
                  required
                />
                No
              </label>
            </div>

            <button
              type="button"
              className="landing-popup-next"
              onClick={handleNext}
            >
              Next
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <h2>Your Contact Information</h2>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
            />
            <input
              type="text"
              name="bestTime"
              value={formData.bestTime}
              onChange={handleChange}
              placeholder="Best Time to Contact"
            />
            <button type="submit" className="landing-popup-submit">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
const LandingPage1 = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="landing-page-root">
      <div className="landing-page-content">
        {/* Hero Section */}
        <section className="landing-page-hero">
          <div className="hero-image-container">
            {!isMobile ? (
              <img
                src="/images/wynn-landing-hero.png"
                alt="Tax Advocate Group Hero"
              />
            ) : (
              <img
                src="/images/cropped-hero.png"
                alt="Tax Advocate Group Hero"
              />
            )}
          </div>
          <div className="hero-text-overlay">
            <h1 className="landing-hero-company-name">Tax Advocate Group</h1>
            <h1 className="landing-hero-title">
              Reduce &amp; Resolve Your IRS Tax Liability, No Matter How Much
              You Owe
            </h1>
            <p className="landing-hero-subtitle">
              Tax Advocate Group professionals have saved taxpayers over $300
              million in tax debt with comprehensive tax resolution services.
            </p>
            <div className="hero-buttons">
              <PhoneLink rawNumber="18005171807" />

              <a
                className="phone-button"
                style={{ background: "#333" }}
                onClick={() => setShowPopup(true)}
              >
                Get Free Consultation
              </a>
            </div>
          </div>
          <div className="hero-overlay"></div>
        </section>
        {showPopup && <LandingPopupForm onClose={() => setShowPopup(false)} />}
        {/* Steps */}
        <div className="landing-container">
          <section className="steps-section">
            <div className="step">
              <img
                className="step-icon"
                src="https://d9hhrg4mnvzow.cloudfront.net/hire.wynntaxsolutions.com/consultation/a9bbfa4e-frame-15031-1.svg"
                alt="Step 1"
              />
              <h3 className="step-title">Legal Representation</h3>
              <p className="step-description">
                Our firm files a Power of Attorney to access your tax records
                and begin the case review.
              </p>
            </div>
            <div className="step">
              <img
                className="step-icon"
                src="https://d9hhrg4mnvzow.cloudfront.net/hire.wynntaxsolutions.com/consultation/a9bbfa4e-frame-15031-1.svg"
                alt="Step 1"
              />
              <h3 className="step-title">Guaranteed Compliance</h3>
              <p className="step-description">
                As part of our commitment to you we will make sure your filings
                are correct and current.
              </p>
            </div>
            <div className="step">
              <img
                className="step-icon"
                src="https://d9hhrg4mnvzow.cloudfront.net/hire.wynntaxsolutions.com/consultation/a9bbfa4e-frame-15031-1.svg"
                alt="Step 1"
              />
              <h3 className="step-title">Best Resolution</h3>
              <p className="step-description">
                Where possible we will reduce your liability by aggressive
                application of tax law.
              </p>
            </div>
            {/* Add Step 2, Step 3 similarly */}
          </section>
        </div>
        <section className="features-section">
          <div className="features-header">
            <h2 className="features-title">
              What makes Tax Advocate Group Different?
            </h2>
            <p className="features-subtitle">
              Our Attorneys are some of the best in the nation with decades of
              tax experience
            </p>
          </div>

          <div className="features-grid">
            {/* Image Side */}
            <div className="features-image">
              <img
                src="/images/wynn-gilf.png" /* Replace with actual image */
                alt="Feature visual"
              />
            </div>

            {/* Text Boxes */}
            <div className="features-boxes">
              <div className="feature-box">
                <span className="feature-icon">✔</span>
                <div className="feature-text">
                  <h4 className="feature-title">Free Consultation</h4>
                  <p className="feature-description">
                    We call the IRS with you, and if theres work we can do we
                    let you know for free.
                  </p>
                </div>
              </div>
              <div className="feature-box">
                <span className="feature-icon">✔</span>
                <div className="feature-text">
                  <h4 className="feature-title">Quick and Accurate Results</h4>
                  <p className="feature-description">
                    We will help you fix your state and federal tax liabilities
                    starting on day one.
                  </p>
                </div>
              </div>
              <div className="feature-box">
                <span className="feature-icon">✔</span>
                <div className="feature-text">
                  <h4 className="feature-title">100% Guarantee</h4>
                  <p className="feature-description">
                    We will provide a resolution to your case, and if you aren't
                    satisfied you can have your money back.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="landing-container">
          <section className="steps-section">
            <div className="step">
              <i className="fas fa-user-tie guarantee-icon"></i>
              <h3 className="step-title">Tailored Tax Guidance</h3>
              <p className="step-description">
                Whether you have business or personal tax issues we will provide
                you industry leading expert guidance. We help with state and
                federal taxes for individuals, payroll taxes and entity
                formation for small businesses.
              </p>
            </div>
            <div className="step">
              <i className="fas fa-handshake guarantee-icon"></i>
              <h3 className="step-title">Open And Honest Accountability</h3>
              <p className="step-description">
                We are available to speak with you during regular business hours
                and provide regular updates via email and text and allow you to
                schedule appointments when you are available.
              </p>
            </div>
            <div className="step">
              <i className="fas fa-file-invoice-dollar guarantee-icon"></i>
              <h3 className="step-title">Ongoing Tax Preparation Services</h3>
              <p className="step-description">
                Long after we have completed the work of preparing resolution,
                we offer account monitoring and complementary tax filing for
                some clients.
              </p>
            </div>
            {/* Add Step 2, Step 3 similarly */}
          </section>
        </div>
        <section className="landing-testimonials-section">
          <div className="landing-testimonials-cards">
            <div className="landing-testimonial-card">
              <div className="landing-testimonial-stars">★★★★★</div>
              <p className="landing-testimonial-text">
                "Wynn went above and beyond to help me through my tax debt. I
                have and will continue to recommend your company to everyone."
              </p>
              <div className="landing-testimonial-author">Anedia R.</div>
            </div>

            <div className="landing-testimonial-card">
              <div className="landing-testimonial-stars">★★★★★</div>
              <p className="landing-testimonial-text">
                "Tax Advocate Group gave me peace of mind. They negotiated a
                payment plan and put me back in good standing with the IRS."
              </p>
              <div className="landing-testimonial-author">Samantha A.</div>
            </div>

            <div className="landing-testimonial-card">
              <div className="landing-testimonial-stars">★★★★★</div>
              <p className="landing-testimonial-text">
                "Thank you for negotiating my balance and getting me filed and
                up to date. I appreciate the help and quick response!"
              </p>
              <div className="landing-testimonial-author">N.S.</div>
            </div>
          </div>

          <div className="landing-bbb-logo">
            <img
              src="images/bbb-accredited-business.png"
              alt="BBB Accredited Business"
            />
          </div>
        </section>
        {/* CTA */}
        <section
          className="landing-callout-section"
          style={{ backgroundImage: 'url("/images/hero-5.png")' }}
        >
          <div className="landing-callout-overlay"></div>
          <div className="landing-callout-content">
            <h2 className="landing-callout-title">
              Take the Next Step Toward Tax Relief
            </h2>
            <p className="landing-callout-subtitle">
              Our experts are ready to help you reduce and resolve your IRS tax
              liability.
            </p>
            <PhoneLink rawNumber="18005171807" />
          </div>
        </section>

        {/* Footer */}
      </div>
    </div>
  );
};

export default LandingPage1;
