import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import Button from '../components/ui/Button';
import { approveContractorAndSendAgreement, getContractorsForReview, rejectContractor } from '../lib/contractorsDb';
import { Link } from 'react-router-dom';

const InternalPartnerReview: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [contractors, setContractors] = useState<any[]>([]);
  const [actionMsg, setActionMsg] = useState('');
  const [actionErr, setActionErr] = useState('');
  const [busyId, setBusyId] = useState('');

  const loadContractors = async () => {
    try {
      const rows = await getContractorsForReview();
      setContractors(rows);
    } catch (err: any) {
      setActionErr(err?.message || 'Failed to load contractors');
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadContractors();
  }, [session]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const approve = async (id: string) => {
    setBusyId(id);
    setActionErr('');
    setActionMsg('');
    try {
      await approveContractorAndSendAgreement(id);
      setActionMsg('Approved and Form 2 agreement sent.');
      await loadContractors();
    } catch (err: any) {
      setActionErr(err?.message || 'Approval failed');
    } finally {
      setBusyId('');
    }
  };

  const reject = async (id: string) => {
    setBusyId(id);
    setActionErr('');
    setActionMsg('');
    try {
      await rejectContractor(id);
      setActionMsg('Submission rejected.');
      await loadContractors();
    } catch (err: any) {
      setActionErr(err?.message || 'Reject failed');
    } finally {
      setBusyId('');
    }
  };

  if (authLoading) {
    return <div className="max-w-3xl mx-auto py-12 px-4 text-brand-secondary">Checking session...</div>;
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white border rounded-xl p-6">
          <h1 className="text-xl font-bold mb-4">Internal Partner Review Login</h1>
          <form onSubmit={handleAuth} className="space-y-3">
            <input className="w-full p-3 border rounded-lg" type="email" placeholder="Analyst email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="w-full p-3 border rounded-lg" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button fullWidth type="submit">Sign In</Button>
          </form>
          {authError && <div className="text-sm text-red-600 mt-3">{authError}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-4">
      <div className="bg-white border rounded-xl p-2 flex flex-wrap gap-2">
        <Link
          to="/internal/create-audit"
          className="px-3 py-2 rounded-lg text-sm font-semibold border border-slate-300 text-brand-dark hover:bg-slate-50"
        >
          Create Audit
        </Link>
        <Link
          to="/internal/partner-reviews"
          className="px-3 py-2 rounded-lg text-sm font-semibold bg-brand-dark text-white"
        >
          Partner Onboarding Review
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-dark">Partner Submissions - Admin Review</h1>
        <Button variant="outline" onClick={signOut}>Sign Out</Button>
      </div>

      {actionMsg && <div className="text-sm text-green-700">{actionMsg}</div>}
      {actionErr && <div className="text-sm text-red-600">{actionErr}</div>}

      <div className="space-y-3">
        {contractors.map((row) => (
          <div key={row.id} className="bg-white border rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-bold text-brand-dark">{row.legal_entity_name}</div>
                <div className="text-sm text-slate-600">ROC {row.roc_license_number}</div>
                <div className="text-sm text-slate-600">{row.owner_principal_name} · {row.direct_cell}</div>
                <div className="text-sm text-slate-600">{row.business_email}</div>
                <div className="text-sm text-slate-600">{row.business_address}</div>
                <div className="text-xs mt-1 uppercase tracking-wide text-slate-500">Status: {row.status}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => approve(row.id)}
                  disabled={busyId === row.id || row.status === 'active_partner' || row.status === 'agreement_sent'}
                >
                  {busyId === row.id ? 'Working...' : 'Approve + Trigger Form 2'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => reject(row.id)} disabled={busyId === row.id || row.status === 'active_partner'}>
                  Reject
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InternalPartnerReview;
