import React, { useEffect } from 'react';

const TermsOfService: React.FC = () => {
  useEffect(() => {
    document.title = 'Terms of Service | Atlas Construction Consulting';
  }, []);

  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-brand-dark mb-8">Terms of Service</h1>
        <div className="space-y-6 text-brand-secondary leading-relaxed">
          <p>
            Atlas Construction Consulting provides informational pricing analysis. Our reports do not constitute legal
            advice, engineering advice, construction warranties, or guaranteed savings.
          </p>
          <p>
            You are responsible for final contractor selection, contract review, and project decisions. Atlas does not
            perform construction work.
          </p>
          <p>
            By using this site and submitting information, you agree to these terms and to the processing of your
            request data for service delivery.
          </p>
          <p className="text-sm text-slate-500">Last updated: February 10, 2026</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
