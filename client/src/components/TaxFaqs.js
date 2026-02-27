import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "./SEO";
import { faqSchema, orgSchema } from "../utils/structuredData";

const faqCategories = [
  {
    category: "About Our Firm",
    icon: "fa-solid fa-building-columns",
    faqs: [
      {
        question: "What makes Tax Advocate Group different from other tax firms?",
        answer:
          "We follow a structured three-phase process — Investigation, Compliance, and Resolution — that ensures we fully understand your situation before recommending a path forward. Our team includes enrolled agents and tax attorneys who handle cases in all 50 states, and we back our work with a money-back guarantee if we accept your case.",
      },
      {
        question: "How much does your service cost?",
        answer:
          "Our fees depend on the complexity of your case. We provide a clear, fixed-price quote after your free consultation — no hidden charges and no hourly surprises. If we don't believe we can improve your situation, we'll tell you honestly and won't charge you anything.",
      },
      {
        question: "What do I need for my free consultation?",
        answer:
          "Just your most recent IRS notice (if you have one) and a general idea of the tax years involved. We handle the rest — including pulling your IRS transcripts. Call us at 1-800-517-1807 or fill out the form on our Contact page to get started.",
      },
    ],
  },
  {
    category: "The Resolution Process",
    icon: "fa-solid fa-list-check",
    faqs: [
      {
        question: "How does your tax resolution process work?",
        answer:
          "We start by filing Power of Attorney so we can pull your IRS transcripts and assess your full tax picture. Next, we bring all unfiled returns current — this compliance step often reduces what you owe. Finally, we negotiate the best available resolution: an installment agreement, Offer in Compromise, penalty abatement, or Currently Not Collectible status, depending on your circumstances.",
      },
      {
        question: "How long does it typically take to resolve my case?",
        answer:
          "Straightforward cases like installment agreements can be set up in 30–60 days. More complex matters — Offers in Compromise, audit reconsiderations, or multi-year compliance projects — may take 4–8 months. During your free consultation, we'll give you a realistic timeline based on your specific situation.",
      },
    ],
  },
  {
    category: "Common Tax Issues",
    icon: "fa-solid fa-triangle-exclamation",
    faqs: [
      {
        question: "What if I haven't filed taxes in several years?",
        answer:
          "Unfiled returns are one of the most common issues we handle. The IRS may have filed substitute returns on your behalf that overstate your liability. We prepare accurate returns for each missing year, which frequently lowers the total balance owed and opens the door to resolution options that weren't previously available.",
      },
      {
        question: "Can you stop a wage garnishment or bank levy that's already active?",
        answer:
          "Yes, and quickly. Once we file Power of Attorney, we contact the IRS or state agency to request an immediate release or reduction of the levy. In many cases, we can get garnishments stopped within days by demonstrating financial hardship or proposing an alternative collection arrangement.",
      },
      {
        question: "Do you handle state tax problems in addition to federal?",
        answer:
          "Yes. We work with all 50 state tax authorities in addition to the IRS. State agencies often have their own garnishment and lien procedures, and we know how to navigate each one. Visit our State Tax Guide for details on your state's tax authority and resolution options.",
      },
      {
        question: "What is an Offer in Compromise, and will I qualify?",
        answer:
          "An Offer in Compromise (OIC) lets you settle your IRS debt for less than you owe. Qualification depends on your income, expenses, assets, and ability to pay. The IRS uses a specific formula to evaluate offers. We analyze your financials against this formula during your consultation so you'll know upfront whether an OIC is a realistic option for you.",
      },
    ],
  },
];

const TaxFaqs = () => {
  const [openKey, setOpenKey] = useState(null);

  const toggleFAQ = (key) => {
    setOpenKey(openKey === key ? null : key);
  };

  return (
    <div className="faq-page">
      <SEO
        title="Tax FAQs | Common Tax Questions Answered | Tax Advocate Group"
        description="Get answers to common tax questions about IRS resolution, offers in compromise, installment plans, penalty abatement, and more from Tax Advocate Group."
        canonical="/tax-faqs"
        structuredData={[orgSchema, faqSchema]}
      />

      {/* Compact Header */}
      <section className="faq-page__hero">
        <div className="faq-page__hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li>Tax FAQs</li>
            </ol>
          </nav>
          <h1>Frequently Asked Questions</h1>
          <p>
            Answers to the questions we hear most from taxpayers across the
            country. Don't see yours?{" "}
            <Link to="/contact-us">Ask us directly</Link> — consultations are
            always free.
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="faq-page__body">
        <div className="faq-page__categories">
          {faqCategories.map((cat, ci) => (
            <div key={ci} className="faq-cat">
              <div className="faq-cat__header">
                <i className={cat.icon} aria-hidden="true"></i>
                <h2>{cat.category}</h2>
              </div>

              <div className="faq-cat__list">
                {cat.faqs.map((faq, fi) => {
                  const key = `${ci}-${fi}`;
                  const isOpen = openKey === key;
                  return (
                    <div
                      key={key}
                      className={`faq-cat__item ${isOpen ? "faq-cat__item--open" : ""}`}
                    >
                      <button
                        className="faq-cat__question"
                        onClick={() => toggleFAQ(key)}
                        aria-expanded={isOpen}
                      >
                        <span>{faq.question}</span>
                        <i
                          className={`fas fa-chevron-${isOpen ? "up" : "down"}`}
                          aria-hidden="true"
                        ></i>
                      </button>
                      {isOpen && (
                        <div className="faq-cat__answer">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="faq-page__cta">
        <div className="faq-page__cta-inner">
          <h2>Still have questions?</h2>
          <p>
            Every tax situation is unique. Talk to one of our specialists
            for advice tailored to yours — no cost, no obligation.
          </p>
          <div className="faq-page__cta-actions">
            <a href="tel:+18005171807" className="faq-page__cta-phone">
              <i className="fa-solid fa-phone" aria-hidden="true"></i>
              Call 800-517-1807
            </a>
            <Link to="/contact-us" className="faq-page__cta-link">
              Request a Callback
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TaxFaqs;
