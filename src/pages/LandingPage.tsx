import React from "react";
import {Header} from "./landingpage/Header.tsx";
import {MainSection} from "./landingpage/MainSection.tsx";
import {Cards} from "./landingpage/Cards.tsx";
import {Contact} from "./landingpage/Contact.tsx";
import {Footer} from "./landingpage/Footer.tsx";

const LandingPage: React.FC = () => {
  return (
      <div className="h-screen bg-gradient-to-b from-green-50 to-green-100">

      <Header />

        {/* Hero Section */}
       <MainSection />

        {/* Features Section - Condensed for mobile */}
        <Cards />

        {/* Contact Section */}
        <Contact />

        {/* Footer */}
      <Footer />
      </div>
  );
};

export default LandingPage;
