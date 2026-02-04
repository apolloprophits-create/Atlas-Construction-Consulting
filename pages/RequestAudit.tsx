import React, { useEffect } from 'react';
import AuditForm from '../components/AuditForm';
import { ShieldCheck } from 'lucide-react';
import FAQList from '../components/FAQList';
import { AUDIT_FAQS } from '../constants';

const RequestAudit: React.FC = () => {
  useEffect(() => {
    document.title = "Request a Construction Price Audit | Phoenix Homeowners";
    const metaDescription = document.querySelector('meta[name="description"]');
    const descContent = "Request an independent construction price audit to verify your project pricing against current Phoenix and Maricopa County market data.";
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
      <div className="bg-brand-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/2 pt-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-dark/10 text-brand-dark text-xs font-bold uppercase tracking-wider mb-6">
                 <ShieldCheck className="w-4 h-4" />
                 Independent Advocacy
              </div>
              <h1 className="text-4xl font-bold text-brand-dark mb-6">Verify Your Quote Before You Sign</h1>
              <p className="text-lg text-brand-secondary mb-8 leading-relaxed">
                Construction pricing in Phoenix is highly variable. We provide a neutral, data-backed second look to ensure you aren't overpaying.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-brand-border flex items-center justify-center font-bold text-brand-dark shadow-sm">1</div>
                  <div>
                     <h3 className="font-bold text-brand-dark">Upload Your Details</h3>
                     <p className="text-sm text-brand-secondary">Share your quote or project scope. It's confidential.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-brand-border flex items-center justify-center font-bold text-brand-dark shadow-sm">2</div>
                  <div>
                     <h3 className="font-bold text-brand-dark">We Analyze the Data</h3>
                     <p className="text-sm text-brand-secondary">We check permit history and market material rates.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-brand-border flex items-center justify-center font-bold text-brand-dark shadow-sm">3</div>
                  <div>
                     <h3 className="font-bold text-brand-dark">Get Your Report</h3>
                     <p className="text-sm text-brand-secondary">Receive a clear "Green/Yellow/Red" price signal via text.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
               <AuditForm embedded />
            </div>
          </div>
        </div>
      </div>
      
      {/* Audit FAQs */}
      <FAQList 
        title="Audit Questions" 
        items={AUDIT_FAQS} 
        className="bg-white border-t border-brand-border" 
      />
    </>
  );
};

export default RequestAudit;