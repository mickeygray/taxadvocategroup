import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import leadContext from "../context/leadContext";

/**
 * EmbeddedLeadForm — 2-step inline lead form for TAG
 * Step 1: debt amount + filed-all-taxes
 * Step 2: name, phone, email, consent
 */
export const EmbeddedLeadForm = ({ variant = "default" }) => {
  const navigate = useNavigate();
  const { sendEmail } = useContext(leadContext);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
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
    if (!consentChecked) return;

    setSubmitted(true);
    sendEmail({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `Assessment request — Debt: ${formData.debtAmount}, Filed all taxes: ${formData.filedAllTaxes}, Best time: ${formData.bestTime || "Any"}`,
    });
    setTimeout(() => navigate("/thank-you"), 1200);
  };

  const isStep2Valid =
    formData.name.trim() &&
    formData.phone.trim() &&
    formData.email.trim() &&
    consentChecked;

  if (submitted) {
    return (
      <div className={`embedded-lead-form ${variant}`}>
        <div className="embedded-form-success">
          <i className="fas fa-check-circle" aria-hidden="true"></i>
          <h3>Request Received</h3>
          <p>A Tax Advocate Group specialist will contact you shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`embedded-lead-form ${variant}`}>
      <div className="embedded-form-header">
        <span className="form-badge">Free Case Evaluation</span>
        <h3>See What You Qualify For</h3>
        <p>Answer two quick questions and a tax specialist will call you back.</p>
      </div>

      {/* Progress indicator */}
      <div className="form-progress">
        <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
          <span>1</span>
        </div>
        <div className={`progress-line ${step >= 2 ? "active" : ""}`}></div>
        <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
          <span>2</span>
        </div>
      </div>

      {step === 1 ? (
        <form onSubmit={(e) => e.preventDefault()} className="form-step">
          <div className="form-group">
            <label htmlFor="hero-debt">How much do you owe the IRS?</label>
            <select
              id="hero-debt"
              name="debtAmount"
              value={formData.debtAmount}
              onChange={handleChange}
              required
            >
              <option value="">Select a range</option>
              <option value="under-10k">Under $10,000</option>
              <option value="10k-30k">$10,000 – $30,000</option>
              <option value="30k-75k">$30,000 – $75,000</option>
              <option value="75k-150k">$75,000 – $150,000</option>
              <option value="over-150k">$150,000+</option>
            </select>
          </div>

          <div className="form-group">
            <label>Have you filed all your tax returns?</label>
            <div className="radio-group">
              <label
                className={`radio-card ${formData.filedAllTaxes === "yes" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="filedAllTaxes"
                  value="yes"
                  checked={formData.filedAllTaxes === "yes"}
                  onChange={handleChange}
                />
                <span>Yes</span>
              </label>
              <label
                className={`radio-card ${formData.filedAllTaxes === "no" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="filedAllTaxes"
                  value="no"
                  checked={formData.filedAllTaxes === "no"}
                  onChange={handleChange}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <button
            type="button"
            className="form-btn"
            onClick={handleNext}
            disabled={!formData.debtAmount || !formData.filedAllTaxes}
          >
            Continue <span className="btn-arrow" aria-hidden="true">&#8594;</span>
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="form-step">
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              aria-label="Full name"
            />
          </div>
          <div className="form-group">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              aria-label="Phone number"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              aria-label="Email address"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="bestTime"
              value={formData.bestTime}
              onChange={handleChange}
              placeholder="Best Time to Contact (optional)"
              aria-label="Best time to contact"
            />
          </div>

          {/* Consent checkbox */}
          <div className="form-group form-consent">
            <label className="consent-checkbox">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                required
              />
              <span className="consent-text">
                I agree to be contacted by Tax Advocate Group via phone, email,
                or text (including autodialed or prerecorded calls).
                Message/data rates may apply. Consent is not required to
                purchase. View our{" "}
                <Link to="/privacy-policy">Privacy Policy</Link>.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="form-btn form-btn-submit"
            disabled={!isStep2Valid}
          >
            Request My Case Review
          </button>
          <button
            type="button"
            className="form-btn-back"
            onClick={() => setStep(1)}
          >
            &#8592; Back
          </button>
        </form>
      )}

      <div className="form-trust">
        <span><i className="fas fa-lock" aria-hidden="true"></i> Secure &amp; Confidential</span>
        <span><i className="fas fa-check" aria-hidden="true"></i> No Obligation</span>
      </div>
    </div>
  );
};

/**
 * HeroSection — Home page hero for Tax Advocate Group
 * Renders both mobile and desktop variants; CSS handles visibility
 */
const HeroSection = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* ========== MOBILE VERSION ========== */}
      {isMobile && (
        <section className="hero hero-mobile-version" aria-label="Tax Advocate Group introduction">
          <div className="hero__media">
            <img
              src="/images/Cover-Video-by-Shutterstock-1111048265-compressed_9.jpeg"
              alt=""
              className="hero__image"
              aria-hidden="true"
              loading="eager"
            />
            <div className="hero__overlay"></div>
          </div>

          <div className="hero__content hero__content--mobile">
            <div className="hero__text">
              <span className="hero__badge">Trusted Tax Professionals</span>
              <h1 className="hero__title">
                <span className="hero__title-line">Tax Advocate</span>
                <span className="hero__title-line hero__title-accent">Group</span>
              </h1>
              <p className="hero__subtitle">
                Individual and Business Tax Consulting
              </p>
            </div>

            <EmbeddedLeadForm variant="mobile-hero" />

            <Link to="/our-tax-services" className="hero__link">
              <span>View Our Services</span>
              <i className="fas fa-arrow-right" aria-hidden="true"></i>
            </Link>
          </div>
        </section>
      )}

      {/* ========== DESKTOP VERSION ========== */}
      {!isMobile && (
        <section className="hero hero-desktop-version" aria-label="Tax Advocate Group introduction">
          <div className="hero__media">
            <video autoPlay muted loop playsInline className="hero__video">
              <source
                src="/images/Cover-Video-by-Shutterstock-1111048265-compressed.mp4"
                type="video/mp4"
              />
            </video>
            <div className="hero__overlay"></div>
          </div>

          <div className="hero__content">
            <div className="hero__grid">
              {/* Left side — Text content */}
              <div className="hero__text">
                <span className="hero__badge">
                  <span className="badge-dot"></span>
                  Trusted Tax Professionals
                </span>

                <h1 className="hero__title">
                  <span className="hero__title-line">Tax Advocate</span>
                  <span className="hero__title-line hero__title-accent">Group</span>
                </h1>

                <p className="hero__subtitle">
                  Individual and Business Tax Consulting
                </p>

                <p className="hero__description">
                  We work with businesses and individuals from all over the U.S.,
                  providing comprehensive and tailored solutions to resolve your
                  tax challenges.
                </p>

                {/* Stats row */}
                <div className="hero__stats">
                  <div className="hero__stat">
                    <span className="hero__stat-value">$300M+</span>
                    <span className="hero__stat-label">Tax Debt Resolved</span>
                  </div>
                  <div className="hero__stat">
                    <span className="hero__stat-value">A+</span>
                    <span className="hero__stat-label">BBB Rating</span>
                  </div>
                  <div className="hero__stat">
                    <span className="hero__stat-value">50</span>
                    <span className="hero__stat-label">States Covered</span>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="hero__buttons">
                  <Link to="/our-tax-services" className="hero__btn hero__btn--primary">
                    <i className="fa-solid fa-folder" aria-hidden="true"></i> Our Services
                  </Link>
                  <Link to="/contact-us" className="hero__btn hero__btn--secondary">
                    <i className="fa-solid fa-phone" aria-hidden="true"></i> Free Consultation
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="hero__trust">
                  <div className="hero__trust-badge">
                    <img
                      src="/images/bbb-accredited-business.png"
                      alt="BBB Accredited Business"
                      width="48"
                      height="48"
                    />
                    <span>BBB A+ Rated</span>
                  </div>
                  <div className="hero__trust-badge">
                    <img
                      src="/images/trust-builder-IRS-Provider.png"
                      alt="IRS Authorized Provider"
                      width="48"
                      height="48"
                    />
                    <span>IRS Licensed</span>
                  </div>
                  <div className="hero__trust-badge">
                    <i className="fas fa-check-circle" aria-hidden="true"></i>
                    <span>All 50 States</span>
                  </div>
                </div>
              </div>

              {/* Right side — Form */}
              <div className="hero__form-wrapper">
                <EmbeddedLeadForm variant="desktop-hero" />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default HeroSection;
