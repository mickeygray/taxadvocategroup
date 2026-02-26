import React, { useState } from "react";
import HeroSection from "./HeroSection";
import Main from "./Main";
import Services from "./Services";
import Testimonials from "./Testimonials";
import SaveTimeSection from "./SaveTimeSection";
import QuoteSection from "./QuoteSection";
import VideoSection from "./VideoSection";
import LandingPopupForm from "./LandingPopupForm";
import SEO from "./SEO";
import { localBusinessSchema, orgSchema } from "../utils/structuredData";

const Home = () => {
  const [consultationOpen, setConsultationOpen] = useState(false);

  return (
    <>
      <SEO
        title="Tax Advocate Group | IRS Tax Relief & Resolution Experts"
        description="Resolve IRS tax debt with licensed enrolled agents. Offers in compromise, installment plans, penalty abatement, and wage garnishment relief. Free consultation — call 1-800-517-1807."
        canonical="/"
        structuredData={[orgSchema, localBusinessSchema]}
      />
      <div className="home-wrapper">
        <HeroSection onConsultationClick={() => setConsultationOpen(true)} />
        <Main />
        <Services />
        <SaveTimeSection />
        <Testimonials />
        <QuoteSection />
        <VideoSection />

        {consultationOpen && (
          <LandingPopupForm onClose={() => setConsultationOpen(false)} />
        )}
      </div>
    </>
  );
};

export default Home;
