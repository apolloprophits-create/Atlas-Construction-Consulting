import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { INDUSTRIES, STEPS, ICON_MAP, GLOBAL_FAQS } from '../constants';
import Button from '../components/ui/Button';
import ExplainerSection from '../components/ExplainerSection';
import FAQList from '../components/FAQList';
import { ArrowRight, BarChart3, Lock, Search } from 'lucide-react';

const Home: React.FC = () => {
  useEffect(() => {
    document.title = "Construction Execution at True Fair Market Value | Atlas Construction Intelligence";
    const metaDescription = document.querySelector('meta[name="description"]');
    const descContent = "Atlas Construction Intelligence is Arizona's project management and owner's representation platform. We use proprietary market intelligence to route projects to licensed trades at true fair market value.";
    if (metaDescription) {
      metaDescription.setAttribute('content', descContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = descContent;
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-brand-surface border-b border-brand-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Live Market Data Active
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark tracking-tight leading-tight mb-6">
                The General Contractor Experience. <br/>
                <span className="text-brand-accent">Without the General Contractor Markup.</span>
              </h1>
              <p className="text-lg md:text-xl text-brand-secondary mb-10 leading-relaxed max-w-2xl">
                Atlas Construction Intelligence is Arizona's premier project management and owner's representation platform. We utilize proprietary intelligence to vet, bid, and manage your project directly with top licensed trades.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/request-audit">
                  <Button as="span" size="lg">Get a Fair Market Proposal</Button>
                </Link>
                <Link to="/how-it-works">
                  <Button as="span" variant="outline" size="lg">
                    How Atlas Works
                  </Button>
                </Link>
              </div>
            </div>

            <div className="md:justify-self-end w-full max-w-xl">
              <div className="relative rounded-2xl border border-brand-border bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] overflow-hidden">
                <img
                  src="/images/intelligence.png"
                  alt="Construction intelligence graphic"
                  className="w-full h-auto block"
                  loading="eager"
                />
              </div>
              <div className="text-xs text-slate-500 mt-3">
                Image file: <code>/public/images/intelligence.png</code>
              </div>
            </div>
          </div>
        </div>
        {/* Abstract Tech Graphic Background */}
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-5 pointer-events-none hidden md:block">
           <svg viewBox="0 0 400 400" className="w-full h-full">
             <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
             </defs>
             <rect width="100%" height="100%" fill="url(#grid)" />
           </svg>
        </div>
      </section>

      {/* Trust Signals / Value Prop */}
      <section className="bg-white py-12 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col gap-3 p-6 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center border border-slate-200 mb-2">
                <BarChart3 className="w-6 h-6 text-brand-accent" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark">Data-Driven</h3>
              <p className="text-brand-secondary text-sm">We use live execution-rate intelligence so scope is priced to real market conditions.</p>
            </div>
            <div className="flex flex-col gap-3 p-6 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center border border-slate-200 mb-2">
                <Lock className="w-6 h-6 text-brand-accent" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark">Independent</h3>
              <p className="text-brand-secondary text-sm">You contract directly with the licensed trade. Atlas manages the process as your owner's rep.</p>
            </div>
            <div className="flex flex-col gap-3 p-6 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center border border-slate-200 mb-2">
                <Search className="w-6 h-6 text-brand-accent" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark">Lower Overhead</h3>
              <p className="text-brand-secondary text-sm">By removing sales layers and pricing buffers, more of your budget goes to labor and equipment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Explainer Section */}
      <ExplainerSection />

      {/* Algorithm vs Sales Model */}
      <section className="py-20 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">We Replaced the Salesman with an Algorithm</h2>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                Traditional contractors often carry added costs for sales commissions, marketing, and overhead. Atlas uses market intelligence and direct trade routing to reduce those layers.
              </p>
              <ul className="space-y-4">
                {[
                  "Direct-to-labor execution path",
                  "Fixed partner rate card discipline",
                  "Managed scope, permit, and inspection coordination",
                  "Fair-market proposals built for execution"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xs font-bold">X</div>
                    <span className="text-slate-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-brand-accent/20 blur-3xl rounded-full"></div>
              <div className="relative bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <div className="flex justify-between items-end mb-8">
                   <div>
                     <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Typical Quote Variance</div>
                     <div className="text-3xl font-bold text-white mt-1">HVAC Replacement</div>
                   </div>
                   <div className="text-right">
                     <div className="text-xs text-red-400 font-mono">HIGHEST BID</div>
                     <div className="text-xl font-mono text-red-400">$18,450</div>
                   </div>
                </div>
                {/* Chart simulation */}
                <div className="space-y-4">
                   <div className="w-full h-8 bg-slate-700 rounded-sm relative overflow-hidden group">
                     <div className="absolute top-0 left-0 h-full w-[45%] bg-green-500/80"></div>
                      <div className="absolute top-1/2 -translate-y-1/2 left-2 text-xs font-bold text-white z-10">ATLAS MANAGED EXECUTION ($14,500)</div>
                   </div>
                   <div className="w-full h-8 bg-slate-700 rounded-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-[75%] bg-yellow-500/60"></div>
                      <div className="absolute top-1/2 -translate-y-1/2 left-2 text-xs font-bold text-slate-200 z-10">RETAIL AVERAGE</div>
                   </div>
                   <div className="w-full h-8 bg-slate-700 rounded-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-[100%] bg-red-500/60"></div>
                      <div className="absolute top-1/2 -translate-y-1/2 left-2 text-xs font-bold text-slate-200 z-10">RETAIL CONTRACTOR ($18,500)</div>
                   </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-700">
                  <p className="text-sm text-slate-400">
                    *Illustrative model showing cost allocation between sales-layer bids and managed direct execution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-dark mb-4">Industries We Serve</h2>
            <p className="text-brand-secondary max-w-2xl mx-auto">
              Managed execution pathways across Arizona for commercial and residential project categories.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(INDUSTRIES).map((industry) => {
              const Icon = ICON_MAP[industry.iconName];
              return (
                <Link 
                  key={industry.slug} 
                  to={`/${industry.slug}`}
                  className="group bg-white p-6 rounded-xl shadow-sm border border-brand-border hover:shadow-md hover:border-brand-accent transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-brand-dark mb-4 group-hover:bg-brand-accent group-hover:text-white transition-colors">
                    {Icon && <Icon className="w-6 h-6" />}
                  </div>
                  <h3 className="font-bold text-lg text-brand-dark mb-2">{industry.name}</h3>
                  <p className="text-sm text-brand-secondary line-clamp-3 mb-4">
                    {industry.heroSubheadline}
                  </p>
                  <div className="flex items-center text-brand-accent text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    View Service Details <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div>
               <h2 className="text-3xl font-bold text-brand-dark mb-6">Precision Pricing. <br/>Predictable Results.</h2>
               <div className="space-y-8">
                 {STEPS.map((step, idx) => (
                   <div key={idx} className="flex gap-4">
                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center font-bold text-sm">
                       {idx + 1}
                     </div>
                     <div>
                       <h4 className="font-bold text-brand-dark mb-1">{step.title}</h4>
                       <p className="text-brand-secondary text-sm">{step.description}</p>
                     </div>
                   </div>
                 ))}
               </div>
               <div className="mt-10">
                 <Link to="/how-it-works">
                   <Button as="span" variant="outline">Detailed Methodology</Button>
                 </Link>
               </div>
             </div>
             <div className="bg-slate-100 rounded-2xl p-8 border border-slate-200">
               {/* Decorative generic data visualization */}
               <div className="flex flex-col gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold text-slate-500 uppercase">Valuation Report</span>
                       <span className="text-xs font-mono text-green-600">VERIFIED</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full mb-2">
                      <div className="h-full w-2/3 bg-brand-dark rounded-full"></div>
                    </div>
                    <div className="text-xs text-slate-400">Projected Savings: $4,000</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 opacity-80 scale-95">
                     <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold text-slate-500 uppercase">Material Index</span>
                    </div>
                    <div className="flex gap-2">
                       <div className="h-8 w-8 bg-slate-200 rounded"></div>
                       <div className="h-8 w-8 bg-slate-200 rounded"></div>
                       <div className="h-8 w-full bg-slate-100 rounded"></div>
                    </div>
                  </div>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* Global FAQs */}
      <FAQList 
        title="Common Questions" 
        items={GLOBAL_FAQS} 
        className="bg-white border-t border-brand-border" 
      />

      {/* CTA Band */}
      <section className="py-20 bg-brand-accent text-white text-center" id="request-audit-form">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Stop Negotiating. Start Executing.</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            See what your project should actually cost based on live market intelligence and managed execution planning.
          </p>
          <Link to="/request-audit">
            <Button
              as="span"
              size="lg"
              variant="outline"
              className="!bg-white !text-brand-accent !border-white hover:!bg-slate-100"
            >
              Get Your Bid
            </Button>
          </Link>
          <p className="mt-4 text-sm text-blue-200 opacity-80">
            Commercial HVAC • High-Efficiency Upgrades • Investor CapEx
          </p>
        </div>
      </section>
    </>
  );
};

export default Home;
