import { Link } from "react-router-dom";

export default function ConsentNotice() {
  return (
    <p className="consent-notice">
      By clicking "Get Free Consultation", you authorize Tax Advocate Group to
      contact you at the email and phone number provided, including by text/SMS
      and autodialed or prerecorded calls. Message and data rates may apply.
      Message frequency varies. You may opt out of texts at any time by replying
      STOP. Your consent is not a condition of purchase. See our{" "}
      <Link to="/privacy-policy" className="consent-notice__link">
        Privacy Policy
      </Link>
      .
    </p>
  );
}
