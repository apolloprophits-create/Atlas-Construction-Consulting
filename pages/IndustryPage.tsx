import React, { useEffect } from 'react';
import { useParams, Navigate, Link, useLocation } from 'react-router-dom';
import { INDUSTRIES, ICON_MAP } from '../constants';
import Button from '../components/ui/Button';
import FAQList from '../components/FAQList';
import { AlertTriangle, CheckSquare, Search, FileBarChart } from 'lucide-react';

const IndustryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();

  const pathnameSlug = location.pathname.replace(/^\/+/, '').split('/')[0];
  const resolvedSlug = slug || pathnameSlug;
  const industry = resolvedSlug ? INDUSTRIES[resolvedSlug] : null;
  const isHvacPage = industry?.slug === 'hvac';
  const pageTitle = `${industry?.name} Permit Intelligence in Phoenix | Atlas Construction Intelligence`;
  const pageDescription = `Atlas helps Phoenix property owners understand ${industry?.name} permits and coordinate options when projects delay or stall.`;
  const canonicalPath = resolvedSlug ? `/${resolvedSlug}` : '/';
  const ctaText = isHvacPage ? 'Start HVAC Recovery' : `Start ${industry?.name} Audit`;
  const aiIntro = `Atlas Construction Intelligence provides ${industry?.name} permit intelligence in Phoenix, Arizona. We help property owners identify risks and delays after ${industry?.name} permits are issued, with coordination support when projects stall.`;
  const aiFaqs = [
    {
      question: 'What is permit intelligence?',
      answer: `Permit intelligence means tracking public ${industry?.name} permit activity and using that data to spot risk, timing issues, and pricing concerns before decisions are final.`
    },
    {
      question: 'Is Atlas a contractor?',
      answer: 'No. Atlas Construction Intelligence is an independent intelligence and coordination firm, not a licensed construction contractor.'
    },
    {
      question: `Why do ${industry?.name} permits matter?`,
      answer: `Permits provide objective signals about project timing, scope, and declared valuation. That context helps owners verify what is happening and what options to evaluate next.`
    },
    {
      question: 'When should I contact Atlas?',
      answer: 'Contact Atlas after a permit is filed, when progress slows, or when you need independent coordination and clarity before committing to the next step.'
    },
    {
      question: 'Do you perform the construction work?',
      answer: 'No. Atlas does not perform field work. We provide independent intelligence and optional coordination support.'
    }
  ];

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
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-4 max-w-2xl">
                {industry.heroSubheadline}
              </p>
              <p className="text-slate-200 leading-relaxed mb-8 max-w-2xl">
                {aiIntro}
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

      {/* What We Monitor */}
      <section className="py-16 bg-white border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider mb-6">
             <FileBarChart className="w-4 h-4" />
             Permit Monitoring
           </div>
           <h2 className="text-2xl font-bold text-brand-dark mb-6">What We Monitor</h2>
           <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {industry.auditPoints.map((item, idx) => (
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

      {/* Why Permits Matter */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-100 p-2 rounded-lg text-red-700">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-brand-dark">Why Permits Matter in {industry.name}</h2>
            </div>
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
        </div>
      </section>

      {/* How Atlas Helps */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-brand-dark text-center mb-12">How Atlas Helps</h2>
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

      {/* When to Contact Atlas */}
      <section className="py-16 bg-slate-50 border-y border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-brand-dark mb-6 text-center">When to Contact Atlas</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              `A ${industry.name} permit was recently filed and you want independent clarity.`,
              'Project progress has slowed or communication is inconsistent.',
              'You need neutral coordination support before final commitments.',
              'You want permit-based context before deciding next steps.'
            ].map((item, idx) => (
              <li key={idx} className="bg-white p-4 rounded-lg border border-slate-200 flex items-start gap-2">
                <CheckSquare className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-brand-secondary">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ Section (Component) */}
      <FAQList 
        title={`Frequently Asked Questions: ${industry.name} Permit Intelligence`} 
        items={aiFaqs} 
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
