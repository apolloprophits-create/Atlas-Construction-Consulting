import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
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
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AuditAuthorization, { AuditAuthorizationSuccess } from './pages/AuditAuthorization';
import PartnerRateCard from './pages/PartnerRateCard';
import PartnerMasterSubcontractor from './pages/PartnerMasterSubcontractor';
import InternalPartnerReview from './pages/InternalPartnerReview';
import { INDUSTRIES } from './constants';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const LegacyIndustryRedirect: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  if (!slug || !INDUSTRIES[slug]) {
    return <Navigate to="/" replace />;
  }
  return <Navigate to={`/${slug}`} replace />;
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
        <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
        <Route path="/terms-of-service" element={<Layout><TermsOfService /></Layout>} />
        <Route path="/request-audit" element={<Layout><RequestAudit /></Layout>} />
        <Route path="/industries" element={<Layout><IndustriesIndex /></Layout>} />
        <Route path="/industries/:slug" element={<LegacyIndustryRedirect />} />
        {Object.keys(INDUSTRIES).map((slug) => (
          <Route key={slug} path={`/${slug}`} element={<Layout><IndustryPage /></Layout>} />
        ))}
        <Route path="/audit-authorization" element={<AuditAuthorization />} />
        <Route path="/audit-authorization/success" element={<AuditAuthorizationSuccess />} />
        <Route path="/partner/rate-card" element={<Layout><PartnerRateCard /></Layout>} />
        <Route path="/partner/master-subcontractor" element={<Layout><PartnerMasterSubcontractor /></Layout>} />
        
        {/* Private / Internal Routes */}
        <Route path="/audit/:secureId" element={<AuditReport />} />
        <Route path="/internal/create-audit" element={<Layout><InternalCreateAudit /></Layout>} />
        <Route path="/internal/partner-reviews" element={<Layout><InternalPartnerReview /></Layout>} />
        {/* Fallback */}
        <Route path="*" element={<Layout><Home /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;
