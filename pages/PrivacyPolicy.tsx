import React, { useEffect } from 'react';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | Atlas Construction Consulting';
  }, []);

  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-brand-dark mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-brand-secondary leading-relaxed">
          <p>
            Atlas Construction Consulting respects your privacy. We collect only the information needed to process
            audit requests and communicate with you about those requests.
          </p>
          <p>
            We do not sell your personal information to third-party lead brokers. We may store submitted information
            in secure systems used to generate and deliver your audit report.
          </p>
          <p>
            If you want your data removed, contact us using the contact page and include the phone number or email used
            in your request.
          </p>
          <p className="text-sm text-slate-500">Last updated: February 10, 2026</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
