import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';

const SIGN_URL = (import.meta as any).env?.VITE_PARTNER_MSA_SIGN_URL || '';

const PartnerMasterSubcontractor: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contractor, setContractor] = useState<any>(null);
  const [signerName, setSignerName] = useState('');
  const [signerTitle, setSignerTitle] = useState('');
  const [signedPdfUrl, setSignedPdfUrl] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const token = useMemo(() => new URLSearchParams(location.search).get('token') || '', [location.search]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        if (!token) {
          throw new Error('Missing agreement token.');
        }
        const resp = await fetch(`/api/contractor-agreement-load?token=${encodeURIComponent(token)}`);
        const body = await resp.json();
        if (!resp.ok) throw new Error(body.error || 'Failed to load agreement');
        setContractor(body.contractor);
      } catch (err: any) {
        setError(err?.message || 'Failed to load agreement');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const resp = await fetch('/api/contractor-agreement-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, signerName, signerTitle, signedPdfUrl })
      });
      const body = await resp.json();
      if (!resp.ok) throw new Error(body.error || 'Submission failed');
      setDone(true);
    } catch (err: any) {
      setError(err?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="max-w-3xl mx-auto py-10 px-4 text-brand-secondary">Loading agreement...</div>;
  if (error) return <div className="max-w-3xl mx-auto py-10 px-4 text-red-600">{error}</div>;
  if (!contractor) return <div className="max-w-3xl mx-auto py-10 px-4 text-red-600">Agreement not found.</div>;
  if (done) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-white border rounded-xl p-6">
          <h1 className="text-2xl font-bold text-brand-dark mb-2">Agreement Submitted</h1>
          <p className="text-brand-secondary">Thank you. Your status is now Active Partner. Atlas and your team have been emailed the signed packet link.</p>
        </div>
      </div>
    );
  }

  const signEmbedUrl = SIGN_URL
    ? `${SIGN_URL}${SIGN_URL.includes('?') ? '&' : '?'}legalEntity=${encodeURIComponent(contractor.legal_entity_name)}&roc=${encodeURIComponent(contractor.roc_license_number)}&email=${encodeURIComponent(contractor.business_email)}`
    : '';

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark">Master Subcontractor Agreement</h1>
      <div className="bg-white border rounded-xl p-6 text-sm text-slate-700 space-y-3">
        <p><strong>Entity:</strong> {contractor.legal_entity_name}</p>
        <p><strong>ROC License:</strong> {contractor.roc_license_number}</p>
        <p><strong>Contact:</strong> {contractor.owner_principal_name} · {contractor.direct_cell} · {contractor.business_email}</p>
        <p><strong>Rate Submission Date:</strong> {new Date(contractor.rate_submitted_at).toLocaleDateString()}</p>
        <hr />
        <p><strong>Section 1 - Parties:</strong> This Agreement is between Atlas Construction Intelligence and {contractor.legal_entity_name}.</p>
        <p><strong>Section 2 - Independent Contractor Status:</strong> Subcontractor is an independent contractor, not an employee of Atlas, has no authority to bind Atlas, and maintains licensing/insurance/compliance.</p>
        <p><strong>Section 3 - Role & Control:</strong> Atlas contracts with homeowner and controls pricing/client communication. Subcontractor performs labor execution only and may not negotiate pricing/scope directly with homeowner.</p>
        <p><strong>Section 4 - Permit Responsibility:</strong> Subcontractor pulls permits under ROC license, schedules/passes inspections, and corrects labor-caused failures at subcontractor cost.</p>
        <p><strong>Section 5 - Payment Terms:</strong> Payment issued after inspection pass. Invoice must include permit number and address. Payment within 48 hours of inspection approval.</p>
        <p><strong>Section 6 - Change Order Control:</strong> No additional work without written Atlas approval. No direct homeowner change orders.</p>
        <p><strong>Section 7 - Indemnification:</strong> Subcontractor indemnifies Atlas for claims/damages/losses arising from subcontractor labor or negligence.</p>
        <p><strong>Section 8 - Warranty:</strong> Labor warranty by subcontractor; equipment warranty by manufacturer; Atlas provides coordination only.</p>
        <p><strong>Section 9 - Non-Solicitation:</strong> 12-month non-circumvention; liquidated damages equal to diverted contract value; governed by Arizona law.</p>
        <p><strong>Section 10 - Rate Incorporation:</strong> Rate submission is incorporated into this agreement.</p>
        <p><strong>Section 11 - Termination:</strong> Either party may terminate with written notice; non-solicitation survives.</p>
      </div>

      {signEmbedUrl ? (
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-2">Digital Signature</h2>
          <iframe title="Digital Signature Form" src={signEmbedUrl} className="w-full h-[680px] border rounded" />
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
          Set <code>VITE_PARTNER_MSA_SIGN_URL</code> to your signature form URL (Jotform/SignWell/DocuSign embed link).
        </div>
      )}

      <form onSubmit={submit} className="bg-white border rounded-xl p-6 space-y-3">
        <h2 className="font-semibold">Section 12 - Digital Execution Confirmation</h2>
        <input className="w-full p-3 border rounded-lg" value={signerName} onChange={(e) => setSignerName(e.target.value)} placeholder="Printed Name" required />
        <input className="w-full p-3 border rounded-lg" value={signerTitle} onChange={(e) => setSignerTitle(e.target.value)} placeholder="Title" required />
        <input className="w-full p-3 border rounded-lg" value={signedPdfUrl} onChange={(e) => setSignedPdfUrl(e.target.value)} placeholder="Signed PDF URL" required />
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1" />
          <span>I confirm this agreement has been signed and the signed PDF URL above is accurate.</span>
        </label>
        <Button type="submit" disabled={!agreed || submitting}>
          {submitting ? 'Submitting...' : 'Submit Agreement'}
        </Button>
      </form>
    </div>
  );
};

export default PartnerMasterSubcontractor;

