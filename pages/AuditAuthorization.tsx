import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const parseNumber = (value: string | null, fallback = 0) => {
  if (!value) return fallback;
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const AuditAuthorization: React.FC = () => {
  const [params] = useSearchParams();
  const permitId = params.get('permitId') || '';
  const propertyAddress = params.get('address') || '';
  const projectType = params.get('projectType') || '5-Ton HVAC Replacement';
  const homeownerName = params.get('owner') || '';
  const homeownerEmail = params.get('email') || '';

  const signUrl = params.get('signUrl') || '';

  useEffect(() => {
    document.title = 'Project Audit & Price Recovery Authorization | Atlas Construction Intelligence';

    const setMeta = (selector: string, attrs: Record<string, string>) => {
      let element = document.head.querySelector(selector) as HTMLElement | null;
      if (!element) {
        element = document.createElement(selector.startsWith('meta') ? 'meta' : 'link');
        document.head.appendChild(element);
      }
      Object.entries(attrs).forEach(([key, value]) => element!.setAttribute(key, value));
    };

    setMeta('meta[name="robots"]', { name: 'robots', content: 'noindex, nofollow, noarchive, nosnippet' });
    setMeta('meta[name="googlebot"]', { name: 'googlebot', content: 'noindex, nofollow, noarchive, nosnippet' });
    setMeta('link[rel="canonical"]', { rel: 'canonical', href: `${window.location.origin}/audit-authorization` });
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-brand-dark text-white px-6 py-6">
          <h1 className="text-2xl font-bold">Project Audit &amp; Price Recovery</h1>
          <p className="text-slate-300 text-sm mt-2">Authorization Confirmation - Atlas Construction Intelligence</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h2 className="font-bold text-brand-dark mb-2">Authorization Form (Single Step)</h2>
            <p className="text-sm text-slate-600 mb-3">
              Fill out and sign this form once, then press the form&apos;s own submit button. This is the only form needed.
            </p>
            {signUrl ? (
              <iframe
                src={signUrl}
                title="Digital Signature"
                className="w-full h-[560px] rounded-lg border"
                loading="lazy"
              />
            ) : (
              <div className="text-sm text-slate-600 bg-white border rounded-lg p-4">
                Signature provider link not set. Add `signUrl` in the shared link to embed your SignWell/Jotform/DocuSign page.
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 text-center">
            Arizona Notice: Homeowners retain a four-day right to cancel under A.R.S. § 32-1158.02.
          </p>
        </div>
      </div>
    </div>
  );
};

export const AuditAuthorizationSuccess: React.FC = () => {
  const [params] = useSearchParams();

  const permitId = params.get('permitId') || '[Permit Number]';
  const propertyAddress = params.get('address') || '[Address]';
  const projectType = params.get('projectType') || 'HVAC installation';
  const homeownerName = params.get('owner') || 'Homeowner';
  const savings = parseNumber(params.get('savings'), 0);
  const formattedSavings = toCurrency(savings);

  const cancellationSubject = `Notice of Cancellation - Permit #${permitId} - ${propertyAddress}`;
  const cancellationBody = `I am writing to formally exercise my right to cancel the residential construction contract for the ${projectType} at ${propertyAddress} pursuant to A.R.S. § 32-1158.02.

Please cease all project activities and provide a full refund of any deposits paid to date as required by law.

An authorized representative from Atlas Construction Intelligence will be handling the transition and permit filing moving forward; please direct any logistical questions to them.`;

  useEffect(() => {
    document.title = 'Authorization Received | Atlas Construction Intelligence';
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-brand-dark mb-2">Success: Your Savings are Locked In.</h1>
          <p className="text-brand-secondary">
            {homeownerName}, you have officially authorized Atlas Construction Intelligence to recover your project valuation.
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg border border-slate-200 p-5">
          <h2 className="font-bold text-brand-dark mb-3">The "Atlas Takeover" Message</h2>
          <div className="space-y-4 text-sm text-slate-700">
            <div>
              <div className="font-semibold text-brand-dark">The Cancellation</div>
              <p>
                You will receive a pre-written cancellation notice in your inbox. Per A.R.S. § 32-1158.02, your previous contractor is legally
                required to honor this request.
              </p>
            </div>
            <div>
              <div className="font-semibold text-brand-dark">The New Crew</div>
              <p>Our Master ROC Partner has been notified. We are currently syncing the permit file to their license.</p>
            </div>
            <div>
              <div className="font-semibold text-brand-dark">The Contact</div>
              <p>
                An Atlas project lead will call you within 60 minutes to confirm your install date and handle the logistics of the switch.
              </p>
            </div>
          </div>
          <p className="mt-4 font-semibold text-green-700">
            Relax - we’ve got the data, we’ve got the crew, and we just saved you {formattedSavings}.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-300 p-5">
          <h3 className="font-bold text-brand-dark mb-2">Pre-Written Cancellation Notice</h3>
          <p className="text-sm text-slate-700 mb-3">
            <span className="font-semibold">Subject:</span> {cancellationSubject}
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-line">
            {cancellationBody}
          </div>
          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(`Subject: ${cancellationSubject}\n\n${cancellationBody}`)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Copy Cancellation Text
            </button>
            <a
              href={`mailto:?subject=${encodeURIComponent(cancellationSubject)}&body=${encodeURIComponent(cancellationBody)}`}
              className="px-4 py-2 rounded-lg bg-brand-dark text-white text-sm font-semibold text-center hover:bg-brand-primary"
            >
              Open in Email App
            </a>
          </div>
        </div>

        <p className="text-xs text-slate-500 text-center">
          Arizona Notice: Homeowners retain a four-day right to cancel under A.R.S. § 32-1158.02.
          <br />
          Permit: {permitId} | Address: {propertyAddress}
        </p>
      </div>
    </div>
  );
};

export default AuditAuthorization;
