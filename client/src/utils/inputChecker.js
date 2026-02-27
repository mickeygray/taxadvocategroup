// src/utils/inputChecker.js
import { Filter } from "bad-words";

const BASE_FILTER = new Filter({ placeHolder: "*" });

const HATE_WORDS = [
  "fag", "faggot", "dyke", "tranny", "chink", "gook", "wetback",
  "retard", "retarded", "niqqer", "niqqa", "n1gger", "n1gga",
  "n1gg3r", "b1tch", "b!tch", "a$$", "a$$hole",
];
BASE_FILTER.addWords(...HATE_WORDS);

function deobfuscate(s = "") {
  return s
    .toLowerCase()
    .replace(/[@]/g, "a")
    .replace(/[!|1]/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/0/g, "o")
    .replace(/\$/g, "s")
    .replace(/q/g, "g");
}

const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PHONE_RE = /^(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?){2}\d{4}$/;
const NAME_RE = /^[A-Za-z][A-Za-z' -]{0,62}[A-Za-z]$/;

function isLikelyGibberish(s = "") {
  const t = s.toLowerCase().replace(/[^a-z]/g, "");
  if (t.length >= 20 && /^(.)\1{9,}$/.test(t)) return true;
  const tokens = t.split(/[^a-z]+/).filter(Boolean);
  if (tokens.some((tok) => tok.length >= 6 && !/[aeiou]/.test(tok))) return true;
  if (t.length >= 10 && /[bcdfghjklmnpqrstvwxyz]{6,}/.test(t)) return true;
  return false;
}

function normalize(s = "") {
  return s.replace(/\s+/g, " ").trim();
}

export function inputChecker({ phase, value }) {
  const raw = String(value == null ? "" : value);
  const cleaned = normalize(raw);
  const lowered = cleaned.toLowerCase();
  const unleet = deobfuscate(lowered);

  const profane = BASE_FILTER.isProfane(lowered) || BASE_FILTER.isProfane(unleet);
  if (profane) {
    return { ok: false, reason: "profanity_detected", cleaned, type: phase };
  }

  switch (phase) {
    case "name": {
      if (!cleaned) return { ok: false, reason: "empty_name" };
      if (!NAME_RE.test(cleaned))
        return { ok: false, reason: "invalid_name_format", cleaned, type: "name" };
      if (isLikelyGibberish(cleaned))
        return { ok: false, reason: "gibberish_name", cleaned, type: "name" };
      return { ok: true, cleaned, type: "name" };
    }
    case "email": {
      if (!cleaned) return { ok: false, reason: "empty_email" };
      if (!EMAIL_RE.test(cleaned))
        return { ok: false, reason: "invalid_email", cleaned, type: "email" };
      return { ok: true, cleaned, type: "email" };
    }
    case "phone": {
      if (!cleaned) return { ok: false, reason: "empty_phone" };
      if (!PHONE_RE.test(cleaned))
        return { ok: false, reason: "invalid_phone", cleaned, type: "phone" };
      const digits = cleaned.replace(/[^\d+]/g, "");
      return { ok: true, cleaned: digits, type: "phone" };
    }
    case "question": {
      if (!cleaned) return { ok: false, reason: "empty_question" };
      if (cleaned.length < 5)
        return { ok: false, reason: "too_short", cleaned, type: "question" };
      if (isLikelyGibberish(cleaned))
        return { ok: false, reason: "gibberish_question", cleaned, type: "question" };
      return { ok: true, cleaned, type: "question" };
    }
    default:
      if (!cleaned) return { ok: false, reason: "empty_input", cleaned };
      if (isLikelyGibberish(cleaned))
        return { ok: false, reason: "gibberish_input", cleaned };
      return { ok: true, cleaned };
  }
}
