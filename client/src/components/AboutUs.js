import React from "react";
import { Link } from "react-router-dom";
import SEO from "./SEO";
import { orgSchema } from "../utils/structuredData";

const AboutUs = () => {
  return (
    <div className="about-page-container">
      <SEO
        title="About Us | Tax Advocate Group | Experienced Tax Professionals"
        description="Learn about Tax Advocate Group — a team of enrolled agents, tax accountants, and consultants dedicated to resolving complex tax issues for individuals and businesses."
        canonical="/about-us"
        structuredData={[orgSchema]}
      />
      {/* About Page Hero Section */}
      <section
        className="about-hero-section"
        style={{
          backgroundImage: `url("/images/contact-hero.png")`,
        }}
      >
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1 className="about-hero-title">About Us</h1>
          <nav className="breadcrumb">
            <ol>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>About Us</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Introduction */}
      <section className="about-intro">
        <h2 className="about-intro__title">
          <i className="fa fa-check-circle" aria-hidden="true"></i> Your
          Dedicated Tax Resolution Partner
        </h2>
        <p>
          Tax Advocate Group was founded on a simple principle: every taxpayer
          deserves knowledgeable, accessible representation when dealing with
          the IRS or state. Our team of enrolled agents, tax attorneys, and CPAs
          brings decades of combined experience to the table—experience that
          translates directly into results for our clients.
        </p>
        <p>
          We've built our practice around the cases other firms turn away.
          Complex multi-year liabilities, business payroll disputes, unfiled
          returns spanning a decade—these are the challenges where our team
          excels. We don't believe in cookie-cutter solutions because your tax
          situation is as unique as your financial story.
        </p>
      </section>

      {/* Our Approach */}
      <section className="about-section">
        <h2>A Methodical Approach to Tax Resolution</h2>
        <p>
          Every case at Tax Advocate Group follows a proven three-phase process
          designed to achieve the best possible outcome:
        </p>
        <ul>
          <li>
            <strong>Phase 1: Investigation</strong> – We pull your complete IRS
            transcripts, analyze your filing history, and identify every
            compliance gap before recommending a strategy.
          </li>
          <li>
            <strong>Phase 2: Compliance</strong> – Before we can negotiate, we
            ensure all returns are filed accurately. This step alone often
            reduces a client's total liability significantly.
          </li>
          <li>
            <strong>Phase 3: Resolution</strong> – Armed with complete records
            and a clear financial picture, we pursue the resolution that puts
            you in the strongest position—whether that's an Offer in Compromise,
            installment plan, penalty abatement, or currently-not-collectible
            status.
          </li>
        </ul>
      </section>

      {/* Who We Serve */}
      <section className="about-section">
        <h2>Who We Serve</h2>
        <p>
          Our clients range from individual wage earners who fell behind on
          filings to small business owners facing trust fund recovery penalties.
          Common situations we handle include:
        </p>
        <ul>
          <li>
            Individuals with <strong>unfiled returns</strong> going back
            multiple years
          </li>
          <li>
            Business owners with <strong>941 payroll tax debt</strong> and
            personal liability assessments
          </li>
          <li>
            Taxpayers facing <strong>active wage garnishments</strong> or bank
            levies who need immediate intervention
          </li>
          <li>
            Couples navigating <strong>joint liability disputes</strong> after
            separation or divorce
          </li>
          <li>
            Self-employed professionals with{" "}
            <strong>estimated tax shortfalls</strong> and mounting penalties
          </li>
        </ul>
      </section>

      {/* What Sets Us Apart */}
      <section className="about-section">
        <h2>What Sets Us Apart</h2>
        <p>
          The tax resolution industry is crowded, and many firms make promises
          they can't keep. Here's what makes Tax Advocate Group different:
        </p>
        <ul>
          <li>
            <strong>Direct IRS Communication</strong> – We file Power of
            Attorney on day one, so the IRS contacts us—not you.
          </li>
          <li>
            <strong>Transparent Pricing</strong> – You'll know the full cost
            before we start. No hidden fees, no surprise charges.
          </li>
          <li>
            <strong>Ongoing Compliance Support</strong> – After resolution, we
            offer tax preparation and monitoring to keep you in good standing.
          </li>
          <li>
            <strong>Nationwide Coverage</strong> – Licensed to practice in all
            50 states, handling both federal and state tax authorities.
          </li>
        </ul>
      </section>

      {/* Our Guarantee */}
      <section className="about-section">
        <h2>Our Commitment to You</h2>
        <p>
          We stand behind our work with a straightforward guarantee: if we
          accept your case, we will deliver a resolution. Our consultation
          process is honest and upfront—if we don't believe we can improve your
          situation, we'll tell you so and won't charge you a dime.
        </p>
        <p>
          That's the Tax Advocate Group difference. We earn our reputation one
          resolved case at a time.
        </p>
      </section>

      {/* Call to Action */}
      <section className="about-cta-section">
        <h2>Schedule Your Free Consultation</h2>
        <p className="about-cta-text">
          The first step is always a conversation. Tell us about your situation,
          and we'll lay out your options—clearly and honestly. No pressure, no
          obligation.
        </p>
        <Link to="/contact-us" className="about-cta-button">
          Start Your Case Review
        </Link>
      </section>
    </div>
  );
};

export default AboutUs;
