// middleware/questionCounter.js
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_Q = 3;

function questionCounter(req, res, next) {
  const now = Date.now();
  let sess = {};

  try {
    sess = req.signedCookies?.tb_qc ? JSON.parse(req.signedCookies.tb_qc) : {};
  } catch (_) {}

  if (!sess.resetAt || now > sess.resetAt) {
    sess = { count: 0, resetAt: now + WINDOW_MS };
  }

  req.taxBarnaby = {
    count: sess.count,
    resetAt: sess.resetAt,
    remaining: Math.max(0, MAX_Q - sess.count),
    max: MAX_Q,
  };

  req.saveTaxBarnaby = (nextCount) => {
    const payload = JSON.stringify({ count: nextCount, resetAt: sess.resetAt });
    res.cookie("tb_qc", payload, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: WINDOW_MS,
      signed: true,
      path: "/",
    });
  };

  next();
}

module.exports = questionCounter;
