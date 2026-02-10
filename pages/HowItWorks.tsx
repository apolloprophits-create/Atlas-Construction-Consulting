import React, { useEffect } from 'react';
import { STEPS } from '../constants';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import ExplainerSection from '../components/ExplainerSection';

const HowItWorks: React.FC = () => {
  useEffect(() => {
    document.title = "How Construction Price Audits Work | Atlas Construction Consulting";
    const metaDescription = document.querySelector('meta[name="description"]');
    const descContent = "See how Atlas Construction Consulting analyzes Phoenix permit data to verify construction pricing before homeowners sign contracts.";
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
      <section className="bg-brand-dark text-white py-20">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">The Atlas Methodology</h1>
            <p className="text-slate-300 max-w-2xl mx-auto">How we turn raw data into negotiating power for Phoenix homeowners.</p>
         </div>
      </section>
      
      <ExplainerSection />

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-24">
            {STEPS.map((step, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-8 items-start">
                 <div className="flex-shrink-0 w-16 h-16 bg-brand-surface rounded-2xl flex items-center justify-center border border-brand-border text-2xl font-bold text-brand-dark shadow-sm">
                   0{idx + 1}
                 </div>
                 <div>
                   <h3 className="text-2xl font-bold text-brand-dark mb-4">{step.title}</h3>
                   <p className="text-lg text-brand-secondary leading-relaxed mb-6">
                     {step.description}
                   </p>
                   {/* Detailed Content Per Step */}
                   <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 text-sm text-slate-600">
                      {idx === 0 && (
                        <p>We access municipal permit databases (Phoenix, Scottsdale, Gilbert, Mesa) to find recently completed projects similar to yours. This establishes a baseline "Permitted Value" which serves as the wholesale cost floor.</p>
                      )}
                      {idx === 1 && (
                        <p>We decompose the quote into three buckets: Materials (Commodity pricing), Labor (Market hourly rates), and Overhead/Profit. If the Overhead bucket exceeds 25-30%, we flag it.</p>
                      )}
                      {idx === 2 && (
                        <p>We provide you with a PDF Audit Report. You can hand this directly to the contractor. It says: "We know what this costs. Please revise."</p>
                      )}
                      {idx === 3 && (
                        <p>If the original contractor won't budge, we can introduce you to our "Audit-Cleared" network—contractors who have agreed to pre-negotiated, transparent margins.</p>
                      )}
                   </div>
                 </div>
              </div>
            ))}
          </div>

          <div className="mt-24 text-center">
             <h3 className="text-2xl font-bold text-brand-dark mb-6">Ready to verify your quote?</h3>
             <Link to="/request-audit">
               <Button as="span" size="lg">Start Your Audit</Button>
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
