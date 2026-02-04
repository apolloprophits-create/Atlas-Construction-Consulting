import React, { useEffect } from 'react';
import Button from '../components/ui/Button';
import { Shield, Users, LineChart } from 'lucide-react';
import FAQList from '../components/FAQList';
import { GLOBAL_FAQS } from '../constants';

const About: React.FC = () => {
  useEffect(() => {
    document.title = "About Atlas Construction Consulting | Independent Price Advocacy";
    const metaDescription = document.querySelector('meta[name="description"]');
    const descContent = "Learn how Atlas Construction Consulting uses permit intelligence and market benchmarks to protect Phoenix homeowners from inflated construction pricing.";
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
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-brand-surface py-20 border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-brand-dark mb-6">Precision Advocacy for the Modern Homeowner</h1>
          <p className="text-xl text-brand-secondary leading-relaxed">
            Atlas was founded on a single premise: The construction market is designed to confuse the buyer. We exist to restore the balance of power.
          </p>
        </div>
      </section>

      {/* Mission Content */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div>
            <h2 className="text-2xl font-bold text-brand-dark mb-4">The Information Asymmetry</h2>
            <p className="text-brand-secondary text-lg leading-relaxed mb-4">
              Most homeowners make a major construction decision ($10k - $100k+) only once or twice a decade. It is a high-stakes, high-stress event often triggered by a failure (broken AC, leaking roof).
            </p>
            <p className="text-brand-secondary text-lg leading-relaxed">
              Contractors, conversely, sell these projects every single day. They know exactly how to structure pricing, hide margins, and leverage urgency. Atlas acts as your interpreter and defender in this transaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
               <div className="mb-4 text-brand-accent"><Shield className="w-8 h-8" /></div>
               <h3 className="font-bold text-brand-dark mb-2">Equity Protection</h3>
               <p className="text-sm text-brand-secondary">We view your home as a financial asset. Overpaying for improvements directly eats into your equity.</p>
             </div>
             <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
               <div className="mb-4 text-brand-accent"><LineChart className="w-8 h-8" /></div>
               <h3 className="font-bold text-brand-dark mb-2">Permit Intelligence</h3>
               <p className="text-sm text-brand-secondary">We don't guess prices. We look at permitted valuations for identical projects in your neighborhood.</p>
             </div>
          </div>

          <div className="border-t border-brand-border pt-12">
            <h2 className="text-2xl font-bold text-brand-dark mb-6">Our Core Principles</h2>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-2 h-2 bg-brand-dark rounded-full mt-2.5 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-brand-dark">No Commissions. Ever.</h4>
                  <p className="text-brand-secondary">We do not accept referral fees from contractors. If we recommend a "Second Look" provider, it is because their pricing passes our audit, not because they paid us.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-2 h-2 bg-brand-dark rounded-full mt-2.5 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-brand-dark">Engineers, Not Salespeople.</h4>
                  <p className="text-brand-secondary">Our background is in data analysis, quantity surveying, and construction management. We speak in numbers, not sales scripts.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-2 h-2 bg-brand-dark rounded-full mt-2.5 flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-brand-dark">Privacy First.</h4>
                  <p className="text-brand-secondary">We are not a lead generation farm. Your data stays with us until YOU decide to share it.</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Global FAQs */}
      <FAQList 
        title="Frequently Asked Questions" 
        items={GLOBAL_FAQS} 
        className="bg-slate-50 border-t border-brand-border" 
      />
    </div>
  );
};

export default About;