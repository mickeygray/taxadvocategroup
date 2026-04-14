import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import { inputChecker } from "../utils/inputChecker";
import leadContext from "../context/leadContext";
import {
  useAutoSaveProgress,
  restoreProgress,
} from "../hooks/useAutoSaveProgress";
import { useTrustedForm } from "../hooks/useTrustedForm";
/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

const PHASE = {
  INTAKE_ISSUES: "intake_issues",
  INTAKE_QUESTIONS: "intake_questions",
  QUESTION: "question",
  NAME: "name",
  CONTACT_OFFER: "contact_offer",
  CONTACT_DETAILS: "contact_details",
  VERIFICATION: "verification",
  DONE: "done",
};

const STATE_LABELS = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District of Columbia",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

const STATES = Object.keys(STATE_LABELS);

const ISSUE_OPTIONS = [
  { id: "balance_due", label: "I owe taxes" },
  { id: "irs_notice", label: "I got an IRS notice" },
  { id: "unfiled", label: "Unfiled returns" },
  { id: "levy_lien", label: "Levy/Lien" },
  { id: "audit", label: "Audit/Exam" },
];

const INTAKE_STEPS = [
  {
    key: "balanceBand",
    prompt: "About how much do you owe?",
    options: [
      { id: "lt10k", label: "Under $10k" },
      { id: "10to50k", label: "$10k\u2013$50k" },
      { id: "gt50k", label: "Over $50k" },
      { id: "unsure", label: "Not sure" },
    ],
    showIf: (form) => form.issues?.includes("balance_due"),
  },
  {
    key: "noticeType",
    prompt: "What type of notice do you have?",
    options: [
      { id: "none", label: "No notice" },
      { id: "cp504", label: "CP504" },
      { id: "levy", label: "Levy / Final notice" },
      { id: "other", label: "Something else" },
    ],
    showIf: (form) =>
      form.issues?.includes("irs_notice") || form.issues?.includes("levy_lien"),
  },
  {
    key: "taxScope",
    prompt: "Is this a federal or state tax issue?",
    options: [
      { id: "federal", label: "Federal (IRS)" },
      { id: "state", label: "State" },
      { id: "both", label: "Both" },
    ],
    showIf: () => true,
  },
  {
    key: "state",
    prompt: "Which state?",
    type: "select",
    options: STATES.map((code) => ({ id: code, label: STATE_LABELS[code] })),
    showIf: (form) => form.taxScope === "state" || form.taxScope === "both",
  },
  {
    key: "filerType",
    prompt: "Is this for an individual or a business?",
    options: [
      { id: "individual", label: "Individual" },
      { id: "business", label: "Business" },
    ],
    showIf: () => true,
  },
];

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

let msgId = 0;
const genId = () => `msg-${++msgId}`;

function rebuildMessagesFromSavedData(saved) {
  const rid = () => Math.random().toString(36).slice(2);
  const msgs = [];

  msgs.push({
    id: rid(),
    who: "bot",
    text: "Hello, my name is Caitlyn, your virtual tax expert. Let's figure out your tax situation. What are your current tax problems? Select all that apply.",
  });

  if (saved.issues?.length > 0) {
    msgs.push({ id: rid(), who: "bot", type: "intake_issues", text: "" });
    if (saved.lastPhase !== PHASE.INTAKE_ISSUES) {
      msgs.push({
        id: rid(),
        who: "bot",
        text: "Got it. Let's go step by step.",
      });
    }
  }

  if (saved.balanceBand || saved.noticeType || saved.taxScope) {
    if (saved.balanceBand) {
      const labels = {
        lt10k: "Under $10k",
        "10to50k": "$10k\u2013$50k",
        gt50k: "Over $50k",
        unsure: "Not sure",
      };
      msgs.push({
        id: rid(),
        who: "you",
        text: labels[saved.balanceBand] || saved.balanceBand,
      });
    }
    if (saved.lastPhase === PHASE.QUESTION || saved.question) {
      msgs.push({
        id: rid(),
        who: "bot",
        text: `${humanSummary(saved)}<br/><br/>Now, what specific question can I help you with?`,
      });
    }
  }

  if (saved.question) {
    msgs.push({ id: rid(), who: "you", text: saved.question });
    if (saved.answer) {
      msgs.push({ id: rid(), who: "bot", text: saved.answer });
      msgs.push({
        id: rid(),
        who: "bot",
        text: `I'd like to continue helping you. We can send you a detailed guide about your situation and how Tax Advocate Group can help. First, what's your name?`,
      });
    }
  }

  if (saved.name) {
    msgs.push({ id: rid(), who: "you", text: saved.name });
    msgs.push({
      id: rid(),
      who: "bot",
      text: `Nice to meet you, ${saved.name}! Would you like us to reach out via email, phone, or both?`,
    });
    msgs.push({ id: rid(), who: "bot", type: "contact_buttons", text: "" });
  }

  if (saved.contactPref) {
    msgs.push({
      id: rid(),
      who: "you",
      text:
        saved.contactPref === "both"
          ? "Both please"
          : `Via ${saved.contactPref}`,
    });
    const promptText =
      saved.contactPref === "email"
        ? "Great! What's your email address?"
        : saved.contactPref === "phone"
          ? "Perfect! What's your cell number?"
          : "Wonderful! Let's start with your email address.";
    msgs.push({ id: rid(), who: "bot", text: promptText });
  }

  if (saved.email && saved.contactPref === "email") {
    msgs.push({ id: rid(), who: "you", text: saved.email });
  }
  if (saved.phone && saved.contactPref === "phone") {
    msgs.push({ id: rid(), who: "you", text: saved.phone });
  }
  if (saved.email && saved.phone && saved.contactPref === "both") {
    msgs.push({ id: rid(), who: "you", text: saved.email });
    msgs.push({ id: rid(), who: "bot", text: "Great! Now your cell number?" });
    msgs.push({ id: rid(), who: "you", text: saved.phone });
  }

  return msgs;
}

function humanSummary(form = {}) {
  const scopeText =
    form.taxScope === "both"
      ? `the IRS and your state${form.state ? ` (${STATE_LABELS[form.state]})` : ""}`
      : form.taxScope === "state"
        ? `your state${form.state ? ` (${STATE_LABELS[form.state]})` : ""}`
        : "the IRS";

  const whoText =
    form.filerType === "business"
      ? "your business taxes"
      : "your personal income tax";

  const amountMap = {
    lt10k: "under $10k",
    "10to50k": "$10k\u2013$50k",
    gt50k: "over $50k",
    unsure: "an amount you're not sure about",
  };
  const amountText = form.balanceBand ? amountMap[form.balanceBand] : null;

  const issues = new Set(form.issues || []);
  const parts = [];
  if (issues.has("balance_due")) parts.push("a balance due");
  if (issues.has("irs_notice")) parts.push("an IRS notice");
  if (issues.has("unfiled")) parts.push("unfiled returns");
  if (issues.has("levy_lien")) parts.push("a levy or lien");
  if (issues.has("audit")) parts.push("an audit/exam");
  const issuePhrase = parts.length ? parts.join(" and ") : "a tax matter";

  const noticeDetail =
    form.noticeType && form.noticeType !== "none"
      ? ` (notice: ${form.noticeType === "cp504" ? "CP504" : form.noticeType === "levy" ? "Levy / Final notice" : form.noticeType === "other" ? "Something else" : "No notice"})`
      : "";

  const amountClause = amountText ? ` of ${amountText}` : "";
  return `Based on what you selected, you're dealing with ${issuePhrase}${amountClause} with ${scopeText} for ${whoText}${noticeDetail}.`;
}

function renderMessage(m) {
  return { __html: m.text };
}

/* -------------------------------------------------------------------------- */
/*                            MAIN COMPONENT                                  */
/* -------------------------------------------------------------------------- */

export default function TaxBarnaby() {
  const { askTaxQuestion } = useContext(leadContext);
  const { certUrl } = useTrustedForm();
  const [phase, setPhase] = useState(PHASE.INTAKE_ISSUES);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState(null);
  const [resendRemaining, setResendRemaining] = useState(3);
  const [smsConsentChecked, setSmsConsentChecked] = useState(false);
  async function handleResendCode(type) {
    setResendLoading(true);
    setResendMessage(null);
    try {
      const response = await fetch("/api/resend-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          phone: form.phone,
          contactPref: form.contactPref,
          name: form.name,
          type,
        }),
      });
      const result = await response.json();
      if (!result.ok) {
        setResendMessage({
          type: "error",
          text: result.error || "Failed to resend code",
        });
        setResendLoading(false);
        return;
      }
      if (result.codesSent?.email?.remaining !== undefined)
        setResendRemaining(result.codesSent.email.remaining);
      else if (result.codesSent?.phone?.remaining !== undefined)
        setResendRemaining(result.codesSent.phone.remaining);
      setResendMessage({
        type: "success",
        text: `New code sent! ${resendRemaining > 0 ? `You have ${resendRemaining} resend${resendRemaining === 1 ? "" : "s"} remaining.` : ""}`,
      });
      setTimeout(() => setResendMessage(null), 5000);
    } catch {
      setResendMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setResendLoading(false);
    }
  }

  const [messages, setMessages] = useState([
    {
      id: genId(),
      who: "bot",
      text: "Hello, my name is Caitlyn, your virtual tax expert. Let's figure out your tax situation. What are your current tax problems? Select all that apply.",
    },
    { id: genId(), who: "bot", type: "intake_issues", text: "" },
  ]);

  const [form, setForm] = useState({
    name: "",
    issues: [],
    balanceBand: "",
    noticeType: "",
    taxScope: "",
    state: "",
    filerType: "",
    question: "",
    answer: "",
    contactPref: "",
    email: "",
    phone: "",
    emailCode: "",
    phoneCode: "",
    emailVerified: false,
    phoneVerified: false,
  });

  const [input, setInput] = useState("");
  const [inputErr, setInputErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentIntakeStep, setCurrentIntakeStep] = useState(0);

  useAutoSaveProgress(form, phase, phase !== PHASE.DONE);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const hasProgress =
        form.name ||
        form.issues?.length > 0 ||
        form.question ||
        form.email ||
        form.phone;
      if (phase !== PHASE.DONE && hasProgress) {
        navigator.sendBeacon(
          "/api/save-progress",
          JSON.stringify({ ...form, lastPhase: phase }),
        );
        navigator.sendBeacon("/api/track-abandon");
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden && phase !== PHASE.DONE) {
        const hasProgress =
          form.name || form.issues?.length > 0 || form.question;
        if (hasProgress) {
          fetch("/api/save-progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ ...form, lastPhase: phase }),
            keepalive: true,
          }).catch(() => {});
        }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [form, phase]);

  useEffect(() => {
    const loadSavedProgress = async () => {
      const saved = await restoreProgress();
      if (saved && saved.lastPhase && saved.lastPhase !== PHASE.INTAKE_ISSUES) {
        setForm((prev) => ({
          ...prev,
          ...saved,
          startedAt: saved.startedAt || Date.now(),
        }));
        setMessages(rebuildMessagesFromSavedData(saved));
        setPhase(saved.lastPhase);
      }
    };
    loadSavedProgress();
  }, []);

  const bottomRef = useRef(null);
  const activeIntakeSteps = useMemo(
    () => INTAKE_STEPS.filter((step) => !step.showIf || step.showIf(form)),
    [form],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ========================== PHASE HANDLERS ==========================

  function handleNameSubmit(name) {
    setForm((prev) => ({ ...prev, name }));
    setMessages((prev) => [
      ...prev,
      { id: genId(), who: "you", text: name },
      {
        id: genId(),
        who: "bot",
        text: `Nice to meet you, ${name}! Would you like us to reach out via email, phone, or both?`,
      },
      { id: genId(), who: "bot", type: "contact_buttons", text: "" },
    ]);
    setPhase(PHASE.CONTACT_OFFER);
  }

  function handleIssueToggle(issueId) {
    setForm((prev) => {
      const cur = prev.issues || [];
      return {
        ...prev,
        issues: cur.includes(issueId)
          ? cur.filter((id) => id !== issueId)
          : [...cur, issueId],
      };
    });
  }

  function handleIssuesContinue() {
    if (!form.issues?.length) {
      setMessages((prev) => [
        ...prev,
        {
          id: genId(),
          who: "bot",
          text: "Please select at least one issue to continue.",
        },
      ]);
      return;
    }
    setMessages((prev) => [
      ...prev,
      { id: genId(), who: "bot", text: "Got it. Let's go step by step." },
    ]);
    setCurrentIntakeStep(0);
    setPhase(PHASE.INTAKE_QUESTIONS);
    const firstStep = activeIntakeSteps[0];
    if (firstStep) {
      setMessages((prev) => [
        ...prev,
        { id: genId(), who: "bot", text: firstStep.prompt },
        {
          id: genId(),
          who: "bot",
          type: "intake_step",
          stepIndex: 0,
          text: "",
        },
      ]);
    } else {
      finishIntake();
    }
  }

  function handleIntakeStepAnswer(stepKey, value, label) {
    setForm((prev) => ({ ...prev, [stepKey]: value }));
    setMessages((prev) => [...prev, { id: genId(), who: "you", text: label }]);
    const nextStepIndex = currentIntakeStep + 1;
    setTimeout(() => {
      const nextActiveSteps = INTAKE_STEPS.filter(
        (step) => !step.showIf || step.showIf({ ...form, [stepKey]: value }),
      );
      if (nextStepIndex < nextActiveSteps.length) {
        const nextStep = nextActiveSteps[nextStepIndex];
        setCurrentIntakeStep(nextStepIndex);
        setMessages((prev) => [
          ...prev,
          { id: genId(), who: "bot", text: nextStep.prompt },
          {
            id: genId(),
            who: "bot",
            type: "intake_step",
            stepIndex: nextStepIndex,
            text: "",
          },
        ]);
      } else {
        finishIntake();
      }
    }, 100);
  }

  function finishIntake() {
    const summary = humanSummary(form);
    setMessages((prev) => [
      ...prev,
      {
        id: genId(),
        who: "bot",
        text: `${summary}<br/><br/>Now, what specific question can I help you with?`,
      },
    ]);
    setPhase(PHASE.QUESTION);
  }

  async function handleQuestionSubmit(question) {
    setForm((prev) => ({ ...prev, question }));
    setMessages((prev) => [
      ...prev,
      { id: genId(), who: "you", text: question },
    ]);
    setLoading(true);
    try {
      const result = await askTaxQuestion(question);
      if (!result.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: genId(),
            who: "bot",
            text:
              result.error ||
              "Sorry, I encountered an error. Please try again.",
          },
        ]);
        setLoading(false);
        return;
      }
      const answer = result.answer || "";
      setForm((prev) => ({ ...prev, answer }));
      setMessages((prev) => [
        ...prev,
        { id: genId(), who: "bot", text: answer },
        {
          id: genId(),
          who: "bot",
          text: `I'd like to continue helping you with this matter. We can send you a detailed guide about your situation and how Tax Advocate Group can help. First, what's your name?`,
        },
      ]);
      setPhase(PHASE.NAME);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: genId(),
          who: "bot",
          text: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleContactPrefSelect(pref) {
    setForm((prev) => ({ ...prev, contactPref: pref }));
    setMessages((prev) => [
      ...prev,
      {
        id: genId(),
        who: "you",
        text: pref === "both" ? "Both please" : `Via ${pref}`,
      },
      {
        id: genId(),
        who: "bot",
        text:
          pref === "email"
            ? "Great! What's your email address?"
            : pref === "phone"
              ? "Perfect! What's your cell number?"
              : "Wonderful! Let's start with your email address.",
      },
    ]);
    setPhase(PHASE.CONTACT_DETAILS);
  }

  async function handleContactDetailsSubmit(value) {
    const { contactPref } = form;

    if (contactPref === "email") {
      const updatedForm = { ...form, email: value };
      setForm(updatedForm);
      setMessages((prev) => [
        ...prev,
        { id: genId(), who: "you", text: value },
        {
          id: genId(),
          who: "bot",
          text: "Perfect! I'm sending a verification code to your email.",
        },
      ]);
      await sendVerificationCodes(updatedForm);
      return;
    }

    if (contactPref === "phone") {
      const updatedForm = { ...form, phone: value };
      setForm(updatedForm);
      setMessages((prev) => [
        ...prev,
        { id: genId(), who: "you", text: value },
        {
          id: genId(),
          who: "bot",
          text: "Great! I'm sending a verification code to your phone.",
        },
      ]);
      await sendVerificationCodes(updatedForm);
      return;
    }

    if (contactPref === "both") {
      if (!form.email) {
        setForm((prev) => ({ ...prev, email: value }));
        setMessages((prev) => [
          ...prev,
          { id: genId(), who: "you", text: value },
          { id: genId(), who: "bot", text: "Great! Now your cell number?" },
        ]);
        return;
      }
      if (!form.phone) {
        const updatedForm = { ...form, phone: value };
        setForm(updatedForm);
        setMessages((prev) => [
          ...prev,
          { id: genId(), who: "you", text: value },
          {
            id: genId(),
            who: "bot",
            text: "Excellent! I'm sending verification codes to both your email and phone.",
          },
        ]);
        await sendVerificationCodes(updatedForm);
        return;
      }
    }
  }

  async function sendVerificationCodes(currentForm) {
    try {
      const response = await fetch("/api/send-verification-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: currentForm.name,
          email: currentForm.email,
          phone: currentForm.phone,
          contactPref: currentForm.contactPref,
        }),
      });
      const result = await response.json();
      if (!result.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: genId(),
            who: "bot",
            text: "Sorry, there was an error sending the verification codes. Please try again.",
          },
        ]);
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: genId(),
          who: "bot",
          text: "Please enter the verification code(s) you received.",
        },
      ]);
      setPhase(PHASE.VERIFICATION);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: genId(),
          who: "bot",
          text: "Sorry, there was an error. Please try again.",
        },
      ]);
    }
  }

  async function handleVerificationSubmit() {
    try {
      const response = await fetch("/api/verify-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          phone: form.phone,
          emailCode: form.emailCode,
          phoneCode: form.phoneCode,
          contactPref: form.contactPref,
        }),
      });
      const result = await response.json();
      if (!result.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: genId(),
            who: "bot",
            text:
              result.error || "Invalid verification code. Please try again.",
          },
        ]);
        return false;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: genId(),
          who: "bot",
          text: "Verified! Preparing your personalized tax guide...",
        },
      ]);
      await finalizeSubmission();
      return true;
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: genId(),
          who: "bot",
          text: "Sorry, there was an error. Please try again.",
        },
      ]);
      return false;
    }
  }

  async function finalizeSubmission() {
    try {
      const summary = humanSummary(form);
      const response = await fetch("/api/finalize-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          contactPref: form.contactPref,
          question: form.question,
          answer: form.answer,
          issues: form.issues,
          balanceBand: form.balanceBand,
          noticeType: form.noticeType,
          taxScope: form.taxScope,
          state: form.state,
          filerType: form.filerType,
          intakeSummary: summary,
          trustedFormCertUrl: certUrl, // ← add
        }),
      });
      const result = await response.json();
      if (!result.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: genId(),
            who: "bot",
            text: "There was an issue finalizing your submission. Our team has been notified and will reach out soon.",
          },
        ]);
        setPhase(PHASE.DONE);
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: genId(),
          who: "bot",
          text: `Perfect! I've sent your personalized tax guide to ${form.email ? "your email" : ""}${form.email && form.phone ? " and a " : ""}${form.phone ? "scheduling link to your phone" : ""}. Our team will reach out within 24 hours. Thank you for choosing Tax Advocate Group!`,
        },
      ]);
      setPhase(PHASE.DONE);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: genId(),
          who: "bot",
          text: "There was an issue, but our team has your information and will reach out soon.",
        },
      ]);
      setPhase(PHASE.DONE);
    }
  }

  // ========================== INPUT HANDLING ==========================

  function handleInputChange(e) {
    const raw = e.target.value;
    setInput(raw);
    let validationPhase = phase;
    if (phase === PHASE.CONTACT_DETAILS) {
      if (form.contactPref === "phone") validationPhase = "phone";
      else if (form.contactPref === "email" || !form.email)
        validationPhase = "email";
      else validationPhase = "phone";
    }
    const textPhases = [PHASE.NAME, PHASE.QUESTION, "email", "phone"];
    if (!textPhases.includes(validationPhase)) {
      setInputErr(null);
      return;
    }
    const result = inputChecker({ phase: validationPhase, value: raw });
    if (result.ok) setInputErr(null);
    else {
      const errorMessages = {
        empty_name: "Please enter your name.",
        empty_email: "Please enter your email.",
        empty_phone: "Please enter your phone number.",
        empty_question: "Please enter a question.",
        invalid_name_format:
          "Name should only contain letters, spaces, hyphens, and apostrophes.",
        invalid_email: "Please enter a valid email address.",
        invalid_phone: "Please enter a valid phone number (10-15 digits).",
        gibberish_name: "Please enter a real name.",
        gibberish_question: "Please enter a clear question.",
        too_short: "Question is too short. Please be more specific.",
        profanity_detected: "Please keep it respectful.",
      };
      setInputErr(errorMessages[result.reason] || "Please check your input.");
    }
  }

  function handleSend(e) {
    e.preventDefault();
    if (phase === PHASE.DONE) return;
    const val = input.trim();
    if (phase === PHASE.INTAKE_ISSUES) {
      handleIssuesContinue();
      return;
    }
    if (phase === PHASE.INTAKE_QUESTIONS) return;
    if (phase === PHASE.CONTACT_OFFER) return;
    if (phase === PHASE.VERIFICATION) {
      handleVerificationSubmit();
      return;
    }
    if (!val) {
      setInputErr("Please enter something.");
      return;
    }
    let validationPhase = phase;
    if (phase === PHASE.CONTACT_DETAILS) {
      if (form.contactPref === "phone") validationPhase = "phone";
      else if (form.contactPref === "email" || !form.email)
        validationPhase = "email";
      else validationPhase = "phone";
    }
    const result = inputChecker({ phase: validationPhase, value: val });
    if (!result.ok) return;
    setInput("");
    setInputErr(null);
    if (phase === PHASE.NAME) handleNameSubmit(result.cleaned);
    else if (phase === PHASE.QUESTION) handleQuestionSubmit(result.cleaned);
    else if (phase === PHASE.CONTACT_DETAILS)
      handleContactDetailsSubmit(result.cleaned);
  }

  // ========================== RENDER ==========================

  const isInputDisabled =
    phase === PHASE.INTAKE_ISSUES ||
    phase === PHASE.INTAKE_QUESTIONS ||
    phase === PHASE.CONTACT_OFFER ||
    phase === PHASE.VERIFICATION ||
    phase === PHASE.DONE ||
    loading;

  const buttonLabel =
    phase === PHASE.INTAKE_ISSUES || phase === PHASE.INTAKE_QUESTIONS
      ? "Continue"
      : phase === PHASE.VERIFICATION
        ? "Verify"
        : phase === PHASE.NAME ||
            phase === PHASE.CONTACT_DETAILS ||
            phase === PHASE.QUESTION
          ? "Send"
          : "Continue";

  const placeholder =
    phase === PHASE.QUESTION
      ? "Type your question\u2026"
      : phase === PHASE.NAME
        ? "Enter your name\u2026"
        : phase === PHASE.CONTACT_DETAILS
          ? form.contactPref === "phone" ||
            (form.contactPref === "both" && form.email)
            ? "Your cell number\u2026"
            : "Your email address\u2026"
          : "";

  return (
    <div style={styles.shell}>
      <div style={styles.chatContainer}>
        <div style={styles.chat}>
          {messages.map((m) => {
            if (
              m.type !== "intake_issues" &&
              m.type !== "intake_step" &&
              m.type !== "contact_buttons"
            ) {
              return (
                <div
                  key={m.id}
                  style={{
                    ...styles.msg,
                    ...(m.who === "you" ? styles.user : styles.bot),
                  }}
                >
                  <div style={styles.role}>
                    {m.who === "you" ? "You" : "Caitlyn"}
                  </div>
                  <div
                    style={styles.bubble}
                    dangerouslySetInnerHTML={renderMessage(m)}
                  />
                </div>
              );
            }
            if (m.type === "intake_issues") {
              return (
                <div key={m.id} style={styles.optionsContainer}>
                  <div style={styles.optionsGrid}>
                    {ISSUE_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleIssueToggle(opt.id)}
                        style={{
                          ...styles.optionBtn,
                          ...(form.issues?.includes(opt.id)
                            ? styles.optionBtnSelected
                            : {}),
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }
            if (m.type === "intake_step") {
              const step = activeIntakeSteps[m.stepIndex];
              if (!step) return null;
              return (
                <div key={m.id} style={styles.optionsContainer}>
                  <div style={styles.optionsGrid}>
                    {step.type === "select" ? (
                      <select
                        value={form[step.key] || ""}
                        onChange={(e) => {
                          const sel = step.options.find(
                            (o) => o.id === e.target.value,
                          );
                          if (sel)
                            handleIntakeStepAnswer(
                              step.key,
                              e.target.value,
                              sel.label,
                            );
                        }}
                        style={styles.select}
                      >
                        <option value="">-- Select --</option>
                        {step.options.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      step.options?.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() =>
                            handleIntakeStepAnswer(step.key, opt.id, opt.label)
                          }
                          style={{
                            ...styles.optionBtn,
                            ...(form[step.key] === opt.id
                              ? styles.optionBtnSelected
                              : {}),
                          }}
                        >
                          {opt.label}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              );
            }
            if (m.type === "contact_buttons") {
              return (
                <div key={m.id} style={styles.contactButtons}>
                  <button
                    onClick={() => handleContactPrefSelect("email")}
                    style={styles.contactBtn}
                  >
                    Email
                  </button>
                  <button
                    onClick={() => handleContactPrefSelect("phone")}
                    style={styles.contactBtn}
                  >
                    Phone
                  </button>
                  <button
                    onClick={() => handleContactPrefSelect("both")}
                    style={styles.contactBtn}
                  >
                    Both
                  </button>
                </div>
              );
            }
            return null;
          })}

          {phase === PHASE.VERIFICATION && (
            <div style={styles.verificationContainer}>
              {resendMessage && (
                <div
                  style={{
                    ...styles.resendMessage,
                    ...(resendMessage.type === "error"
                      ? styles.resendMessageError
                      : styles.resendMessageSuccess),
                  }}
                >
                  {resendMessage.text}
                </div>
              )}
              {(form.contactPref === "email" ||
                form.contactPref === "both") && (
                <div style={styles.verificationField}>
                  <div style={styles.verificationLabelRow}>
                    <label style={styles.verificationLabel}>Email Code:</label>
                    <button
                      type="button"
                      onClick={() => handleResendCode("email")}
                      disabled={resendLoading || resendRemaining === 0}
                      style={{
                        ...styles.resendButton,
                        ...(resendLoading || resendRemaining === 0
                          ? styles.resendButtonDisabled
                          : {}),
                      }}
                    >
                      {resendLoading ? "Sending..." : "Resend Code"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={form.emailCode}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        emailCode: e.target.value,
                      }))
                    }
                    placeholder="6-digit code"
                    maxLength={6}
                    style={styles.verificationInput}
                  />
                </div>
              )}
              {(form.contactPref === "phone" ||
                form.contactPref === "both") && (
                <div style={styles.verificationField}>
                  <div style={styles.verificationLabelRow}>
                    <label style={styles.verificationLabel}>Phone Code:</label>
                    <button
                      type="button"
                      onClick={() => handleResendCode("phone")}
                      disabled={resendLoading || resendRemaining === 0}
                      style={{
                        ...styles.resendButton,
                        ...(resendLoading || resendRemaining === 0
                          ? styles.resendButtonDisabled
                          : {}),
                      }}
                    >
                      {resendLoading ? "Sending..." : "Resend Code"}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={form.phoneCode}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        phoneCode: e.target.value,
                      }))
                    }
                    placeholder="6-digit code"
                    maxLength={6}
                    style={styles.verificationInput}
                  />
                </div>
              )}
              {resendRemaining === 0 && (
                <div style={styles.rateLimitWarning}>
                  Resend limit reached. Please wait 15 minutes or contact
                  support.
                </div>
              )}
              {phase === PHASE.VERIFICATION && (
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#64748b",
                      lineHeight: 1.6,
                      padding: "8px 4px",
                      marginTop: 4,
                    }}
                  >
                    By verifying, you expressly consent to receive automated and
                    manually dialed telephone calls and prerecorded voice
                    messages from Tax Advocate Group, LLC. Message and data
                    rates may apply. Message frequency varies. Reply STOP to opt
                    out, HELP for assistance. Consent is not a condition of
                    purchase.{" "}
                    <a href="/privacy-policy" style={{ color: "#0d9488" }}>
                      Privacy Policy
                    </a>
                    .
                  </div>

                  {/* ── SMS opt-in (optional, separate per TCR) ── */}
                  <div style={{ marginTop: 8 }}>
                    <label
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={smsConsentChecked}
                        onChange={(e) => setSmsConsentChecked(e.target.checked)}
                        style={{ marginTop: 2, flexShrink: 0 }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          color: "#64748b",
                          lineHeight: 1.6,
                        }}
                      >
                        By checking this box, I agree to receive SMS messages
                        about customer care and case updates from Tax Advocate
                        Group at the phone number provided. Message frequency
                        may vary. Message and data rates may apply. Text HELP to
                        1-800-517-1807 for assistance. Reply STOP to opt out.
                        View our{" "}
                        <a href="/privacy-policy" style={{ color: "#0d9488" }}>
                          Privacy Policy
                        </a>{" "}
                        and{" "}
                        <a
                          href="/terms-of-service"
                          style={{ color: "#0d9488" }}
                        >
                          Terms of Service
                        </a>
                        .
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* ── SMS opt-in (optional, separate per TCR) ── */}
              <div style={{ marginTop: 8 }}>
                <label
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={smsConsentChecked}
                    onChange={(e) => setSmsConsentChecked(e.target.checked)}
                    style={{ marginTop: 2, flexShrink: 0 }}
                  />
                  <span
                    style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6 }}
                  >
                    By checking this box, I agree to receive SMS messages about
                    customer care and case updates from Tax Advocate Group at
                    the phone number provided. Message frequency may vary.
                    Message and data rates may apply. Text HELP to
                    1-800-517-1807 for assistance. Reply STOP to opt out. View
                    our{" "}
                    <a href="/privacy-policy" style={{ color: "#0d9488" }}>
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="/terms-of-service" style={{ color: "#0d9488" }}>
                      Terms of Service
                    </a>
                    .
                  </span>
                </label>
              </div>
            </div>
          )}

          {loading && (
            <div style={{ ...styles.msg, ...styles.bot }}>
              <div style={styles.role}>Caitlyn</div>
              <div style={styles.bubble}>Thinking...</div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div style={styles.inputArea}>
        {inputErr && <div style={styles.error}>{inputErr}</div>}
        <form onSubmit={handleSend} style={styles.inputRow}>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={isInputDisabled}
            style={styles.input}
            autoFocus={false}
          />
          <button
            type="submit"
            disabled={phase === PHASE.DONE}
            style={{
              ...styles.button,
              ...(phase === PHASE.DONE ? styles.buttonDisabled : {}),
            }}
          >
            {buttonLabel}
          </button>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              STYLES (teal/navy)                            */
/* -------------------------------------------------------------------------- */

const styles = {
  shell: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    fontFamily: "system-ui, sans-serif",
  },
  chatContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    padding: "16px",
  },
  chat: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflowY: "auto",
    scrollbarGutter: "stable",
  },
  msg: { display: "flex", flexDirection: "column" },
  user: { alignItems: "flex-end" },
  bot: { alignItems: "flex-start" },
  role: { fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 500 },
  bubble: {
    maxWidth: "85%",
    background: "#f0fdfa",
    border: "1px solid #99f6e4",
    borderRadius: 12,
    padding: "12px 16px",
    lineHeight: 1.5,
    fontSize: 15,
    color: "#0f172a",
  },
  contactButtons: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    margin: "12px 0",
  },
  contactBtn: {
    background: "#f0fdfa",
    border: "2px solid #99f6e4",
    borderRadius: 8,
    padding: "12px 20px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  optionsContainer: { margin: "8px 0" },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 8,
  },
  optionBtn: {
    background: "#fff",
    border: "2px solid #e2e8f0",
    borderRadius: 8,
    padding: "12px 16px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "center",
  },
  optionBtnSelected: {
    background:
      "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #0f4c75 100%)",
    color: "#fff",
    borderColor: "transparent",
  },
  select: {
    gridColumn: "1 / -1",
    padding: "12px 16px",
    fontSize: 15,
    borderRadius: 8,
    border: "2px solid #e2e8f0",
    outline: "none",
    cursor: "pointer",
  },
  inputArea: {
    padding: "12px 16px",
    borderTop: "1px solid #e2e8f0",
    background: "#fff",
  },
  error: { color: "#dc2626", fontSize: 13, marginBottom: 8, fontWeight: 500 },
  inputRow: { display: "flex", gap: 8 },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  button: {
    background:
      "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #0f4c75 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "12px 24px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(13,148,136,0.3)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    whiteSpace: "nowrap",
  },
  buttonDisabled: { opacity: 0.5, cursor: "not-allowed" },
  verificationContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: "16px",
    background: "#f0fdfa",
    borderRadius: 12,
    border: "1px solid #99f6e4",
    margin: "8px 0",
  },
  verificationField: { display: "flex", flexDirection: "column", gap: 6 },
  verificationLabelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  verificationLabel: { fontSize: 13, fontWeight: 600, color: "#475569" },
  verificationInput: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "2px solid #cbd5e1",
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: "4px",
    textAlign: "center",
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  resendButton: {
    background: "none",
    border: "1px solid #0d9488",
    borderRadius: 6,
    padding: "4px 12px",
    fontSize: 12,
    fontWeight: 600,
    color: "#0d9488",
    cursor: "pointer",
  },
  resendButtonDisabled: { opacity: 0.4, cursor: "not-allowed" },
  resendMessage: {
    fontSize: 13,
    padding: "8px 12px",
    borderRadius: 6,
    fontWeight: 500,
  },
  resendMessageError: {
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
  },
  resendMessageSuccess: {
    background: "#f0fdf4",
    color: "#16a34a",
    border: "1px solid #bbf7d0",
  },
  rateLimitWarning: {
    fontSize: 12,
    color: "#d97706",
    fontWeight: 500,
    padding: "8px",
    background: "#fffbeb",
    borderRadius: 6,
    textAlign: "center",
  },
};
