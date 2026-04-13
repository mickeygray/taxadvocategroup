import { Link } from "react-router-dom";

export default function ConsentNotice() {
  return (
    <p className="consent-notice">
      By submitting this form, you expressly consent to receive automated and
      manually dialed telephone calls, prerecorded voice messages, and SMS/MMS
      text messages from Tax Advocate Group, LLC and its representatives at the
      telephone number you have provided. During your initial inquiry period,
      you may receive up to five (5) text messages related to your tax matter,
      consultation scheduling, and case evaluation follow-up. Following
      enrollment as an active client, you may receive no more than one (1) text
      message per calendar month for purposes including but not limited to
      document request notifications, scheduled payment reminders, and case
      status updates. Message and data rates may apply depending on your mobile
      carrier and service plan. Message frequency varies. You may opt out of
      text communications at any time by replying STOP to any message; reply
      HELP for assistance. Consent to receive text messages is not a condition
      of purchase or receipt of services. For additional information, see our
      <Link to="/privacy-policy" className="consent-notice__link">
        Privacy Policy
      </Link>
      .
    </p>
  );
}
