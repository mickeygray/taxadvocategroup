import React from "react";

export default function PhoneLink({ rawNumber = "", className = "" }) {
  const normalize = (v) => {
    if (!v) return "";
    const s = String(v).trim();
    if (s.startsWith("+")) return "+" + s.slice(1).replace(/\D+/g, "");
    return s.replace(/\D+/g, "");
  };

  const toE164 = (v) => {
    const n = normalize(v);
    if (!n) return "";
    if (n.startsWith("+")) return n;
    if (n.length === 11 && n.startsWith("1")) return `+${n}`;
    if (n.length === 10) return `+1${n}`;
    return n.startsWith("+") ? n : `+${n}`;
  };

  const formatUS = (v) => {
    const d = normalize(v).replace(/^1/, "");
    if (d.length >= 10) {
      return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
    }
    return String(v);
  };

  const tel = `tel:${toE164(rawNumber)}`;
  const display = formatUS(rawNumber);

  return (
    <a
      href={tel}
      className={`phone-button ${className}`}
      aria-label={`Call ${display}`}
    >
      <i className="fa-solid fa-phone" aria-hidden="true"></i> CALL: {display}
    </a>
  );
}
