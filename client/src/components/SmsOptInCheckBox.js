import { Link } from "react-router-dom";

/**
 * TCR-compliant SMS opt-in checkbox.
 *
 * Rules per TCR registration:
 *  - Separate from all other consent types
 *  - NOT pre-checked (defaultChecked must be false)
 *  - Optional — never pass `required`
 *  - Language must name the SMS type and include HELP/STOP instructions
 */
export default function SmsOptInCheckbox({
  checked,
  onChange,
  className = "",
}) {
  return (
    <div className={`sms-opt-in ${className}`}>
      <label className="sms-opt-in__label">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          defaultChecked={false}
          /* ── NOT required — SMS opt-in must be optional per TCR ── */
        />
        <span className="sms-opt-in__text">
          By checking this box, I agree to receive SMS messages about customer
          care and case updates from Tax Advocate Group at the phone number
          provided above. Message frequency may vary. Message and data rates may
          apply. Text HELP to{" "}
          <a href="tel:18005171807" className="sms-opt-in__link">
            1-800-517-1807
          </a>{" "}
          for assistance. Reply STOP to opt out of receiving SMS messages.
          Please review our{" "}
          <Link to="/privacy-policy" className="sms-opt-in__link">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link to="/terms-of-service" className="sms-opt-in__link">
            Terms of Service
          </Link>
          .
        </span>
      </label>
    </div>
  );
}
