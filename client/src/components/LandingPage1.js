import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import leadContext from "../context/leadContext";
import PhoneLink from "./PhoneLink";
import SEO from "./SEO";
import { orgSchema } from "../utils/structuredData";
import { trackCustomEvent, trackStandardEvent } from "../utils/fbq";
import { useTrustedForm } from "../hooks/useTrustedForm";
import SmsOptInCheckbox from "./SmsOptInCheckBox";

/* ═══════════════════════════════════════════
 *  INLINE MULTI-STEP FORM
 * ═══════════════════════════════════════════ */
const LeadForm = () => {
  const navigate = useNavigate();
  const { sendLeadForm } = useContext(leadContext);
  const { certUrl, inputProps: tfInputProps } = useTrustedForm();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [smsConsentChecked, setSmsConsentChecked] = useState(false);
  const [formData, setFormData] = useState({
    taxType: "",
    filingStatus: "",
    debtType: "",
    debtAmount: "",
    name: "",
    phone: "",
    email: "",
    source: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prefill = {};
    let hasAny = false;
    const paramMap = {
      name: "name",
      email: "email",
      phone: "phone",
      taxType: "taxType",
      tax_type: "taxType",
      filingStatus: "filingStatus",
      filing_status: "filingStatus",
      debtType: "debtType",
      debt_type: "debtType",
      debtAmount: "debtAmount",
      debt_amount: "debtAmount",
      debt: "debtAmount",
      state: "state",
      nid: "source",
      source: "source",
    };
    for (const [paramKey, formKey] of Object.entries(paramMap)) {
      const value = params.get(paramKey);
      if (value && String(value).trim()) {
        prefill[formKey] = String(value).trim();
        hasAny = true;
      }
    }
    if (hasAny) {
      setFormData((prev) => ({ ...prev, ...prefill }));
      if (
        prefill.taxType &&
        prefill.filingStatus &&
        prefill.debtType &&
        prefill.debtAmount
      ) {
        setStep(3);
      } else if (prefill.taxType && prefill.filingStatus) {
        setStep(2);
      }
    }
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const selectOption = (name, value) =>
    setFormData({ ...formData, [name]: value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consentChecked) return;
    setSubmitted(true);
    sendLeadForm({
      ...formData,
      consentGiven: true,
      smsConsent: smsConsentChecked,
      trustedFormCertUrl: certUrl,
      source: formData.source || "landing-qualify",
    });
    trackCustomEvent("LandingFormSubmitted", {
      source: "QualifyNow",
      has_email: !!formData.email,
      has_phone: !!formData.phone,
      debt_amount: formData.debtAmount || null,
    });
    trackStandardEvent("Lead");
    setTimeout(() => navigate("/thank-you"), 800);
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
      <div className="lp-form">
        <div className="lp-form__success">
          <i className="fas fa-check-circle"></i>
          <h3>Request Received!</h3>
          <p>A Tax Advocate Group specialist will contact you shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lp-form">
      <div className="lp-form__header">
        <span className="lp-form__badge">Free Case Evaluation</span>
        <h3>See If You Qualify for Tax Relief</h3>
      </div>

      {/* Progress */}
      <div className="lp-form__progress">
        {[1, 2, 3].map((n) => (
          <React.Fragment key={n}>
            {n > 1 && (
              <div
                className={`lp-form__progress-line ${step >= n ? "active" : ""}`}
              />
            )}
            <div
              className={`lp-form__progress-step ${step >= n ? "active" : ""}`}
            >
              {step > n ? <i className="fas fa-check"></i> : n}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="lp-form__step">
          <div className="lp-form__group">
            <label>Is this for business or individual taxes?</label>
            <div className="lp-form__pills">
              {["Individual", "Business", "Both"].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`lp-form__pill ${formData.taxType === val ? "selected" : ""}`}
                  onClick={() => selectOption("taxType", val)}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
          <div className="lp-form__group">
            <label>Filing status</label>
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
            className="lp-form__btn"
            onClick={() => setStep(2)}
            disabled={!isStep1Valid}
          >
            Continue &rarr;
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="lp-form__step">
          <div className="lp-form__group">
            <label>Is your tax debt federal, state, or both?</label>
            <div className="lp-form__pills">
              {["Federal", "State", "Both"].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`lp-form__pill ${formData.debtType === val ? "selected" : ""}`}
                  onClick={() => selectOption("debtType", val)}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
          <div className="lp-form__group">
            <label>Estimated amount owed</label>
            <div className="lp-form__pills">
              {[
                { label: "Under $10K", value: "under-10k" },
                { label: "$10K–$50K", value: "10k-50k" },
                { label: "$50K–$100K", value: "50k-100k" },
                { label: "$100K+", value: "over-100k" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`lp-form__pill ${formData.debtAmount === opt.value ? "selected" : ""}`}
                  onClick={() => selectOption("debtAmount", opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="lp-form__btn-row">
            <button
              type="button"
              className="lp-form__btn-back"
              onClick={() => setStep(1)}
            >
              &larr; Back
            </button>
            <button
              type="button"
              className="lp-form__btn"
              onClick={() => setStep(3)}
              disabled={!isStep2Valid}
            >
              Continue &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="lp-form__step">
          <div className="lp-form__group">
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
          <div className="lp-form__group">
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
          <div className="lp-form__group">
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

          {/* ── General contact consent (required) ── */}
          <div className="lp-form__group lp-form__consent">
            <label>
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                required
              />
              <span>
                By submitting this form, you expressly consent to receive
                automated and manually dialed telephone calls and prerecorded
                voice messages from Tax Advocate Group, LLC at the telephone
                number provided. Message and data rates may apply. Consent is
                not a condition of purchase.{" "}
                <Link to="/privacy-policy">Privacy Policy</Link> |{" "}
                <Link to="/terms-of-service">Terms of Service</Link>.
              </span>
            </label>
          </div>

          {/* ── SMS opt-in (optional, separate per TCR) ── */}
          <SmsOptInCheckbox
            checked={smsConsentChecked}
            onChange={(e) => setSmsConsentChecked(e.target.checked)}
            className="lp-form__sms-consent"
          />

          <div className="lp-form__btn-row">
            <button
              type="button"
              className="lp-form__btn-back"
              onClick={() => setStep(2)}
            >
              &larr; Back
            </button>
            <input {...tfInputProps} />
            <button
              type="submit"
              className="lp-form__btn lp-form__btn--submit"
              disabled={!isStep3Valid}
            >
              Get My Free Evaluation
            </button>
          </div>
        </form>
      )}

      <div className="lp-form__trust">
        <span>
          <i className="fas fa-lock"></i> Secure &amp; Confidential
        </span>
        <span>
          <i className="fas fa-check-circle"></i> No Obligation
        </span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
 *  LANDING PAGE
 * ═══════════════════════════════════════════ */
const LandingPage1 = () => {
  return (
    <div className="lp">
      <SEO
        title="Qualify Now | Free Tax Consultation | Tax Advocate Group"
        description="See if you qualify for IRS tax relief. Free consultation — resolve tax debt, stop garnishments, settle for less."
        canonical="/qualify-now"
        structuredData={[orgSchema]}
        noindex={true}
      />
      <header className="lp__topbar">
        <img
          src="/images/tax-advocate-group-logo-small.png"
          alt="Tax Advocate Group"
          className="lp__logo"
        />
        <PhoneLink rawNumber="18005171807" className="lp__phone" />
      </header>
      <section className="lp__hero">
        <div className="lp__hero-bg">
          <img src="/images/tag-landing-hero.png" alt="" aria-hidden="true" />
          <div className="lp__hero-overlay" />
        </div>
        <div className="lp__hero-inner">
          <div className="lp__hero-text">
            <h1>
              Resolve Your IRS Tax Debt —<br />
              <span className="lp__hero-accent">
                No Matter How Much You Owe
              </span>
            </h1>
            <p className="lp__hero-sub">
              Tax Advocate Group professionals have saved taxpayers over
              <strong> $300 million</strong> in tax debt with comprehensive
              resolution services.
            </p>
            <div className="lp__hero-stats">
              <div className="lp__stat">
                <span className="lp__stat-num">$300M+</span>
                <span className="lp__stat-label">Tax Debt Resolved</span>
              </div>
              <div className="lp__stat">
                <span className="lp__stat-num">5,000+</span>
                <span className="lp__stat-label">Clients Helped</span>
              </div>
              <div className="lp__stat">
                <span className="lp__stat-num">A+</span>
                <span className="lp__stat-label">BBB Rated</span>
              </div>
            </div>
          </div>
          <div className="lp__hero-form">
            <LeadForm />
          </div>
        </div>
      </section>
      <section className="lp__trust-bar">
        <div className="lp__trust-inner">
          <div className="lp__trust-item">
            <i className="fas fa-gavel"></i>
            <div>
              <strong>IRS Licensed</strong>
              <span>Enrolled Agents &amp; Tax Attorneys</span>
            </div>
          </div>
          <div className="lp__trust-item">
            <i className="fas fa-shield-alt"></i>
            <div>
              <strong>100% Guarantee</strong>
              <span>Resolution or your money back</span>
            </div>
          </div>
          <div className="lp__trust-item">
            <i className="fas fa-map-marked-alt"></i>
            <div>
              <strong>All 50 States</strong>
              <span>Nationwide tax resolution</span>
            </div>
          </div>
          <div className="lp__trust-item">
            <i className="fas fa-phone-alt"></i>
            <div>
              <strong>Free Consultation</strong>
              <span>We call the IRS with you</span>
            </div>
          </div>
        </div>
      </section>
      <section className="lp__steps">
        <h2>How It Works</h2>
        <div className="lp__steps-grid">
          <div className="lp__step">
            <div className="lp__step-num">1</div>
            <h3>Free Consultation</h3>
            <p>
              We review your tax situation and call the IRS with you to
              understand your case.
            </p>
          </div>
          <div className="lp__step">
            <div className="lp__step-num">2</div>
            <h3>Legal Representation</h3>
            <p>
              We file Power of Attorney to access your records and begin working
              your case.
            </p>
          </div>
          <div className="lp__step">
            <div className="lp__step-num">3</div>
            <h3>Resolution</h3>
            <p>
              We negotiate with the IRS to reduce your liability and establish
              the best outcome.
            </p>
          </div>
        </div>
      </section>
      <section className="lp__testimonials">
        <h2>What Our Clients Say</h2>
        <div className="lp__testimonials-grid">
          <div className="lp__testimonial">
            <div className="lp__stars">★★★★★</div>
            <p>
              "They went above and beyond to help me through my tax debt. I have
              and will continue to recommend your company to everyone."
            </p>
            <span className="lp__author">— Anedia R.</span>
          </div>
          <div className="lp__testimonial">
            <div className="lp__stars">★★★★★</div>
            <p>
              "Tax Advocate Group gave me peace of mind. They negotiated a
              payment plan and put me back in good standing with the IRS."
            </p>
            <span className="lp__author">— Samantha A.</span>
          </div>
          <div className="lp__testimonial">
            <div className="lp__stars">★★★★★</div>
            <p>
              "Thank you for negotiating my balance and getting me filed and up
              to date. I appreciate the help and quick response!"
            </p>
            <span className="lp__author">— N.S.</span>
          </div>
        </div>
      </section>
      <section className="lp__cta">
        <h2>Take the First Step Toward Tax Relief</h2>
        <p>
          Our experts are ready to help you resolve your IRS tax liability
          today.
        </p>
        <PhoneLink rawNumber="18005171807" className="lp__cta-phone" />
      </section>
      <footer className="lp__footer">
        <p>
          &copy; {new Date().getFullYear()} Tax Advocate Group &nbsp;|&nbsp;
          <Link to="/privacy-policy">Privacy Policy</Link> &nbsp;|&nbsp;
          <Link to="/terms-of-service">Terms of Service</Link>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage1;
