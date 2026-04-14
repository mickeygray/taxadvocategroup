import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import leadContext from "../context/leadContext";
import PhoneLink from "./PhoneLink";
import { useTrustedForm } from "../hooks/useTrustedForm";
import SmsOptInCheckbox from "./SmsOptInCheckbox";

const StateTaxForm = ({ stateName, stateAbbr, taxAuthority }) => {
  const { sendLeadForm } = useContext(leadContext);
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const { certUrl, inputProps: tfInputProps } = useTrustedForm();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    state: stateName || "",
    problemTypes: [],
    owedAmount: "",
    description: "",
  });
  const [consentChecked, setConsentChecked] = useState(false);
  const [smsConsentChecked, setSmsConsentChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const problemOptions = [
    { id: "back-taxes", label: "Back Taxes / Unfiled Returns" },
    { id: "wage-garnishment", label: "Wage Garnishment" },
    { id: "bank-levy", label: "Bank Levy / Account Freeze" },
    { id: "tax-lien", label: "Tax Lien" },
    { id: "payment-plan", label: "Need a Payment Plan" },
    { id: "oic", label: "Offer in Compromise / Settlement" },
    { id: "penalty", label: "Penalties & Interest" },
    { id: "audit", label: "State Tax Audit" },
    { id: "license-hold", label: "License / Registration Hold" },
    { id: "other", label: "Other / Not Sure" },
  ];

  const owedRanges = [
    "Under $5,000",
    "$5,000 – $10,000",
    "$10,000 – $25,000",
    "$25,000 – $50,000",
    "$50,000 – $100,000",
    "Over $100,000",
    "Not sure",
  ];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckbox = (id) => {
    setForm((prev) => ({
      ...prev,
      problemTypes: prev.problemTypes.includes(id)
        ? prev.problemTypes.filter((p) => p !== id)
        : [...prev.problemTypes, id],
    }));
  };

  const canAdvance = () => {
    switch (step) {
      case 1:
        return form.name.trim() !== "" && form.email.trim() !== "";
      case 2:
        return form.problemTypes.length > 0;
      case 3:
        return true;
      case 4:
        return consentChecked;
      default:
        return false;
    }
  };

  const next = () => {
    if (canAdvance() && step < totalSteps) setStep(step + 1);
  };
  const back = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consentChecked) return;
    setSubmitting(true);
    try {
      await sendLeadForm({
        name: form.name,
        email: form.email,
        phone: form.phone,
        state: form.state,
        problemTypes: form.problemTypes.join(", "),
        owedAmount: form.owedAmount,
        description: form.description,
        trustedFormCertUrl: certUrl,
        smsConsent: smsConsentChecked,
      });
      setSubmitted(true);
    } catch {
      window.location.href = `mailto:inquiry@taxadvocategroup.com?subject=State Tax Help — ${stateName}&body=${encodeURIComponent(
        `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nState: ${form.state}\nIssues: ${form.problemTypes.join(", ")}\nAmount Owed: ${form.owedAmount}\n\n${form.description}`,
      )}`;
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="stf__success">
        <i className="fas fa-check-circle" aria-hidden="true"></i>
        <h3>We've Got Your Info</h3>
        <p>
          A Tax Advocate Group specialist familiar with {stateName} tax issues
          will reach out within 1 business day.
        </p>
        <p className="stf__urgent">
          Need help now? Call <PhoneLink rawNumber="18005171807" />
        </p>
      </div>
    );
  }

  return (
    <form className="stf" onSubmit={handleSubmit}>
      <div className="stf__header">
        <h3>Get Help With {stateAbbr ? stateName : "State"} Tax Problems</h3>
        <p>
          Tell us what's going on and we'll map out your options
          {taxAuthority ? ` with the ${taxAuthority}` : ""}.
        </p>
      </div>

      {/* Progress bar */}
      <div className="stf__progress">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`stf__progress-step${i + 1 <= step ? " stf__progress-step--active" : ""}${i + 1 < step ? " stf__progress-step--done" : ""}`}
          >
            <div className="stf__progress-dot">
              {i + 1 < step ? <i className="fas fa-check"></i> : i + 1}
            </div>
          </div>
        ))}
        <div className="stf__progress-bar">
          <div
            className="stf__progress-fill"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Contact Info */}
      {step === 1 && (
        <div className="stf__step">
          <p className="stf__step-label">Step 1 — Your Information</p>
          <div className="stf__field">
            <label htmlFor="stf-name">Full Name *</label>
            <input
              id="stf-name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="John Smith"
            />
          </div>
          <div className="stf__field">
            <label htmlFor="stf-email">Email *</label>
            <input
              id="stf-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>
          <div className="stf__field">
            <label htmlFor="stf-phone">Phone</label>
            <input
              id="stf-phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
      )}

      {/* Step 2: Problem Types */}
      {step === 2 && (
        <div className="stf__step">
          <p className="stf__step-label">Step 2 — What are you dealing with?</p>
          <div className="stf__checkboxes">
            {problemOptions.map((opt) => (
              <label key={opt.id} className="stf__checkbox">
                <input
                  type="checkbox"
                  checked={form.problemTypes.includes(opt.id)}
                  onChange={() => handleCheckbox(opt.id)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Amount + Details */}
      {step === 3 && (
        <div className="stf__step">
          <p className="stf__step-label">Step 3 — A Few More Details</p>
          <div className="stf__field">
            <label htmlFor="stf-owed">Approximate Amount Owed</label>
            <select
              id="stf-owed"
              name="owedAmount"
              value={form.owedAmount}
              onChange={handleChange}
            >
              <option value="">Select a range...</option>
              {owedRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>
          <div className="stf__field">
            <label htmlFor="stf-desc">
              Anything else we should know? (optional)
            </label>
            <textarea
              id="stf-desc"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder={`E.g., "I got a garnishment notice from ${taxAuthority || "the state"} last week..."`}
            />
          </div>
        </div>
      )}

      {/* Step 4: Consent + Submit */}
      {step === 4 && (
        <div className="stf__step">
          <p className="stf__step-label">Step 4 — Almost Done</p>

          {/* Summary */}
          <div className="stf__summary">
            <div className="stf__summary-row">
              <span>Name</span>
              <span>{form.name}</span>
            </div>
            <div className="stf__summary-row">
              <span>Email</span>
              <span>{form.email}</span>
            </div>
            {form.phone && (
              <div className="stf__summary-row">
                <span>Phone</span>
                <span>{form.phone}</span>
              </div>
            )}
            <div className="stf__summary-row">
              <span>Issues</span>
              <span>
                {form.problemTypes
                  .map((id) => problemOptions.find((o) => o.id === id)?.label)
                  .join(", ")}
              </span>
            </div>
            {form.owedAmount && (
              <div className="stf__summary-row">
                <span>Amount</span>
                <span>{form.owedAmount}</span>
              </div>
            )}
          </div>

          {/* ── General contact consent (required) ── */}
          <div className="stf__consent">
            <label className="stf__consent-label">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                required
              />
              <input {...tfInputProps} />
              <span className="stf__consent-text">
                By submitting this form, you expressly consent to receive
                automated and manually dialed telephone calls and prerecorded
                voice messages from Tax Advocate Group, LLC at the telephone
                number provided. Message and data rates may apply. Consent is
                not a condition of purchase. View our{" "}
                <Link to="/privacy-policy">Privacy Policy</Link> and{" "}
                <Link to="/terms-of-service">Terms of Service</Link>.
              </span>
            </label>
          </div>

          {/* ── SMS opt-in (optional, separate per TCR) ── */}
          <SmsOptInCheckbox
            checked={smsConsentChecked}
            onChange={(e) => setSmsConsentChecked(e.target.checked)}
            className="stf__sms-consent"
          />
        </div>
      )}

      {/* Navigation */}
      <div className="stf__nav">
        {step > 1 && (
          <button type="button" className="stf__back" onClick={back}>
            <i className="fas fa-arrow-left" aria-hidden="true"></i> Back
          </button>
        )}
        {step < totalSteps && (
          <button
            type="button"
            className="stf__next"
            onClick={next}
            disabled={!canAdvance()}
          >
            Next <i className="fas fa-arrow-right" aria-hidden="true"></i>
          </button>
        )}
        {step === totalSteps && (
          <button
            type="submit"
            className="stf__submit"
            disabled={submitting || !consentChecked}
          >
            {submitting ? (
              "Sending..."
            ) : (
              <>
                <i className="fas fa-paper-plane" aria-hidden="true"></i> Get My
                Free Consultation
              </>
            )}
          </button>
        )}
      </div>

      <p className="stf__disclaimer">
        Free, no-obligation consultation. Your information is confidential.
      </p>
    </form>
  );
};

export default StateTaxForm;
