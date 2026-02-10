import React from 'react';
import { ShieldCheck, Search, Database } from 'lucide-react';
import Button from './ui/Button';
import { Link } from 'react-router-dom';

const ExplainerSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-dark/5 text-brand-dark text-xs font-bold uppercase tracking-wider mb-4">
             <ShieldCheck className="w-4 h-4" />
             Methodology
          </div>
          <h2 className="text-3xl font-bold text-brand-dark mb-4">What Is an Atlas Audit?</h2>
          <p className="text-brand-secondary max-w-2xl mx-auto text-lg">
            We are an independent intelligence firm, not a lead generation agency. Our audits are purely data-driven, leveraging county permit records to protect homeowner equity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-brand-accent mb-4">
               <Database className="w-6 h-6" />
             </div>
             <h3 className="font-bold text-lg text-brand-dark mb-2">Permit Intelligence</h3>
             <p className="text-sm text-brand-secondary">
               We monitor Maricopa County permit databases in real-time. When a permit is issued, we pull the valuation data declared by the contractor.
             </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-brand-accent mb-4">
               <Search className="w-6 h-6" />
             </div>
             <h3 className="font-bold text-lg text-brand-dark mb-2">Market Benchmarking</h3>
             <p className="text-sm text-brand-secondary">
               We compare your project's valuation against thousands of similar, recently completed projects in your specific zip code.
             </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-brand-accent mb-4">
               <ShieldCheck className="w-6 h-6" />
             </div>
             <h3 className="font-bold text-lg text-brand-dark mb-2">Conflict-Free Advocacy</h3>
             <p className="text-sm text-brand-secondary">
               We do not sell leads. We do not take commissions. Our only goal is to tell you if the price you are paying is fair.
             </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/request-audit">
            <Button as="span" size="lg">Request a Price Audit</Button>
          </Link>
          <p className="text-xs text-slate-400 mt-4">
            Independent. Confidential. Data-Backed.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExplainerSection;
