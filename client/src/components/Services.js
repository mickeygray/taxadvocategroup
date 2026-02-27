import React from "react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: "fa-solid fa-shield-halved",
    title: "Tax Relief",
    description:
      "Reduce your tax burden through legitimate deductions, credits, and settlement programs. We find every dollar you're entitled to keep.",
    link: "/tax-relief",
  },
  {
    icon: "fa-solid fa-handshake",
    title: "Tax Resolution",
    description:
      "Resolve unpaid taxes, audits, liens, and levies. We negotiate directly with the IRS and state agencies on your behalf.",
    link: "/tax-resolution",
  },
  {
    icon: "fa-solid fa-scale-balanced",
    title: "Tax Negotiation",
    description:
      "Secure reduced payments, extended deadlines, or Offers in Compromise. Our enrolled agents know what the IRS will accept.",
    link: "/tax-negotiation",
  },
  {
    icon: "fa-solid fa-lock",
    title: "Protection Plans",
    description:
      "Safeguard against future tax issues with proactive planning, compliance monitoring, and ongoing professional support.",
    link: "/tax-protection-plans",
  },
];

const Services = () => {
  return (
    <section className="services-v2">
      <div className="services-v2__inner">
        <div className="services-v2__header">
          <span className="section-label">What We Do</span>
          <h2>Business and Personal Tax Services</h2>
          <p>
            We shoulder the work and guide your situation to a positive
            resolution — keeping you informed every step of the way.
          </p>
        </div>

        <div className="services-v2__grid">
          {services.map((service, index) => (
            <Link
              to={service.link}
              key={index}
              className="services-v2__card"
            >
              <div className="services-v2__icon">
                <i className={service.icon} aria-hidden="true"></i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="services-v2__link">
                Learn more <i className="fas fa-arrow-right" aria-hidden="true"></i>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
