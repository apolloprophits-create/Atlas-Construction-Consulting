import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';

const toCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0
  );

const parseNumber = (value: string | null, fallback = 0) => {
  if (!value) return fallback;
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const AuditAuthorization: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [permitId, setPermitId] = useState(params.get('permitId') || '');
  const [propertyAddress, setPropertyAddress] = useState(params.get('address') || '');
  const [projectType, setProjectType] = useState(params.get('projectType') || '5-Ton HVAC Replacement');
  const [homeownerName, setHomeownerName] = useState(params.get('owner') || '');
  const [homeownerEmail, setHomeownerEmail] = useState(params.get('email') || '');
  const [signedPdfUrl, setSignedPdfUrl] = useState('');
  const [currentValuation, setCurrentValuation] = useState(parseNumber(params.get('currentValuation'), 0));
  const [authorizedRate, setAuthorizedRate] = useState(parseNumber(params.get('authorizedRate'), 0));
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const signUrl = params.get('signUrl') || '';
  const savings = useMemo(() => Math.max(currentValuation - authorizedRate, 0), [currentValuation, authorizedRate]);

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

  const handleLockIn = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/authorization-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          permitId,
          propertyAddress,
          projectType,
          homeownerName,
          homeownerEmail,
          currentValuation,
          authorizedRate,
          savings,
          signedPdfUrl
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || 'Could not submit authorization.');
      }

      navigate('/audit-authorization/success');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not submit authorization.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-brand-dark text-white px-6 py-6">
          <h1 className="text-2xl font-bold">Project Audit &amp; Price Recovery</h1>
          <p className="text-slate-300 text-sm mt-2">Authorization Confirmation - Atlas Construction Intelligence</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h2 className="font-bold text-brand-dark mb-3">Lead Information</h2>
            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm">
                <span className="block text-slate-600 mb-1">Permit ID</span>
                <input value={permitId} onChange={(e) => setPermitId(e.target.value)} className="w-full border rounded-lg p-2.5" />
              </label>
              <label className="text-sm">
                <span className="block text-slate-600 mb-1">Property Address</span>
                <input
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full border rounded-lg p-2.5"
                />
              </label>
              <label className="text-sm">
                <span className="block text-slate-600 mb-1">Project Type</span>
                <input
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full border rounded-lg p-2.5"
                />
              </label>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h2 className="font-bold text-brand-dark mb-3">The Math</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <span className="text-slate-600 font-medium">Current Permit Valuation</span>
                <input
                  type="number"
                  value={currentValuation}
                  onChange={(e) => setCurrentValuation(Number(e.target.value))}
                  className="w-40 text-right font-bold border rounded p-2"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <span className="text-slate-600 font-medium">Atlas Authorized Rate</span>
                <input
                  type="number"
                  value={authorizedRate}
                  onChange={(e) => setAuthorizedRate(Number(e.target.value))}
                  className="w-40 text-right font-bold border rounded p-2"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                <span className="text-green-800 font-bold">Total Homeowner Savings</span>
                <span className="text-xl font-extrabold text-green-700">{toCurrency(savings)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h2 className="font-bold text-brand-dark mb-3">Authorization Details</h2>
            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm">
                <span className="block text-slate-600 mb-1">Homeowner Name</span>
                <input
                  value={homeownerName}
                  onChange={(e) => setHomeownerName(e.target.value)}
                  className="w-full border rounded-lg p-2.5"
                />
              </label>
              <label className="text-sm">
                <span className="block text-slate-600 mb-1">Homeowner Email</span>
                <input
                  type="email"
                  value={homeownerEmail}
                  onChange={(e) => setHomeownerEmail(e.target.value)}
                  className="w-full border rounded-lg p-2.5"
                />
              </label>
              <label className="text-sm">
                <span className="block text-slate-600 mb-1">Signed PDF URL (optional)</span>
                <input
                  value={signedPdfUrl}
                  onChange={(e) => setSignedPdfUrl(e.target.value)}
                  placeholder="Paste signed document URL if available"
                  className="w-full border rounded-lg p-2.5"
                />
              </label>
            </div>
            <p className="text-sm text-slate-700 mt-4 leading-relaxed">
              Homeowner hereby appoints Atlas Construction Intelligence as Owner&apos;s Representative to manage the HVAC replacement
              at the specified address. Installation to be performed by a licensed ROC partner.
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h2 className="font-bold text-brand-dark mb-3">Digital Signature</h2>
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

          {submitError && <div className="text-sm text-red-600 text-center">{submitError}</div>}

          <Button fullWidth onClick={handleLockIn} disabled={submitting}>
            {submitting ? 'Locking Recovery...' : 'I Signed - Lock In Recovery'}
          </Button>

          <p className="text-xs text-slate-500 text-center">
            Arizona Notice: Homeowners retain a four-day right to cancel under A.R.S. § 32-1158.02.
          </p>
        </div>
      </div>
    </div>
  );
};

export const AuditAuthorizationSuccess: React.FC = () => {
  useEffect(() => {
    document.title = 'Authorization Received | Atlas Construction Intelligence';
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
        <h1 className="text-2xl font-bold text-brand-dark mb-3">Your recovery is locked in.</h1>
        <p className="text-brand-secondary">
          Atlas is now processing your file. We will handle the cancellation logistics with your previous provider.
        </p>
      </div>
    </div>
  );
};

export default AuditAuthorization;
