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
             Atlas Model
          </div>
          <h2 className="text-3xl font-bold text-brand-dark mb-4">The Direct-to-Labor Model</h2>
          <p className="text-brand-secondary max-w-2xl mx-auto text-lg">
            Atlas acts as your intelligence partner and owner's representative. We define scope, route projects to licensed trades, and manage execution quality from bid to completion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-brand-accent mb-4">
               <Database className="w-6 h-6" />
             </div>
             <h3 className="font-bold text-lg text-brand-dark mb-2">Specify and Bid</h3>
             <p className="text-sm text-brand-secondary">
               We use market intelligence to define scope and secure fixed-rate bids from ROC-licensed execution partners.
             </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-brand-accent mb-4">
               <Search className="w-6 h-6" />
             </div>
             <h3 className="font-bold text-lg text-brand-dark mb-2">Contract Transparency</h3>
             <p className="text-sm text-brand-secondary">
               You contract directly with the licensed trade performing labor and materials. No hidden pricing layers.
             </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-brand-accent mb-4">
               <ShieldCheck className="w-6 h-6" />
             </div>
             <h3 className="font-bold text-lg text-brand-dark mb-2">Managed Execution</h3>
             <p className="text-sm text-brand-secondary">
               Atlas coordinates schedule, permits, inspections, and quality control so you get wholesale efficiency without self-managing the build.
             </p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/request-audit">
            <Button as="span" size="lg">Get a Fair Market Proposal</Button>
          </Link>
          <p className="text-xs text-slate-400 mt-4">
            Transparent Scope. Licensed Trades. Managed Delivery.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ExplainerSection;
