import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import leadContext from "../context/leadContext";

const HeroSection = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { sendEmail } = useContext(leadContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    debtAmount: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    sendEmail({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: `Quick assessment - Estimated debt: ${formData.debtAmount}`,
    });
    setSubmitted(true);
    setTimeout(() => navigate("/thank-you"), 1500);
  };

  return (
    <section className="hero-container" aria-label="Tax Advocate Group introduction">
      {!isMobile ? (
        <video autoPlay muted loop playsInline className="hero-video">
          <source
            src="/images/Cover-Video-by-Shutterstock-1111048265-compressed.mp4"
            type="video/mp4"
          />
        </video>
      ) : (
        <img
          src="/images/Cover-Video-by-Shutterstock-1111048265-compressed_9.jpeg"
          alt="Tax professionals helping clients"
          className="hero-image"
          loading="eager"
        />
      )}

      <div className="hero-content">
        <div className="hero-text-side">
          <h1 className="hero-title">Tax Advocate Group</h1>
          <p className="hero-subtitle">
            <strong>Individual and Business Tax Consulting</strong>
            <br />
            We work with businesses and individuals from all over the U.S.
            providing comprehensive and tailored solutions.
          </p>
          <div className="hero-buttons">
            <Link to="/our-tax-services" className="hero-btn">
              <i className="fa-solid fa-folder" aria-hidden="true"></i> OUR TAX SERVICES
            </Link>
            <Link to="/contact-us" className="hero-btn">
              <i className="fa-solid fa-phone" aria-hidden="true"></i> FREE CONSULTATION
            </Link>
          </div>
        </div>

        <div className="hero-form-side">
          <div className="hero-inline-form">
            <h2 className="hero-form-title">Free Case Assessment</h2>
            <p className="hero-form-subtitle">Find out your options in minutes</p>
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  aria-label="Full name"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  aria-label="Phone number"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-label="Email address"
                />
                <select
                  name="debtAmount"
                  value={formData.debtAmount}
                  onChange={handleChange}
                  required
                  aria-label="Estimated tax debt"
                >
                  <option value="">Estimated Tax Debt</option>
                  <option value="<10000">Less than $10,000</option>
                  <option value="10000-25000">$10,000 - $25,000</option>
                  <option value="25000-50000">$25,000 - $50,000</option>
                  <option value="50000-100000">$50,000 - $100,000</option>
                  <option value=">100000">More than $100,000</option>
                </select>
                <button type="submit" className="hero-form-submit">
                  Get My Free Assessment
                </button>
              </form>
            ) : (
              <div className="hero-form-success">
                <i className="fas fa-check-circle" aria-hidden="true"></i>
                <p>Thank you! We'll be in touch shortly.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
