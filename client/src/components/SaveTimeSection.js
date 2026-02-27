import React from "react";
import { Link } from "react-router-dom";

const SaveTimeSection = () => {
  return (
    <section className="cta-banner">
      <div className="cta-banner__inner">
        <div className="cta-banner__content">
          <h2>Stop Losing Sleep Over Tax Debt</h2>
          <p>
            Whether you're facing wage garnishments, frozen accounts, or years
            of unfiled returns — we've seen it before and we know how to fix it.
            Your free consultation starts with a single call.
          </p>
          <div className="cta-banner__actions">
            <a href="tel:+18005171807" className="cta-banner__phone">
              <i className="fa-solid fa-phone" aria-hidden="true"></i>
              800-517-1807
            </a>
            <Link to="/contact-us" className="cta-banner__link">
              Or request a callback
              <i className="fas fa-arrow-right" aria-hidden="true"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaveTimeSection;
