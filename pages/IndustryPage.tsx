import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { INDUSTRIES, ICON_MAP } from '../constants';
import Button from '../components/ui/Button';
import ExplainerSection from '../components/ExplainerSection';
import FAQList from '../components/FAQList';
import { AlertTriangle, CheckSquare, Search, FileBarChart } from 'lucide-react';

const IndustryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const industry = slug ? INDUSTRIES[slug] : null;
  const isHvacPage = industry?.slug === 'hvac';
  const pageTitle = isHvacPage
    ? 'HVAC Price Recovery & Market Intelligence | Phoenix, AZ | Atlas'
    : `${industry?.name} Cost Verification & Intelligence | Phoenix, AZ | Atlas`;
  const pageDescription = isHvacPage
    ? 'Phoenix HVAC price intelligence with verified market floor rates for 3-ton to 5-ton systems. Independent recovery-focused valuation insights for homeowners.'
    : `${industry?.name} cost verification and market intelligence for Phoenix-area homeowners. Independent permit-backed pricing analysis across Phoenix, Scottsdale, and Mesa.`;
  const canonicalPath = slug ? `/${slug}` : '/';
  const ctaText = isHvacPage ? 'Start HVAC Recovery' : `Start ${industry?.name} Audit`;

  useEffect(() => {
    if (industry) {
      document.title = pageTitle;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', pageDescription);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = pageDescription;
        document.head.appendChild(meta);
      }

      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        canonical.setAttribute('data-managed-by', 'industry-page');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', `${window.location.origin}${canonicalPath}`);
    }
    
    // Cleanup title on unmount
    return () => {
      document.title = 'Atlas Construction Intelligence | Market Intelligence & Cost Verification';
      const canonical = document.querySelector('link[rel="canonical"][data-managed-by="industry-page"]');
      if (canonical) {
        canonical.remove();
      }
    };
  }, [industry, pageTitle, pageDescription, canonicalPath]);

  if (!industry) {
    return <Navigate to="/" replace />;
  }

  const Icon = ICON_MAP[industry.iconName] || Search;

  return (
    <>
      {/* Industry Hero */}
      <section className="bg-brand-dark text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-brand-accent mb-4">
                <Icon className="w-6 h-6" />
                <span className="font-bold uppercase tracking-wider text-sm">{industry.name} INTELLIGENCE</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                {isHvacPage ? 'Phoenix HVAC Price Intelligence & Recovery' : industry.heroHeadline}
              </h1>
              {isHvacPage && (
                <h2 className="text-xl md:text-2xl font-semibold text-slate-200 mb-6">
                  Verified Market Floor Rates for 3-Ton to 5-Ton Systems.
                </h2>
              )}
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                {industry.heroSubheadline}
              </p>
              <Link to="/request-audit">
                <Button as="span" variant="secondary" size="lg">
                  {ctaText}
                </Button>
              </Link>
            </div>
            {/* Visual Abstract for Industry */}
            <div className="hidden md:flex justify-center items-center w-full max-w-xs">
               <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 w-full">
                 <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <span className="text-xs text-slate-400 font-mono">MARKET_VARIANCE</span>
                    <span className="text-xs text-red-300 font-mono">DETECTED</span>
                 </div>
                 <div className="space-y-3">
                    <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                    <div className="h-2 bg-white/20 rounded-full w-full"></div>
                    <div className="h-2 bg-white/20 rounded-full w-5/6"></div>
                 </div>
                 <div className="mt-6 flex gap-2">
                    <div className="px-2 py-1 bg-brand-accent/30 rounded text-xs text-brand-accent">High Risk</div>
                    <div className="px-2 py-1 bg-white/10 rounded text-xs">Volatile</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Overpriced */}
      <section className="py-16 bg-white border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider mb-6">
             <AlertTriangle className="w-4 h-4" />
             Market Analysis
           </div>
           <h2 className="text-2xl font-bold text-brand-dark mb-6">Why is {industry.name} often overpriced?</h2>
           <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {industry.overpricedAnalysis.map((item, idx) => (
               <li key={idx} className="bg-slate-50 p-5 rounded-lg border border-slate-100 flex flex-col gap-3">
                 <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                   {idx + 1}
                 </div>
                 <p className="text-brand-secondary font-medium leading-snug">
                   {item}
                 </p>
               </li>
             ))}
           </ul>
        </div>
      </section>

      {/* Explainer Section */}
      <ExplainerSection />

      {/* Split: What We Audit vs Red Flags */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Audit Points */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-border h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                  <FileBarChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark">What Atlas Audits</h3>
              </div>
              <ul className="space-y-4">
                {industry.auditPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-brand-secondary">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Red Flags */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-border h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-100 p-2 rounded-lg text-red-700">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark">Common Red Flags</h3>
              </div>
              <ul className="space-y-4">
                {industry.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold text-xs mt-0.5 flex-shrink-0">!</div>
                    <span className="text-brand-secondary">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works (Stealth Process) */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-brand-dark text-center mb-12">How the Atlas Audit Works</h2>
          <div className="relative border-l-2 border-slate-200 ml-4 md:ml-0 space-y-12 md:space-y-0">
            {industry.processSteps.map((step, idx) => (
              <div key={idx} className="relative pl-8 md:pl-0">
                 <div className={`md:flex items-center justify-between ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="hidden md:block w-5/12"></div> {/* Spacer */}
                    
                    <div className="absolute left-[-9px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-brand-dark border-4 border-white shadow-sm z-10"></div>
                    
                    <div className="md:w-5/12 bg-slate-50 p-6 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">Step 0{idx + 1}</span>
                      </div>
                      <p className="font-semibold text-brand-dark text-lg">
                        {step}
                      </p>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section (Component) */}
      <FAQList 
        title={`Frequently Asked Questions About ${industry.name} Pricing`} 
        items={industry.faqs} 
        className="bg-slate-50 border-t border-brand-border" 
      />

      {/* Local Service Area Signal */}
      <section className="py-10 bg-white border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm md:text-base text-brand-secondary text-center">
            Service Area: Phoenix, Scottsdale, and Mesa, Arizona.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-900 text-center">
        <div className="max-w-2xl mx-auto px-4">
           <h2 className="text-2xl font-bold text-white mb-4">{industry.ctaHeadline}</h2>
           <p className="text-slate-400 mb-8">
             Upload your {industry.name} proposal for a free, confidential review.
           </p>
           <Link to="/request-audit">
             <Button as="span" variant="secondary" size="lg">
               {ctaText}
             </Button>
           </Link>
        </div>
      </section>
    </>
  );
};

export default IndustryPage;
