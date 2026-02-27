// utils/partialSubmissions.js

const PARTIAL_COOKIE = "tb_partial";
const PARTIAL_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

function savePartialProgress(res, formData) {
  try {
    const partial = {
      issues: formData.issues || [],
      balanceBand: formData.balanceBand || "",
      noticeType: formData.noticeType || "",
      taxScope: formData.taxScope || "",
      state: formData.state || "",
      filerType: formData.filerType || "",
      question: (formData.question || "").slice(0, 500),
      answer: (formData.answer || "").slice(0, 1000),
      name: formData.name || "",
      email: formData.email || "",
      phone: formData.phone || "",
      contactPref: formData.contactPref || "",
      lastPhase: formData.lastPhase || "intake_issues",
      lastUpdated: Date.now(),
      startedAt: formData.startedAt || Date.now(),
    };

    res.cookie(PARTIAL_COOKIE, JSON.stringify(partial), {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: PARTIAL_MAX_AGE,
      signed: true,
      path: "/",
    });
  } catch (error) {
    console.error("[PARTIAL] Error saving progress:", error);
  }
}

function readPartialProgress(req) {
  try {
    const raw = req.signedCookies?.[PARTIAL_COOKIE];
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.lastUpdated && Date.now() - parsed.lastUpdated > PARTIAL_MAX_AGE) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function clearPartialProgress(res) {
  res.clearCookie(PARTIAL_COOKIE, { path: "/", httpOnly: true, sameSite: "Lax" });
}

module.exports = {
  savePartialProgress,
  readPartialProgress,
  clearPartialProgress,
  PARTIAL_COOKIE,
};
