import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import SEO from "./SEO";
import { orgSchema, statePageSchema } from "../utils/structuredData";
import stateData, { getStateBySlug } from "../data/stateData";
import StateTaxForm from "./StateTaxForm";
import PhoneLink from "./PhoneLink";

const difficultyMeta = {
  easy: { label: "Low Difficulty", className: "badge--easy" },
  moderate: { label: "Moderate Difficulty", className: "badge--moderate" },
  hard: { label: "High Difficulty", className: "badge--hard" },
  none: { label: "No Income Tax", className: "badge--none" },
};

const Section = ({ show, title, children, className = "" }) =>
  show ? (
    <section className={`stp__section ${className}`}>
      <h2>{title}</h2>
      {children}
    </section>
  ) : null;

const InfoPill = ({ icon, label, value, href }) => (
  <div className="stp__pill">
    <i className={`fas ${icon}`} aria-hidden="true"></i>
    <div>
      <span className="stp__pill-label">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="stp__pill-value"
        >
          {value} <i className="fas fa-external-link-alt" aria-hidden="true"></i>
        </a>
      ) : (
        <span className="stp__pill-value">{value}</span>
      )}
    </div>
  </div>
);

const StateTaxPage = () => {
  const { stateSlug } = useParams();
  const state = getStateBySlug(stateSlug);

  if (!state) return <Navigate to="/state-tax-guide" replace />;

  const diff = difficultyMeta[state.difficulty] || difficultyMeta.moderate;
  const hasResolutionData =
    state.oic || state.installmentAgreement || state.garnishment;
  const incomeDisplay =
    state.incomeType === "none"
      ? "No State Income Tax"
      : `${state.incomeTaxRange} (${state.incomeType})`;

  const schema = statePageSchema
    ? [orgSchema, statePageSchema(state)]
    : [orgSchema];

  return (
    <div className="state-tax-page">
      <SEO
        title={`${state.name} Tax Relief | ${state.abbreviation} Tax Help | Tax Advocate Group`}
        description={
          state.summary ||
          `Get tax relief help in ${state.name}. Learn about the ${state.taxAuthority}, resolution options, and how Tax Advocate Group resolves ${state.abbreviation} tax problems.`
        }
        canonical={`/state-tax-guide/${state.slug}`}
        structuredData={schema}
      />

      {/* HERO */}
      <section className="stp__hero">
        <div className="stp__hero-inner">
          <div className="stp__hero-left">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <ol>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/state-tax-guide">State Tax Guide</Link>
                </li>
                <li aria-current="page">{state.name}</li>
              </ol>
            </nav>
            <h1>
              <span className="stp__hero-abbr">{state.abbreviation}</span>
              {state.name} Tax Relief
            </h1>
            <span className={`stp__badge ${diff.className}`}>{diff.label}</span>
            <p className="stp__hero-sub">
              {state.incomeType === "none"
                ? `${state.name} has no state income tax, but residents may still face federal tax issues and other state-level obligations.`
                : `The ${state.taxAuthority} enforces ${state.incomeType} income tax rates of ${state.incomeTaxRange}.${state.hasStateLevyPower ? " They have independent authority to levy, garnish wages, and place liens." : ""}`}
            </p>
          </div>
          <div className="stp__hero-form">
            <StateTaxForm
              stateName={state.name}
              stateAbbr={state.abbreviation}
              taxAuthority={state.taxAuthority}
            />
          </div>
        </div>
      </section>

      {/* QUICK INFO PILLS */}
      <section className="stp__pills">
        <div className="stp__pills-inner">
          <InfoPill
            icon="fa-landmark"
            label="Tax Authority"
            value={state.taxAuthority}
            href={state.taxAuthorityUrl}
          />
          {state.phone && (
            <InfoPill
              icon="fa-phone-alt"
              label="Phone"
              value={state.phone}
              href={`tel:${state.phone.replace(/[^+\d]/g, "")}`}
            />
          )}
          <InfoPill
            icon="fa-percentage"
            label="Income Tax"
            value={incomeDisplay}
          />
          <InfoPill
            icon="fa-shopping-cart"
            label="Sales Tax"
            value={state.salesTaxRange}
          />
          {state.statute && (
            <InfoPill
              icon="fa-hourglass-half"
              label="Collection Statute"
              value={state.statute}
            />
          )}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="stp__main">
        <div className="stp__main-inner">
          <Section show={!!state.summary} title={`Tax Overview: ${state.name}`}>
            <p>{state.summary}</p>
          </Section>

          <Section show={state.keyFacts?.length > 0} title="Key Tax Facts">
            <ul className="stp__fact-list">
              {state.keyFacts?.map((fact, i) => (
                <li key={i}>
                  <i className="fas fa-check-circle" aria-hidden="true"></i>
                  {fact}
                </li>
              ))}
            </ul>
          </Section>

          <Section
            show={state.commonIssues?.length > 0}
            title="Common Tax Issues"
          >
            <div className="stp__issues">
              {state.commonIssues?.map((issue, i) => (
                <div key={i} className="stp__issue">
                  <span className="stp__issue-num">{i + 1}</span>
                  <p>{issue}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Resolution Options */}
          {hasResolutionData && (
            <div className="stp__resolution">
              <h2>Resolution Options in {state.name}</h2>

              {state.installmentAgreement && (
                <div className="stp__res-card">
                  <div className="stp__res-card-header">
                    <i className="fas fa-calendar-alt" aria-hidden="true"></i>
                    <h3>Payment Plans (Installment Agreements)</h3>
                  </div>
                  <div className="stp__res-card-body">
                    {state.installmentAgreement.maxMonthsNoFinancials > 0 && (
                      <p>
                        <strong>Without financials:</strong> Up to{" "}
                        {state.installmentAgreement.maxMonthsNoFinancials} months
                      </p>
                    )}
                    {state.installmentAgreement.maxMonthsWithFinancials > 0 && (
                      <p>
                        <strong>With financials:</strong> Up to{" "}
                        {state.installmentAgreement.maxMonthsWithFinancials} months
                      </p>
                    )}
                    {state.installmentAgreement.notes && (
                      <p className="stp__res-notes">
                        {state.installmentAgreement.notes}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {state.oic && (
                <div className="stp__res-card">
                  <div className="stp__res-card-header">
                    <i className="fas fa-handshake" aria-hidden="true"></i>
                    <h3>Offer in Compromise (OIC)</h3>
                  </div>
                  <div className="stp__res-card-body">
                    <p>
                      <strong>Available:</strong>{" "}
                      {state.oic.available ? "Yes" : "No"}
                    </p>
                    {state.oic.available && state.oic.stopsCollections && (
                      <p className="stp__res-good">
                        <i className="fas fa-shield-alt" aria-hidden="true"></i> Stops
                        collections while pending
                      </p>
                    )}
                    {state.oic.available && !state.oic.stopsCollections && (
                      <p className="stp__res-warn">
                        <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>{" "}
                        Does NOT stop collections while pending
                      </p>
                    )}
                    {state.oic.formNumber && (
                      <p>
                        <strong>Form:</strong> {state.oic.formNumber}
                      </p>
                    )}
                    {state.oic.notes && (
                      <p className="stp__res-notes">{state.oic.notes}</p>
                    )}
                  </div>
                </div>
              )}

              {state.garnishment && (
                <div className="stp__res-card">
                  <div className="stp__res-card-header">
                    <i className="fas fa-money-check-alt" aria-hidden="true"></i>
                    <h3>Wage Garnishment</h3>
                  </div>
                  <div className="stp__res-card-body">
                    {state.garnishment.percentage && (
                      <p>
                        <strong>Rate:</strong> {state.garnishment.percentage}
                      </p>
                    )}
                    <p>
                      <strong>Can lift with payment plan:</strong>{" "}
                      {state.garnishment.canLift ? (
                        <span className="stp__res-yes">Yes</span>
                      ) : (
                        <span className="stp__res-no">No</span>
                      )}
                    </p>
                    <p>
                      <strong>Can reduce amount:</strong>{" "}
                      {state.garnishment.canReduce ? (
                        <span className="stp__res-yes">Yes</span>
                      ) : (
                        <span className="stp__res-no">No</span>
                      )}
                    </p>
                    {state.garnishment.notes && (
                      <p className="stp__res-notes">{state.garnishment.notes}</p>
                    )}
                  </div>
                </div>
              )}

              {state.penaltyAbatement?.available && (
                <div className="stp__res-card">
                  <div className="stp__res-card-header">
                    <i className="fas fa-eraser" aria-hidden="true"></i>
                    <h3>Penalty Abatement</h3>
                  </div>
                  <div className="stp__res-card-body">
                    <p>
                      <strong>Available:</strong> Yes
                    </p>
                    {state.penaltyAbatement.notes && (
                      <p className="stp__res-notes">
                        {state.penaltyAbatement.notes}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {state.bankLevy && (
                <div className="stp__res-card">
                  <div className="stp__res-card-header">
                    <i className="fas fa-university" aria-hidden="true"></i>
                    <h3>Bank Levy</h3>
                  </div>
                  <div className="stp__res-card-body">
                    <p>
                      <strong>Can release:</strong>{" "}
                      {state.bankLevy.canRelease ? (
                        <span className="stp__res-yes">Yes</span>
                      ) : (
                        <span className="stp__res-no">No</span>
                      )}
                    </p>
                    {state.bankLevy.notes && (
                      <p className="stp__res-notes">{state.bankLevy.notes}</p>
                    )}
                  </div>
                </div>
              )}

              {state.hardship?.available && (
                <div className="stp__res-card">
                  <div className="stp__res-card-header">
                    <i className="fas fa-life-ring" aria-hidden="true"></i>
                    <h3>Hardship / Currently Not Collectible</h3>
                  </div>
                  <div className="stp__res-card-body">
                    <p>
                      <strong>Available:</strong> Yes
                    </p>
                    {state.hardship.notes && (
                      <p className="stp__res-notes">{state.hardship.notes}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {!hasResolutionData && !state.summary && (
            <Section
              show={true}
              title={`${state.name} Tax Information`}
              className="stp__placeholder"
            >
              <p>
                The {state.taxAuthority} oversees tax collection and enforcement
                in {state.name}.{" "}
                {state.incomeType === "none"
                  ? `${state.name} does not impose a state income tax, but residents may still face federal tax obligations, sales tax issues, or other state-level tax matters.`
                  : `${state.name} imposes a ${state.incomeType} income tax ranging from ${state.incomeTaxRange}. Residents and businesses may face issues including back taxes, penalties, and state collection actions.`}
              </p>
            </Section>
          )}

          <Section
            show={state.recentChanges?.length > 0}
            title="Recent Tax Changes"
          >
            <ul className="stp__changes">
              {state.recentChanges?.map((change, i) => (
                <li key={i}>
                  <i className="fas fa-bolt" aria-hidden="true"></i>
                  {change}
                </li>
              ))}
            </ul>
          </Section>

          <Section
            show={state.officialLinks?.length > 0}
            title="Official Resources"
          >
            <div className="stp__links">
              {state.officialLinks?.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stp__link"
                >
                  <i className="fas fa-external-link-alt" aria-hidden="true"></i>
                  {link.label}
                </a>
              ))}
            </div>
          </Section>

          {/* How We Help */}
          <section className="stp__section stp__help">
            <h2>How Tax Advocate Group Helps {state.name} Taxpayers</h2>
            <p>
              Whether you're dealing with the IRS, the {state.taxAuthority}, or
              both — we provide comprehensive tax resolution services to{" "}
              {state.name} residents and businesses.
            </p>
            <div className="stp__services">
              <Link to="/tax-relief" className="stp__service-card">
                <i className="fas fa-shield-alt" aria-hidden="true"></i>
                <h4>Tax Relief</h4>
                <p>Consultation, preparation, and settlement services</p>
              </Link>
              <Link to="/tax-resolution" className="stp__service-card">
                <i className="fas fa-balance-scale" aria-hidden="true"></i>
                <h4>Tax Resolution</h4>
                <p>IRS representation, innocent spouse relief, and more</p>
              </Link>
              <Link to="/tax-negotiation" className="stp__service-card">
                <i className="fas fa-handshake" aria-hidden="true"></i>
                <h4>Tax Negotiation</h4>
                <p>Offers in compromise, payment plans, penalty abatement</p>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Browse Other States */}
      <section className="stp__browse">
        <div className="stp__browse-inner">
          <h3>Browse Other States</h3>
          <div className="stp__browse-grid">
            {stateData
              .filter((s) => s.slug !== state.slug)
              .slice(0, 12)
              .map((s) => (
                <Link
                  key={s.slug}
                  to={`/state-tax-guide/${s.slug}`}
                  className="stp__browse-link"
                >
                  <span className="stp__browse-abbr">{s.abbreviation}</span>
                  {s.name}
                </Link>
              ))}
            <Link
              to="/state-tax-guide"
              className="stp__browse-link stp__browse-link--all"
            >
              View All 50 States &#8594;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StateTaxPage;
