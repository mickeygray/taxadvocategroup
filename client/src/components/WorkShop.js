import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SEO from "./SEO";

/* ─────────────────────────────────────────────────────────────────────────────
   MUSIC — swap the ID. Plays on load. FAB defaults to STOP.
   youtube.com/watch?v= ← that part
───────────────────────────────────────────────────────────────────────────── */
const HYPE_TRACK_YT_ID = "tDsZoQX1gis";
// Starts MUTED — browsers block audio autoplay without a prior user gesture (mobile is strictest).
// We unmute via postMessage on first user interaction. enablejsapi=1 enables postMessage control.
const YT_SRC = `https://www.youtube.com/embed/${HYPE_TRACK_YT_ID}?autoplay=1&loop=1&playlist=${HYPE_TRACK_YT_ID}&controls=0&mute=1&enablejsapi=1`;

/* Ticker lines — two tracks, opposite directions for kinetic energy */
const TICKER_GOLD = [
  "$65M+ IN REVENUE",
  "TOP REP $50K/MO",
  "$200M+ SAVED FOR CLIENTS",
  "A+ BBB RATED",
  "5,000+ LIVES CHANGED",
  "FORTUNE-LEVEL EARNINGS",
  "REAL MONEY · REAL RESULTS",
  "NOW HIRING · CHATSWORTH CA",
];
const TICKER_RED = [
  "NO EXPERIENCE REQUIRED",
  "PROMOTE FROM WITHIN · ALWAYS",
  "FULL BENEFITS + 401(K)",
  "WE TRAIN WINNERS FROM SCRATCH",
  "HIRING SEMINAR — LIMITED SPOTS",
  "APPLY TODAY",
];

const PARTICLES = [
  { left: 7, delay: 0.0, dur: 6.2, sym: "$" },
  { left: 14, delay: 1.4, dur: 4.9, sym: "💰" },
  { left: 23, delay: 0.6, dur: 5.6, sym: "⚡" },
  { left: 31, delay: 2.2, dur: 6.9, sym: "$" },
  { left: 40, delay: 0.3, dur: 4.3, sym: "🔥" },
  { left: 49, delay: 1.9, dur: 7.1, sym: "💎" },
  { left: 58, delay: 0.1, dur: 5.2, sym: "$" },
  { left: 66, delay: 2.7, dur: 4.6, sym: "💰" },
  { left: 75, delay: 1.1, dur: 6.4, sym: "⚡" },
  { left: 84, delay: 3.2, dur: 5.9, sym: "$" },
  { left: 11, delay: 3.9, dur: 5.0, sym: "🔥" },
  { left: 20, delay: 0.8, dur: 6.5, sym: "💎" },
  { left: 36, delay: 4.3, dur: 5.3, sym: "$" },
  { left: 53, delay: 1.6, dur: 7.2, sym: "💰" },
  { left: 62, delay: 3.0, dur: 4.8, sym: "⚡" },
  { left: 71, delay: 0.5, dur: 6.0, sym: "$" },
  { left: 79, delay: 3.5, dur: 6.1, sym: "🔥" },
  { left: 88, delay: 1.8, dur: 4.5, sym: "💎" },
  { left: 94, delay: 0.2, dur: 5.7, sym: "$" },
  { left: 3, delay: 2.4, dur: 6.8, sym: "💰" },
];

function useCounter(target, duration = 2200, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf,
      start = null;
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
    "Tax Advocate Group hiring seminar. No experience required. Top reps earn $40,000–$50,000/month. $200M+ saved for clients lifetime. Full benefits, 401(k), promote-from-within culture. Chatsworth, CA.",
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

/* ═══════════════════════════════════════════════════════════════════════════ */
const WorkShop = () => {
  const [ytSrc, setYtSrc] = useState(YT_SRC);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const [soundUnlocked, setSoundUnlocked] = useState(false); // false = still muted, waiting for gesture
  const [countersOn, setCountersOn] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [visible, setVisible] = useState({});
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
  const [showModal, setShowModal] = useState(false);

  const statsRef = useRef(null);
  const sectionRefs = useRef({});
  const iframeRef = useRef(null);

  // Send a command to the YouTube iframe via postMessage
  const ytCmd = (func) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: "" }),
      "*",
    );
  };

  // Unlock sound on first user interaction anywhere on the page.
  // Browsers require a gesture before audio can play — this fires once then removes itself.
  useEffect(() => {
    if (soundUnlocked) return;
    const unlock = () => {
      ytCmd("unMute");
      setSoundUnlocked(true);
    };
    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("touchstart", unlock, {
      once: true,
      passive: true,
    });
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
    };
  }, [soundUnlocked]);

  const grossRev = useCounter(65, 1600, countersOn);
  const clientSav = useCounter(200, 1900, countersOn);
  const topEarner = useCounter(50000, 2200, countersOn);
  const clients = useCounter(5000, 2000, countersOn);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setCountersOn(true);
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting)
            setVisible((p) => ({ ...p, [e.target.dataset.reveal]: true }));
        });
      },
      { threshold: 0.1 },
    );
    Object.values(sectionRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const ref = (key) => (el) => {
    if (el) {
      el.dataset.reveal = key;
      sectionRefs.current[key] = el;
    }
  };

  const toggleMusic = () => {
    if (musicPlaying) {
      ytCmd("pauseVideo");
      setMusicPlaying(false);
    } else {
      ytCmd("playVideo");
      // If they somehow toggle before unlock, unmute now too
      if (!soundUnlocked) {
        ytCmd("unMute");
        setSoundUnlocked(true);
      }
      setMusicPlaying(true);
    }
  };

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) return;
    setSubmitting(true);
    setFormError("");
    try {
      const res = await axios.post("/api/workshop-apply", formData);
      if (res.status === 200) {
        setShowModal(true);
        setSubmitted(true);
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setFormError(
          "Server error (404) — call us directly at (818) 230-2223.",
        );
      } else {
        setFormError(
          "Something went wrong. Call (818) 230-2223 or email inquiry@taxadvocategroup.com.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ws">
      <SEO
        title="Hiring Seminar | Tax Advocate Group — Real Money. Real Opportunity. Chatsworth, CA."
        description="Tax Advocate Group hiring seminar. Top reps earn $40K–$50K/month. $200M+ saved for clients lifetime. No experience required. Full training, benefits, 401(k). Apply now."
        canonical="/seminar"
        structuredData={[jobSchema]}
        noindex={false}
      />

      {/* Hidden YouTube player — always mounted so postMessage works */}
      <iframe
        ref={iframeRef}
        src={ytSrc}
        allow="autoplay; encrypted-media"
        title="hype"
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

      {/* ── Music FAB ── */}
      <button
        className={`ws__fab ${!soundUnlocked ? "ws__fab--nudge" : ""}`}
        onClick={toggleMusic}
        aria-label={musicPlaying ? "Stop music" : "Play music"}
      >
        {!soundUnlocked ? (
          <>
            <span>🔊</span>
            <span>TAP FOR SOUND</span>
          </>
        ) : musicPlaying ? (
          <>
            <span className="ws__eq">
              <span />
              <span />
              <span />
              <span />
              <span />
            </span>
            <span>STOP</span>
          </>
        ) : (
          <>
            <span>▶</span>
            <span>PLAY</span>
          </>
        )}
      </button>

      {/* ── Urgency Bar ── */}
      <div className="ws__urgency-bar">
        <div className="ws__urgency-bar-inner">
          <span className="ws__urgency-bar-dot" />
          <span className="ws__urgency-bar-text">
            <strong>Next Seminar: May 9th at 10:00 AM.</strong> Spots are
            filling fast — apply before this closes.
          </span>
          <a href="#apply" className="ws__urgency-bar-cta">
            Claim My Spot →
          </a>
        </div>
      </div>

      {/* ── Double ticker ── */}
      <div className="ws__tickers">
        <div className="ws__ticker ws__ticker--gold">
          <div className="ws__ticker-track">
            {[...TICKER_GOLD, ...TICKER_GOLD].map((t, i) => (
              <span key={i} className="ws__ticker-item">
                <span className="ws__ticker-gem">◆</span>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="ws__ticker ws__ticker--red">
          <div className="ws__ticker-track ws__ticker-track--rev">
            {[...TICKER_RED, ...TICKER_RED].map((t, i) => (
              <span key={i} className="ws__ticker-item">
                <span className="ws__ticker-gem">◆</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════ HERO ══════════════════════════════ */}
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
        <div className="ws__hero-scrim" />
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
          className={`ws__hero-body ${heroReady ? "ws__hero-body--in" : ""}`}
        >
          <img
            src="/images/tax-advocate-group-logo-small.png"
            alt="Tax Advocate Group"
            className="ws__hero-logo"
          />

          <div className="ws__hero-eyebrow">
            <span className="ws__eyebrow-dot" />
            NEXT SEMINAR: MAY 9TH · 10:00 AM · CHATSWORTH, CA
          </div>

          <h1 className="ws__hero-h1">
            <span className="ws__h1-top">Stop Settling.</span>
            <span className="ws__h1-mid">
              Start <em>Earning</em>
            </span>
            <span className="ws__h1-bot">Like You Mean It.</span>
          </h1>

          <p className="ws__hero-deck">
            We have generated over <strong>$65 million</strong> in revenue and
            saved our clients over <strong>$200 million</strong>
            in tax debt. Our top reps take home{" "}
            <strong>$40,000–$50,000 a month.</strong>
            <br />
            This is not a side hustle. This is a career that changes your life.
          </p>

          <div className="ws__hero-proof">
            <div className="ws__proof-chip">
              <span className="ws__proof-num">$50K</span>
              <span className="ws__proof-tag">/mo top earner</span>
            </div>
            <div className="ws__proof-chip ws__proof-chip--red">
              <span className="ws__proof-num">$200M+</span>
              <span className="ws__proof-tag">saved for clients</span>
            </div>
            <div className="ws__proof-chip">
              <span className="ws__proof-num">A+</span>
              <span className="ws__proof-tag">BBB rating</span>
            </div>
            <div className="ws__proof-chip">
              <span className="ws__proof-num">5K+</span>
              <span className="ws__proof-tag">lives changed</span>
            </div>
          </div>

          <div className="ws__hero-actions">
            <a href="#apply" className="ws__btn-primary">
              Claim My Spot at the Seminar
              <span className="ws__btn-arrow">→</span>
            </a>
            <a href="tel:+18182302223" className="ws__btn-ghost">
              📞 (818) 230-2223
            </a>
          </div>

          <div className="ws__hero-eyebrow ws__hero-eyebrow--bottom">
            <span className="ws__eyebrow-dot" />
            LIMITED SEATS · MAY 9TH AT 10:00 AM · CHATSWORTH, CA
          </div>
        </div>

        <div className="ws__hero-scroll" aria-hidden="true">
          <span className="ws__scroll-line" />
          <span>SCROLL</span>
        </div>
      </section>

      {/* ══════════════════════════════ MANIFESTO STRIP ══════════════════════════════ */}
      <div className="ws__manifesto">
        <div className="ws__manifesto-inner">
          <p className="ws__manifesto-text">
            "The wolves don't wait. The top performers at Tax Advocate Group
            didn't wait for permission, for the perfect moment, or for someone
            to hand them an opportunity. They showed up. They got trained. They
            got paid.
            <strong> That could be you — if you want it badly enough.</strong>"
          </p>
        </div>
      </div>

      {/* ══════════════════════════════ BLOOMBERG STATS ══════════════════════════════ */}
      <section className="ws__board" ref={statsRef}>
        <div className="ws__board-header">
          <span className="ws__board-label">LIVE PERFORMANCE DATA</span>
          <span className="ws__board-live">
            <span className="ws__live-dot" />
            REAL NUMBERS
          </span>
        </div>
        <div className="ws__board-grid">
          <div className="ws__board-card">
            <div className="ws__board-card-label">
              LIFETIME REVENUE GENERATED
            </div>
            <div className="ws__board-card-num">
              <span className="ws__board-prefix">$</span>
              {grossRev}M<span className="ws__board-plus">+</span>
            </div>
            <div className="ws__board-card-sub">
              Built over a decade. Still growing.
            </div>
          </div>
          <div className="ws__board-card ws__board-card--gold">
            <div className="ws__board-card-label">
              LIFETIME SAVINGS FOR CLIENTS
            </div>
            <div className="ws__board-card-num">
              <span className="ws__board-prefix">$</span>
              {clientSav}M<span className="ws__board-plus">+</span>
            </div>
            <div className="ws__board-card-sub">
              Real debt. Real relief. Real results.
            </div>
          </div>
          <div className="ws__board-card ws__board-card--red">
            <div className="ws__board-card-label">
              TOP REP MONTHLY TAKE-HOME
            </div>
            <div className="ws__board-card-num">
              <span className="ws__board-prefix">$</span>
              {topEarner.toLocaleString()}
            </div>
            <div className="ws__board-card-sub">
              Uncapped. Earned. Every. Single. Month.
            </div>
          </div>
          <div className="ws__board-card">
            <div className="ws__board-card-label">CLIENTS HELPED</div>
            <div className="ws__board-card-num">
              {clients.toLocaleString()}
              <span className="ws__board-plus">+</span>
            </div>
            <div className="ws__board-card-sub">
              Families who sleep better at night
            </div>
          </div>
        </div>
        <div className="ws__board-footer">
          These are not projections. These are not aspirations. These are the
          actual numbers from our actual business.
        </div>
      </section>

      {/* ══════════════════════════════ THE PITCH ══════════════════════════════ */}
      <section
        className="ws__pitch"
        ref={ref("pitch")}
        data-visible={visible.pitch}
      >
        <div className="ws__pitch-inner">
          <div className="ws__pitch-left">
            <span className="ws__label">What We Actually Do</span>
            <h2 className="ws__h2">
              We Fight the IRS
              <br />
              <span className="ws__gold">So Our Clients</span>
              <br />
              <span className="ws__gold">Don't Have To.</span>
            </h2>
            <p className="ws__body">
              Thousands of Americans wake up every morning terrified — wage
              garnishments eating their paycheck, frozen bank accounts, IRS
              notices they can't decode. We are the team that makes those
              problems disappear. Licensed professionals. Real resolution. Real
              results.
            </p>
            <p className="ws__body">
              You are the person who answers the call, understands the pain, and
              connects them to life-changing help.
              <strong style={{ color: "#f0c060" }}>
                {" "}
                For that work, you earn like it matters. Because it does.
              </strong>
            </p>
            <div className="ws__pitch-proof-row">
              {[
                ["BBB A+", "Nationally Rated"],
                ["50 States", "We Operate Everywhere"],
                ["$200M+", "Client Debt Resolved"],
              ].map(([num, label]) => (
                <div key={label} className="ws__pitch-proof-item">
                  <span className="ws__pitch-proof-num">{num}</span>
                  <span className="ws__pitch-proof-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ws__pitch-right">
            <div className="ws__earnings-card">
              <div className="ws__earnings-card-header">
                <span className="ws__earnings-card-title">
                  YOUR INCOME TRAJECTORY
                </span>
                <span className="ws__earnings-card-note">
                  Based on actual rep performance
                </span>
              </div>
              {[
                {
                  phase: "WEEKS 1–4",
                  label: "You're learning. You're hungry.",
                  range: "$2K – $5K",
                  pct: 20,
                  color: "#2b5ebe",
                },
                {
                  phase: "MONTHS 2–3",
                  label: "You're finding your rhythm.",
                  range: "$5K – $10K",
                  pct: 40,
                  color: "#4a7fd4",
                },
                {
                  phase: "MONTHS 4–6",
                  label: "You're competing at the top.",
                  range: "$10K – $18K",
                  pct: 65,
                  color: "#8faa4e",
                },
                {
                  phase: "MONTH 6+",
                  label: "You're a closer. This is yours.",
                  range: "$40K – $50K+",
                  pct: 100,
                  color: "#c9a227",
                },
              ].map((tier, i) => (
                <div key={i} className="ws__earnings-row">
                  <div className="ws__earnings-meta">
                    <span className="ws__earnings-phase">{tier.phase}</span>
                    <span className="ws__earnings-range">{tier.range}</span>
                  </div>
                  <div className="ws__earnings-track">
                    <div
                      className="ws__earnings-bar"
                      style={{
                        width: `${tier.pct}%`,
                        background: `linear-gradient(90deg, #0e1d48, ${tier.color})`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  </div>
                  <span className="ws__earnings-label">{tier.label}</span>
                </div>
              ))}
              <p className="ws__earnings-fine">
                * Results depend on effort, coachability, and execution. This
                isn't a promise — it's a pattern.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ NOT FOR EVERYONE ══════════════════════════════ */}
      <section
        className="ws__select"
        ref={ref("select")}
        data-visible={visible.select}
      >
        <div className="ws__select-inner">
          <span className="ws__label ws__label--red">
            THIS IS NOT FOR EVERYONE
          </span>
          <h2 className="ws__h2 ws__h2--center">
            We Don't Hire Bodies.
            <br />
            <span className="ws__gold">We Hire Wolves.</span>
          </h2>
          <p
            className="ws__body ws__body--center"
            style={{ maxWidth: 560, margin: "0 auto 3rem" }}
          >
            We have no interest in filling seats. We're building a team of
            people who are genuinely hungry — people who will wake up Monday
            excited, not dreading it. If that's not you, this isn't for you. If
            that <em>is</em> you, keep reading.
          </p>

          <div className="ws__twin-cols">
            <div className="ws__twin-col ws__twin-col--no">
              <div className="ws__twin-col-header">
                <span className="ws__twin-icon">✗</span>
                This ISN'T For You If...
              </div>
              <ul className="ws__twin-list">
                <li>You're looking for an easy paycheck with zero effort</li>
                <li>You take "no" personally and stop dialing</li>
                <li>
                  You're not coachable and think you already know everything
                </li>
                <li>You want to coast and collect a steady salary</li>
                <li>You're not willing to outwork the person next to you</li>
              </ul>
            </div>
            <div className="ws__twin-col ws__twin-col--yes">
              <div className="ws__twin-col-header">
                <span className="ws__twin-icon ws__twin-icon--gold">✓</span>
                This IS For You If...
              </div>
              <ul className="ws__twin-list">
                <li>
                  You want your income to reflect how hard you actually work
                </li>
                <li>You're hungry, coachable, and competitive</li>
                <li>You want to be part of something bigger than yourself</li>
                <li>You see a phone as an opportunity, not a burden</li>
                <li>You've been waiting for someone to give you a real shot</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ VIDEO ══════════════════════════════ */}
      <section
        className="ws__video"
        ref={ref("video")}
        data-visible={visible.video}
      >
        <div className="ws__video-inner">
          <span className="ws__label">See It Yourself</span>
          <h2 className="ws__h2 ws__h2--center">
            This Isn't a Sales Pitch.
            <br />
            <span className="ws__gold">It's Your Future.</span>
          </h2>
          <p
            className="ws__body ws__body--center"
            style={{ maxWidth: 500, margin: "0 auto 2rem" }}
          >
            Before you apply, watch this. Know who we are, what we stand for,
            and why the people on this floor show up fired up every single day.
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

      {/* ══════════════════════════════ FULL PACKAGE ══════════════════════════════ */}
      <section
        className="ws__package"
        ref={ref("package")}
        data-visible={visible.package}
      >
        <div className="ws__package-inner">
          <div className="ws__package-header">
            <span className="ws__label">The Full Picture</span>
            <h2 className="ws__h2">
              Fortune 500 Benefits.
              <br />
              <span className="ws__gold">Wolf Pack Culture.</span>
            </h2>
          </div>
          <div className="ws__pkg-grid">
            <div className="ws__pkg-card ws__pkg-card--big">
              <div className="ws__pkg-icon">💰</div>
              <h3 className="ws__pkg-title">Uncapped Performance Pay</h3>
              <p className="ws__pkg-body">
                There is no ceiling. No cap. No "salary max." Your effort is
                your limit. We have reps who out-earn doctors. That's not a
                metaphor.
              </p>
              <div className="ws__pkg-highlight">
                $50K/mo<span> potential</span>
              </div>
            </div>
            <div className="ws__pkg-card">
              <div className="ws__pkg-icon">🏥</div>
              <h3 className="ws__pkg-title">Full Health Coverage</h3>
              <p className="ws__pkg-body">
                Medical, Vision &amp; Dental. Your health is covered from day
                one.
              </p>
            </div>
            <div className="ws__pkg-card">
              <div className="ws__pkg-icon">🏦</div>
              <h3 className="ws__pkg-title">401(k) Enrollment</h3>
              <p className="ws__pkg-body">
                Real retirement savings. We're building your long game, not just
                your next paycheck.
              </p>
            </div>
            <div className="ws__pkg-card ws__pkg-card--accent">
              <div className="ws__pkg-icon">🎓</div>
              <h3 className="ws__pkg-title">World-Class Training</h3>
              <p className="ws__pkg-body">
                Zero experience required. We turn hungry people into high
                earners. Every top rep on our floor started exactly where you
                are right now.
              </p>
            </div>
            <div className="ws__pkg-card">
              <div className="ws__pkg-icon">🕗</div>
              <h3 className="ws__pkg-title">Consistent Schedule</h3>
              <p className="ws__pkg-body">
                Monday–Friday · 7:30 AM – 4:30 PM · Weekends are yours.
              </p>
            </div>
            <div className="ws__pkg-card ws__pkg-card--wide">
              <div className="ws__pkg-icon">🚀</div>
              <h3 className="ws__pkg-title">
                Promote From Within — Every Time
              </h3>
              <p className="ws__pkg-body">
                Every manager. Every team lead. Every director. Started on the
                floor. We don't import leadership from outside — we build it
                from our best people. Want to lead? Produce. It's that simple.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ PROCESS ══════════════════════════════ */}
      <section
        className="ws__path"
        ref={ref("path")}
        data-visible={visible.path}
      >
        <div className="ws__path-inner">
          <span className="ws__label ws__label--red">THE PATH FORWARD</span>
          <h2 className="ws__h2 ws__h2--center">
            From Seminar to
            <br />
            <span className="ws__gold">Six Figures.</span>
          </h2>
          <p
            className="ws__body ws__body--center"
            style={{ maxWidth: 500, margin: "0 auto 3rem" }}
          >
            Here is exactly what happens from the moment you apply to the day
            your first big check hits. No mystery. No games.
          </p>
          <div className="ws__path-steps">
            {[
              {
                n: "01",
                title: "Apply Right Now",
                body: "Fill out the form below or call us. No résumé. No experience needed. We respond within 1 business day.",
              },
              {
                n: "02",
                title: "Attend the Seminar",
                body: "Come to our Chatsworth office. See the floor. Meet the team. Understand exactly how the money gets made.",
              },
              {
                n: "03",
                title: "Get Trained to Win",
                body: "We teach you everything — the product, the pitch, the close. Most reps are on the phones independently within their first week.",
              },
              {
                n: "04",
                title: "Close Deals. Cash Out.",
                body: "Performance pay. Weekly. No ceiling. The top of this ladder goes as high as you're willing to climb.",
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="ws__path-step">
                <div className="ws__path-step-num">{n}</div>
                <div className="ws__path-step-body">
                  <h4 className="ws__path-step-title">{title}</h4>
                  <p className="ws__path-step-desc">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ QUOTE ══════════════════════════════ */}
      <section className="ws__quote">
        <div className="ws__quote-bg" aria-hidden="true">
          WINNER
        </div>
        <div className="ws__quote-inner">
          <div className="ws__quote-mark">"</div>
          <blockquote className="ws__quote-text">
            I came in with nothing but a good attitude and a willingness to be
            coached. Four months later I was in the top five on the board. Seven
            months in I was running my own team. I've never worked anywhere that
            actually rewarded effort the way this place does. If you're hungry —
            and I mean genuinely, uncomfortably hungry — get yourself in front
            of these people.
          </blockquote>
          <cite className="ws__quote-cite">
            — Current TAG Sales Team Leader · Chatsworth, CA
          </cite>
        </div>
      </section>

      {/* ══════════════════════════════ APPLY ══════════════════════════════ */}
      <section
        className="ws__apply"
        id="apply"
        ref={ref("apply")}
        data-visible={visible.apply}
      >
        <div className="ws__apply-inner">
          <div className="ws__apply-header">
            <span className="ws__label ws__label--red">
              MAY 9TH · 10:00 AM · LIMITED SEATS
            </span>
            <h2 className="ws__h2 ws__h2--center">
              The Seminar Is Free.
              <br />
              <span className="ws__gold">The Opportunity Is Priceless.</span>
            </h2>
            <p
              className="ws__body ws__body--center"
              style={{ maxWidth: 520, margin: "0 auto" }}
            >
              Fill this out. We will reach out within 1 business day. Your
              decision right now determines everything that comes next.
            </p>
          </div>

          <div className="ws__apply-layout">
            <div className="ws__form-col">
              {submitted ? (
                <div className="ws__success">
                  <span className="ws__success-icon">🎉</span>
                  <h3 className="ws__success-title">You're In the Queue.</h3>
                  <p className="ws__success-msg">
                    Our team will be in touch within 1 business day to lock in
                    your seminar spot. The best decision you've made all year
                    just happened.
                  </p>
                  <a href="tel:+18182302223" className="ws__success-cta">
                    Can't Wait? Call Now: (818) 230-2223
                  </a>
                </div>
              ) : (
                <form className="ws__form" onSubmit={handleSubmit} noValidate>
                  <div className="ws__form-2col">
                    <div className="ws__fg">
                      <label htmlFor="ws-n">Full Name *</label>
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
                    <div className="ws__fg">
                      <label htmlFor="ws-p">Phone Number *</label>
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
                  <div className="ws__fg">
                    <label htmlFor="ws-e">Email Address *</label>
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
                  <div className="ws__fg">
                    <label htmlFor="ws-w">
                      Why do you want this? What are you working toward? *
                    </label>
                    <textarea
                      id="ws-w"
                      name="why"
                      value={formData.why}
                      onChange={handleChange}
                      placeholder="Don't hold back. Tell us exactly what drives you, what you want out of your career, and why you're ready to go all in. This is your pitch to us."
                      rows={6}
                      required
                    />
                  </div>
                  <div className="ws__form-consent">
                    <label className="ws__consent-lbl">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        required
                      />
                      <span>
                        I consent to being contacted by Tax Advocate Group about
                        this employment opportunity via phone, email, or text.{" "}
                        <Link to="/privacy-policy">Privacy Policy</Link>.
                      </span>
                    </label>
                  </div>
                  {formError && <p className="ws__form-err">{formError}</p>}
                  <button
                    type="submit"
                    className={`ws__submit ${!consent || submitting ? "ws__submit--off" : ""}`}
                    disabled={!consent || submitting}
                  >
                    {submitting ? "Sending..." : "🐺 I Want In — Claim My Spot"}
                  </button>
                  <p className="ws__form-alt">
                    Or call/email directly:&nbsp;
                    <a href="tel:+18182302223">(818) 230-2223</a>&nbsp;·&nbsp;
                    <a href="mailto:apply@taxadvocategroup.com">
                      apply@taxadvocategroup.com
                    </a>
                  </p>
                </form>
              )}
            </div>

            <div className="ws__info-col">
              <div className="ws__info-card">
                <div className="ws__info-card-head">
                  📋 Seminar — May 9th at 10:00 AM
                </div>
                <div className="ws__info-card-body">
                  {[
                    [
                      "📅",
                      "Date & Time",
                      "Friday, May 9th, 2026\n10:00 AM Sharp",
                    ],
                    [
                      "📍",
                      "Location",
                      "21625 Prairie St, Suite #200\nChatsworth, CA 91311",
                    ],
                    ["🕗", "Office Hours", "Monday–Friday\n7:30 AM – 4:30 PM"],
                    ["💼", "Position", "Full-Time · In-Office"],
                    ["💰", "Pay", "Performance-Based · No Cap"],
                    ["🏥", "Benefits", "Medical, Vision & Dental"],
                    ["🏦", "Retirement", "401(k) Enrollment"],
                    ["🚀", "Growth", "Promote Exclusively Within"],
                  ].map(([icon, lbl, val]) => (
                    <div key={lbl} className="ws__info-row">
                      <span>{icon}</span>
                      <div>
                        <strong>{lbl}</strong>
                        {val.split("\n").map((l, i) => (
                          <span key={i}>
                            {l}
                            <br />
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ws__urgency-card">
                <div className="ws__urgency-dot" />
                <p className="ws__urgency-text">
                  Seminar spots are limited. We are actively interviewing. The
                  sooner you apply, the sooner your life changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
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
          <span suppressHydrationWarning>
            &copy; {new Date().getFullYear()} Tax Advocate Group, LLC. All
            Rights Reserved.
          </span>
          &nbsp;|&nbsp;
          <Link to="/privacy-policy">Privacy Policy</Link>&nbsp;|&nbsp;
          <Link to="/terms-of-service">Terms of Service</Link>
        </p>
      </footer>

      <style>{`
        /* ─── Design Tokens ─── */
        .ws {
          --gold: #c9a227;
          --gold-lt: #f0c060;
          --red: #9b2020;
          --red-lt: #c0392b;
          --navy: #070b16;
          --navy-mid: #0e1a3e;
          --navy-lt: #162050;
          --white: #ffffff;
          --dim: rgba(255,255,255,0.6);
          --dimmer: rgba(255,255,255,0.35);
          font-family: 'Montserrat','Poppins',Arial,sans-serif;
          color: var(--white);
          overflow-x: hidden;
          background: var(--navy);
        }
        .ws *, .ws *::before, .ws *::after { box-sizing: border-box; margin: 0; }

        /* ─── Shared ─── */
        .ws__label {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--gold);
          margin-bottom: 0.75rem;
        }
        .ws__label--red { color: var(--red-lt); }
        .ws__h2 {
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.025em;
          color: var(--white);
          margin-bottom: 1rem;
        }
        .ws__h2--center { text-align: center; }
        .ws__gold { color: var(--gold); }
        .ws__body {
          font-size: 1rem;
          line-height: 1.82;
          color: var(--dim);
          margin-bottom: 1rem;
        }
        .ws__body--center { text-align: center; }
        section[data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.85s ease, transform 0.85s ease;
        }
        section[data-visible="true"] { opacity: 1; transform: translateY(0); }

        /* ─── FAB ─── */
        .ws__fab {
          position: fixed;
          bottom: 1.75rem;
          right: 1.75rem;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.1rem;
          background: rgba(7,11,22,0.9);
          border: 2px solid var(--gold);
          border-radius: 50px;
          color: var(--gold);
          font-family: inherit;
          font-size: 0.7rem;
          font-weight: 800;
          cursor: pointer;
          backdrop-filter: blur(14px);
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          box-shadow: 0 4px 24px rgba(201,162,39,0.2);
        }
        .ws__fab:hover { background: rgba(201,162,39,0.15); transform: scale(1.06); box-shadow: 0 4px 36px rgba(201,162,39,0.38); }
        .ws__fab--nudge {
          animation: ws-nudge 2.2s ease-in-out infinite;
          border-color: rgba(201,162,39,0.9);
          box-shadow: 0 0 24px rgba(201,162,39,0.55);
        }
        @keyframes ws-nudge {
          0%,100% { transform: scale(1);    box-shadow: 0 0 24px rgba(201,162,39,0.4); }
          50%      { transform: scale(1.08); box-shadow: 0 0 44px rgba(201,162,39,0.75); }
        }
        .ws__eq { display: flex; align-items: flex-end; gap: 2px; height: 14px; }
        .ws__eq span { display: block; width: 3px; background: var(--gold); border-radius: 2px; animation: ws-eq 0.55s ease-in-out infinite alternate; }
        .ws__eq span:nth-child(1){ height:5px;  animation-delay:0s; }
        .ws__eq span:nth-child(2){ height:12px; animation-delay:0.1s; }
        .ws__eq span:nth-child(3){ height:7px;  animation-delay:0.2s; }
        .ws__eq span:nth-child(4){ height:13px; animation-delay:0.05s; }
        .ws__eq span:nth-child(5){ height:4px;  animation-delay:0.15s; }
        @keyframes ws-eq { from{transform:scaleY(0.25)} to{transform:scaleY(1)} }

        /* ─── Urgency Bar ─── */
        .ws__urgency-bar {
          background: linear-gradient(90deg, #0d0000 0%, #1a0505 40%, #1a0505 60%, #0d0000 100%);
          border-bottom: 1px solid rgba(192,57,43,0.4);
          padding: 0.65rem 1.5rem;
          position: sticky;
          top: 0;
          z-index: 900;
          backdrop-filter: blur(12px);
        }
        .ws__urgency-bar-inner {
          max-width: 1150px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
          flex-wrap: wrap;
        }
        .ws__urgency-bar-dot {
          width: 8px; height: 8px;
          background: var(--red-lt);
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 10px var(--red-lt);
          animation: ws-blink 1.4s ease-in-out infinite;
        }
        .ws__urgency-bar-text {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.72);
          letter-spacing: 0.02em;
        }
        .ws__urgency-bar-text strong {
          color: #fff;
          font-weight: 800;
        }
        .ws__urgency-bar-cta {
          display: inline-block;
          padding: 0.35rem 1rem;
          background: var(--red);
          border: 1px solid rgba(192,57,43,0.6);
          border-radius: 50px;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #fff;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .ws__urgency-bar-cta:hover {
          background: var(--red-lt);
          box-shadow: 0 0 18px rgba(192,57,43,0.5);
        }
        @media (max-width: 540px) {
          .ws__urgency-bar { padding: 0.55rem 1rem; }
          .ws__urgency-bar-text { font-size: 0.74rem; text-align: center; }
        }

        /* ─── Tickers ─── */
        .ws__tickers { }
        .ws__ticker {
          overflow: hidden;
          white-space: nowrap;
          padding: 0.5rem 0;
        }
        .ws__ticker--gold { background: var(--gold); }
        .ws__ticker--red  { background: var(--red); }
        .ws__ticker-track {
          display: inline-flex;
          animation: ws-tick 28s linear infinite;
          will-change: transform;
        }
        .ws__ticker-track--rev { animation-direction: reverse; animation-duration: 22s; }
        @keyframes ws-tick { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .ws__ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding: 0 1.75rem;
        }
        .ws__ticker--gold .ws__ticker-item { color: #050a14; }
        .ws__ticker--red  .ws__ticker-item { color: rgba(255,255,255,0.92); }
        .ws__ticker-gem { font-size: 0.45rem; opacity: 0.5; }

        /* ─── HERO ─── */
        .ws__hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .ws__hero-video {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; z-index: 0;
        }
        .ws__hero-scrim {
          position: absolute; inset: 0; z-index: 1;
          background:
            linear-gradient(180deg, rgba(7,11,22,0.55) 0%, rgba(7,11,22,0.0) 40%, rgba(7,11,22,0.0) 60%, rgba(7,11,22,0.7) 100%),
            linear-gradient(90deg, rgba(7,11,22,0.92) 0%, rgba(7,11,22,0.78) 50%, rgba(7,11,22,0.55) 100%);
        }
        .ws__particles { position:absolute; inset:0; z-index:2; pointer-events:none; overflow:hidden; }
        .ws__particle {
          position: absolute; top: -2rem;
          font-size: 1rem; opacity: 0.45;
          animation: ws-fall linear infinite; will-change: transform;
        }
        @keyframes ws-fall {
          0%   { transform: translateY(-2rem) rotate(0deg); opacity: 0; }
          8%   { opacity: 0.45; }
          92%  { opacity: 0.45; }
          100% { transform: translateY(110vh) rotate(380deg); opacity: 0; }
        }
        .ws__hero-body {
          position: relative; z-index: 3;
          max-width: 920px; width: 100%;
          padding: 3rem 2rem 4.5rem;
          text-align: center;
          opacity: 0; transform: translateY(36px);
          transition: opacity 1s ease, transform 1s ease;
        }
        .ws__hero-body--in { opacity: 1; transform: translateY(0); }
        .ws__hero-logo { height: 56px; width: auto; margin: 0 auto 2rem; display: block; filter: brightness(1.1); }
        .ws__hero-eyebrow {
          display: inline-flex; align-items: center; gap: 0.6rem;
          background: rgba(201,162,39,0.1);
          border: 1px solid rgba(201,162,39,0.45);
          border-radius: 50px;
          padding: 0.45rem 1.15rem;
          font-size: 0.65rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.18em;
          color: var(--gold); margin-bottom: 1.75rem;
        }
        .ws__hero-eyebrow--bottom {
          margin-top: 1.5rem;
          margin-bottom: 0;
          background: rgba(155,32,32,0.12);
          border-color: rgba(192,57,43,0.4);
          color: rgba(255,255,255,0.65);
        }
        .ws__hero-eyebrow--bottom .ws__eyebrow-dot {
          background: var(--red-lt);
          box-shadow: 0 0 8px var(--red-lt);
        }
        .ws__eyebrow-dot {
          width: 7px; height: 7px;
          background: var(--gold); border-radius: 50%;
          animation: ws-blink 1.8s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes ws-blink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(1.6)} }

        .ws__hero-h1 {
          display: flex; flex-direction: column;
          font-size: clamp(2.8rem, 7vw, 6rem);
          font-weight: 900; line-height: 1.04;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
        }
        .ws__h1-top {
          font-size: 0.52em; font-weight: 600;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase; letter-spacing: 0.14em;
          margin-bottom: 0.05em;
        }
        .ws__h1-mid {
          color: var(--white);
        }
        .ws__h1-mid em {
          font-style: normal;
          background: linear-gradient(90deg, var(--gold-lt), var(--white) 40%, var(--gold));
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: ws-sweep 3.5s linear infinite;
        }
        .ws__h1-bot { color: var(--white); }
        @keyframes ws-sweep { 0%{background-position:0% center} 100%{background-position:200% center} }

        .ws__hero-deck {
          font-size: clamp(1rem, 2.2vw, 1.2rem);
          color: rgba(255,255,255,0.78);
          line-height: 1.72; max-width: 660px;
          margin: 0 auto 2rem;
        }
        .ws__hero-deck strong { color: var(--gold-lt); }

        .ws__hero-proof {
          display: flex; flex-wrap: wrap;
          gap: 0.75rem; justify-content: center;
          margin-bottom: 2.25rem;
        }
        .ws__proof-chip {
          display: flex; flex-direction: column;
          align-items: center;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 0.75rem 1.25rem;
          min-width: 90px;
          backdrop-filter: blur(8px);
          transition: transform 0.2s, border-color 0.2s;
        }
        .ws__proof-chip:hover { transform: translateY(-3px); border-color: var(--gold); }
        .ws__proof-chip--red { border-color: rgba(192,57,43,0.35); }
        .ws__proof-chip--red:hover { border-color: var(--red-lt); }
        .ws__proof-num {
          font-size: 1.5rem; font-weight: 900;
          color: var(--gold); line-height: 1;
        }
        .ws__proof-chip--red .ws__proof-num { color: #e57373; }
        .ws__proof-tag {
          font-size: 0.62rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: var(--dimmer); margin-top: 0.25rem;
        }
        .ws__hero-actions {
          display: flex; align-items: center;
          justify-content: center;
          gap: 1rem; flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .ws__btn-primary {
          display: inline-flex; align-items: center; gap: 0.6rem;
          padding: 1.1rem 2.75rem;
          background: linear-gradient(135deg, #9b7a15 0%, var(--gold-lt) 50%, #9b7a15 100%);
          background-size: 200% auto;
          color: #050a14;
          font-size: 1.05rem; font-weight: 900;
          letter-spacing: 0.04em; text-transform: uppercase;
          border-radius: 50px; text-decoration: none;
          animation: ws-shine 3s linear infinite, ws-breathe 2.8s ease-in-out infinite;
          box-shadow: 0 0 40px rgba(201,162,39,0.45);
          transition: box-shadow 0.3s;
        }
        .ws__btn-primary:hover { box-shadow: 0 0 65px rgba(201,162,39,0.7); }
        .ws__btn-arrow { transition: transform 0.2s; }
        .ws__btn-primary:hover .ws__btn-arrow { transform: translateX(5px); }
        @keyframes ws-shine { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes ws-breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.022)} }
        .ws__btn-ghost {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 1.05rem 1.85rem;
          background: rgba(255,255,255,0.07);
          border: 2px solid rgba(255,255,255,0.18);
          border-radius: 50px;
          color: rgba(255,255,255,0.88);
          font-size: 1rem; font-weight: 700;
          text-decoration: none; backdrop-filter: blur(8px);
          transition: all 0.2s;
        }
        .ws__btn-ghost:hover { background: rgba(201,162,39,0.12); border-color: var(--gold); color: var(--gold-lt); }
        .ws__hero-disclaimer { font-size: 0.74rem; color: rgba(255,255,255,0.32); letter-spacing: 0.05em; }
        .ws__hero-scroll {
          position: absolute; bottom: 2rem; left: 50%;
          transform: translateX(-50%); z-index: 3;
          display: flex; flex-direction: column;
          align-items: center; gap: 0.5rem;
          font-size: 0.58rem; letter-spacing: 0.22em;
          color: rgba(255,255,255,0.28); text-transform: uppercase;
        }
        .ws__scroll-line {
          width: 1px; height: 28px;
          background: linear-gradient(to bottom, transparent, rgba(201,162,39,0.5));
          animation: ws-scrollpulse 1.8s ease-in-out infinite;
        }
        @keyframes ws-scrollpulse { 0%,100%{opacity:0.3;transform:scaleY(0.5)} 50%{opacity:1;transform:scaleY(1)} }

        /* ─── MANIFESTO ─── */
        .ws__manifesto {
          background: linear-gradient(135deg, var(--red) 0%, #6b0f0f 100%);
          padding: 3rem 2rem;
          text-align: center;
          border-top: 2px solid rgba(192,57,43,0.6);
          border-bottom: 2px solid rgba(192,57,43,0.6);
        }
        .ws__manifesto-inner { max-width: 860px; margin: 0 auto; }
        .ws__manifesto-text {
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          line-height: 1.75;
          color: rgba(255,255,255,0.85);
          font-style: italic;
        }
        .ws__manifesto-text strong { color: #fff; font-style: normal; }

        /* ─── BLOOMBERG BOARD ─── */
        .ws__board {
          background: #040812;
          padding: 5rem 2rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .ws__board-header {
          display: flex; align-items: center;
          justify-content: space-between;
          max-width: 1150px; margin: 0 auto 2.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .ws__board-label {
          font-size: 0.62rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.2em;
          color: rgba(255,255,255,0.35);
        }
        .ws__board-live {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.62rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.15em;
          color: #4caf50;
        }
        .ws__live-dot {
          width: 7px; height: 7px; background: #4caf50;
          border-radius: 50%;
          box-shadow: 0 0 8px #4caf50;
          animation: ws-blink 1.4s ease-in-out infinite;
        }
        .ws__board-grid {
          max-width: 1150px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4,1fr);
          gap: 1px; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px; overflow: hidden;
        }
        .ws__board-card {
          background: #06090f;
          padding: 2rem 1.75rem;
          transition: background 0.25s;
        }
        .ws__board-card:hover { background: #0a0f1c; }
        .ws__board-card--gold { background: #0a0d0e; }
        .ws__board-card--gold:hover { background: #0f1410; }
        .ws__board-card--red { background: #0d0707; }
        .ws__board-card--red:hover { background: #130a0a; }
        .ws__board-card-label {
          font-size: 0.6rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.16em;
          color: rgba(255,255,255,0.3);
          margin-bottom: 0.75rem;
        }
        .ws__board-card-num {
          font-size: clamp(2.5rem, 4vw, 3.8rem);
          font-weight: 900; line-height: 1;
          letter-spacing: -0.03em;
          color: #fff;
          font-variant-numeric: tabular-nums;
        }
        .ws__board-card--gold .ws__board-card-num { color: var(--gold-lt); }
        .ws__board-card--red .ws__board-card-num  { color: #e57373; }
        .ws__board-prefix { font-size: 0.55em; vertical-align: super; font-weight: 700; }
        .ws__board-plus   { font-size: 0.55em; vertical-align: super; color: var(--gold); }
        .ws__board-card-sub {
          font-size: 0.76rem; color: rgba(255,255,255,0.35);
          line-height: 1.5; margin-top: 0.6rem;
        }
        .ws__board-footer {
          max-width: 1150px; margin: 1.5rem auto 0;
          font-size: 0.72rem; color: rgba(255,255,255,0.22);
          text-align: center; font-style: italic;
        }

        /* ─── PITCH ─── */
        .ws__pitch { background: #070b16; padding: 6rem 2rem; }
        .ws__pitch-inner {
          max-width: 1150px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 5rem; align-items: center;
        }
        .ws__pitch-proof-row {
          display: flex; gap: 2rem;
          margin-top: 2rem; padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .ws__pitch-proof-item { display: flex; flex-direction: column; }
        .ws__pitch-proof-num {
          font-size: 1.65rem; font-weight: 900;
          color: var(--gold); line-height: 1;
        }
        .ws__pitch-proof-label {
          font-size: 0.7rem; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--dimmer);
          margin-top: 0.3rem;
        }
        /* Earnings card */
        .ws__earnings-card {
          background: linear-gradient(145deg, var(--navy-mid) 0%, #091226 100%);
          border: 1.5px solid rgba(201,162,39,0.25);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .ws__earnings-card-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.75rem; }
        .ws__earnings-card-title {
          font-size: 0.62rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.18em;
          color: var(--gold);
        }
        .ws__earnings-card-note { font-size: 0.65rem; color: var(--dimmer); font-style: italic; }
        .ws__earnings-row { margin-bottom: 1.1rem; }
        .ws__earnings-meta {
          display: flex; justify-content: space-between;
          margin-bottom: 0.3rem;
        }
        .ws__earnings-phase { font-size: 0.72rem; font-weight: 700; color: rgba(255,255,255,0.6); }
        .ws__earnings-range { font-size: 0.72rem; font-weight: 800; color: var(--gold); }
        .ws__earnings-track {
          background: rgba(255,255,255,0.05);
          border-radius: 50px; height: 30px; overflow: hidden;
        }
        .ws__earnings-bar {
          height: 100%; border-radius: 50px;
          animation: ws-bar-in 1.4s ease-out both;
          will-change: width;
        }
        @keyframes ws-bar-in { from { width: 0 !important; } }
        .ws__earnings-label {
          font-size: 0.68rem; color: var(--dimmer);
          margin-top: 0.25rem; display: block;
          font-style: italic;
        }
        .ws__earnings-fine {
          font-size: 0.65rem; color: rgba(255,255,255,0.2);
          margin-top: 1.25rem; font-style: italic;
        }

        /* ─── NOT FOR EVERYONE ─── */
        .ws__select {
          background: linear-gradient(160deg, #040812 0%, #0a0d1e 50%, #040812 100%);
          padding: 6rem 2rem; text-align: center;
        }
        .ws__select-inner { max-width: 1000px; margin: 0 auto; }
        .ws__twin-cols {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 1.5rem; text-align: left;
        }
        .ws__twin-col {
          border-radius: 14px; padding: 2rem;
        }
        .ws__twin-col--no {
          background: rgba(155,32,32,0.08);
          border: 1px solid rgba(155,32,32,0.25);
        }
        .ws__twin-col--yes {
          background: rgba(201,162,39,0.06);
          border: 1px solid rgba(201,162,39,0.28);
        }
        .ws__twin-col-header {
          display: flex; align-items: center; gap: 0.6rem;
          font-size: 0.85rem; font-weight: 800;
          color: var(--white); margin-bottom: 1.25rem;
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .ws__twin-icon { font-size: 1.1rem; color: #e57373; }
        .ws__twin-icon--gold { color: var(--gold); }
        .ws__twin-list { list-style: none; padding: 0; }
        .ws__twin-list li {
          font-size: 0.9rem; color: var(--dim);
          padding: 0.6rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          line-height: 1.55;
        }
        .ws__twin-list li:last-child { border-bottom: none; }
        .ws__twin-col--no  .ws__twin-list li::before { content: "✗ "; color: #e57373; font-weight: 800; }
        .ws__twin-col--yes .ws__twin-list li::before { content: "✓ "; color: var(--gold); font-weight: 800; }

        /* ─── VIDEO ─── */
        .ws__video { background: #030508; padding: 6rem 2rem; text-align: center; }
        .ws__video-inner { max-width: 840px; margin: 0 auto; }
        .ws__video-frame {
          position: relative; padding-bottom: 56.25%; height: 0;
          border-radius: 14px; overflow: hidden; margin-top: 2rem;
          box-shadow: 0 28px 90px rgba(0,0,0,0.7), 0 0 60px rgba(201,162,39,0.1);
          border: 2px solid rgba(201,162,39,0.18);
        }
        .ws__video-frame iframe { position:absolute; top:0; left:0; width:100%; height:100%; border:none; }

        /* ─── PACKAGE ─── */
        .ws__package { background: #070b16; padding: 6rem 2rem; }
        .ws__package-inner { max-width: 1150px; margin: 0 auto; }
        .ws__package-header { text-align: center; margin-bottom: 3rem; }
        .ws__pkg-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          grid-template-rows: auto auto;
          gap: 1.25rem;
        }
        .ws__pkg-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 1.75rem;
          transition: border-color 0.25s, transform 0.25s, background 0.25s;
        }
        .ws__pkg-card:hover { border-color: rgba(201,162,39,0.3); transform: translateY(-3px); background: rgba(201,162,39,0.03); }
        .ws__pkg-card--big {
          grid-row: 1 / 3;
          background: linear-gradient(145deg, rgba(22,32,80,0.8) 0%, rgba(10,18,50,0.9) 100%);
          border-color: rgba(201,162,39,0.28);
          display: flex; flex-direction: column;
        }
        .ws__pkg-card--accent {
          background: rgba(201,162,39,0.05);
          border-color: rgba(201,162,39,0.2);
        }
        .ws__pkg-card--wide { grid-column: 2 / 4; }
        .ws__pkg-icon { font-size: 2rem; margin-bottom: 1rem; }
        .ws__pkg-title { font-size: 1rem; font-weight: 800; color: var(--white); margin-bottom: 0.6rem; line-height: 1.3; }
        .ws__pkg-body  { font-size: 0.87rem; color: var(--dim); line-height: 1.72; flex: 1; }
        .ws__pkg-highlight {
          margin-top: 1.5rem; font-size: 2.2rem;
          font-weight: 900; color: var(--gold); line-height: 1;
        }
        .ws__pkg-highlight span { font-size: 0.45em; color: var(--dimmer); font-weight: 600; }

        /* ─── PATH ─── */
        .ws__path { background: #040812; padding: 6rem 2rem; text-align: center; }
        .ws__path-inner { max-width: 900px; margin: 0 auto; }
        .ws__path-steps {
          display: grid; grid-template-columns: repeat(2,1fr);
          gap: 1.25rem; text-align: left; margin-top: 0.5rem;
        }
        .ws__path-step {
          display: flex; gap: 1.25rem; align-items: flex-start;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; padding: 1.75rem;
          transition: border-color 0.25s;
        }
        .ws__path-step:hover { border-color: rgba(201,162,39,0.22); }
        .ws__path-step-num {
          font-size: 2.75rem; font-weight: 900;
          color: rgba(201,162,39,0.15); line-height: 1;
          flex-shrink: 0; font-variant-numeric: tabular-nums;
          letter-spacing: -0.05em;
        }
        .ws__path-step-title { font-size: 1rem; font-weight: 800; color: var(--white); margin-bottom: 0.5rem; }
        .ws__path-step-desc  { font-size: 0.87rem; color: var(--dim); line-height: 1.7; }

        /* ─── QUOTE ─── */
        .ws__quote {
          background: #0c0906;
          border-top: 3px solid var(--gold);
          border-bottom: 3px solid var(--gold);
          padding: 5.5rem 2rem;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .ws__quote-bg {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 18rem; font-weight: 900;
          color: rgba(201,162,39,0.03);
          letter-spacing: -0.05em;
          pointer-events: none; user-select: none;
        }
        .ws__quote-inner { max-width: 820px; margin: 0 auto; position: relative; z-index: 1; }
        .ws__quote-mark {
          font-size: 8rem; color: rgba(201,162,39,0.2);
          font-family: Georgia,serif; line-height: 0.5;
          position: absolute; top: -1.5rem; left: -2rem;
          pointer-events: none;
        }
        .ws__quote-text {
          font-size: clamp(1.05rem, 2.4vw, 1.3rem);
          font-weight: 600; color: rgba(255,255,255,0.88);
          line-height: 1.78; font-style: italic;
          margin-bottom: 1.5rem; position: relative; z-index: 1;
        }
        .ws__quote-cite {
          font-size: 0.8rem; font-weight: 800;
          color: var(--gold); text-transform: uppercase;
          letter-spacing: 0.1em; font-style: normal;
        }

        /* ─── APPLY ─── */
        .ws__apply { background: #030508; padding: 6rem 2rem; }
        .ws__apply-inner { max-width: 1100px; margin: 0 auto; }
        .ws__apply-header { text-align: center; margin-bottom: 3.5rem; }
        .ws__apply-layout {
          display: grid; grid-template-columns: 1fr 360px;
          gap: 3rem; align-items: start;
        }
        .ws__form {
          background: linear-gradient(145deg, var(--navy-mid) 0%, #09132a 100%);
          border: 1.5px solid rgba(201,162,39,0.28);
          border-radius: 18px; padding: 2.5rem;
          box-shadow: 0 28px 90px rgba(0,0,0,0.5);
        }
        .ws__form-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .ws__fg { margin-bottom: 1.1rem; }
        .ws__fg label {
          display: block; font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.45); margin-bottom: 0.45rem;
        }
        .ws__fg input, .ws__fg textarea {
          width: 100%; padding: 0.9rem 1rem;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(201,162,39,0.18);
          border-radius: 10px; font-family: inherit;
          font-size: 0.95rem; color: var(--white);
          transition: border-color 0.2s, background 0.2s;
          outline: none;
        }
        .ws__fg input::placeholder, .ws__fg textarea::placeholder { color: rgba(255,255,255,0.22); }
        .ws__fg input:focus, .ws__fg textarea:focus { border-color: var(--gold); background: rgba(201,162,39,0.04); }
        .ws__fg textarea { resize: vertical; min-height: 130px; }
        .ws__form-consent { margin: 1rem 0 1.5rem; }
        .ws__consent-lbl {
          display: flex; align-items: flex-start; gap: 0.75rem;
          cursor: pointer; font-size: 0.75rem;
          color: rgba(255,255,255,0.42); line-height: 1.55;
        }
        .ws__consent-lbl input[type="checkbox"] { width:16px; height:16px; margin-top:2px; flex-shrink:0; accent-color:var(--gold); }
        .ws__consent-lbl a { color: var(--gold); }
        .ws__form-err {
          color: #f87171; font-size: 0.82rem; margin-bottom: 1rem;
          padding: 0.65rem 1rem;
          background: rgba(248,113,113,0.07);
          border-radius: 8px; border: 1px solid rgba(248,113,113,0.22);
        }
        .ws__submit {
          width: 100%; padding: 1.15rem;
          background: linear-gradient(135deg, #8c6c10 0%, var(--gold-lt) 50%, #8c6c10 100%);
          background-size: 200% auto;
          border: none; border-radius: 10px;
          font-family: inherit; font-size: 1rem; font-weight: 900;
          color: #050a14; text-transform: uppercase; letter-spacing: 0.08em;
          cursor: pointer;
          animation: ws-shine 3s linear infinite;
          box-shadow: 0 6px 32px rgba(201,162,39,0.35);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .ws__submit:hover:not(:disabled) { box-shadow: 0 8px 48px rgba(201,162,39,0.6); transform: translateY(-2px); }
        .ws__submit--off { opacity: 0.38; cursor: not-allowed; animation: none; }
        .ws__form-alt {
          margin-top: 1.1rem; font-size: 0.74rem;
          color: rgba(255,255,255,0.3); text-align: center;
        }
        .ws__form-alt a { color: var(--gold); text-decoration: none; }
        .ws__form-alt a:hover { text-decoration: underline; }

        /* Info col */
        .ws__info-card {
          background: linear-gradient(145deg, var(--navy-mid) 0%, #091226 100%);
          border: 1.5px solid rgba(201,162,39,0.25);
          border-radius: 16px; overflow: hidden;
          margin-bottom: 1.25rem;
        }
        .ws__info-card-head {
          background: var(--gold); color: #050a14;
          font-size: 0.78rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.1em;
          padding: 0.9rem 1.5rem;
        }
        .ws__info-card-body { padding: 1.25rem 1.5rem; }
        .ws__info-row {
          display: flex; align-items: flex-start; gap: 0.85rem;
          padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 0.84rem; color: rgba(255,255,255,0.75); line-height: 1.5;
        }
        .ws__info-row:last-child { border-bottom: none; }
        .ws__info-row > span { font-size: 1rem; flex-shrink: 0; margin-top: 0.1rem; }
        .ws__info-row strong {
          display: block; font-size: 0.68rem;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: var(--gold); margin-bottom: 0.15rem;
        }
        .ws__urgency-card {
          background: rgba(155,32,32,0.1);
          border: 1px solid rgba(155,32,32,0.3);
          border-radius: 12px; padding: 1.25rem 1.5rem;
          display: flex; align-items: flex-start; gap: 0.85rem;
        }
        .ws__urgency-dot {
          width: 8px; height: 8px; background: var(--red-lt);
          border-radius: 50%; flex-shrink: 0; margin-top: 0.35rem;
          box-shadow: 0 0 10px var(--red-lt);
          animation: ws-blink 1.4s ease-in-out infinite;
        }
        .ws__urgency-text { font-size: 0.82rem; color: rgba(255,255,255,0.65); line-height: 1.6; }

        /* Success */
        .ws__success {
          background: linear-gradient(145deg, var(--navy-mid) 0%, #09132a 100%);
          border: 1.5px solid rgba(201,162,39,0.3);
          border-radius: 18px; padding: 4rem 2.5rem; text-align: center;
        }
        .ws__success-icon { font-size: 4.5rem; display: block; margin-bottom: 1.25rem; }
        .ws__success-title { font-size: 1.7rem; font-weight: 900; color: var(--gold); margin-bottom: 0.75rem; }
        .ws__success-msg { font-size: 1rem; color: var(--dim); line-height: 1.72; margin-bottom: 1.75rem; }
        .ws__success-cta {
          display: inline-block; padding: 0.9rem 2rem;
          background: var(--gold); color: #050a14;
          font-weight: 900; font-size: 0.9rem; border-radius: 8px;
          text-decoration: none; text-transform: uppercase;
          letter-spacing: 0.06em; transition: background 0.2s;
        }
        .ws__success-cta:hover { background: var(--gold-lt); }

        /* Footer */
        .ws__footer {
          background: #020305;
          border-top: 3px solid var(--gold);
          padding: 3rem 2rem; text-align: center;
        }
        .ws__footer-logo { height: 44px; width: auto; margin: 0 auto 0.85rem; display: block; opacity: 0.75; }
        .ws__footer-addr  { font-size: 0.8rem; color: rgba(255,255,255,0.35); margin-bottom: 0.4rem; }
        .ws__footer-contact { font-size: 0.8rem; color: rgba(255,255,255,0.45); margin-bottom: 0.85rem; }
        .ws__footer-contact a { color: var(--gold); text-decoration: none; }
        .ws__footer-contact a:hover { text-decoration: underline; }
        .ws__footer-legal { font-size: 0.7rem; color: rgba(255,255,255,0.22); }
        .ws__footer-legal a { color: rgba(201,162,39,0.55); text-decoration: none; }
        .ws__footer-legal a:hover { color: var(--gold); }

        /* ─── Responsive ─── */
        @media (max-width: 1024px) {
          .ws__pitch-inner  { grid-template-columns: 1fr; gap: 3rem; }
          .ws__board-grid   { grid-template-columns: repeat(2,1fr); }
          .ws__pkg-grid     { grid-template-columns: repeat(2,1fr); }
          .ws__pkg-card--big { grid-row: auto; }
          .ws__pkg-card--wide { grid-column: 1 / 3; }
          .ws__apply-layout { grid-template-columns: 1fr; }
          .ws__info-col     { max-width: 480px; }
          .ws__twin-cols    { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .ws__fab .ws__fab > span:last-child { display: none; }
          .ws__board-grid  { grid-template-columns: 1fr 1fr; }
          .ws__pkg-grid    { grid-template-columns: 1fr; }
          .ws__pkg-card--wide { grid-column: auto; }
          .ws__path-steps  { grid-template-columns: 1fr; }
          .ws__form-2col   { grid-template-columns: 1fr; }
          .ws__form        { padding: 1.75rem 1.25rem; }
          .ws__pitch-proof-row { flex-wrap: wrap; gap: 1.25rem; }
          .ws__hero-actions { flex-direction: column; align-items: center; }
          .ws__btn-primary, .ws__btn-ghost { width: 100%; max-width: 340px; justify-content: center; }
          .ws__hero-proof { gap: 0.5rem; }
        }
        @media (max-width: 540px) {
          .ws__board-grid { grid-template-columns: 1fr; }
          .ws__board-card { padding: 1.5rem 1.25rem; }
          .ws__hero-h1    { font-size: clamp(2.2rem, 9vw, 3rem); }
          .ws__quote-mark { display: none; }
        }
      `}</style>
    </div>
  );
};

export default WorkShop;
