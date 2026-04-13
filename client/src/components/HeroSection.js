import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import leadContext from "../context/leadContext";

/**
 * EmbeddedLeadForm — 3-step inline lead form for TAG
 * Step 1: tax situation type (filing status, business vs individual, state vs federal)
 * Step 2: debt range + urgency
 * Step 3: contact info + consent
 */
export const EmbeddedLeadForm = ({ variant = "default" }) => {
  const navigate = useNavigate();
  const { sendEmail } = useContext(leadContext);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [formData, setFormData] = useState({
    taxType: "",
    filingStatus: "",
    debtType: "",
    debtAmount: "",
    urgency: "",
    name: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const selectOption = (name, value) =>
    setFormData({ ...formData, [name]: value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consentChecked) return;

    setSubmitted(true);
    sendEmail({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `Assessment — Type: ${formData.taxType}, Filing: ${formData.filingStatus}, Debt: ${formData.debtType} / ${formData.debtAmount}, Urgency: ${formData.urgency}`,
    });
    setTimeout(() => navigate("/thank-you"), 1200);
  };

  const isStep1Valid = formData.taxType && formData.filingStatus;
  const isStep2Valid = formData.debtType && formData.debtAmount;
  const isStep3Valid =
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
        <h3>Tell Us About Your Situation</h3>
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
        <div className={`progress-line ${step >= 3 ? "active" : ""}`}></div>
        <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
          <span>3</span>
        </div>
      </div>

      {step === 1 && (
        <div className="form-step">
          <div className="form-group">
            <label>Is this for business or individual taxes?</label>
            <div className="radio-group">
              {["Individual", "Business", "Both"].map((val) => (
                <label
                  key={val}
                  className={`radio-card ${formData.taxType === val ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="taxType"
                    value={val}
                    checked={formData.taxType === val}
                    onChange={handleChange}
                  />
                  <span>{val}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>What is your filing status?</label>
            <select
              name="filingStatus"
              value={formData.filingStatus}
              onChange={handleChange}
            >
              <option value="">Select status</option>
              <option value="single">Single</option>
              <option value="married-joint">Married Filing Jointly</option>
              <option value="married-separate">
                Married Filing Separately
              </option>
              <option value="head-of-household">Head of Household</option>
              <option value="business-entity">Business Entity</option>
            </select>
          </div>

          <button
            type="button"
            className="form-btn"
            onClick={() => setStep(2)}
            disabled={!isStep1Valid}
          >
            Continue{" "}
            <span className="btn-arrow" aria-hidden="true">
              &#8594;
            </span>
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="form-step">
          <div className="form-group">
            <label>Is your debt federal, state, or both?</label>
            <div className="radio-group">
              {["Federal", "State", "Both"].map((val) => (
                <label
                  key={val}
                  className={`radio-card ${formData.debtType === val ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="debtType"
                    value={val}
                    checked={formData.debtType === val}
                    onChange={handleChange}
                  />
                  <span>{val}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Estimated amount owed</label>
            <div className="amount-pills">
              {[
                { label: "Under $10K", value: "under-10k" },
                { label: "$10K–$50K", value: "10k-50k" },
                { label: "$50K–$100K", value: "50k-100k" },
                { label: "$100K+", value: "over-100k" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`amount-pill ${formData.debtAmount === opt.value ? "selected" : ""}`}
                  onClick={() => selectOption("debtAmount", opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-btn-row">
            <button
              type="button"
              className="form-btn-back"
              onClick={() => setStep(1)}
            >
              &#8592; Back
            </button>
            <button
              type="button"
              className="form-btn"
              onClick={() => setStep(3)}
              disabled={!isStep2Valid}
            >
              Continue{" "}
              <span className="btn-arrow" aria-hidden="true">
                &#8594;
              </span>
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
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

          <div className="form-group form-consent">
            <label className="consent-checkbox">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                required
              />
              <span className="consent-text">
                By submitting this form, you expressly consent to receive
                automated and manually dialed telephone calls, prerecorded voice
                messages, and SMS/MMS text messages from Tax Advocate Group, LLC
                and its representatives at the telephone number you have
                provided. During your initial inquiry period, you may receive up
                to five (5) text messages related to your tax matter,
                consultation scheduling, and case evaluation follow-up.
                Following enrollment as an active client, you may receive no
                more than one (1) text message per calendar month for purposes
                including but not limited to document request notifications,
                scheduled payment reminders, and case status updates. Message
                and data rates may apply depending on your mobile carrier and
                service plan. Message frequency varies. You may opt out of text
                communications at any time by replying STOP to any message;
                reply HELP for assistance. Consent is not a condition of
                purchase. View our{" "}
                <Link to="/privacy-policy">Privacy Policy</Link>.
              </span>
            </label>
          </div>

          <div className="form-btn-row">
            <button
              type="button"
              className="form-btn-back"
              onClick={() => setStep(2)}
            >
              &#8592; Back
            </button>
            <button
              type="submit"
              className="form-btn form-btn-submit"
              disabled={!isStep3Valid}
            >
              Get My Free Evaluation
            </button>
          </div>
        </form>
      )}

      <div className="form-trust">
        <span>
          <i className="fas fa-lock" aria-hidden="true"></i> Secure &amp;
          Confidential
        </span>
        <span>
          <i className="fas fa-check" aria-hidden="true"></i> No Obligation
        </span>
      </div>
    </div>
  );
};

/**
 * HeroSection — Home page hero for Tax Advocate Group
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
        <section
          className="hero hero-mobile-version"
          aria-label="Tax Advocate Group introduction"
        >
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
                <span className="hero__title-line hero__title-accent">
                  Group
                </span>
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
        <section
          className="hero hero-desktop-version"
          aria-label="Tax Advocate Group introduction"
        >
          <div className="hero__media">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              poster="/images/Cover-Video-by-Shutterstock-1111048265-compressed_9.jpeg"
              className="hero__video"
            >
              <source
                src="/images/Cover-Video-by-Shutterstock-1111048265-compressed.mp4"
                type="video/mp4"
              />
            </video>
            <div className="hero__overlay hero__overlay--center"></div>
          </div>

          <div className="hero__content hero__content--centered">
            {/* Centered headline block */}
            <div className="hero__headline-block">
              <span className="hero__badge hero__badge--center">
                <i className="fas fa-shield-alt" aria-hidden="true"></i>
                Trusted Tax Professionals
              </span>

              <h1 className="hero__title hero__title--centered">
                <span className="hero__title-sweep">Tax Advocate Group</span>
              </h1>

              <p className="hero__tagline">
                Individual &amp; Business Tax Consulting
              </p>

              <p className="hero__blurb">
                Comprehensive and tailored solutions for businesses and
                individuals across all 50 states.
              </p>
            </div>

            {/* Stats chips */}
            <div className="hero__chips">
              <div className="hero__chip">
                <span className="hero__chip-value">$150M+</span>
                <span className="hero__chip-label">Resolved</span>
              </div>
              <div className="hero__chip">
                <span className="hero__chip-value">A+</span>
                <span className="hero__chip-label">BBB Rating</span>
              </div>
              <div className="hero__chip">
                <span className="hero__chip-value">50</span>
                <span className="hero__chip-label">States</span>
              </div>
              <div className="hero__chip">
                <span className="hero__chip-value">24hr</span>
                <span className="hero__chip-label">Response</span>
              </div>
            </div>

            {/* Form — centered card */}
            <div className="hero__form-card">
              <EmbeddedLeadForm variant="desktop-hero" />
            </div>

            {/* Trust row below form */}
            <div className="hero__trust hero__trust--center">
              <div className="hero__trust-badge">
                <img
                  src="/images/bbb-accredited-business.png"
                  alt="BBB Accredited Business"
                  width="40"
                  height="40"
                  loading="lazy"
                />
                <span>BBB A+ Rated</span>
              </div>
              <div className="hero__trust-badge">
                <img
                  src="/images/trust-builder-IRS-Provider.png"
                  alt="IRS Authorized Provider"
                  width="40"
                  height="40"
                  loading="lazy"
                />
                <span>IRS Licensed</span>
              </div>
              <div className="hero__trust-badge">
                <i className="fas fa-check-circle" aria-hidden="true"></i>
                <span>All 50 States</span>
              </div>
              <div className="hero__trust-badge">
                <i className="fas fa-lock" aria-hidden="true"></i>
                <span>Secure &amp; Confidential</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default HeroSection;
