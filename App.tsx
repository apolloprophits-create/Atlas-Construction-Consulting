import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import IndustryPage from './pages/IndustryPage';
import IndustriesIndex from './pages/IndustriesIndex';
import HowItWorks from './pages/HowItWorks';
import RequestAudit from './pages/RequestAudit';
import Contact from './pages/Contact';
import InternalCreateAudit from './pages/InternalCreateAudit';
import AuditReport from './pages/AuditReport';
import WhatIsAudit from './pages/WhatIsAudit';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes - Wrapped in Layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
        <Route path="/what-is-a-construction-price-audit" element={<Layout><WhatIsAudit /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/request-audit" element={<Layout><RequestAudit /></Layout>} />
        <Route path="/industries" element={<Layout><IndustriesIndex /></Layout>} />
        <Route path="/industries/:slug" element={<Layout><IndustryPage /></Layout>} />
        
        {/* Private / Internal Routes */}
        <Route path="/audit/:secureId" element={<AuditReport />} />
        {/* Internal Tool with Public Layout for easy navigation access */}
        <Route path="/internal/create-audit" element={<Layout><InternalCreateAudit /></Layout>} />

        {/* Fallback */}
        <Route path="*" element={<Layout><Home /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;