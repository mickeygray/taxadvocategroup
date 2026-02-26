import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "./SEO";
import { faqSchema, orgSchema } from "../utils/structuredData";

const faqs = [
  {
    question: "What makes Tax Advocate Group different from other tax firms?",
    answer:
      "We follow a structured three-phase process—Investigation, Compliance, and Resolution—that ensures we fully understand your situation before recommending a path forward. Our team includes enrolled agents and tax attorneys who handle cases in all 50 states, and we back our work with a money-back guarantee if we accept your case.",
  },
  {
    question: "How does your tax resolution process work?",
    answer:
      "We start by filing Power of Attorney so we can pull your IRS transcripts and assess your full tax picture. Next, we bring all unfiled returns current—this compliance step often reduces what you owe. Finally, we negotiate the best available resolution: an installment agreement, Offer in Compromise, penalty abatement, or Currently Not Collectible status, depending on your circumstances.",
  },
  {
    question: "What if I haven’t filed taxes in several years?",
    answer:
      "Unfiled returns are one of the most common issues we handle. The IRS may have filed substitute returns on your behalf that overstate your liability. We prepare accurate returns for each missing year, which frequently lowers the total balance owed and opens the door to resolution options that weren’t previously available.",
  },
  {
    question: "How long does it typically take to resolve my case?",
    answer:
      "Straightforward cases like installment agreements can be set up in 30–60 days. More complex matters—Offers in Compromise, audit reconsiderations, or multi-year compliance projects—may take 4–8 months. During your free consultation, we’ll give you a realistic timeline based on your specific situation.",
  },
  {
    question: "Do you handle state tax problems in addition to federal?",
    answer:
      "Yes. We work with all 50 state tax authorities in addition to the IRS. State agencies often have their own garnishment and lien procedures, and we know how to navigate each one. Visit our State Tax Guide for details on your state’s tax authority and resolution options.",
  },
  {
    question: "What is an Offer in Compromise, and will I qualify?",
    answer:
      "An Offer in Compromise (OIC) lets you settle your IRS debt for less than you owe. Qualification depends on your income, expenses, assets, and ability to pay. The IRS uses a specific formula to evaluate offers. We analyze your financials against this formula during your consultation so you’ll know upfront whether an OIC is a realistic option for you.",
  },
  {
    question: "Can you stop a wage garnishment or bank levy that’s already active?",
    answer:
      "Yes, and quickly. Once we file Power of Attorney, we contact the IRS or state agency to request an immediate release or reduction of the levy. In many cases, we can get garnishments stopped within days by demonstrating financial hardship or proposing an alternative collection arrangement.",
  },
  {
    question: "How much does your service cost?",
    answer:
      "Our fees depend on the complexity of your case. We provide a clear, fixed-price quote after your free consultation—no hidden charges and no hourly surprises. If we don’t believe we can improve your situation, we’ll tell you honestly and won’t charge you anything.",
  },
  {
    question: "What do I need for my free consultation?",
    answer:
      "Just your most recent IRS notice (if you have one) and a general idea of the tax years involved. We handle the rest—including pulling your IRS transcripts. Call us at 1-800-517-1807 or fill out the form on our Contact page to get started.",
  },
];

const TaxFaqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="tax-faqs-page">
      <SEO
        title="Tax FAQs | Common Tax Questions Answered | Tax Advocate Group"
        description="Get answers to common tax questions about IRS resolution, offers in compromise, installment plans, penalty abatement, and more from Tax Advocate Group."
        canonical="/tax-faqs"
        structuredData={[orgSchema, faqSchema]}
      />
      {/* Hero Section */}
      <section
        className="faq-hero-section"
        aria-label="Page Title Bar"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/hero-2.png)`,
        }}
      >
        <div className="faq-hero-content">
          <h1 className="faq-hero-title">Tax FAQs</h1>
          <nav className="breadcrumb">
            <ol>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>Tax FAQs</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* FAQ Section */}
      <div className="faq-container">
        <div className="faq-section">
          <h2 className="faq-header">Frequently Asked Questions</h2>
          <p className="faq-description">
            We hear these questions every day from taxpayers across the country.
            If you don’t find what you’re looking for below,{" "}
            <Link to="/contact-us">reach out to our team</Link> for a free,
            no-obligation consultation.
          </p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "open" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <h3>
                <i className="fa fa-question-circle" aria-hidden="true"></i>{" "}
                {faq.question}
                <span className="toggle-icon">
                  {openIndex === index ? "−" : "+"}
                </span>
              </h3>
              {openIndex === index && (
                <p className="faq-answer">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="faq-contact">
        <h3>Still have questions?</h3>
        <p>
          Contact us for a personalized consultation. Our experts are here to
          help you navigate your tax challenges.
        </p>
        <Link to="/contact-us" className="contact-button">
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default TaxFaqs;
