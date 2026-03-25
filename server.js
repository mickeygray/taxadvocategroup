require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const axios = require("axios");
const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");
const connectDB = require("./config/db");
const OpenAI = require("openai");
const cookieParser = require("cookie-parser");
const questionCounter = require("./middleware/questionCounter");
const {
  generateCode,
  storeVerificationCode,
  verifyCode,
  isVerified,
  generateAISummary,
} = require("./utils/verification");

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === "production";

/* -------------------------------------------------------------------------- */
/*                              MIDDLEWARE                                     */
/* -------------------------------------------------------------------------- */

connectDB();
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET || "dev-secret-change-me"));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://www.taxadvocategroup.com"],
    credentials: true,
  }),
);

/* -------------------------------------------------------------------------- */
/*                           EMAIL & OPENAI SETUP                             */
/* -------------------------------------------------------------------------- */

// Transporter used ONLY for verification code emails
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.TAG_API_KEY,
  },
});

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/* -------------------------------------------------------------------------- */
/*                        TAX BARNABY HISTORY COOKIE                          */
/* -------------------------------------------------------------------------- */

const TB_HISTORY_COOKIE = "tb_history";
const TB_HISTORY_MAX_ITEMS = 4;
const TB_HISTORY_MAX_FIELD = 1200;

function clampText(s = "", limit = TB_HISTORY_MAX_FIELD) {
  const t = String(s)
    .replace(/\u0000/g, "")
    .trim();
  return t.length > limit ? t.slice(0, limit) + " ..." : t;
}

function readHistory(req) {
  try {
    const raw = req.signedCookies?.[TB_HISTORY_COOKIE];
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x) => x && typeof x === "object")
      .map(({ q, a }) => ({ q: clampText(q), a: clampText(a) }))
      .slice(-TB_HISTORY_MAX_ITEMS);
  } catch {
    return [];
  }
}

function writeHistory(res, history) {
  const trimmed = (history || [])
    .filter((x) => x && typeof x === "object")
    .map(({ q, a }) => ({ q: clampText(q), a: clampText(a) }))
    .slice(-TB_HISTORY_MAX_ITEMS);

  res.cookie(TB_HISTORY_COOKIE, JSON.stringify(trimmed), {
    httpOnly: true,
    sameSite: "Lax",
    secure: isProd,
    signed: true,
    maxAge: 7 * 24 * 3600 * 1000,
    path: "/",
  });
}

/* -------------------------------------------------------------------------- */
/*                       TAX AREAS & SYSTEM PROMPT                            */
/* -------------------------------------------------------------------------- */

const TAX_AREAS = `
FEDERAL TAX TOPICS:
- Balance due / tax debt / back taxes / unpaid taxes
- IRS notices (CP501, CP503, CP504, CP90, CP91, LT11, 1058, 668A, etc.)
- Unfiled returns / non-filer / late filing / compliance
- Levy / lien / garnishment / wage garnishment / bank levy / seizure
- Audit / examination / correspondence audit
- Payment plans / installment agreements / currently not collectible (CNC)
- Offer in compromise (OIC) / tax settlement / penalty abatement
- Collection Due Process (CDP) hearings / appeals
- Innocent spouse relief / injured spouse
- Tax forms (1040, 941, 940, W-2, 1099, K-1, Schedule C, etc.)
- Withholding / estimated taxes / quarterly payments
- Self-employment tax / payroll tax / employment tax (FICA, Medicare)
- Business taxes / LLC / S-corp / C-corp / partnership / sole proprietor
- Deductions / credits / exemptions / dependents
- Capital gains / depreciation / basis
- Retirement accounts (IRA, 401k, RMD) / HSA
- Estate tax / gift tax / inheritance
- Identity theft / identity verification / IP PIN

STATE TAX TOPICS:
- State tax debt / state notices
- Franchise Tax Board (FTB - California)
- Department of Revenue (various states)
- State filing / state compliance
- Sales tax / use tax / excise tax / property tax

LIFE SITUATIONS THAT MAY RELATE TO TAX:
- Death of family member (estate tax, inheritance, final returns)
- Divorce / separation (innocent spouse, filing status, alimony)
- Job loss / unemployment (income changes, estimated taxes)
- Starting a business (entity selection, self-employment tax)
- Received inheritance / sold property (capital gains, basis)
- Medical expenses (deductions, HSA)
- Education expenses (credits, student loan interest)
- Disability / hardship (currently not collectible, payment plans)
- Bankruptcy (discharge of tax debt, chapter 7 vs 13)
- Cryptocurrency / gig work / 1099 income
`;

const NON_TAX_REFUSAL =
  "I specialize in U.S. tax matters and can't provide guidance on that topic. However, if you have tax questions related to your situation, I'm here to help. Would you like to schedule a call with a Tax Advocate Group consultant to discuss your needs?";

const TAX_SYSTEM_PROMPT = `
You are Caitlyn, a specialized U.S. tax education assistant for Tax Advocate Group.

CONTEXT AWARENESS:
You may have information about the user's tax situation from their intake selections. Use this context to provide personalized guidance.

TAX AREAS YOU COVER:
${TAX_AREAS}

ROLE & SCOPE:
- Explain and interpret federal and state tax rules clearly and professionally
- Draw on the Internal Revenue Code (IRC), Treasury Regulations, IRS rulings and procedures, the Internal Revenue Manual (IRM), official IRS publications, and state or local tax guidance
- Make these rules understandable in plain English for ordinary taxpayers

STYLE & OUTPUT:
- Write in smooth, conversational paragraphs
- Keep answers concise (usually 6-10 sentences or 150 words max)
- Use light formatting for clarity
- When citing authorities, include short inline references such as (IRC §6331) or (IRM 5.14.1.2)
- Never use markdown headers (#, ##, etc.)
- Professional, approachable tone

CONTENT GUIDELINES:
- Address the user's situation factually
- Mention deadlines, forms, or processes accurately
- If unsure, say what needs verification
- Stay strictly within U.S. federal or state tax matters

CRITICAL PROHIBITIONS:
- NEVER tell users to contact or visit the IRS or any government website
- NEVER include phone numbers, URLs, or external resources
- NEVER fabricate citations
- NEVER discuss non-tax topics

NON-TAX QUESTION HANDLING:
If a question has NO connection to taxes:
- Politely respond: "${NON_TAX_REFUSAL}"

CLOSING:
- Always end with: "Tax Advocate Group can help you review your situation and confirm the best next step. Educational information only—not legal or tax advice."
`;

/* -------------------------------------------------------------------------- */
/*                          TAX KEYWORD DETECTION                             */
/* -------------------------------------------------------------------------- */

function isTaxRelated(text = "") {
  const s = (text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const keywords = [
    "tax",
    "taxes",
    "taxation",
    "taxpayer",
    "tax return",
    "tax refund",
    "tax bill",
    "tax debt",
    "back taxes",
    "owe taxes",
    "owe the irs",
    "late taxes",
    "delinquent taxes",
    "unpaid taxes",
    "past due taxes",
    "tax relief",
    "tax resolution",
    "tax problem",
    "tax issue",
    "tax help",
    "tax notice",
    "tax letter",
    "irs letter",
    "irs notice",
    "notice of intent",
    "cp501",
    "cp503",
    "cp504",
    "cp90",
    "cp91",
    "lt11",
    "1058",
    "668a",
    "cp508c",
    "irs",
    "internal revenue",
    "internal revenue service",
    "treasury",
    "federal tax",
    "state tax",
    "franchise tax board",
    "ftb",
    "department of revenue",
    "revenue department",
    "taxing authority",
    "1040",
    "1040x",
    "1041",
    "1065",
    "1120",
    "1120s",
    "941",
    "940",
    "1099",
    "1099-misc",
    "1099k",
    "w2",
    "w-2",
    "k1",
    "k-1",
    "schedule c",
    "schedule e",
    "schedule f",
    "schedule a",
    "schedule b",
    "form 433a",
    "form 433b",
    "form 433f",
    "form 9465",
    "form 2848",
    "form 656",
    "form 8857",
    "form 8821",
    "form 4506",
    "form 4506-t",
    "ein",
    "itin",
    "ssn",
    "tax id",
    "filing",
    "file my taxes",
    "filed my taxes",
    "unfiled",
    "compliance",
    "non filer",
    "non-filer",
    "late filing",
    "amendment",
    "amend return",
    "audit",
    "examination",
    "amended return",
    "substitute for return",
    "income",
    "earned income",
    "gross income",
    "adjusted gross",
    "agi",
    "deduct",
    "deduction",
    "deductions",
    "itemized",
    "standard deduction",
    "credit",
    "tax credit",
    "child tax credit",
    "earned income credit",
    "dependency",
    "dependent",
    "exemption",
    "write off",
    "write-off",
    "capital gain",
    "capital gains",
    "basis",
    "depreciation",
    "withholding",
    "fica",
    "social security tax",
    "medicare tax",
    "payroll tax",
    "employment tax",
    "self employment tax",
    "estimated tax",
    "quarterly payment",
    "quarterly taxes",
    "levy",
    "lien",
    "garnishment",
    "garnish wages",
    "bank levy",
    "seizure",
    "payment plan",
    "installment agreement",
    "currently not collectible",
    "cnc",
    "offer in compromise",
    "oic",
    "fresh start",
    "settlement",
    "penalty abatement",
    "first time abatement",
    "hardship",
    "appeal",
    "cdp hearing",
    "collection due process",
    "innocent spouse",
    "llc",
    "s corp",
    "s-corp",
    "c corp",
    "c-corp",
    "partnership",
    "sole proprietor",
    "self employed",
    "business taxes",
    "penalty",
    "interest",
    "failure to file",
    "failure to pay",
    "extension",
    "deadline",
    "april 15",
    "due date",
    "ira",
    "roth ira",
    "401k",
    "hsa",
    "rmd",
    "estate tax",
    "gift tax",
    "i owe",
    "owe the irs",
    "owe money to the irs",
    "owe taxes",
    "received a letter",
    "got a letter",
    "irs sent me",
    "balance due",
  ];

  return keywords.some((k) => new RegExp(`\\b${k}\\b`, "i").test(s));
}

/* -------------------------------------------------------------------------- */
/*                            WEBHOOK HELPER                                  */
/* -------------------------------------------------------------------------- */

async function postToWebhook(fields, source = "website") {
  console.log(`[WEBHOOK] ========== START postToWebhook ==========`);
  console.log(`[WEBHOOK] Source: ${source}`);
  console.log(`[WEBHOOK] Fields:`, JSON.stringify(fields, null, 2));

  try {
    if (!process.env.WEBHOOK_URL || !process.env.LEAD_WEBHOOK_SECRET) {
      console.warn("[WEBHOOK] ✗ Missing WEBHOOK_URL or LEAD_WEBHOOK_SECRET");
      return { ok: false, error: "Webhook not configured" };
    }

    const url = `${process.env.WEBHOOK_URL}/lead-contact`;
    console.log(`[WEBHOOK] Posting to URL: ${url}`);

    const response = await axios.post(
      url,
      { ...fields, source },
      {
        headers: {
          "Content-Type": "application/json",
          "x-webhook-key": process.env.LEAD_WEBHOOK_SECRET,
        },
        timeout: 15000,
      },
    );

    console.log(`[WEBHOOK] ✓ Response status: ${response.status}`);
    console.log(`[WEBHOOK] ========== END postToWebhook ==========`);
    return response.data;
  } catch (err) {
    console.error(`[WEBHOOK] ✗ Error: ${err.message}`);
    console.error(
      `[WEBHOOK] ✗ Response status: ${err.response?.status || "N/A"}`,
    );
    console.log(`[WEBHOOK] ========== END postToWebhook (ERROR) ==========`);
    return { ok: false, error: err.message };
  }
}

/* -------------------------------------------------------------------------- */
/*                          FORM TRACKING                                     */
/* -------------------------------------------------------------------------- */

app.post("/api/track-form-input", async (req, res) => {
  try {
    const { formType, formData, abandoned, timestamp } = req.body;

    if (!formType || !formData) {
      return res
        .status(400)
        .json({ ok: false, error: "formType and formData required" });
    }

    const cookieName = `form_${formType}`;
    const cookieData = {
      formType,
      formData,
      abandoned: abandoned || false,
      timestamp: timestamp || Date.now(),
      lastUpdated: Date.now(),
    };

    res.cookie(cookieName, JSON.stringify(cookieData), {
      httpOnly: true,
      sameSite: "Lax",
      secure: isProd,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      signed: true,
      path: "/",
    });

    if (abandoned) {
      const hasContact = formData.email || formData.phone;
      if (hasContact) {
        const displayName =
          formData.name ||
          [formData.firstName, formData.lastName].filter(Boolean).join(" ") ||
          "Unknown";
        const formLabel = formType
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        // Fire to webhook so the pipeline handles notification
        postToWebhook(
          {
            name: displayName,
            email: formData.email || "",
            phone: formData.phone || "",
            company: "TAG",
            city: "",
            state: "",
            message: `Abandoned ${formLabel} form`,
          },
          "form-abandonment",
        ).catch((err) =>
          console.error("[TRACK-FORM] Webhook failed:", err.message),
        );
      }
    }

    return res.json({ ok: true, message: "Form data tracked" });
  } catch (error) {
    console.error("[/track-form-input] error:", error);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to track form data" });
  }
});

/* -------------------------------------------------------------------------- */
/*                          CONTACT FORM ROUTE                                */
/* -------------------------------------------------------------------------- */

app.post("/send-email", async (req, res) => {
  const { name, email, message, phone, trustedFormCertUrl } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const webhookResult = await postToWebhook(
      {
        name,
        email,
        company: "TAG",
        phone: phone || "",
        city: "",
        state: "",
        message,
        trustedFormCertUrl: trustedFormCertUrl || "",
      },
      "contact-form",
    );

    console.log(
      "[CONTACT-FORM] ✓ Webhook:",
      webhookResult.ok ? "Success" : webhookResult.error,
    );

    res.status(200).json({ success: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Error sending email. Try again later." });
  }
});

app.post("/api/contact-form", async (req, res) => {
  const { name, email, message, phone, trustedFormCertUrl } = req.body;
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Name, email, and message are required!" });
  }

  try {
    const webhookResult = await postToWebhook(
      {
        name,
        email,
        company: "TAG",
        phone: phone || "",
        city: "",
        state: "",
        message,
        trustedFormCertUrl: trustedFormCertUrl,
      },
      "contact-form",
    );

    console.log(
      "[CONTACT-FORM] ✓ Webhook:",
      webhookResult.ok ? "Success" : webhookResult.error,
    );
    res.status(200).json({ success: "Form submitted successfully!" });
  } catch (error) {
    console.error("[CONTACT-FORM] Error:", error);
    res.status(500).json({ error: "Error processing form. Try again later." });
  }
});

/* -------------------------------------------------------------------------- */
/*                          LEAD FORM (LANDING PAGE)                          */
/* -------------------------------------------------------------------------- */

app.post("/api/lead-form", async (req, res) => {
  const {
    taxType,
    filingStatus,
    debtType,
    debtAmount,
    name,
    phone,
    email,
    bestTime,
    source,
    trustedFormCertUrl,
  } = req.body;

  console.log("[LEAD-FORM] Submission:", {
    name,
    email,
    phone,
    debtAmount,
    taxType,
  });

  if (!name || !phone || !email) {
    return res
      .status(400)
      .json({ error: "Name, phone, and email are required!" });
  }

  try {
    const message = [
      taxType ? `Tax Type: ${taxType}` : "",
      filingStatus ? `Filing Status: ${filingStatus}` : "",
      debtType ? `Debt Type: ${debtType}` : "",
      debtAmount ? `Estimated Amount: ${debtAmount}` : "",
      bestTime ? `Best Time: ${bestTime}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    const webhookResult = await postToWebhook(
      {
        name,
        email,
        company: "TAG",
        phone,
        city: "",
        state: "",
        message,
        trustedFormCertUrl,
      },
      source || "landing-qualify",
    );

    console.log(
      "[LEAD-FORM] ✓ Webhook:",
      webhookResult.ok ? "Success" : webhookResult.error,
      "CaseID:",
      webhookResult.caseId || "N/A",
    );

    console.log("[LEAD-FORM] ✓ Complete");
    res.status(200).json({ success: "Lead form submitted successfully!" });
  } catch (error) {
    console.error("[LEAD-FORM] Error:", error?.message || error);
    res
      .status(500)
      .json({ error: "Error processing lead form. Try again later." });
  }
});

/* -------------------------------------------------------------------------- */
/*                          STATE TAX FORM                                    */
/* -------------------------------------------------------------------------- */

app.post("/api/state-tax-form", async (req, res) => {
  const {
    name,
    email,
    phone,
    state,
    problemTypes,
    owedAmount,
    description,
    source,
    trustedFormCertUrl,
  } = req.body;

  console.log("[STATE-TAX-FORM] Submission:", { name, email, phone, state });

  if (!name || !email || !phone || !state) {
    return res
      .status(400)
      .json({ error: "Name, email, phone, and state are required." });
  }

  try {
    const issues =
      typeof problemTypes === "string"
        ? problemTypes
        : Array.isArray(problemTypes)
          ? problemTypes.join(", ")
          : "";

    const message = [
      `State: ${state}`,
      issues ? `Issues: ${issues}` : "",
      owedAmount ? `Amount Owed: ${owedAmount}` : "",
      description ? `Details: ${description}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    const webhookResult = await postToWebhook(
      {
        name,
        email,
        company: "TAG",
        phone,
        city: "",
        state,
        message,
        trustedFormCertUrl,
      },
      source || "state-tax-guide",
    );

    console.log(
      "[STATE-TAX-FORM] ✓ Webhook:",
      webhookResult.ok ? "Success" : webhookResult.error,
    );

    res.status(200).json({ success: "State tax form submitted successfully!" });
  } catch (error) {
    console.error("[STATE-TAX-FORM] Error:", error?.message || error);
    res.status(500).json({ error: "Error processing form. Try again later." });
  }
});

/* -------------------------------------------------------------------------- */
/*                      TAX BARNABY AI ANSWER ROUTE                           */
/* -------------------------------------------------------------------------- */

app.post("/api/answer", questionCounter, async (req, res) => {
  try {
    const raw = req.body?.question;
    const question = (raw ?? "").toString().trim();

    if (!question) {
      return res.json({
        ok: true,
        blocked: false,
        remaining: req.taxBarnaby.remaining,
        resetAt: req.taxBarnaby.resetAt,
        answer: NON_TAX_REFUSAL,
      });
    }

    const history = readHistory(req);
    const prior = history.slice(-2).flatMap(({ q, a }) => [
      { role: "user", content: q },
      { role: "assistant", content: a },
    ]);

    if (!isTaxRelated(question)) {
      return res.json({
        ok: true,
        blocked: false,
        remaining: req.taxBarnaby.remaining,
        resetAt: req.taxBarnaby.resetAt,
        answer: NON_TAX_REFUSAL,
      });
    }

    if (!openai) {
      return res
        .status(503)
        .json({ ok: false, error: "AI service not configured" });
    }

    const resp = await openai.responses.create({
      model: "gpt-4o-mini",
      instructions: TAX_SYSTEM_PROMPT,
      max_output_tokens: 600,
      input: [...prior, { role: "user", content: question }],
    });

    const answer = resp?.output_text ?? "";

    const newCount = (req.taxBarnaby.count ?? 0) + 1;
    await req.saveTaxBarnaby(newCount);
    writeHistory(res, [...history, { q: question, a: answer }]);

    return res.json({
      ok: true,
      blocked: false,
      remaining: Math.max(0, req.taxBarnaby.max - newCount),
      resetAt: req.taxBarnaby.resetAt,
      answer,
    });
  } catch (err) {
    console.error("[/api/answer] error:", err);
    return res.status(500).json({ ok: false, error: "AI request failed" });
  }
});

app.get("/api/tb-status", questionCounter, (req, res) => {
  res.json({
    ok: true,
    count: req.taxBarnaby.count,
    remaining: req.taxBarnaby.remaining,
    resetAt: req.taxBarnaby.resetAt,
  });
});

/* -------------------------------------------------------------------------- */
/*                      VERIFICATION ROUTES (TAX BARNABY)                     */
/* -------------------------------------------------------------------------- */

const resendLimiter = new Map();

function checkResendLimit(identifier) {
  const now = Date.now();
  const key = identifier.toLowerCase();

  if (!resendLimiter.has(key)) {
    resendLimiter.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return { allowed: true, remaining: 2, resetAt: now + 15 * 60 * 1000 };
  }

  const data = resendLimiter.get(key);
  if (now > data.resetAt) {
    resendLimiter.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return { allowed: true, remaining: 2, resetAt: now + 15 * 60 * 1000 };
  }

  if (data.count >= 3) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: data.resetAt,
      waitMinutes: Math.ceil((data.resetAt - now) / 60000),
    };
  }

  data.count++;
  resendLimiter.set(key, data);
  return { allowed: true, remaining: 3 - data.count, resetAt: data.resetAt };
}

setInterval(
  () => {
    const now = Date.now();
    for (const [key, data] of resendLimiter.entries()) {
      if (now > data.resetAt) resendLimiter.delete(key);
    }
  },
  30 * 60 * 1000,
);

app.post("/api/resend-verification-code", async (req, res) => {
  try {
    const { email, phone, contactPref, name, type } = req.body;
    const targetEmail = type === "email" || !type ? email : null;
    const targetPhone = type === "phone" || !type ? phone : null;

    if (!targetEmail && !targetPhone) {
      return res
        .status(400)
        .json({ ok: false, error: "Email or phone required" });
    }

    const results = { email: { sent: false }, phone: { sent: false } };

    if (targetEmail && (contactPref === "email" || contactPref === "both")) {
      const limit = checkResendLimit(targetEmail);
      if (!limit.allowed) {
        return res.json({
          ok: false,
          error: `Too many requests. Wait ${limit.waitMinutes} minutes.`,
          rateLimited: true,
        });
      }
      const emailCode = generateCode();
      storeVerificationCode(targetEmail, emailCode, "email");
      await transporter.sendMail({
        from: "Tax Advocate Group <inquiry@taxadvocategroup.com>",
        to: targetEmail,
        subject: "Your New Verification Code - Tax Advocate Group",
        text: `Hi ${name || "there"},\n\nYour new verification code is: ${emailCode}\n\nThis code expires in 10 minutes.\n\nTax Advocate Group`,
      });
      results.email = {
        sent: true,
        remaining: limit.remaining,
        resetAt: limit.resetAt,
      };
    }

    if (targetPhone && (contactPref === "phone" || contactPref === "both")) {
      const limit = checkResendLimit(targetPhone);
      if (!limit.allowed) {
        return res.json({
          ok: false,
          error: `Too many requests. Wait ${limit.waitMinutes} minutes.`,
          rateLimited: true,
        });
      }
      const phoneCode = generateCode();
      storeVerificationCode(targetPhone, phoneCode, "phone");
      console.log(`[VERIFY] Phone code for ${targetPhone}: ${phoneCode}`);
      results.phone = {
        sent: true,
        remaining: limit.remaining,
        resetAt: limit.resetAt,
      };
    }

    return res.json({
      ok: true,
      codesSent: results,
      message: "New verification code sent",
    });
  } catch (error) {
    console.error("[/resend-verification-code] error:", error);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to resend verification code" });
  }
});

app.post("/api/send-verification-codes", async (req, res) => {
  try {
    const { email, phone, contactPref, name } = req.body;
    if (!email && !phone) {
      return res
        .status(400)
        .json({ ok: false, error: "Email or phone required" });
    }

    const codes = {};

    if (email && (contactPref === "email" || contactPref === "both")) {
      const emailCode = generateCode();
      storeVerificationCode(email, emailCode, "email");
      await transporter.sendMail({
        from: "Tax Advocate Group <inquiry@taxadvocategroup.com>",
        to: email,
        subject: "Verify Your Email - Tax Advocate Group",
        text: `Hi ${name || "there"},\n\nYour verification code is: ${emailCode}\n\nThis code expires in 10 minutes.\n\nTax Advocate Group`,
      });
      codes.email = "sent";
    }

    if (phone && (contactPref === "phone" || contactPref === "both")) {
      const phoneCode = generateCode();
      storeVerificationCode(phone, phoneCode, "phone");
      console.log(`[VERIFY] Phone code for ${phone}: ${phoneCode}`);
      codes.phone = "sent";
    }

    return res.json({ ok: true, codesSent: codes });
  } catch (error) {
    console.error("[/send-verification-codes] error:", error);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to send verification codes" });
  }
});

app.post("/api/verify-codes", async (req, res) => {
  try {
    const { email, phone, emailCode, phoneCode, contactPref } = req.body;
    const results = { emailVerified: false, phoneVerified: false };

    if (
      email &&
      emailCode &&
      (contactPref === "email" || contactPref === "both")
    ) {
      const emailResult = verifyCode(email, emailCode);
      if (!emailResult.ok) {
        return res.json({
          ok: false,
          error:
            emailResult.reason === "expired"
              ? "Email code expired."
              : "Invalid email code.",
          field: "email",
        });
      }
      results.emailVerified = true;
    }

    if (
      phone &&
      phoneCode &&
      (contactPref === "phone" || contactPref === "both")
    ) {
      const phoneResult = verifyCode(phone, phoneCode);
      if (!phoneResult.ok) {
        return res.json({
          ok: false,
          error:
            phoneResult.reason === "expired"
              ? "Phone code expired."
              : "Invalid phone code.",
          field: "phone",
        });
      }
      results.phoneVerified = true;
    }

    return res.json({ ok: true, ...results });
  } catch (error) {
    console.error("[/verify-codes] error:", error);
    return res.status(500).json({ ok: false, error: "Verification failed" });
  }
});

/* -------------------------------------------------------------------------- */
/*                     FINALIZE SUBMISSION (TAX BARNABY)                      */
/* -------------------------------------------------------------------------- */

app.post("/api/finalize-submission", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      contactPref,
      question,
      answer,
      issues,
      balanceBand,
      noticeType,
      taxScope,
      state,
      filerType,
      intakeSummary,
      trustedFormCertUrl,
    } = req.body;

    if (email && !isVerified(email)) {
      return res.status(400).json({ ok: false, error: "Email not verified" });
    }
    if (phone && !isVerified(phone)) {
      return res.status(400).json({ ok: false, error: "Phone not verified" });
    }

    const conversationHistory = readHistory(req);
    const questionCounterData = req.signedCookies?.tb_qc
      ? JSON.parse(req.signedCookies.tb_qc)
      : { count: 0 };
    const ipAddress =
      req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const userData = {
      name,
      email,
      phone,
      issues,
      balanceBand,
      noticeType,
      taxScope,
      state,
      filerType,
    };
    const aiSummary = openai
      ? await generateAISummary(openai, userData)
      : intakeSummary || "AI summary unavailable";

    const BarnabySubmission = require("./models/BarnabySubmission");
    const submission = new BarnabySubmission({
      name,
      email,
      phone,
      contactPref,
      emailVerified: !!email,
      phoneVerified: !!phone,
      issues,
      balanceBand,
      noticeType,
      taxScope,
      state,
      filerType,
      intakeSummary,
      question,
      answer,
      conversationHistory: conversationHistory.map((item, idx) => ({
        q: item.q,
        a: item.a,
        timestamp: new Date(
          Date.now() - (conversationHistory.length - idx) * 60000,
        ),
      })),
      aiSummary,
      ipAddress,
      userAgent,
      questionsAsked: questionCounterData.count || 0,
    });

    await submission.save();
    console.log("[/finalize-submission] Saved to MongoDB:", submission._id);

    // POST to webhook — pipeline handles notification, welcome email, CRM, outreach
    const webhookResult = await postToWebhook(
      {
        name,
        email,
        phone,
        company: "TAG",
        city: "",
        state: state || "",
        message: aiSummary,
        trustedFormCertUrl,
      },
      "caitlyn-verified",
    );

    console.log(
      "[FINALIZE] ✓ Webhook:",
      webhookResult.ok ? "Success" : webhookResult.error,
      "CaseID:",
      webhookResult.caseId || "N/A",
    );

    if (webhookResult.caseId) {
      await BarnabySubmission.updateOne(
        { _id: submission._id },
        {
          $set: {
            logicsCaseId: String(webhookResult.caseId),
            leadSource: "VF Digital",
          },
        },
      ).catch((e) =>
        console.error("[FINALIZE] CaseID save failed:", e.message),
      );
    }

    res.clearCookie("tb_qc", { path: "/" });
    res.clearCookie(TB_HISTORY_COOKIE, { path: "/" });

    return res.json({
      ok: true,
      message: "Submission finalized",
      submissionId: submission._id,
    });
  } catch (error) {
    console.error("[/finalize-submission] error:", error);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to finalize submission" });
  }
});

/* -------------------------------------------------------------------------- */
/*                       PROGRESS & ABANDONMENT                               */
/* -------------------------------------------------------------------------- */

app.post("/api/save-progress", (req, res) => {
  try {
    const { savePartialProgress } = require("./utils/partialSubmissions");
    const formData = req.body;
    if (!formData || typeof formData !== "object") {
      return res.status(400).json({ ok: false, error: "Invalid form data" });
    }
    savePartialProgress(res, formData);
    return res.json({ ok: true, message: "Progress saved" });
  } catch (error) {
    console.error("[/save-progress] error:", error);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to save progress" });
  }
});

app.get("/api/restore-progress", (req, res) => {
  try {
    const { readPartialProgress } = require("./utils/partialSubmissions");
    const partial = readPartialProgress(req);
    return res.json({
      ok: true,
      hasProgress: !!partial,
      data: partial || null,
    });
  } catch (error) {
    console.error("[/restore-progress] error:", error);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to restore progress" });
  }
});

app.post("/api/track-abandon", async (req, res) => {
  try {
    const { readPartialProgress } = require("./utils/partialSubmissions");
    const partial = readPartialProgress(req);
    if (!partial) {
      return res.json({ ok: true, saved: false, message: "No data to save" });
    }

    if (
      partial.lastPhase === "verification" &&
      (partial.email || partial.phone)
    ) {
      // Fire to webhook so the pipeline handles it
      postToWebhook(
        {
          name: partial.name || "Unknown",
          email: partial.email || "",
          phone: partial.phone || "",
          company: "TAG",
          city: "",
          state: "",
          message:
            "Abandoned Caitlyn chatbot at VERIFICATION step — high priority",
        },
        "chatbot-abandonment",
      ).catch((err) =>
        console.error("[TRACK-ABANDON] Webhook failed:", err.message),
      );
      console.log("[TRACK-ABANDON] High priority — sent to webhook");
    }

    return res.json({
      ok: true,
      saved: true,
      highPriority: partial.lastPhase === "verification",
    });
  } catch (error) {
    console.error("[/track-abandon] error:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                        VISITOR TRACKING WEBHOOK                            */
/* -------------------------------------------------------------------------- */

app.post("/api/track-visitor", async (req, res) => {
  try {
    const { page, referrer, timestamp } = req.body;
    const ipAddress =
      req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;
    const userAgent = req.headers["user-agent"];

    let visitorId = req.signedCookies?.tb_visitor;
    if (!visitorId) {
      visitorId = Math.random().toString(36).slice(2) + Date.now().toString(36);
      res.cookie("tb_visitor", visitorId, {
        httpOnly: true,
        sameSite: "Lax",
        secure: isProd,
        signed: true,
        maxAge: 30 * 24 * 3600 * 1000,
        path: "/",
      });
    }

    return res.json({ ok: true, visitorId });
  } catch (error) {
    console.error("[/track-visitor] error:", error);
    return res.status(500).json({ ok: false });
  }
});

/* -------------------------------------------------------------------------- */
/*                              SITEMAP                                       */
/* -------------------------------------------------------------------------- */

app.get("/sitemap.xml", async (req, res) => {
  const links = [
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/about-us", changefreq: "monthly", priority: 0.7 },
    { url: "/our-tax-services", changefreq: "monthly", priority: 0.7 },
    { url: "/tax-relief", changefreq: "monthly", priority: 0.7 },
    { url: "/tax-resolution", changefreq: "monthly", priority: 0.7 },
    { url: "/tax-negotiation", changefreq: "monthly", priority: 0.7 },
    { url: "/tax-protection-plans", changefreq: "monthly", priority: 0.7 },
    { url: "/tax-faqs", changefreq: "monthly", priority: 0.6 },
    { url: "/contact-us", changefreq: "yearly", priority: 0.5 },
    { url: "/tax-news", changefreq: "weekly", priority: 0.6 },
    { url: "/state-tax-guide", changefreq: "monthly", priority: 0.8 },
    { url: "/qualify-now", changefreq: "monthly", priority: 0.6 },
    { url: "/privacy-policy", changefreq: "yearly", priority: 0.3 },
    { url: "/terms-of-service", changefreq: "yearly", priority: 0.3 },
  ];

  const statesSlugs = [
    "state-income-tax-help-alabama",
    "state-income-tax-help-alaska",
    "state-income-tax-help-arizona",
    "state-income-tax-help-arkansas",
    "state-income-tax-help-california",
    "state-income-tax-help-colorado",
    "state-income-tax-help-connecticut",
    "state-income-tax-help-delaware",
    "state-income-tax-help-florida",
    "state-income-tax-help-georgia",
    "state-income-tax-help-hawaii",
    "state-income-tax-help-idaho",
    "state-income-tax-help-illinois",
    "state-income-tax-help-indiana",
    "state-income-tax-help-iowa",
    "state-income-tax-help-kansas",
    "state-income-tax-help-kentucky",
    "state-income-tax-help-louisiana",
    "state-income-tax-help-maine",
    "state-income-tax-help-maryland",
    "state-income-tax-help-massachusetts",
    "state-income-tax-help-michigan",
    "state-income-tax-help-minnesota",
    "state-income-tax-help-mississippi",
    "state-income-tax-help-missouri",
    "state-income-tax-help-montana",
    "state-income-tax-help-nebraska",
    "state-income-tax-help-nevada",
    "state-income-tax-help-new-hampshire",
    "state-income-tax-help-new-jersey",
    "state-income-tax-help-new-mexico",
    "state-income-tax-help-new-york",
    "state-income-tax-help-north-carolina",
    "state-income-tax-help-north-dakota",
    "state-income-tax-help-ohio",
    "state-income-tax-help-oklahoma",
    "state-income-tax-help-oregon",
    "state-income-tax-help-pennsylvania",
    "state-income-tax-help-rhode-island",
    "state-income-tax-help-south-carolina",
    "state-income-tax-help-south-dakota",
    "state-income-tax-help-tennessee",
    "state-income-tax-help-texas",
    "state-income-tax-help-utah",
    "state-income-tax-help-vermont",
    "state-income-tax-help-virginia",
    "state-income-tax-help-washington",
    "state-income-tax-help-west-virginia",
    "state-income-tax-help-wisconsin",
    "state-income-tax-help-wyoming",
  ];
  statesSlugs.forEach((slug) => {
    links.push({
      url: `/state-tax-guide/${slug}`,
      changefreq: "monthly",
      priority: 0.6,
    });
  });

  const subPages = [
    "tax-relief/tax-consultation",
    "tax-relief/tax-preparation",
    "tax-relief/tax-settlement",
    "tax-resolution/tax-representation",
    "tax-resolution/dealing-with-the-irs",
    "tax-resolution/irs-innocent-spouse",
    "tax-resolution/state-tax-relief",
    "tax-resolution/statute-of-limitations",
    "tax-resolution/tax-prep-and-planning",
    "tax-resolution/unified-tax-returns",
    "tax-resolution/irs-tax-discharge",
    "tax-resolution/payroll-tax-relief",
    "tax-resolution/wage-garnishment-relief",
    "tax-negotiation/currently-not-collectible",
    "tax-negotiation/irs-installment-plans",
    "tax-negotiation/penalty-abatement",
    "tax-negotiation/offer-in-compromise",
  ];
  subPages.forEach((slug) => {
    links.push({ url: `/${slug}`, changefreq: "monthly", priority: 0.5 });
  });

  const blogRoutes = ["understanding-tax-relief", "irs-negotiation-tips"];
  blogRoutes.forEach((slug) => {
    links.push({
      url: `/tax-news/${slug}`,
      changefreq: "monthly",
      priority: 0.6,
    });
  });

  const stream = new SitemapStream({
    hostname: "https://www.taxadvocategroup.com",
  });
  const xml = await streamToPromise(Readable.from(links)).then((data) => {
    links.forEach((link) => stream.write(link));
    stream.end();
    return data;
  });

  res.header("Content-Type", "application/xml");
  res.send(xml);
});

/* -------------------------------------------------------------------------- */
/*                              START SERVER                                  */
/* -------------------------------------------------------------------------- */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
