import React from "react";
import { Link } from "react-router-dom";
// Ensure you have a separate CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Menu Links */}
        <div className="footer-column">
          <h4>Menu Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/our-tax-services">Services</Link>
            </li>
            <li>
              <Link to="/tax-faqs">Tax FAQs</Link>
            </li>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
            <li>
              <Link to="/tax-news">Tax News</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Logo & Address */}
        <div className="footer-column center">
          <img
            src="/images/tax-advocate-group-logo-small.png"
            alt="Tax Advocate Group Logo"
            className="footer-logo"
          />
          <p>
            <strong>Tax Advocate Group</strong>
          </p>
          <p>21625 Prairie Street, Suite #200</p>
          <p>Chatsworth, CA 91331</p>
          <p>
            <i className="fa-solid fa-phone"></i>
            {"   "} 800-517-1807
          </p>
        </div>

        {/* Column 4: Recent Posts */}
        <div className="footer-column">
          <h4>Recent Posts</h4>
          <ul>
            {" "}
            <li>
              <a href="/tax-news/irs-cp501-notice-guide">
                IRS Notice CP 501 - What does it means?
              </a>
            </li>
            <li>
              <a href="/tax-news/tax-advocate-bill-of-rights">
                Your Rights as a Taxpayer and How We Embody Them
              </a>
            </li>
            <li>
              <a href="/tax-news/understanding-tax-relief">
                Understanding Tax Relief: Solutions to Ease Your Financial
                Burden
              </a>
            </li>
            <li>
              <a href="/tax-news/irs-negotiation-tips">
                Tax Resolution Truth: How to Really Negotiate with the IRS
              </a>
            </li>
            <li>
              <a href="/tax-news/irs-wage-garnishment-guide">
                IRS Wage Garnishment: What It Is and How To Stop It
              </a>
            </li>{" "}
            <li>
              <a href="/tax-news/irs-bank-levy-guide">
                Bank Levy: What It Means When the IRS Freezes Your Account
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <div className="footer-bottom">
        <p className="footer-disclaimer">
          By clicking “SUBSCRIBE” or “SUBMIT,” I agree to be contacted by Tax
          Advocate Group and its affiliates via prerecorded and/or telemarketing
          calls and/or SMS/MMS text messages...
        </p>
        <p className="footer-copyright">
          © 2025 Tax Advocate Group, LLC. All Rights Reserved. |
          <Link to="/privacy-policy"> Privacy Policy</Link> |
          <Link to="/terms-of-service"> Terms of Service</Link> |
        </p>
      </div>
    </footer>
  );
};

export default Footer;
