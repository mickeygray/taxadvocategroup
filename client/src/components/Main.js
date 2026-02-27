import React from "react";
import { Link } from "react-router-dom";

const Main = () => {
  return (
    <main className="main-container">
      {/* Metrics Bar */}
      <section className="metrics-bar">
        <div className="metrics-bar__inner">
          <div className="metrics-bar__item">
            <span className="metrics-bar__number">$300M+</span>
            <span className="metrics-bar__label">Tax Debt Resolved</span>
          </div>
          <div className="metrics-bar__divider" />
          <div className="metrics-bar__item">
            <span className="metrics-bar__number">50</span>
            <span className="metrics-bar__label">States Served</span>
          </div>
          <div className="metrics-bar__divider" />
          <div className="metrics-bar__item">
            <span className="metrics-bar__number">A+</span>
            <span className="metrics-bar__label">BBB Rating</span>
          </div>
          <div className="metrics-bar__divider" />
          <div className="metrics-bar__item">
            <span className="metrics-bar__number">15+</span>
            <span className="metrics-bar__label">Years Experience</span>
          </div>
        </div>
      </section>

      {/* How We Work — Process Section */}
      <section className="process-section">
        <div className="process-section__inner">
          <div className="process-section__header">
            <span className="section-label">Our Approach</span>
            <h2>Three Phases to Tax Freedom</h2>
            <p>
              Every case follows our proven process. We handle the complexity so
              you can focus on moving forward.
            </p>
          </div>

          <div className="process-grid">
            <div className="process-card">
              <div className="process-card__number">01</div>
              <div className="process-card__content">
                <h3>Investigation</h3>
                <p>
                  We file Power of Attorney and pull your IRS transcripts to get
                  the full picture — what you owe, why, and what options are on
                  the table. No guesswork.
                </p>
              </div>
            </div>

            <div className="process-card">
              <div className="process-card__number">02</div>
              <div className="process-card__content">
                <h3>Compliance</h3>
                <p>
                  Unfiled returns get filed. Incorrect assessments get corrected.
                  This step alone often reduces your total balance and unlocks
                  resolution paths that weren't available before.
                </p>
              </div>
            </div>

            <div className="process-card">
              <div className="process-card__number">03</div>
              <div className="process-card__content">
                <h3>Resolution</h3>
                <p>
                  We negotiate the strongest outcome for your situation — whether
                  that's an Offer in Compromise, installment plan, penalty
                  abatement, or Currently Not Collectible status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="home-about">
        <div className="home-about__inner">
          <div className="home-about__text">
            <span className="section-label">Who We Are</span>
            <h2>Enrolled Agents. Forensic Accountants. Your Advocates.</h2>
            <p>
              Tax Advocate Group is a team of licensed professionals who
              specialize in resolving complex tax issues for individuals and
              businesses. We've built our reputation on strategic,
              results-driven consulting — not cookie-cutter solutions.
            </p>
            <p>
              For businesses, we handle entity formation, payroll setup,
              quarterly filings, and ongoing compliance. For individuals, we
              intervene on wage garnishments, frozen accounts, and mounting
              collection pressure — fast.
            </p>
            <Link to="/contact-us" className="home-about__cta">
              Talk to a Specialist
              <i className="fas fa-arrow-right" aria-hidden="true"></i>
            </Link>
          </div>
          <div className="home-about__image">
            <img
              src="/images/TAG-Home-Page-Image-1.png"
              alt="Tax Advocate Group team"
            />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-strip">
        <div className="trust-strip__inner">
          <img
            src="/images/bbb-accredited-business.png"
            alt="BBB Accredited Business"
            className="trust-strip__badge"
          />
          <img
            src="/images/trust-builder-supermoney.png"
            alt="SuperMoney Best Rated Firm"
            className="trust-strip__badge"
          />
          <img
            src="/images/trust-builder-IRS-power-of-atty-1.png"
            alt="IRS Power of Attorney"
            className="trust-strip__badge"
          />
          <img
            src="/images/trust-builder-IRS-Provider.png"
            alt="Approved IRS Provider"
            className="trust-strip__badge"
          />
        </div>
      </section>
    </main>
  );
};

export default Main;
