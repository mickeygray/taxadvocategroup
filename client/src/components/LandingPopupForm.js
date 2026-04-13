import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import leadContext from "../context/leadContext";

const LandingPopupForm = ({ onClose }) => {
  const navigate = useNavigate();
  const { sendEmail } = useContext(leadContext);
  const [step, setStep] = useState(1);
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

    sendEmail({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `Popup form — Debt: ${formData.debtAmount}, Filed: ${formData.filedAllTaxes}, Best time: ${formData.bestTime || "Any"}`,
    });
    onClose();
    navigate("/thank-you");
  };

  return (
    <div className="landing-popup-overlay" role="dialog" aria-modal="true">
      <div className="landing-popup-form">
        <button
          className="landing-popup-close"
          onClick={onClose}
          aria-label="Close form"
        >
          &#10005;
        </button>
        {step === 1 && (
          <form onSubmit={(e) => e.preventDefault()}>
            <h2>How much do you owe?</h2>
            <select
              name="debtAmount"
              value={formData.debtAmount}
              onChange={handleChange}
              required
              aria-label="Estimated tax debt"
            >
              <option value="">Select an amount</option>
              <option value="<10000">Less than $10,000</option>
              <option value="10000-25000">$10,000 – $25,000</option>
              <option value="25000-50000">$25,000 – $50,000</option>
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
              disabled={!formData.debtAmount || !formData.filedAllTaxes}
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

            <div className="landing-popup-consent">
              <label className="consent-checkbox">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  required
                />
                <span className="consent-text">
                  By submitting this form, you expressly consent to receive
                  automated and manually dialed telephone calls, prerecorded
                  voice messages, and SMS/MMS text messages from Tax Advocate
                  Group, LLC and its representatives at the telephone number you
                  have provided. During your initial inquiry period, you may
                  receive up to five (5) text messages related to your tax
                  matter, consultation scheduling, and case evaluation
                  follow-up. Following enrollment as an active client, you may
                  receive no more than one (1) text message per calendar month
                  for purposes including but not limited to document request
                  notifications, scheduled payment reminders, and case status
                  updates. Message and data rates may apply depending on your
                  mobile carrier and service plan. Message frequency varies. You
                  may opt out of text communications at any time by replying
                  STOP to any message; reply HELP for assistance. Consent is not
                  a condition of purchase. View our{" "}
                  <Link to="/privacy-policy">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="landing-popup-submit"
              disabled={!consentChecked}
            >
              Get Free Consultation
            </button>
            <button
              type="button"
              className="landing-popup-back"
              onClick={() => setStep(1)}
            >
              &#8592; Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LandingPopupForm;
