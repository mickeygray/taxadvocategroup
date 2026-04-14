import React, { useContext, useState } from "react";
import leadContext from "../context/leadContext";
import PhoneLink from "./PhoneLink";
import SEO from "./SEO";
import { Link } from "react-router-dom";
import { orgSchema } from "../utils/structuredData";
import { useTrustedForm } from "../hooks/useTrustedForm";
import SmsOptInCheckbox from "./SmsOptInCheckBox";

const ContactUs = () => {
  const { sendEmail } = useContext(leadContext);
  const { certUrl, inputProps: tfInputProps } = useTrustedForm();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [consentChecked, setConsentChecked] = useState(false);
  const [smsConsentChecked, setSmsConsentChecked] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailPayload = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      trustedFormCertUrl: certUrl,
      smsConsent: smsConsentChecked,
    };

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    });
    sendEmail(emailPayload);
  };

  return (
    <div>
      <SEO
        title="Contact Us | Free Tax Consultation | Tax Advocate Group"
        description="Contact Tax Advocate Group for a free tax consultation. Call 1-800-517-1807 or fill out our form. We resolve IRS tax issues for individuals and businesses."
        canonical="/contact-us"
        structuredData={[orgSchema]}
      />
      {/* Hero Section */}
      <section
        className="contact-hero"
        style={{ backgroundImage: `url("/images/contact-hero.png")` }}
      >
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <h1>Contact Us</h1>
          <nav className="contact-breadcrumbs">
            <a href="/">Home</a> <span>/</span> <span>Contact Us</span>
          </nav>
        </div>
      </section>

      {/* Floating Contact Info Boxes */}
      <div className="contact-info-container">
        <div className="contact-info-box">
          <i className="fas fa-phone-alt"></i>
          <h3>Contacts</h3>
          <p>
            <PhoneLink rawNumber="18005171807" />
          </p>
          <p>
            <a href="mailto:inquiry@taxadvocategroup.com">
              inquiry@taxadvocategroup.com
            </a>
          </p>
        </div>
        <div className="contact-info-box">
          <i className="fas fa-home"></i>
          <h3>Address</h3>
          <p>21625 Prairie Street, Suite #200</p>
          <p>Chatsworth, CA 91311</p>
        </div>
        <div className="contact-info-box">
          <i className="fas fa-business-time"></i>
          <h3>Business Hours</h3>
          <p>
            <strong>Mon to Fri:</strong> 7:00 AM – 5:00 PM
          </p>
          <p>
            <strong>Sat &amp; Sun:</strong> Closed
          </p>
        </div>
      </div>

      {/* Form and Image Section */}
      <div className="contact-form-container">
        <div className="contact-form">
          <h3>Send Us a Message</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input {...tfInputProps} />
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <textarea
              name="message"
              placeholder="Your Message"
              required
              value={formData.message}
              onChange={handleChange}
            ></textarea>

            {/* ── General contact consent (required) ── */}
            <div className="form-group form-consent">
              <label className="consent-checkbox">
                <input
                  type="checkbox"
                  required
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  checked={consentChecked}
                />
                <span className="consent-text">
                  By submitting this form, you expressly consent to receive
                  automated and manually dialed telephone calls and prerecorded
                  voice messages from Tax Advocate Group, LLC at the telephone
                  number provided. Message and data rates may apply. Consent is
                  not a condition of purchase. View our{" "}
                  <Link to="/privacy-policy">Privacy Policy</Link> and{" "}
                  <Link to="/terms-of-service">Terms of Service</Link>.
                </span>
              </label>
            </div>

            {/* ── SMS opt-in (optional, separate per TCR) ── */}
            <SmsOptInCheckbox
              checked={smsConsentChecked}
              onChange={(e) => setSmsConsentChecked(e.target.checked)}
            />

            <button type="submit" disabled={!consentChecked}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
