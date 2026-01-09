/**
 * Landing Page Legacy - JR Drogaria
 * Mantido para compatibilidade com produção atual
 */

import React from "react";
import {Header} from "./Header";
import {MainSection} from "./MainSection";
import {Cards} from "./Cards";
import {Contact} from "./Contact";
import {Footer} from "./Footer";

const LandingPageLegacy: React.FC = () => {
  return (
      <div className="h-screen bg-gradient-to-b from-green-50 to-green-100">
        <Header />
        <MainSection />
        <Cards />
        <Contact />
        <Footer />
      </div>
  );
};

export default LandingPageLegacy;
