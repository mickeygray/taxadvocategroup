import React from "react";
import { Link } from "react-router-dom";
import SEO from "./SEO";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page">
      <SEO
        title="Privacy Policy | Tax Advocate Group"
        description="Read the Privacy Policy for Tax Advocate Group. Learn how we collect, use, and protect your personal information."
        canonical="/privacy-policy"
        noindex={true}
      />
      {/* Hero Section */}
      <section
        className="privacy-hero"
        style={{ backgroundImage: `url("/images/privacy-hero.png")` }}
      >
        <div className="privacy-hero-overlay"></div>
        <div className="privacy-hero-content">
          <h1>Privacy Policy</h1>
          <nav className="privacy-breadcrumbs">
            <Link to="/">Home</Link> <span>/</span> <span>Privacy Policy</span>
          </nav>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <div className="privacy-content">
        <h2>Introduction</h2>
        <p>
          This Privacy Policy describes how your personal information is
          collected, used, and shared when you visit{" "}
          <strong>taxadvocategroup.com</strong> (the &quot;Site&quot;).
        </p>

        <h2>Information We Collect</h2>
        <p>
          When you visit the Site, we automatically collect certain information
          about your device, including:
        </p>
        <ul>
          <li>Web browser type</li>
          <li>IP address</li>
          <li>Time zone</li>
          <li>Cookies installed on your device</li>
        </ul>
        <p>Additionally, we collect:</p>
        <ul>
          <li>Web pages viewed and referral sources</li>
          <li>Interaction details on the Site</li>
          <li>
            Personal information you submit through our forms, including name,
            phone number, email address, and details about your tax situation
          </li>
        </ul>

        <h2>How We Use Your Personal Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Respond to your inquiries and provide tax resolution services</li>
          <li>Communicate with you about your case or consultation</li>
          <li>Screen for potential fraud and risk</li>
          <li>Improve and optimize our Site and services</li>
          <li>Send you service-related communications if you have opted in</li>
        </ul>

        <h2>SMS / Text Message Communications</h2>
        <p>
          When you provide your phone number and separately check the SMS
          consent checkbox on any of our forms, you agree to receive SMS
          messages from Tax Advocate Group related to customer care and case
          updates.
        </p>
        <ul>
          <li>
            <strong>SMS opt-in is optional</strong> and is never a condition of
            purchase or service.
          </li>
          <li>
            <strong>Message frequency varies</strong> based on your case status
            and interactions.
          </li>
          <li>
            <strong>Message and data rates may apply</strong> depending on your
            mobile carrier and plan.
          </li>
          <li>
            You may opt out at any time by replying <strong>STOP</strong> to any
            message. Reply <strong>HELP</strong> for assistance, or call us at{" "}
            <a href="tel:18005171807">1-800-517-1807</a>.
          </li>
          <li>
            <strong>
              Your mobile phone number and SMS opt-in consent will not be shared
              with third parties for their own marketing purposes under any
              circumstances.
            </strong>
          </li>
        </ul>
        <p>
          For full details on our SMS program including opt-in methods, message
          types, and opt-out instructions, please review the{" "}
          <Link to="/terms-of-service">SMS Communications section</Link> of our
          Terms of Service.
        </p>
        <p>
          For additional support, contact us at{" "}
          <a href="mailto:inquiry@taxadvocategroup.com">
            inquiry@taxadvocategroup.com
          </a>
          .
        </p>

        <h2>Sharing Your Information</h2>
        <p>
          We share your Personal Information with third parties only as
          described below:
        </p>
        <ul>
          <li>
            <strong>Google Analytics</strong> — for website traffic and
            performance tracking (
            <a
              href="https://www.google.com/intl/en/policies/privacy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            ). You may opt out{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </li>
        </ul>
        <p>
          We do not sell, rent, or share your mobile phone number or SMS opt-in
          data with any third parties for marketing purposes.
        </p>

        <h2>Behavioral Advertising</h2>
        <p>
          We may use targeted advertising on platforms such as Facebook and
          Google. You can opt out of personalized advertising via:
        </p>
        <ul>
          <li>
            <a
              href="https://www.facebook.com/settings/?tab=ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook Ad Preferences
            </a>
          </li>
          <li>
            <a
              href="https://www.google.com/settings/ads/anonymous"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ad Settings
            </a>
          </li>
          <li>
            <a
              href="http://optout.aboutads.info/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Digital Advertising Alliance Opt-Out
            </a>
          </li>
        </ul>

        <h2>Do Not Track</h2>
        <p>
          We do not alter our data collection practices when we detect a Do Not
          Track signal from your browser.
        </p>

        <h2>Your Rights</h2>
        <p>
          Depending on your location, you may have the right to access, correct,
          or request deletion of your personal data. To exercise these rights,
          please contact us using the information below.
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain your information for as long as necessary to fulfill the
          purposes outlined in this policy, comply with legal obligations, and
          resolve disputes. You may request deletion of your personal data by
          contacting us directly.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy periodically to reflect operational, legal,
          or regulatory changes. We encourage you to review this page regularly.
        </p>

        <h2>Contact Us</h2>
        <p>
          For questions, complaints, or data deletion requests, contact us at{" "}
          <a href="mailto:inquiry@taxadvocategroup.com">
            inquiry@taxadvocategroup.com
          </a>{" "}
          or by mail:
        </p>
        <p>
          <strong>Tax Advocate Group</strong>
          <br />
          21625 Prairie Street, Suite #200
          <br />
          Chatsworth, CA 91311, United States
        </p>

        <p>
          © {new Date().getFullYear()} Tax Advocate Group. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
