import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./components/Home";
import TaxFaqs from "./components/TaxFaqs";
import AboutUs from "./components/AboutUs";
import OurTaxServices from "./components/OurTaxServices";
import TaxRelief from "./components/TaxRelief";
import TaxResolution from "./components/TaxResolution";
import TaxNegotiation from "./components/TaxNegotiation";
import TaxProtectionPlans from "./components/TaxProtectionPlans";
import SubPageWrapper from "./components/SubPageWrapper";
import ContactUs from "./components/ContactUs";
import TaxNews from "./components/TaxNews";
import TaxNewsArticle from "./components/TaxNewsArticle";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import LandingPage1 from "./components/LandingPage1";
import ThankYou from "./components/ThankYou";
import LeadState from "./context/LeadState";
import "./App.css";

const App = () => {
  return (
    <LeadState>
      <Router>
        <ScrollToTop />
        <Navbar />
        <div className="page-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/qualify-now" element={<LandingPage1 />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/tax-faqs" element={<TaxFaqs />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/our-tax-services" element={<OurTaxServices />} />
            <Route path="/tax-relief" element={<TaxRelief />} />
            <Route path="/tax-resolution" element={<TaxResolution />} />
            <Route path="/tax-negotiation" element={<TaxNegotiation />} />
            <Route path="/tax-protection-plans" element={<TaxProtectionPlans />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/tax-news" element={<TaxNews />} />
            <Route path="/tax-news/:id" element={<TaxNewsArticle />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/:category/:slug" element={<SubPageWrapper />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </LeadState>
  );
};

export default App;
