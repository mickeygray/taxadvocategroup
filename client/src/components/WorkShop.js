import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SEO from "./SEO";

/* ─────────────────────────────────────────────────────────────────────────────
   MUSIC — swap HYPE_TRACK_YT_ID with any YouTube video ID you want.
   The iframe fires only after a real user click (satisfies browser autoplay).
   To find an ID: youtube.com/watch?v=THIS_PART
───────────────────────────────────────────────────────────────────────────── */
const HYPE_TRACK_YT_ID = "1QOJU2NeMaQ";

/* Pre-generated particles — static array avoids react-snap hydration mismatch */
const PARTICLES = [
  { left: 8, delay: 0.0, dur: 6.1, sym: "$" },
  { left: 17, delay: 1.3, dur: 4.8, sym: "💰" },
  { left: 26, delay: 0.7, dur: 5.5, sym: "⚡" },
  { left: 35, delay: 2.1, dur: 6.8, sym: "$" },
  { left: 44, delay: 0.4, dur: 4.2, sym: "🔥" },
  { left: 53, delay: 1.8, dur: 7.0, sym: "💎" },
  { left: 62, delay: 0.2, dur: 5.1, sym: "$" },
  { left: 71, delay: 2.6, dur: 4.5, sym: "💰" },
  { left: 80, delay: 1.0, dur: 6.3, sym: "⚡" },
  { left: 89, delay: 3.1, dur: 5.8, sym: "$" },
  { left: 12, delay: 3.8, dur: 4.9, sym: "🔥" },
  { left: 22, delay: 0.9, dur: 6.4, sym: "💎" },
  { left: 31, delay: 4.2, dur: 5.2, sym: "$" },
  { left: 48, delay: 1.5, dur: 7.1, sym: "💰" },
  { left: 59, delay: 2.9, dur: 4.7, sym: "⚡" },
  { left: 67, delay: 0.6, dur: 5.9, sym: "$" },
  { left: 76, delay: 3.4, dur: 6.0, sym: "🔥" },
  { left: 85, delay: 1.7, dur: 4.4, sym: "💎" },
  { left: 93, delay: 0.3, dur: 5.6, sym: "$" },
  { left: 4, delay: 2.3, dur: 6.7, sym: "💰" },
];

/* Eased animated counter, triggered by IntersectionObserver */
function useCounter(target, duration = 2200, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    let start = null;
    const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
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

const jobSchema = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: "Sales Representative – Tax Resolution",
  description:
    "Tax Advocate Group is hiring motivated Sales Representatives for our Chatsworth, CA office. No prior sales experience required. Performance-based compensation with top earners making $20,000–$25,000 per month. Full training, health benefits, 401(k), and promote-from-within culture.",
  hiringOrganization: {
    "@type": "Organization",
    name: "Tax Advocate Group",
    sameAs: "https://www.taxadvocategroup.com",
    logo: "https://www.taxadvocategroup.com/images/tax-advocate-group-logo-small.png",
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
  workHours: "Monday–Friday, 7:30 AM – 4:30 PM",
  baseSalary: {
    "@type": "MonetaryAmount",
    currency: "USD",
    value: {
      "@type": "QuantitativeValue",
      minValue: 50000,
      maxValue: 300000,
      unitText: "YEAR",
    },
  },
  incentiveCompensation:
    "Performance-based. Top earners $20,000–$25,000/month.",
  jobBenefits: "401(k) enrollment, Health Insurance, Vision, Dental",
  qualifications:
    "No prior sales experience required. Strong work ethic and self-motivation essential.",
  datePosted: "2026-04-16",
  validThrough: "2026-12-31",
};

/* ═══════════════════════════════════════════════════════════════════════════ */
const WorkShop = () => {
  const [musicOn, setMusicOn] = useState(false);
  const [ytSrc, setYtSrc] = useState("");
  const [countersOn, setCountersOn] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    why: "",
  });
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [heroReady, setHeroReady] = useState(false);
  const statsRef = useRef(null);

  const topMonthly = useCounter(25000, 2400, countersOn);
  const yearOnePot = useCounter(100000, 2600, countersOn);
  const clientsSaved = useCounter(5000, 2000, countersOn);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setCountersOn(true);
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Music: hidden YouTube iframe — renders only when ON, removing it stops audio */
  const toggleMusic = () => {
    if (musicOn) {
      setYtSrc("");
      setMusicOn(false);
    } else {
      setYtSrc(
        `https://www.youtube.com/embed/${HYPE_TRACK_YT_ID}?autoplay=1&loop=1&playlist=${HYPE_TRACK_YT_ID}&controls=0&mute=0`,
      );
      setMusicOn(true);
    }
  };

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* Direct POST to /api/workshop-apply → SendGrid → apply@taxadvocategroup.com
     Does NOT touch the webhook pipeline or CRM. */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) return;
    setSubmitting(true);
    setFormError("");
    try {
      await axios.post("/api/workshop-apply", formData);
      setSubmitted(true);
    } catch (err) {
      console.error("[WorkShop] submit error:", err);
      setFormError(
        "Something went wrong. Email us directly at apply@taxadvocategroup.com",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ws">
      <SEO
        title="Now Hiring: Sales Rep – Tax Advocate Group | Chatsworth, CA | Up to $25K/Mo"
        description="Join Tax Advocate Group's elite sales team in Chatsworth, CA. No experience required. Top reps earn $20K–$25K per month. Full training, health benefits, 401(k). Apply now."
        canonical="/workshop"
        structuredData={[jobSchema]}
        noindex={false}
      />

      {/* Hidden YouTube music player — only rendered when ON */}
      {ytSrc && (
        <iframe
          src={ytSrc}
          allow="autoplay"
          title="Background music"
          style={{
            position: "fixed",
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
            left: "-9999px",
            top: "-9999px",
          }}
        />
      )}

      {/* Music FAB */}
      <button
        className="ws__music-fab"
        onClick={toggleMusic}
        aria-label="Toggle music"
      >
        <span className="ws__music-icon">{musicOn ? "🔇" : "🎵"}</span>
        <span className="ws__music-label">{musicOn ? "Mute" : "Vibe"}</span>
      </button>

      {/* ── HERO ── */}
      <section className="ws__hero">
        <video
          className="ws__hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/Cover-Video-by-Shutterstock-1111048265-compressed_9.jpeg"
        >
          <source
            src="/images/Cover-Video-by-Shutterstock-1111048265-compressed.mp4"
            type="video/mp4"
          />
        </video>
        <div className="ws__hero-overlay" />
        <div className="ws__particles" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="ws__particle"
              style={{
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.dur}s`,
              }}
            >
              {p.sym}
            </span>
          ))}
        </div>
        <div
          className={`ws__hero-content ${heroReady ? "ws__hero-content--ready" : ""}`}
        >
          <img
            src="/images/tax-advocate-group-logo-small.png"
            alt="Tax Advocate Group"
            className="ws__logo"
          />
          <div className="ws__badge">
            <span className="ws__badge-dot" />
            NOW HIRING · CHATSWORTH, CA
          </div>
          <h1 className="ws__h1">
            Your Next<span className="ws__h1-gold"> Six Figures</span>
            <br />
            Starts <span className="ws__h1-glow">Here.</span>
          </h1>
          <p className="ws__hero-sub">
            No sales experience? No problem — we train winners from scratch.
            <br />
            <strong>
              Top performers earn $20,000–$25,000 every single month.
            </strong>
          </p>
          <div className="ws__hero-pills">
            <span>💰 Unlimited Earnings</span>
            <span>🏥 Full Benefits</span>
            <span>📈 Promote From Within</span>
            <span>🎓 We Train You</span>
          </div>
          <a href="#apply" className="ws__hero-cta">
            <span>Apply Now — It's Free</span>
            <span className="ws__arrow">→</span>
          </a>
          <div className="ws__hero-contact">
            <a href="tel:+18182302223">(818) 230-2223</a>
            <span>·</span>
            <a href="mailto:apply@taxadvocategroup.com">
              apply@taxadvocategroup.com
            </a>
          </div>
        </div>
      </section>

      {/* ── BIG NUMBERS ── */}
      <section className="ws__numbers" ref={statsRef}>
        <div className="ws__numbers-inner">
          <div className="ws__num-card">
            <div className="ws__num-value">
              ${topMonthly.toLocaleString()}
              <span className="ws__num-unit">/mo</span>
            </div>
            <div className="ws__num-title">Top Earners Bring Home</div>
            <div className="ws__num-desc">
              Our best reps make this every month — consistently
            </div>
          </div>
          <div className="ws__num-divider" />
          <div className="ws__num-card ws__num-card--gold">
            <div className="ws__num-value">
              ${yearOnePot.toLocaleString()}
              <span className="ws__num-unit">+</span>
            </div>
            <div className="ws__num-title">Year-One Potential</div>
            <div className="ws__num-desc">
              Six figures is achievable if you put in the work
            </div>
          </div>
          <div className="ws__num-divider" />
          <div className="ws__num-card">
            <div className="ws__num-value">
              {clientsSaved.toLocaleString()}
              <span className="ws__num-unit">+</span>
            </div>
            <div className="ws__num-title">Clients We've Helped</div>
            <div className="ws__num-desc">
              Real people. Real relief. You made that happen.
            </div>
          </div>
        </div>
        <p className="ws__numbers-tagline">
          "We make big money here. Your dreams can come true.{" "}
          <strong>The sky is the limit.</strong>"
        </p>
      </section>

      {/* ── VIDEO ── */}
      <section className="ws__video-section">
        <div className="ws__video-inner">
          <span className="ws__section-label">Watch &amp; Decide</span>
          <h2 className="ws__section-h2">
            See the Team That's
            <span className="ws__gold-text"> Changing Lives</span>
          </h2>
          <p className="ws__section-p">
            Know what we're about before you apply. This is real.
          </p>
          <div className="ws__video-frame">
            <iframe
              src="https://www.youtube.com/embed/9N_KN7qeFvQ?rel=0&modestbranding=1"
              title="Tax Advocate Group"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── OPPORTUNITY ── */}
      <section className="ws__opp">
        <div className="ws__opp-inner">
          <div className="ws__opp-text">
            <span className="ws__section-label">The Opportunity</span>
            <h2 className="ws__section-h2">
              More Than a Job.
              <br />
              <span className="ws__gold-text">A Career Path.</span>
            </h2>
            <p className="ws__section-p">
              Tax Advocate Group helps thousands of Americans escape crushing
              IRS debt. You're the person who connects them to the team that can
              fix it.
            </p>
            <p className="ws__section-p">
              And for that work, <strong>you earn accordingly.</strong> No cap.
              No ceiling. Your pay reflects your effort — every single week.
            </p>
            <ul className="ws__opp-list">
              <li>
                <span>✅</span> Full training from day one — no experience
                needed
              </li>
              <li>
                <span>✅</span> Real management that invests in your growth
              </li>
              <li>
                <span>✅</span> Performance pay with no earning limit
              </li>
              <li>
                <span>✅</span> Promote from within — leadership filled
                internally
              </li>
              <li>
                <span>✅</span> Meaningful work — you help people sleep at night
              </li>
            </ul>
          </div>
          <div className="ws__opp-card">
            <div className="ws__opp-card-header">
              <span>📋</span> The Details
            </div>
            <div className="ws__opp-card-body">
              {[
                ["📍", "Location", "Chatsworth, CA 91311"],
                ["🕗", "Schedule", "M–F · 7:30 AM – 4:30 PM"],
                ["💼", "Type", "Full-Time · In-Office"],
                ["💰", "Compensation", "Performance-Based · No Cap"],
                ["🏥", "Health Benefits", "Medical, Vision & Dental"],
                ["🏦", "Retirement", "401(k) Enrollment"],
                ["🚀", "Growth", "Promote Exclusively From Within"],
              ].map(([icon, label, val]) => (
                <div key={label} className="ws__opp-row">
                  <span className="ws__opp-icon-sm">{icon}</span>
                  <div>
                    <strong>{label}</strong>
                    {val}
                  </div>
                </div>
              ))}
            </div>
            <a href="#apply" className="ws__opp-card-cta">
              I'm Ready — Apply Now →
            </a>
          </div>
        </div>
      </section>

      {/* ── WHO WE WANT ── */}
      <section className="ws__want">
        <div className="ws__want-inner">
          <span className="ws__section-label ws__section-label--light">
            Who We're Looking For
          </span>
          <h2 className="ws__section-h2">
            We Don't Need a Résumé.
            <br />
            We Need <span className="ws__gold-text">Hunger.</span>
          </h2>
          <p className="ws__section-p ws__section-p--light">
            No prior sales experience required. We will train you on everything.
            What we <em>can't</em> teach is attitude.
          </p>
          <div className="ws__traits">
            {[
              [
                "🔥",
                "Driven",
                "You want more out of life and you're ready to work for it. Every. Single. Day.",
              ],
              [
                "📞",
                "Communicator",
                "You can talk to anyone, build rapport fast, and make people feel heard.",
              ],
              [
                "📋",
                "Coachable",
                "You listen, learn, and apply feedback immediately. No ego in the way.",
              ],
              [
                "⚡",
                "Resilient",
                "You bounce back, keep dialing, and don't quit when it gets tough.",
              ],
              [
                "🎯",
                "Goal-Oriented",
                "You're motivated by outcomes. Your number on the board means something to you.",
              ],
              [
                "🤝",
                "Team Player",
                "You lift the people around you and celebrate shared wins.",
              ],
            ].map(([icon, title, desc]) => (
              <div key={title} className="ws__trait">
                <div className="ws__trait-icon">{icon}</div>
                <h4 className="ws__trait-title">{title}</h4>
                <p className="ws__trait-desc">{desc}</p>
              </div>
            ))}
          </div>
          <div className="ws__no-exp-banner">
            <span>🎓 No Sales Experience Required</span>
            <span className="ws__no-exp-sep">·</span>
            <span>We Train You From Day One</span>
            <span className="ws__no-exp-sep">·</span>
            <span>Full-Time In-Office Position</span>
          </div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="ws__quote">
        <div className="ws__quote-inner">
          <div className="ws__quote-mark" aria-hidden="true">
            "
          </div>
          <blockquote className="ws__quote-text">
            Joining TAG was the best decision I ever made. My first full month,
            I closed enough deals to pay off three months of bills. Now I'm
            helping lead my own team. This place is the real deal — if you're
            willing to put in the work, the money will follow.
          </blockquote>
          <cite className="ws__quote-cite">
            — Current TAG Sales Team Member, Chatsworth
          </cite>
        </div>
      </section>

      {/* ── APPLICATION FORM ── */}
      <section className="ws__apply" id="apply">
        <div className="ws__apply-inner">
          <span className="ws__section-label">Join the Team</span>
          <h2 className="ws__section-h2">
            Apply Now — <span className="ws__gold-text">Takes 60 Seconds.</span>
          </h2>
          <p className="ws__section-p">
            Fill this out and we'll reach out fast. Spots are limited.
          </p>

          {submitted ? (
            <div className="ws__success">
              <div className="ws__success-icon">🎉</div>
              <h3 className="ws__success-title">Application Received!</h3>
              <p className="ws__success-msg">
                Our team will reach out within 1 business day. Get ready — your
                future is about to change.
              </p>
              <a href="tel:+18182302223" className="ws__success-cta">
                Or Call Us: (818) 230-2223
              </a>
            </div>
          ) : (
            <form className="ws__form" onSubmit={handleSubmit} noValidate>
              <div className="ws__form-row">
                <div className="ws__form-group">
                  <label htmlFor="ws-name">Full Name *</label>
                  <input
                    id="ws-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="ws__form-group">
                  <label htmlFor="ws-phone">Phone Number *</label>
                  <input
                    id="ws-phone"
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
              <div className="ws__form-group">
                <label htmlFor="ws-email">Email Address *</label>
                <input
                  id="ws-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@email.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="ws__form-group">
                <label htmlFor="ws-why">
                  Why do you want this opportunity? *
                </label>
                <textarea
                  id="ws-why"
                  name="why"
                  value={formData.why}
                  onChange={handleChange}
                  placeholder="Tell us what motivates you and why you're ready to win..."
                  rows={5}
                  required
                />
              </div>
              <div className="ws__form-consent">
                <label className="ws__consent-label">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                  />
                  <span>
                    By submitting, I consent to being contacted by Tax Advocate
                    Group regarding this employment opportunity.{" "}
                    <Link to="/privacy-policy">Privacy Policy</Link>.
                  </span>
                </label>
              </div>
              {formError && <p className="ws__form-error">{formError}</p>}
              <button
                type="submit"
                className={`ws__submit ${!consent || submitting ? "ws__submit--disabled" : ""}`}
                disabled={!consent || submitting}
              >
                {submitting ? "Sending..." : "🚀 Submit My Application"}
              </button>
              <p className="ws__form-note">
                Or email:{" "}
                <a href="mailto:apply@taxadvocategroup.com">
                  apply@taxadvocategroup.com
                </a>
                &nbsp;|&nbsp;<a href="tel:+18182302223">(818) 230-2223</a>
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="ws__footer">
        <img
          src="/images/tax-advocate-group-logo-small.png"
          alt="Tax Advocate Group"
          className="ws__footer-logo"
        />
        <p className="ws__footer-addr">
          21625 Prairie Street, Suite #200 · Chatsworth, CA 91311
        </p>
        <p className="ws__footer-contact">
          <a href="tel:+18182302223">(818) 230-2223</a>&nbsp;·&nbsp;
          <a href="mailto:apply@taxadvocategroup.com">
            apply@taxadvocategroup.com
          </a>
        </p>
        <p className="ws__footer-legal">
          &copy; {new Date().getFullYear()} Tax Advocate Group, LLC. All Rights
          Reserved.&nbsp;|&nbsp;
          <Link to="/privacy-policy">Privacy Policy</Link>&nbsp;|&nbsp;
          <Link to="/terms-of-service">Terms of Service</Link>
        </p>
      </footer>

      <style>{`
        .ws{font-family:'Montserrat','Poppins',Arial,sans-serif;color:#fff;overflow-x:hidden;background:#0a0e1a}
        .ws *,.ws *::before,.ws *::after{box-sizing:border-box}
        .ws__music-fab{position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;align-items:center;gap:.4rem;padding:.6rem 1rem;background:rgba(201,162,39,.15);border:2px solid #c9a227;border-radius:50px;color:#c9a227;font-family:inherit;font-size:.82rem;font-weight:700;cursor:pointer;backdrop-filter:blur(8px);transition:background .2s,transform .2s;text-transform:uppercase;letter-spacing:.06em}
        .ws__music-fab:hover{background:rgba(201,162,39,.3);transform:scale(1.05)}
        .ws__music-icon{font-size:1rem}
        .ws__hero{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .ws__hero-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
        .ws__hero-overlay{position:absolute;inset:0;background:linear-gradient(160deg,rgba(5,10,30,.95) 0%,rgba(10,20,60,.88) 40%,rgba(20,10,40,.82) 100%);z-index:1}
        .ws__particles{position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden}
        .ws__particle{position:absolute;top:-2rem;font-size:1.1rem;opacity:.55;animation:ws-fall linear infinite;will-change:transform}
        @keyframes ws-fall{0%{transform:translateY(-2rem) rotate(0deg);opacity:0}10%{opacity:.55}90%{opacity:.55}100%{transform:translateY(110vh) rotate(360deg);opacity:0}}
        .ws__hero-content{position:relative;z-index:3;text-align:center;padding:2rem 1.5rem 3rem;max-width:900px;width:100%;opacity:0;transform:translateY(28px);transition:opacity .9s ease,transform .9s ease}
        .ws__hero-content--ready{opacity:1;transform:translateY(0)}
        .ws__logo{height:60px;width:auto;margin:0 auto 1.5rem;display:block;filter:brightness(1.1)}
        .ws__badge{display:inline-flex;align-items:center;gap:.5rem;background:rgba(201,162,39,.15);border:1px solid rgba(201,162,39,.5);border-radius:50px;padding:.4rem 1rem;font-size:.72rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#c9a227;margin-bottom:1.25rem}
        .ws__badge-dot{width:7px;height:7px;background:#c9a227;border-radius:50%;animation:ws-pulse 1.8s ease-in-out infinite}
        @keyframes ws-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.35)}}
        .ws__h1{font-size:clamp(2.4rem,6vw,5rem);font-weight:900;line-height:1.08;margin-bottom:1.25rem;letter-spacing:-.02em;color:#fff}
        .ws__h1-gold{color:#c9a227}
        .ws__h1-glow{background:linear-gradient(90deg,#f0c060,#fff 40%,#f0c060);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:ws-sweep 3s linear infinite}
        @keyframes ws-sweep{0%{background-position:0% center}100%{background-position:200% center}}
        .ws__hero-sub{font-size:clamp(1rem,2.2vw,1.25rem);color:rgba(255,255,255,.85);line-height:1.65;max-width:640px;margin:0 auto 1.75rem}
        .ws__hero-sub strong{color:#f0c060}
        .ws__hero-pills{display:flex;flex-wrap:wrap;gap:.6rem;justify-content:center;margin-bottom:2rem}
        .ws__hero-pills span{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:50px;padding:.4rem .9rem;font-size:.8rem;font-weight:600;backdrop-filter:blur(6px);color:rgba(255,255,255,.9);white-space:nowrap}
        .ws__hero-cta{display:inline-flex;align-items:center;gap:.5rem;padding:1.05rem 2.5rem;background:linear-gradient(135deg,#c9a227 0%,#f0c060 50%,#c9a227 100%);background-size:200% auto;color:#0a0e1a;font-size:1.1rem;font-weight:900;letter-spacing:.04em;text-transform:uppercase;border-radius:50px;text-decoration:none;animation:ws-shine 3s linear infinite,ws-hero-pulse 2.5s ease-in-out infinite;box-shadow:0 0 30px rgba(201,162,39,.5);margin-bottom:1.25rem}
        .ws__hero-cta:hover{box-shadow:0 0 50px rgba(201,162,39,.75)}
        .ws__arrow{font-size:1.2rem;transition:transform .2s}
        .ws__hero-cta:hover .ws__arrow{transform:translateX(4px)}
        @keyframes ws-shine{0%{background-position:0% center}100%{background-position:200% center}}
        @keyframes ws-hero-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
        .ws__hero-contact{font-size:.88rem;color:rgba(255,255,255,.6)}
        .ws__hero-contact a{color:rgba(255,255,255,.8);text-decoration:none;transition:color .2s}
        .ws__hero-contact a:hover{color:#c9a227}
        .ws__hero-contact span{margin:0 .4rem}
        .ws__numbers{background:linear-gradient(135deg,#0f1a3d 0%,#1a2b5e 50%,#0f1a3d 100%);padding:4rem 2rem;border-top:3px solid #c9a227;border-bottom:3px solid rgba(201,162,39,.3);text-align:center}
        .ws__numbers-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:center;flex-wrap:wrap}
        .ws__num-card{flex:1;min-width:220px;padding:2rem 1.5rem}
        .ws__num-card--gold .ws__num-value{color:#f0c060}
        .ws__num-divider{width:1px;height:80px;background:rgba(201,162,39,.3);flex-shrink:0}
        .ws__num-value{font-size:clamp(2.5rem,5vw,4rem);font-weight:900;color:#fff;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums;margin-bottom:.5rem}
        .ws__num-unit{font-size:.45em;color:#c9a227;font-weight:700;vertical-align:super}
        .ws__num-title{font-size:.82rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:#c9a227;margin-bottom:.4rem}
        .ws__num-desc{font-size:.82rem;color:rgba(255,255,255,.55);line-height:1.5}
        .ws__numbers-tagline{margin-top:2.5rem;font-size:1.1rem;color:rgba(255,255,255,.7);font-style:italic}
        .ws__numbers-tagline strong{color:#c9a227}
        .ws__video-section{background:#06090f;padding:5rem 2rem}
        .ws__video-inner{max-width:800px;margin:0 auto;text-align:center}
        .ws__video-frame{position:relative;padding-bottom:56.25%;height:0;border-radius:12px;overflow:hidden;margin-top:2rem;box-shadow:0 20px 60px rgba(0,0,0,.6),0 0 40px rgba(201,162,39,.15);border:2px solid rgba(201,162,39,.25)}
        .ws__video-frame iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:none}
        .ws__section-label{display:inline-block;font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.16em;color:#c9a227;margin-bottom:.6rem}
        .ws__section-label--light{color:#f0c060}
        .ws__section-h2{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;line-height:1.15;margin-bottom:1rem;color:#fff}
        .ws__section-p{font-size:1rem;line-height:1.75;color:rgba(255,255,255,.7);max-width:640px;margin:0 auto 1rem}
        .ws__section-p--light{color:rgba(255,255,255,.75)}
        .ws__gold-text{color:#c9a227}
        .ws__opp{background:#0c1120;padding:5rem 2rem}
        .ws__opp-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 380px;gap:3.5rem;align-items:start}
        .ws__opp-list{list-style:none;padding:0;margin:1.25rem 0 0}
        .ws__opp-list li{display:flex;align-items:flex-start;gap:.7rem;padding:.55rem 0;font-size:.95rem;color:rgba(255,255,255,.8);border-bottom:1px solid rgba(255,255,255,.06);line-height:1.5}
        .ws__opp-list li:last-child{border-bottom:none}
        .ws__opp-list li span{flex-shrink:0}
        .ws__opp-card{background:linear-gradient(145deg,#1a2b5e 0%,#0f1a3d 100%);border:2px solid rgba(201,162,39,.4);border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.4);position:sticky;top:2rem}
        .ws__opp-card-header{background:#c9a227;color:#0a0e1a;font-weight:800;font-size:.85rem;text-transform:uppercase;letter-spacing:.1em;padding:.85rem 1.5rem;display:flex;align-items:center;gap:.5rem}
        .ws__opp-card-body{padding:1.25rem 1.5rem}
        .ws__opp-row{display:flex;align-items:flex-start;gap:.85rem;padding:.7rem 0;border-bottom:1px solid rgba(255,255,255,.07);font-size:.88rem;color:rgba(255,255,255,.85);line-height:1.4}
        .ws__opp-row:last-child{border-bottom:none}
        .ws__opp-icon-sm{font-size:1.1rem;flex-shrink:0;margin-top:.1rem}
        .ws__opp-row strong{display:block;font-size:.75rem;text-transform:uppercase;letter-spacing:.07em;color:#c9a227;margin-bottom:.1rem}
        .ws__opp-card-cta{display:block;margin:0 1.5rem 1.5rem;padding:.85rem;background:#c9a227;color:#0a0e1a;text-align:center;font-weight:800;font-size:.9rem;text-transform:uppercase;letter-spacing:.06em;border-radius:8px;text-decoration:none;transition:background .2s,transform .2s}
        .ws__opp-card-cta:hover{background:#f0c060;transform:translateY(-2px)}
        .ws__want{background:linear-gradient(160deg,#0a0e1a 0%,#14203a 50%,#0a0e1a 100%);padding:5rem 2rem;text-align:center}
        .ws__want-inner{max-width:1100px;margin:0 auto}
        .ws__traits{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;margin:2.5rem 0;text-align:left}
        .ws__trait{background:rgba(255,255,255,.04);border:1px solid rgba(201,162,39,.2);border-radius:12px;padding:1.5rem;transition:border-color .25s,transform .25s,background .25s}
        .ws__trait:hover{border-color:#c9a227;transform:translateY(-3px);background:rgba(201,162,39,.06)}
        .ws__trait-icon{font-size:2rem;margin-bottom:.75rem}
        .ws__trait-title{font-size:1rem;font-weight:800;color:#fff;margin-bottom:.4rem}
        .ws__trait-desc{font-size:.88rem;color:rgba(255,255,255,.6);line-height:1.6}
        .ws__no-exp-banner{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:.75rem;background:rgba(201,162,39,.1);border:1px solid rgba(201,162,39,.3);border-radius:8px;padding:1rem 1.5rem;font-size:.88rem;font-weight:700;color:#f0c060;text-transform:uppercase;letter-spacing:.06em}
        .ws__no-exp-sep{opacity:.4}
        .ws__quote{background:#c9a227;padding:4rem 2rem;text-align:center}
        .ws__quote-inner{max-width:760px;margin:0 auto;position:relative}
        .ws__quote-mark{font-size:8rem;color:rgba(0,0,0,.12);font-family:Georgia,serif;line-height:.6;position:absolute;top:-1rem;left:-1rem;pointer-events:none}
        .ws__quote-text{font-size:clamp(1.05rem,2.5vw,1.3rem);font-weight:600;color:#0a0e1a;line-height:1.7;font-style:italic;margin:0 0 1.25rem;position:relative;z-index:1}
        .ws__quote-cite{font-size:.85rem;font-weight:800;color:rgba(10,14,26,.7);text-transform:uppercase;letter-spacing:.08em;font-style:normal}
        .ws__apply{background:#06090f;padding:5rem 2rem}
        .ws__apply-inner{max-width:680px;margin:0 auto;text-align:center}
        .ws__form{background:linear-gradient(145deg,#0f1a3d 0%,#0c1225 100%);border:2px solid rgba(201,162,39,.35);border-radius:16px;padding:2.5rem 2rem;text-align:left;margin-top:2rem;box-shadow:0 20px 60px rgba(0,0,0,.5)}
        .ws__form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        .ws__form-group{margin-bottom:1.1rem}
        .ws__form-group label{display:block;font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.6);margin-bottom:.45rem}
        .ws__form-group input,.ws__form-group textarea{width:100%;padding:.85rem 1rem;background:rgba(255,255,255,.06);border:1.5px solid rgba(201,162,39,.25);border-radius:8px;font-family:inherit;font-size:.95rem;color:#fff;transition:border-color .2s,background .2s;outline:none}
        .ws__form-group input::placeholder,.ws__form-group textarea::placeholder{color:rgba(255,255,255,.3)}
        .ws__form-group input:focus,.ws__form-group textarea:focus{border-color:#c9a227;background:rgba(201,162,39,.06)}
        .ws__form-group textarea{resize:vertical;min-height:110px}
        .ws__form-consent{margin:1rem 0 1.5rem}
        .ws__consent-label{display:flex;align-items:flex-start;gap:.75rem;cursor:pointer;font-size:.78rem;color:rgba(255,255,255,.5);line-height:1.5}
        .ws__consent-label input[type="checkbox"]{width:16px;height:16px;margin-top:2px;flex-shrink:0;accent-color:#c9a227}
        .ws__consent-label a{color:#c9a227}
        .ws__form-error{color:#f87171;font-size:.85rem;margin-bottom:1rem;text-align:center;padding:.6rem;background:rgba(248,113,113,.1);border-radius:6px;border:1px solid rgba(248,113,113,.3)}
        .ws__submit{width:100%;padding:1.1rem;background:linear-gradient(135deg,#c9a227 0%,#f0c060 50%,#c9a227 100%);background-size:200% auto;border:none;border-radius:8px;font-family:inherit;font-size:1rem;font-weight:900;color:#0a0e1a;text-transform:uppercase;letter-spacing:.08em;cursor:pointer;animation:ws-shine 3s linear infinite;box-shadow:0 4px 20px rgba(201,162,39,.35);transition:box-shadow .2s,transform .2s}
        .ws__submit:hover:not(:disabled){box-shadow:0 6px 30px rgba(201,162,39,.55);transform:translateY(-2px)}
        .ws__submit--disabled{opacity:.45;cursor:not-allowed;animation:none}
        .ws__form-note{margin-top:1.25rem;font-size:.8rem;color:rgba(255,255,255,.4);text-align:center}
        .ws__form-note a{color:#c9a227;text-decoration:none}
        .ws__form-note a:hover{text-decoration:underline}
        .ws__success{background:linear-gradient(145deg,#0f1a3d 0%,#0c1225 100%);border:2px solid rgba(201,162,39,.4);border-radius:16px;padding:3rem 2rem;text-align:center;margin-top:2rem}
        .ws__success-icon{font-size:4rem;margin-bottom:1rem}
        .ws__success-title{font-size:1.6rem;font-weight:900;color:#c9a227;margin-bottom:.75rem}
        .ws__success-msg{font-size:1rem;color:rgba(255,255,255,.75);line-height:1.65;margin-bottom:1.5rem}
        .ws__success-cta{display:inline-block;padding:.85rem 2rem;background:#c9a227;color:#0a0e1a;font-weight:800;font-size:.9rem;border-radius:8px;text-decoration:none;text-transform:uppercase;letter-spacing:.06em;transition:background .2s}
        .ws__success-cta:hover{background:#f0c060}
        .ws__footer{background:#040609;border-top:3px solid #c9a227;padding:2.5rem 2rem;text-align:center}
        .ws__footer-logo{height:45px;width:auto;margin:0 auto .75rem;display:block;opacity:.85}
        .ws__footer-addr{font-size:.85rem;color:rgba(255,255,255,.45);margin-bottom:.4rem}
        .ws__footer-contact{font-size:.85rem;color:rgba(255,255,255,.55);margin-bottom:.75rem}
        .ws__footer-contact a{color:#c9a227;text-decoration:none}
        .ws__footer-contact a:hover{text-decoration:underline}
        .ws__footer-legal{font-size:.75rem;color:rgba(255,255,255,.3)}
        .ws__footer-legal a{color:rgba(201,162,39,.7);text-decoration:none}
        .ws__footer-legal a:hover{color:#c9a227}
        @media(max-width:1024px){.ws__opp-inner{grid-template-columns:1fr}.ws__opp-card{position:static;max-width:480px}.ws__traits{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:768px){
          .ws__music-fab .ws__music-label{display:none}.ws__music-fab{padding:.65rem}
          .ws__num-divider{display:none}.ws__numbers-inner{flex-direction:column}
          .ws__num-card{padding:1.5rem 1rem;border-bottom:1px solid rgba(201,162,39,.15)}.ws__num-card:last-child{border-bottom:none}
          .ws__form-row{grid-template-columns:1fr}.ws__traits{grid-template-columns:1fr}
          .ws__opp-card{max-width:100%}.ws__no-exp-banner{flex-direction:column;gap:.4rem}.ws__no-exp-sep{display:none}
          .ws__form{padding:1.75rem 1.25rem}
        }
        @media(max-width:480px){.ws__hero-cta{padding:.9rem 1.75rem;font-size:.95rem}.ws__badge{font-size:.65rem}}
      `}</style>
    </div>
  );
};

export default WorkShop;
