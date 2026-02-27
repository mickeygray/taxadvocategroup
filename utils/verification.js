const crypto = require("crypto");

const verificationCodes = new Map();
const CODE_EXPIRY = 10 * 60 * 1000; // 10 minutes

function generateCode() {
  return crypto.randomInt(100000, 999999).toString();
}

function storeVerificationCode(identifier, code, type) {
  verificationCodes.set(identifier, {
    code,
    type,
    createdAt: Date.now(),
    verified: false,
  });
}

function verifyCode(identifier, code) {
  const stored = verificationCodes.get(identifier);
  if (!stored) return { ok: false, reason: "no_code" };
  if (Date.now() - stored.createdAt > CODE_EXPIRY) {
    verificationCodes.delete(identifier);
    return { ok: false, reason: "expired" };
  }
  if (stored.code !== code) return { ok: false, reason: "invalid" };
  stored.verified = true;
  verificationCodes.set(identifier, stored);
  return { ok: true };
}

function isVerified(identifier) {
  const stored = verificationCodes.get(identifier);
  return stored?.verified === true;
}

function cleanupExpiredCodes() {
  const now = Date.now();
  for (const [key, value] of verificationCodes.entries()) {
    if (now - value.createdAt > CODE_EXPIRY || value.verified === true) {
      verificationCodes.delete(key);
    }
  }
}
setInterval(cleanupExpiredCodes, 5 * 60 * 1000);

async function generateAISummary(openai, userData) {
  const prompt = `Based on the following tax situation, write a brief, encouraging 3-4 sentence summary that:
1. Acknowledges their specific situation
2. Highlights the key steps Tax Advocate Group can help with
3. Provides reassurance
4. Keeps a professional, warm tone

Tax Situation:
- Issues: ${userData.issues?.join(", ") || "Tax matters"}
- Amount: ${userData.balanceBand || "Undisclosed"}
- Tax Scope: ${userData.taxScope || "Federal"}
- Filer Type: ${userData.filerType || "Individual"}

Write the summary in 3-4 sentences, professional and encouraging tone:`;

  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      instructions: "You write brief, encouraging summaries for tax resolution clients. Be warm, professional, and reassuring. Keep it to 3-4 sentences.",
      max_output_tokens: 200,
      input: [{ role: "user", content: prompt }],
    });
    return response?.output_text?.trim() ||
      "Tax Advocate Group is here to help you resolve your tax situation with personalized guidance and expert support.";
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return "Tax Advocate Group is here to help you resolve your tax situation with personalized guidance and expert support.";
  }
}

module.exports = {
  generateCode,
  storeVerificationCode,
  verifyCode,
  isVerified,
  cleanupExpiredCodes,
  generateAISummary,
};
