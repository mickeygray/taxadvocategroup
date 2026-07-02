import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SEO from "./SEO";

const CONTACT_PHONE = "(818) 230-2223";
const CONTACT_PHONE_HREF = "tel:+18182302223";
const CONTACT_EMAIL = "apply@taxadvocategroup.com";
const HYPE_TRACK_YT_ID = "tDsZoQX1gis";
const MUSIC_SRC = `https://www.youtube.com/embed/${HYPE_TRACK_YT_ID}?enablejsapi=1&loop=1&playlist=${HYPE_TRACK_YT_ID}&controls=0&modestbranding=1&playsinline=1`;

const seminarDetails = {
  title: "Tax Advocate Group Hiring Seminar",
  schedule: "Saturday, July 25, 2026 at 10:00 AM PT",
  location: "Chatsworth, CA",
  address: "21625 Prairie Street, Suite #200, Chatsworth, CA 91311",
  format: "In-person hiring seminar",
};

const jobSchema = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: "Sales Representative - Tax Resolution",
  description:
    "Tax Advocate Group hiring seminar for motivated sales professionals. Full training, benefits, 401(k), in-office role in Chatsworth, CA, and uncapped performance-based compensation.",
  hiringOrganization: {
    "@type": "Organization",
    name: "Tax Advocate Group",
    sameAs: "https://www.taxadvocategroup.com",
  },
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      streetAddress: "21625 Prairie Street, Suite #200",
      addressLocality: "Chatsworth",
      addressRegion: "CA",
      postalCode: "91311",
      addressCountry: "US",
    },
  },
  employmentType: "FULL_TIME",
  baseSalary: {
    "@type": "MonetaryAmount",
    currency: "USD",
    value: {
      "@type": "QuantitativeValue",
      minValue: 60000,
      maxValue: 300000,
      unitText: "YEAR",
    },
  },
  datePosted: "2026-04-16",
  validThrough: "2026-12-31",
};

const heroHighlights = [
  {
    icon: "fa-solid fa-chart-line",
    title: "Uncapped upside",
    body: "No fixed commission ceiling. Your production sets the pace.",
  },
  {
    icon: "fa-solid fa-graduation-cap",
    title: "Trained to close",
    body: "A structured ramp into product knowledge, sales process, and floor standards.",
  },
  {
    icon: "fa-solid fa-shield-heart",
    title: "Benefits with ambition",
    body: "Medical, dental, vision, and 401(k) enrollment for eligible full-time team members.",
  },
  {
    icon: "fa-solid fa-arrow-trend-up",
    title: "Rise from the floor",
    body: "Leadership is built from closers who can produce, coach, and lead.",
  },
];

const roleItems = [
  "Work real conversations with taxpayers who need a clear next move.",
  "Qualify serious prospects and move with urgency, confidence, and control.",
  "Learn a disciplined consultative sales process backed by training and floor support.",
  "Build a durable career in a high-demand market where closers can separate themselves.",
];

const fitItems = [
  "You have killer instinct in sales and still want to be coached.",
  "You bring a warrior mentality: disciplined, competitive, and consistent.",
  "You communicate under pressure and can earn trust quickly.",
  "You want your income to reflect effort, skill, and execution.",
];

const notFitItems = [
  "You are looking for a passive role with minimal accountability.",
  "You are uncomfortable with phone-based sales conversations.",
  "You prefer guaranteed comfort over performance upside.",
  "You are not available for an in-office role in Chatsworth.",
];

const benefits = [
  {
    icon: "fa-solid fa-dollar-sign",
    title: "Uncapped performance pay",
    body: "Top producers can reach serious monthly earnings because compensation grows with results.",
  },
  {
    icon: "fa-solid fa-user-tie",
    title: "Closer to leader path",
    body: "Managers and team leads are promoted from performers who understand the floor.",
  },
  {
    icon: "fa-solid fa-notes-medical",
    title: "Health coverage",
    body: "Medical, dental, and vision options are available to eligible full-time employees.",
  },
  {
    icon: "fa-solid fa-piggy-bank",
    title: "401(k) enrollment",
    body: "Build toward long-term financial stability while growing your sales career.",
  },
  {
    icon: "fa-solid fa-chalkboard-user",
    title: "No tax experience required",
    body: "We train the product, process, language, and standards for the role.",
  },
  {
    icon: "fa-solid fa-handshake",
    title: "Real client impact",
    body: "Your work helps people connect with professionals who can address serious tax problems.",
  },
];

const pathSteps = [
  {
    n: "01",
    title: "Apply",
    body: "Submit your contact information and tell us why you are ready for a bigger sales opportunity.",
  },
  {
    n: "02",
    title: "Recruiting call",
    body: "Our team confirms fit, answers initial questions, and shares the next available seminar details.",
  },
  {
    n: "03",
    title: "Attend the seminar",
    body: "Meet the team, see the floor, and understand what it takes to compete here.",
  },
  {
    n: "04",
    title: "Train. Close. Climb.",
    body: "Qualified candidates move into structured training with clear expectations and room to rise.",
  },
];

function useCounter(target, duration = 1600, active = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return undefined;

    let raf;
    let start = null;
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (ts) => {
      if (!start) start = ts;
      const pct = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(ease(pct) * target));
      if (pct < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);

  return count;
}

const WorkShop = () => {
  const [countersOn, setCountersOn] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [visible, setVisible] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    why: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [musicPlaying, setMusicPlaying] = useState(false);

  const statsRef = useRef(null);
  const sectionRefs = useRef({});
  const iframeRef = useRef(null);

  const grossRev = useCounter(65, 1400, countersOn);
  const clientSav = useCounter(200, 1650, countersOn);
  const topEarner = useCounter(50000, 1900, countersOn);
  const clients = useCounter(5000, 1750, countersOn);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return undefined;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setCountersOn(true);
      },
      { threshold: 0.15 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => ({
              ...prev,
              [entry.target.dataset.reveal]: true,
            }));
          }
        });
      },
      { threshold: 0.12 },
    );

    Object.values(sectionRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const revealRef = (key) => (el) => {
    if (el) {
      el.dataset.reveal = key;
      sectionRefs.current[key] = el;
    }
  };

  const ytCmd = (func) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: "" }),
      "*",
    );
  };

  const toggleMusic = () => {
    if (musicPlaying) {
      ytCmd("pauseVideo");
      setMusicPlaying(false);
      return;
    }

    ytCmd("unMute");
    ytCmd("playVideo");
    setMusicPlaying(true);
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleResumeChange = (e) => {
    const [file] = e.target.files || [];
    setResumeFile(file || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) return;

    setSubmitting(true);
    setFormError("");

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("phone", formData.phone);
      payload.append("email", formData.email);
      payload.append("why", formData.why);
      if (resumeFile) payload.append("resume", resumeFile);

      const res = await axios.post("/api/workshop-apply", payload);
      if (res.status === 200) setSubmitted(true);
    } catch (err) {
      const status = err?.response?.status;
      const serverMessage = err?.response?.data?.error;

      if (status === 404) {
        setFormError(`Server error (404). Call us directly at ${CONTACT_PHONE}.`);
      } else if (status === 429) {
        setFormError(
          serverMessage ||
            `You have reached the seminar submission limit for now. Please try again later or call ${CONTACT_PHONE}.`,
        );
      } else {
        setFormError(serverMessage || `Something went wrong. Call ${CONTACT_PHONE}.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ws">
      <SEO
        title="Hiring Seminar | Tax Advocate Group Sales Career"
        description="Your journey to the top starts here. Tax Advocate Group hiring seminar for competitive sales professionals. Full training, benefits, 401(k), internal promotion path, and uncapped earning potential."
        canonical="/seminar"
        structuredData={[jobSchema]}
        noindex={false}
      />

      <iframe
        ref={iframeRef}
        src={MUSIC_SRC}
        allow="autoplay; encrypted-media"
        title="Seminar soundtrack"
        className="ws__music-frame"
      />

      <button
        type="button"
        className={`ws__sound ${musicPlaying ? "ws__sound--on" : ""}`}
        onClick={toggleMusic}
        aria-pressed={musicPlaying}
        aria-label={musicPlaying ? "Pause seminar soundtrack" : "Play seminar soundtrack"}
        title={musicPlaying ? "Pause seminar soundtrack" : "Play seminar soundtrack"}
      >
        <i
          className={musicPlaying ? "fa-solid fa-volume-high" : "fa-solid fa-play"}
          aria-hidden="true"
        />
        <span className="ws__sound-label">
          {musicPlaying ? "Sound on" : "Energy mode"}
        </span>
      </button>

      <section className="ws__hero">
        <img
          className="ws__hero-image"
          src="/images/seminar-sales-closer-hero.png"
          alt=""
          aria-hidden="true"
        />
        <div className="ws__hero-scrim" />

        <div
          className={`ws__hero-body ${heroReady ? "ws__hero-body--in" : ""}`}
        >
          <img
            src="/images/tax-advocate-group-logo-small.png"
            alt="Tax Advocate Group"
            className="ws__hero-logo"
          />

          <div className="ws__hero-kicker">
            <i className="fa-solid fa-briefcase" aria-hidden="true" />
            Hiring seminar for competitive sales professionals
          </div>

          <h1 className="ws__hero-title">
            Your journey to the top starts here.
          </h1>

          <p className="ws__hero-copy">
            We are looking for closers with a warrior mentality: competitive,
            coachable, resilient, and ready to win. Tax Advocate Group trains
            motivated salespeople to help taxpayers move fast, understand their
            options, and connect with licensed resolution professionals.
          </p>

          <div className="ws__hero-actions">
            <a href="#apply" className="ws__btn ws__btn--primary">
              <span>Claim your seat</span>
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </a>
            <a href={CONTACT_PHONE_HREF} className="ws__btn ws__btn--secondary">
              <i className="fa-solid fa-phone" aria-hidden="true" />
              <span>{CONTACT_PHONE}</span>
            </a>
          </div>
        </div>
      </section>

      <section className="ws__session-band" aria-label="Seminar details">
        <div className="ws__session">
          <div>
            <span>Schedule</span>
            <strong>{seminarDetails.schedule}</strong>
          </div>
          <div>
            <span>Location</span>
            <strong>{seminarDetails.location}</strong>
          </div>
          <div>
            <span>Format</span>
            <strong>{seminarDetails.format}</strong>
          </div>
        </div>
      </section>

      <section
        className="ws__intro"
        ref={revealRef("intro")}
        data-visible={visible.intro}
      >
        <div className="ws__intro-inner">
          {heroHighlights.map((item) => (
            <article className="ws__highlight" key={item.title}>
              <i className={item.icon} aria-hidden="true" />
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ws__metrics" ref={statsRef}>
        <div className="ws__section-head">
          <span className="ws__label">Company Performance</span>
          <h2>Serious business. Serious upside.</h2>
          <p>
            This is not theory and it is not a motivational poster. The role is
            built around a real service, measurable demand, and a team with a
            long record of helping clients resolve difficult tax problems.
          </p>
        </div>
        <div className="ws__metrics-grid">
          <article>
            <span>Revenue generated</span>
            <strong>${grossRev}M+</strong>
            <p>Lifetime company revenue.</p>
          </article>
          <article>
            <span>Client savings</span>
            <strong>${clientSav}M+</strong>
            <p>Tax debt savings delivered for clients.</p>
          </article>
          <article>
            <span>Top monthly performance</span>
            <strong>${topEarner.toLocaleString()}</strong>
            <p>Potential achieved by top producers.</p>
          </article>
          <article>
            <span>Clients helped</span>
            <strong>{clients.toLocaleString()}+</strong>
            <p>Individuals and businesses served.</p>
          </article>
        </div>
      </section>

      <section
        className="ws__role"
        ref={revealRef("role")}
        data-visible={visible.role}
      >
        <div className="ws__role-inner">
          <div className="ws__role-copy">
            <span className="ws__label">The Role</span>
            <h2>Consultative sales for people who want to win.</h2>
            <p>
              This is a professional sales floor with standards. You will learn
              the tax resolution market, speak with people who need help, and
              develop the discipline required to build a strong book of business.
            </p>
            <ul className="ws__check-list">
              {roleItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="ws__earning-panel">
            <div className="ws__earning-head">
              <span>Earning Potential</span>
              <strong>Uncapped</strong>
            </div>
            {[
              {
                phase: "Training ramp",
                range: "$2K - $5K",
                width: "24%",
              },
              {
                phase: "Developing producer",
                range: "$5K - $10K",
                width: "44%",
              },
              {
                phase: "Established closer",
                range: "$10K - $18K",
                width: "66%",
              },
              {
                phase: "Top performer",
                range: "$40K - $50K+",
                width: "100%",
              },
            ].map((tier) => (
              <div className="ws__earning-row" key={tier.phase}>
                <div className="ws__earning-meta">
                  <span>{tier.phase}</span>
                  <strong>{tier.range}</strong>
                </div>
                <div className="ws__earning-track">
                  <div
                    className="ws__earning-fill"
                    style={{ width: tier.width }}
                  />
                </div>
              </div>
            ))}
            <p>
              Compensation depends on performance, consistency, and execution.
              Past results are not a guarantee of future earnings.
            </p>
          </div>
        </div>
      </section>

      <section
        className="ws__benefits"
        ref={revealRef("benefits")}
        data-visible={visible.benefits}
      >
        <div className="ws__section-head">
          <span className="ws__label">Total Opportunity</span>
          <h2>Training, benefits, and a ladder worth climbing.</h2>
          <p>
            We are hiring people who want more than a seat and a paycheck. The
            seminar explains how the role works, what support is provided, and
            what strong performers can build here.
          </p>
        </div>

        <div className="ws__benefit-grid">
          {benefits.map((item) => (
            <article className="ws__benefit-card" key={item.title}>
              <i className={item.icon} aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="ws__fit"
        ref={revealRef("fit")}
        data-visible={visible.fit}
      >
        <div className="ws__section-head">
          <span className="ws__label">Candidate Fit</span>
          <h2>Who belongs on this floor.</h2>
          <p>
            The opportunity is meaningful, but it is not casual. We are looking
            for candidates who want coaching, pressure, standards, and a direct
            connection between performance and earnings.
          </p>
        </div>

        <div className="ws__fit-grid">
          <article className="ws__fit-card">
            <h3>Strong fit</h3>
            <ul>
              {fitItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="ws__fit-card ws__fit-card--muted">
            <h3>May not be a fit</h3>
            <ul>
              {notFitItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section
        className="ws__path"
        ref={revealRef("path")}
        data-visible={visible.path}
      >
        <div className="ws__section-head">
          <span className="ws__label">Hiring Path</span>
          <h2>From seminar to the sales floor.</h2>
          <p>
            Dates change as seminar seats fill, so our recruiting team confirms
            the next available session directly with qualified applicants.
          </p>
        </div>

        <div className="ws__path-grid">
          {pathSteps.map((step) => (
            <article className="ws__path-step" key={step.n}>
              <span>{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="ws__apply"
        id="apply"
        ref={revealRef("apply")}
        data-visible={visible.apply}
      >
        <div className="ws__apply-inner">
          <div className="ws__apply-head">
            <span className="ws__label">Apply For The Seminar</span>
            <h2>Step in if you are ready to compete.</h2>
            <p>
              Submit your information and our team will follow up with the next
              available seminar details, expectations, and any questions about
              the role.
            </p>
          </div>

          <div className="ws__apply-layout">
            <div className="ws__form-shell">
              {submitted ? (
                <div className="ws__success">
                  <i className="fa-solid fa-circle-check" aria-hidden="true" />
                  <h3>Application received.</h3>
                  <p>
                    Our recruiting team will review your information and reach
                    out within 1 business day with next steps.
                  </p>
                  <a href={CONTACT_PHONE_HREF} className="ws__success-link">
                    Call recruiting at {CONTACT_PHONE}
                  </a>
                </div>
              ) : (
                <form className="ws__form" onSubmit={handleSubmit}>
                  <div className="ws__form-2col">
                    <div className="ws__field">
                      <label htmlFor="ws-n">Full name *</label>
                      <input
                        id="ws-n"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Smith"
                        required
                        autoComplete="name"
                      />
                    </div>
                    <div className="ws__field">
                      <label htmlFor="ws-p">Phone number *</label>
                      <input
                        id="ws-p"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(555) 123-4567"
                        required
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div className="ws__field">
                    <label htmlFor="ws-e">Email address *</label>
                    <input
                      id="ws-e"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@email.com"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="ws__field">
                    <label htmlFor="ws-w">
                      What interests you about this opportunity? *
                    </label>
                    <textarea
                      id="ws-w"
                      name="why"
                      value={formData.why}
                      onChange={handleChange}
                      placeholder="Tell us about your sales experience, goals, and what you want from your next career move."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="ws__field">
                    <label htmlFor="ws-r">Resume (optional)</label>
                    <input
                      id="ws-r"
                      type="file"
                      name="resume"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleResumeChange}
                    />
                    <div className="ws__file-meta">
                      <span>PDF or Word documents accepted.</span>
                      <strong>{resumeFile ? resumeFile.name : "No file selected"}</strong>
                    </div>
                  </div>

                  <label className="ws__consent">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      required
                    />
                    <span>
                      I consent to being contacted by Tax Advocate Group about
                      this employment opportunity by phone, email, or text.{" "}
                      <Link to="/privacy-policy">Privacy Policy</Link>.
                    </span>
                  </label>

                  {formError && <p className="ws__error">{formError}</p>}

                  <button
                    type="submit"
                    className="ws__submit"
                    disabled={!consent || submitting}
                  >
                    {submitting ? "Submitting..." : "Claim my seat"}
                  </button>

                  <p className="ws__direct">
                    Prefer to speak with someone?{" "}
                    <a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</a> or{" "}
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </p>
                </form>
              )}
            </div>

            <aside className="ws__details" aria-label="Seminar details">
              <h3>{seminarDetails.title}</h3>
              <dl>
                <div>
                  <dt>Schedule</dt>
                  <dd>{seminarDetails.schedule}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{seminarDetails.address}</dd>
                </div>
                <div>
                  <dt>Position</dt>
                  <dd>Full-time sales representative, in office</dd>
                </div>
                <div>
                  <dt>Compensation</dt>
                  <dd>Performance-based with no fixed commission cap</dd>
                </div>
                <div>
                  <dt>Benefits</dt>
                  <dd>Medical, dental, vision, and 401(k) for eligible employees</dd>
                </div>
              </dl>
              <div className="ws__partner">
                <img
                  src="/images/tengoose_logo.jpg"
                  alt="Tengoose Coffee"
                  className="ws__partner-logo"
                />
                <p>
                  Coffee and pastries are provided by Tengoose Coffee during
                  select seminar sessions.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <footer className="ws__footer">
        <img
          src="/images/tax-advocate-group-logo-small.png"
          alt="Tax Advocate Group"
          className="ws__footer-logo"
        />
        <p>{seminarDetails.address}</p>
        <p>
          <a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</a> |{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        <p>
          <span suppressHydrationWarning>
            &copy; {new Date().getFullYear()} Tax Advocate Group, LLC. All
            Rights Reserved.
          </span>{" "}
          | <Link to="/privacy-policy">Privacy Policy</Link> |{" "}
          <Link to="/terms-of-service">Terms of Service</Link>
        </p>
      </footer>

      <style>{`
        .ws {
          --ink: #0b1020;
          --midnight: #111827;
          --graphite: #172033;
          --text: #273244;
          --muted: #667085;
          --line: #cbd5e1;
          --surface: #ffffff;
          --soft: #edf4ef;
          --soft-green: #e3f4ef;
          --teal: #0d9488;
          --teal-dark: #0f5f59;
          --brass: #b8872f;
          --brass-soft: #f4ead8;
          --heat: #c84f16;
          --heat-dark: #9a3412;
          --heat-soft: #fff1e8;
          --error: #b42318;
          font-family: 'Montserrat', 'Poppins', Arial, sans-serif;
          color: var(--text);
          background: var(--ink);
          overflow-x: hidden;
        }

        .ws *,
        .ws *::before,
        .ws *::after {
          box-sizing: border-box;
        }

        .ws a {
          color: inherit;
        }

        .ws__music-frame {
          position: fixed;
          width: 1px;
          height: 1px;
          left: -9999px;
          top: -9999px;
          opacity: 0;
          pointer-events: none;
        }

        .ws__sound {
          position: absolute;
          right: 1.25rem;
          top: 1.25rem;
          z-index: 50;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          width: 44px;
          min-height: 44px;
          padding: 0;
          border: 1px solid rgba(18, 24, 38, 0.14);
          border-radius: 8px;
          background: #ffffff;
          color: var(--ink);
          box-shadow: 0 18px 46px rgba(18, 24, 38, 0.18);
          font-family: inherit;
          font-size: 0.82rem;
          font-weight: 900;
          cursor: pointer;
          transition: transform 180ms ease, background 180ms ease, color 180ms ease;
        }

        .ws__sound::after {
          content: attr(aria-label);
          position: absolute;
          top: calc(100% + 0.55rem);
          right: 0;
          width: max-content;
          max-width: 220px;
          padding: 0.5rem 0.65rem;
          border-radius: 6px;
          background: rgba(18, 24, 38, 0.95);
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 800;
          line-height: 1.2;
          opacity: 0;
          pointer-events: none;
          transform: translateY(-4px);
          transition: opacity 160ms ease, transform 160ms ease;
          white-space: nowrap;
        }

        .ws__sound:hover {
          transform: translateY(-2px);
        }

        .ws__sound:hover::after {
          opacity: 1;
          transform: translateY(0);
        }

        .ws__sound i {
          color: var(--heat);
        }

        .ws__sound-label {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
          border: 0;
        }

        .ws__sound--on {
          background: var(--ink);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.18);
        }

        .ws__hero {
          position: relative;
          min-height: 78vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5.75rem 1.5rem 5rem;
          overflow: hidden;
          background: var(--ink);
        }

        .ws__hero-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          z-index: 0;
        }

        .ws__hero-scrim {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(90deg, rgba(8, 13, 24, 0.98) 0%, rgba(8, 13, 24, 0.82) 42%, rgba(8, 13, 24, 0.34) 78%, rgba(8, 13, 24, 0.22) 100%),
            linear-gradient(180deg, rgba(15, 118, 110, 0.12) 0%, rgba(194, 65, 12, 0.12) 48%, rgba(18, 24, 38, 0.62) 100%);
        }

        .ws__hero-body {
          position: relative;
          z-index: 2;
          width: min(100%, 1120px);
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 700ms ease, transform 700ms ease;
        }

        .ws__hero-body--in {
          opacity: 1;
          transform: translateY(0);
        }

        .ws__hero-logo {
          display: block;
          width: 190px;
          height: auto;
          margin-bottom: 2rem;
          filter: brightness(1.08);
        }

        .ws__hero-kicker,
        .ws__label {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--brass);
          font-size: 0.82rem;
          font-weight: 800;
          line-height: 1.3;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .ws__hero-title {
          max-width: 860px;
          margin: 1rem 0 1.25rem;
          color: #ffffff;
          font-size: 4.35rem;
          line-height: 1.04;
          font-weight: 900;
          letter-spacing: 0;
        }

        .ws__hero-copy {
          max-width: 720px;
          margin: 0 0 2rem;
          color: rgba(255, 255, 255, 0.82);
          font-size: 1.12rem;
          line-height: 1.75;
        }

        .ws__hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-bottom: 0;
        }

        .ws__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          min-height: 48px;
          padding: 0.85rem 1.3rem;
          border-radius: 8px;
          font-size: 0.96rem;
          font-weight: 800;
          line-height: 1.2;
          text-decoration: none;
          transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
        }

        .ws__btn:hover {
          transform: translateY(-2px);
        }

        .ws .ws__btn--primary {
          background: linear-gradient(135deg, var(--heat), var(--teal));
          color: #ffffff;
          border: 1px solid transparent;
          box-shadow: 0 16px 34px rgba(194, 65, 12, 0.24);
        }

        .ws .ws__btn--primary:hover {
          background: linear-gradient(135deg, var(--heat-dark), var(--teal-dark));
          border-color: transparent;
        }

        .ws .ws__btn--secondary {
          background: #ffffff;
          color: var(--teal-dark);
          border: 1px solid #ffffff;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.16);
        }

        .ws .ws__btn--secondary:hover {
          background: var(--soft-green);
          border-color: var(--soft-green);
        }

        .ws__session-band {
          padding: 2rem 1.5rem 0;
          background:
            linear-gradient(180deg, #080d18 0%, #111827 100%);
        }

        .ws__session {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          width: min(100%, 1120px);
          margin: 0 auto;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 20px 55px rgba(0, 0, 0, 0.24);
          backdrop-filter: blur(18px);
        }

        .ws__session > div {
          padding: 1rem 1.25rem;
          border-right: 1px solid rgba(255, 255, 255, 0.12);
        }

        .ws__session > div:last-child {
          border-right: 0;
        }

        .ws__session span {
          display: block;
          color: rgba(251, 191, 36, 0.82);
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 0.2rem;
        }

        .ws__session strong {
          display: block;
          color: #ffffff;
          font-size: 0.95rem;
          line-height: 1.35;
        }

        section[data-reveal] {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 650ms ease, transform 650ms ease;
        }

        section[data-visible="true"] {
          opacity: 1;
          transform: translateY(0);
        }

        .ws__intro {
          padding: 2rem 1.5rem 0;
          background:
            linear-gradient(180deg, #111827 0%, #12231f 100%);
        }

        .ws__intro-inner {
          width: min(100%, 1120px);
          margin: 0 auto;
          position: relative;
          z-index: 3;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.26);
        }

        .ws__highlight {
          min-height: 210px;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(12px);
        }

        .ws__highlight i,
        .ws__benefit-card i,
        .ws__success i {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 8px;
          background: var(--soft-green);
          color: var(--teal);
          font-size: 1rem;
          margin-bottom: 1.1rem;
        }

        .ws__intro .ws__highlight i {
          background: rgba(13, 148, 136, 0.18);
          color: #99f6e4;
        }

        .ws__intro .ws__highlight h2 {
          color: #ffffff;
        }

        .ws__intro .ws__highlight p {
          color: rgba(255, 255, 255, 0.72);
        }

        .ws__highlight h2,
        .ws__benefit-card h3,
        .ws__fit-card h3,
        .ws__path-step h3,
        .ws__details h3,
        .ws__success h3 {
          color: var(--ink);
          font-size: 1.05rem;
          line-height: 1.3;
          font-weight: 850;
          letter-spacing: 0;
          margin: 0 0 0.55rem;
        }

        .ws__highlight p,
        .ws__benefit-card p,
        .ws__path-step p,
        .ws__success p {
          color: var(--muted);
          font-size: 0.92rem;
          line-height: 1.65;
          margin: 0;
        }

        .ws__metrics,
        .ws__benefits,
        .ws__fit,
        .ws__path,
        .ws__apply {
          padding: 6rem 1.5rem;
        }

        .ws__metrics,
        .ws__path {
          background:
            linear-gradient(180deg, #12231f 0%, #0b1020 100%);
          color: #ffffff;
        }

        .ws__benefits,
        .ws__apply {
          background:
            linear-gradient(135deg, rgba(13, 148, 136, 0.14), rgba(200, 79, 22, 0.1)),
            #eef6f2;
        }

        .ws__section-head,
        .ws__apply-head {
          width: min(100%, 760px);
          margin: 0 auto 2.5rem;
          text-align: center;
        }

        .ws__section-head h2,
        .ws__apply-head h2,
        .ws__role-copy h2 {
          color: var(--ink);
          font-size: 2.5rem;
          line-height: 1.14;
          font-weight: 900;
          letter-spacing: 0;
          margin: 0.75rem 0 0.8rem;
        }

        .ws__section-head p,
        .ws__apply-head p,
        .ws__role-copy p {
          color: var(--muted);
          font-size: 1.02rem;
          line-height: 1.75;
          margin: 0;
        }

        .ws__metrics-grid {
          width: min(100%, 1120px);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.12);
        }

        .ws__metrics-grid article {
          min-height: 210px;
          padding: 1.6rem;
          background: rgba(255, 255, 255, 0.07);
        }

        .ws__metrics-grid span {
          display: block;
          color: rgba(255, 255, 255, 0.58);
          font-size: 0.78rem;
          font-weight: 800;
          margin-bottom: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0;
        }

        .ws__metrics-grid strong {
          display: block;
          color: #fbbf24;
          font-size: 3rem;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0;
          font-variant-numeric: tabular-nums;
          margin-bottom: 0.85rem;
        }

        .ws__metrics-grid p {
          color: rgba(255, 255, 255, 0.68);
          font-size: 0.9rem;
          line-height: 1.55;
          margin: 0;
        }

        .ws__role {
          padding: 6rem 1.5rem;
          background:
            linear-gradient(135deg, #111827 0%, #10231f 48%, #0b1020 100%);
          color: #ffffff;
        }

        .ws__role-inner {
          width: min(100%, 1120px);
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 430px;
          gap: 4rem;
          align-items: center;
        }

        .ws__role-copy h2 {
          color: #ffffff;
        }

        .ws__role-copy p {
          color: rgba(255, 255, 255, 0.72);
        }

        .ws__check-list,
        .ws__fit-card ul {
          list-style: none;
          padding: 0;
          margin: 1.6rem 0 0;
        }

        .ws__check-list li,
        .ws__fit-card li {
          position: relative;
          padding: 0.75rem 0 0.75rem 2rem;
          color: rgba(255, 255, 255, 0.76);
          font-size: 0.98rem;
          line-height: 1.6;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ws__check-list li::before,
        .ws__fit-card li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 1.35rem;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--teal);
        }

        .ws__earning-panel {
          background: #ffffff;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 26px 70px rgba(0, 0, 0, 0.28);
        }

        .ws__earning-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          padding-bottom: 1rem;
          margin-bottom: 1.1rem;
          border-bottom: 1px solid var(--line);
        }

        .ws__earning-head span {
          color: var(--muted);
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .ws__earning-head strong {
          color: var(--teal-dark);
          font-size: 1.8rem;
          line-height: 1;
          font-weight: 900;
        }

        .ws__earning-row {
          margin-bottom: 1.05rem;
        }

        .ws__earning-meta {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 0.45rem;
        }

        .ws__earning-meta span,
        .ws__earning-meta strong {
          color: var(--ink);
          font-size: 0.86rem;
          line-height: 1.3;
        }

        .ws__earning-meta strong {
          color: var(--brass);
        }

        .ws__earning-track {
          height: 12px;
          overflow: hidden;
          border-radius: 999px;
          background: #e8edf2;
        }

        .ws__earning-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--teal), var(--brass));
          animation: ws-bar-in 950ms ease both;
        }

        @keyframes ws-bar-in {
          from {
            width: 0;
          }
        }

        .ws__earning-panel p {
          color: var(--muted);
          font-size: 0.78rem;
          line-height: 1.55;
          margin: 1.2rem 0 0;
        }

        .ws__benefit-grid,
        .ws__fit-grid,
        .ws__path-grid {
          width: min(100%, 1120px);
          margin: 0 auto;
          display: grid;
          gap: 1rem;
        }

        .ws__benefit-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .ws__benefit-card,
        .ws__fit-card,
        .ws__path-step,
        .ws__details,
        .ws__form-shell {
          background: #ffffff;
          border: 1px solid var(--line);
          border-radius: 8px;
          box-shadow: 0 18px 45px rgba(18, 24, 38, 0.08);
          color: var(--text);
        }

        .ws__benefit-card,
        .ws__fit-card,
        .ws__path-step {
          padding: 1.5rem;
          transition: border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
        }

        .ws__benefit-card:hover,
        .ws__path-step:hover {
          transform: translateY(-3px);
          border-color: rgba(15, 118, 110, 0.28);
          box-shadow: 0 16px 34px rgba(18, 24, 38, 0.08);
        }

        .ws__fit {
          background:
            linear-gradient(135deg, rgba(184, 135, 47, 0.16), rgba(13, 148, 136, 0.12)),
            #f6faf7;
        }

        .ws__fit-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .ws__fit-card li {
          color: var(--text);
          border-bottom-color: var(--line);
        }

        .ws__fit-card--muted li::before {
          background: var(--brass);
        }

        .ws__fit-card--muted {
          background: #fbfaf7;
        }

        .ws__path-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .ws__path-step span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: var(--brass-soft);
          color: var(--brass);
          font-size: 0.9rem;
          font-weight: 900;
          margin-bottom: 1.1rem;
        }

        .ws__apply-inner {
          width: min(100%, 1120px);
          margin: 0 auto;
        }

        .ws__metrics .ws__section-head h2,
        .ws__path .ws__section-head h2,
        .ws__apply .ws__apply-head h2 {
          color: #ffffff;
        }

        .ws__metrics .ws__section-head p,
        .ws__path .ws__section-head p,
        .ws__apply .ws__apply-head p {
          color: rgba(255, 255, 255, 0.72);
        }

        .ws__path .ws__path-step {
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.18);
        }

        .ws__path .ws__path-step h3 {
          color: #ffffff;
        }

        .ws__path .ws__path-step p {
          color: rgba(255, 255, 255, 0.7);
        }

        .ws__apply {
          background:
            linear-gradient(135deg, rgba(200, 79, 22, 0.22) 0%, rgba(11, 16, 32, 0) 38%),
            linear-gradient(180deg, #111827 0%, #0b1020 100%);
          color: #ffffff;
        }

        .ws__apply-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 1.5rem;
          align-items: start;
        }

        .ws__form {
          padding: 1.6rem;
        }

        .ws__form-2col {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }

        .ws__field {
          margin-bottom: 1rem;
        }

        .ws__field label {
          display: block;
          color: var(--ink);
          font-size: 0.82rem;
          font-weight: 800;
          line-height: 1.3;
          margin-bottom: 0.45rem;
        }

        .ws__field input,
        .ws__field textarea {
          width: 100%;
          min-height: 46px;
          padding: 0.85rem 0.9rem;
          border: 1px solid #cfd6e2;
          border-radius: 8px;
          background: #ffffff;
          color: var(--ink);
          font-family: inherit;
          font-size: 0.95rem;
          line-height: 1.4;
          outline: none;
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }

        .ws__field textarea {
          min-height: 132px;
          resize: vertical;
        }

        .ws__field input:focus,
        .ws__field textarea:focus {
          border-color: var(--teal);
          box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
        }

        .ws__field input[type="file"] {
          padding: 0.65rem;
        }

        .ws__field input[type="file"]::file-selector-button {
          margin-right: 0.75rem;
          padding: 0.58rem 0.75rem;
          border: 0;
          border-radius: 8px;
          background: var(--soft-green);
          color: var(--teal-dark);
          font-family: inherit;
          font-size: 0.82rem;
          font-weight: 800;
          cursor: pointer;
        }

        .ws__file-meta {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 0.45rem;
          color: var(--muted);
          font-size: 0.78rem;
          line-height: 1.45;
        }

        .ws__file-meta strong {
          color: var(--teal-dark);
          text-align: right;
          word-break: break-word;
        }

        .ws__consent {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin: 1.1rem 0;
          color: var(--muted);
          font-size: 0.82rem;
          line-height: 1.55;
        }

        .ws__consent input {
          flex: 0 0 auto;
          width: 17px;
          height: 17px;
          margin-top: 0.2rem;
          accent-color: var(--teal);
        }

        .ws__consent a,
        .ws__direct a,
        .ws__footer a {
          color: var(--teal-dark);
          font-weight: 800;
          text-decoration: none;
        }

        .ws__consent a:hover,
        .ws__direct a:hover,
        .ws__footer a:hover {
          text-decoration: underline;
        }

        .ws__error {
          margin: 0 0 1rem;
          padding: 0.8rem 0.9rem;
          border: 1px solid rgba(180, 35, 24, 0.26);
          border-radius: 8px;
          background: #fff4f2;
          color: var(--error);
          font-size: 0.86rem;
          line-height: 1.45;
        }

        .ws__submit,
        .ws__success-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 48px;
          padding: 0.85rem 1rem;
          border: 1px solid var(--teal);
          border-radius: 8px;
          background: var(--teal);
          color: #ffffff;
          font-family: inherit;
          font-size: 0.96rem;
          font-weight: 900;
          line-height: 1.2;
          text-decoration: none;
          cursor: pointer;
          transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
        }

        .ws__submit:hover:not(:disabled),
        .ws__success-link:hover {
          background: var(--teal-dark);
          border-color: var(--teal-dark);
          transform: translateY(-2px);
          text-decoration: none;
        }

        .ws__submit:disabled {
          opacity: 0.52;
          cursor: not-allowed;
        }

        .ws__direct {
          margin: 1rem 0 0;
          color: var(--muted);
          font-size: 0.83rem;
          line-height: 1.55;
          text-align: center;
        }

        .ws__details {
          padding: 1.5rem;
          background: var(--ink);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .ws__details h3 {
          color: #ffffff;
          margin-bottom: 1.1rem;
        }

        .ws__details dl {
          margin: 0;
        }

        .ws__details div {
          padding: 0.85rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .ws__details dt {
          color: rgba(255, 255, 255, 0.58);
          font-size: 0.75rem;
          font-weight: 800;
          margin-bottom: 0.22rem;
          text-transform: uppercase;
        }

        .ws__details dd {
          margin: 0;
          color: rgba(255, 255, 255, 0.88);
          font-size: 0.9rem;
          line-height: 1.55;
        }

        .ws__partner {
          display: flex;
          gap: 0.85rem;
          align-items: center;
          margin-top: 1.2rem;
          padding: 1rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08);
        }

        .ws__partner-logo {
          width: 60px;
          height: auto;
          flex: 0 0 auto;
        }

        .ws__partner p {
          margin: 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 0.8rem;
          line-height: 1.45;
        }

        .ws__success {
          padding: 3rem 1.5rem;
          text-align: center;
        }

        .ws__success i {
          color: var(--teal);
          margin-left: auto;
          margin-right: auto;
        }

        .ws__success p {
          max-width: 520px;
          margin: 0 auto 1.25rem;
        }

        .ws__success-link {
          width: auto;
          min-width: 240px;
        }

        .ws__footer {
          padding: 3rem 1.5rem;
          background: #0b1020;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .ws__footer-logo {
          display: block;
          width: 170px;
          height: auto;
          margin: 0 auto 1rem;
        }

        .ws__footer p {
          margin: 0.45rem 0;
          color: rgba(255, 255, 255, 0.62);
          font-size: 0.82rem;
          line-height: 1.6;
        }

        .ws__footer a {
          color: #99f6e4;
        }

        @media (max-width: 1040px) {
          .ws__hero {
            min-height: auto;
            padding: 4.75rem 1.25rem 4.25rem;
          }

          .ws__hero-logo {
            width: 158px;
            margin-bottom: 1.35rem;
          }

          .ws__hero-title {
            margin: 0.85rem 0 1rem;
            font-size: 3rem;
          }

          .ws__hero-copy {
            margin-bottom: 1.25rem;
            font-size: 1.04rem;
            line-height: 1.62;
          }

          .ws__hero-actions {
            margin-bottom: 0;
          }

          .ws__session-band {
            padding: 1.5rem 1.25rem 0;
          }

          .ws__session > div {
            padding: 0.85rem 1rem;
          }

          .ws__intro-inner,
          .ws__metrics-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ws__role-inner,
          .ws__apply-layout {
            grid-template-columns: 1fr;
          }

          .ws__earning-panel,
          .ws__details {
            max-width: 560px;
          }

          .ws__benefit-grid,
          .ws__path-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .ws__hero {
            min-height: auto;
            padding: 4rem 1rem 3.5rem;
          }

          .ws__hero-logo {
            width: 148px;
            margin-bottom: 1.35rem;
          }

          .ws__hero-title,
          .ws__section-head h2,
          .ws__apply-head h2,
          .ws__role-copy h2 {
            font-size: 2.3rem;
          }

          .ws__hero-copy {
            font-size: 1rem;
          }

          .ws__hero-actions,
          .ws__btn {
            width: 100%;
          }

          .ws__session {
            grid-template-columns: 1fr;
          }

          .ws__session > div {
            border-right: 0;
            border-bottom: 1px solid var(--line);
          }

          .ws__session > div:last-child {
            border-bottom: 0;
          }

          .ws__intro-inner {
            margin-top: 0;
            grid-template-columns: 1fr;
          }

          .ws__intro,
          .ws__metrics,
          .ws__benefits,
          .ws__fit,
          .ws__path,
          .ws__apply,
          .ws__role {
            padding: 4rem 1rem;
          }

          .ws__session-band {
            padding: 1.25rem 1rem 0;
          }

          .ws__intro {
            padding-top: 2rem;
          }

          .ws__metrics-grid,
          .ws__benefit-grid,
          .ws__fit-grid,
          .ws__path-grid,
          .ws__form-2col {
            grid-template-columns: 1fr;
          }

          .ws__highlight,
          .ws__metrics-grid article {
            min-height: auto;
          }

          .ws__metrics-grid strong {
            font-size: 2.45rem;
          }

          .ws__form {
            padding: 1.15rem;
          }

          .ws__file-meta {
            flex-direction: column;
          }

          .ws__file-meta strong {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default WorkShop;
