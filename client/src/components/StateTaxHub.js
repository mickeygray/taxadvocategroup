import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "./SEO";
import { orgSchema } from "../utils/structuredData";
import stateData from "../data/stateData";
import PhoneLink from "./PhoneLink";

const StateTaxHub = () => {
  const [filter, setFilter] = useState("");

  const noIncomeTax = stateData.filter((s) => s.incomeType === "none").length;
  const withIncomeTax = stateData.length - noIncomeTax;
  const hardStates = stateData.filter((s) => s.difficulty === "hard").length;

  // Group A-Z
  const grouped = stateData.reduce((acc, s) => {
    const letter = s.name[0];
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(s);
    return acc;
  }, {});

  // Filter
  const filteredStates = filter
    ? stateData.filter(
        (s) =>
          s.name.toLowerCase().includes(filter.toLowerCase()) ||
          s.abbreviation.toLowerCase().includes(filter.toLowerCase()),
      )
    : null;

  return (
    <div className="state-hub">
      <SEO
        title="State Tax Guide | Tax Relief in All 50 States | Tax Advocate Group"
        description="Comprehensive guide to tax relief in every U.S. state. Find your state's tax authority, resolution options, and how Tax Advocate Group can help."
        canonical="/state-tax-guide"
        structuredData={[orgSchema]}
      />

      {/* ─── HERO ─── */}
      <section className="state-hub__hero">
        <div className="state-hub__hero-inner">
          <h1>State Tax Relief Guide</h1>
          <p className="state-hub__subtitle">
            Select your state to see tax authority info, resolution options, and
            how we can help.
          </p>

          {/* Search filter */}
          <div className="state-hub__search">
            <i className="fas fa-search" aria-hidden="true"></i>
            <input
              type="text"
              placeholder="Search by state name or abbreviation..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter states"
            />
          </div>

          {/* Quick grid for filtered results */}
          {filteredStates && (
            <div className="state-hub__quick-grid">
              {filteredStates.length === 0 ? (
                <p className="state-hub__no-results">No matching states found.</p>
              ) : (
                filteredStates.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/state-tax-guide/${s.slug}`}
                    className="state-hub__quick-card"
                  >
                    <span className="state-hub__quick-abbr">{s.abbreviation}</span>
                    <span>{s.name}</span>
                    {s.incomeType === "none" && (
                      <span className="state-hub__badge--none">No Income Tax</span>
                    )}
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="state-hub__stats">
        <div className="state-hub__stats-inner">
          <div className="state-hub__stat">
            <span className="state-hub__stat-num">50</span>
            <span className="state-hub__stat-label">States Covered</span>
          </div>
          <div className="state-hub__stat">
            <span className="state-hub__stat-num">{withIncomeTax}</span>
            <span className="state-hub__stat-label">States With Income Tax</span>
          </div>
          <div className="state-hub__stat">
            <span className="state-hub__stat-num">{noIncomeTax}</span>
            <span className="state-hub__stat-label">No Income Tax</span>
          </div>
          <div className="state-hub__stat">
            <span className="state-hub__stat-num">{hardStates}</span>
            <span className="state-hub__stat-label">High-Difficulty States</span>
          </div>
        </div>
      </section>

      {/* ─── A-Z DIRECTORY ─── */}
      {!filter && (
        <section className="state-hub__directory">
          <div className="state-hub__directory-inner">
            <h2>Browse by State</h2>
            <div className="state-hub__az">
              {Object.entries(grouped)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([letter, states]) => (
                  <div key={letter} className="state-hub__letter-group">
                    <h3 className="state-hub__letter">{letter}</h3>
                    <ul>
                      {states.map((s) => (
                        <li key={s.slug}>
                          <Link to={`/state-tax-guide/${s.slug}`}>
                            <span className="state-hub__abbr">{s.abbreviation}</span>
                            {s.name}
                            {s.incomeType === "none" && (
                              <span className="state-hub__badge--none">
                                No Income Tax
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="state-hub__cta">
        <div className="state-hub__cta-inner">
          <h2>Need Help With State or Federal Taxes?</h2>
          <p>We resolve tax problems in all 50 states — IRS and state level.</p>
          <div className="state-hub__cta-buttons">
            <PhoneLink rawNumber="18005171807" className="btn btn--phone" />
            <Link to="/contact-us" className="btn btn--primary">
              Free Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StateTaxHub;
