import React, { useState, useEffect } from 'react';
import { mockDb } from '../lib/mockDb';
import Button from '../components/ui/Button';
import { Copy, Check, Lock, Inbox, User, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

const InternalCreateAudit: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [leads, setLeads] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    homeownerName: '',
    homeownerPhone: '',
    industry: 'HVAC',
    zip: '',
    permitIssuedDate: new Date().toISOString().split('T')[0],
    permittedValuation: 0,
    marketMedian: 0,
    findings: '',
    whatThisMeans: '',
  });
  
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [authorizationLink, setAuthorizationLink] = useState<string | null>(null);
  const [freshAuthorizationLink, setFreshAuthorizationLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [authCopied, setAuthCopied] = useState(false);
  const [freshAuthCopied, setFreshAuthCopied] = useState(false);

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
    if (session) {
      mockDb
        .getLeads()
        .then((dbLeads) => setLeads(dbLeads))
        .catch((error) => {
          console.error(error);
          setLeads([]);
        });
    } else {
      setLeads([]);
    }
  }, [session]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setAuthError(error.message);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    }
  };

  const populateFromLead = (lead: any) => {
    setFormData(prev => ({
      ...prev,
      homeownerName: lead.name,
      homeownerPhone: lead.phone,
      industry: lead.projectType !== 'General' ? lead.projectType : 'HVAC',
      zip: lead.zipCode,
      findings: lead.notes ? `- Customer Note: "${lead.notes}"` : '',
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateSignal = (val: number, median: number): 'green' | 'yellow' | 'red' => {
    if (median === 0) return 'yellow';
    const ratio = val / median;
    if (ratio > 1.4) return 'red';
    if (ratio > 1.15) return 'yellow';
    return 'green';
  };

  const buildAuthorizationLink = (permitId: string, valuation: number, median: number) => {
    const appOrigin = window.location.origin;
    const authParams = new URLSearchParams({
      permitId,
      address: formData.zip,
      projectType: formData.industry,
      owner: formData.homeownerName,
      email: '',
      currentValuation: String(valuation),
      authorizedRate: String(median),
      session: Date.now().toString()
    });
    return `${appOrigin}/audit-authorization?${authParams.toString()}`;
  };

  const generateFreshAuthorizationLink = () => {
    const permitId = `PENDING-${Date.now().toString().slice(-6)}`;
    const link = buildAuthorizationLink(permitId, Number(formData.permittedValuation || 0), Number(formData.marketMedian || 0));
    setFreshAuthorizationLink(link);
    navigator.clipboard.writeText(link).then(() => {
      setFreshAuthCopied(true);
      setTimeout(() => setFreshAuthCopied(false), 2000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const val = Number(formData.permittedValuation);
    const median = Number(formData.marketMedian);
    const deviation = median > 0 ? Math.round(((val - median) / median) * 100) : 0;
    const signal = calculateSignal(val, median);

    const findingsArray = formData.findings.split('\n').filter(f => f.trim() !== '');
    
    // Default actions based on signal
    const actions = [];
    if (signal === 'red') {
       actions.push('Do not sign the current contract.');
       actions.push('Request a line-item breakdown of overhead fees.');
       actions.push('Get a second opinion from an audit-cleared provider.');
    } else if (signal === 'yellow') {
       actions.push('Negotiate the labor rate.');
       actions.push('Verify specific model numbers match the quote.');
    } else {
       actions.push('Proceed with confidence. Price is within market range.');
    }

    // Default "what this means" if empty
    let meaning = formData.whatThisMeans;
    if (!meaning) {
       if (signal === 'red') meaning = "The permitted valuation is significantly lower than your quote. This typically indicates high sales commissions (25%+) or extreme overhead markup, rather than actual material cost.";
       else if (signal === 'yellow') meaning = "The quote is on the higher end of the spectrum. This may be due to premium equipment selection or seasonal demand pricing.";
       else meaning = "Your quote is consistent with other recently permitted projects in your zip code. The contractor's margins appear to be within standard industry limits.";
    }

    const id = await mockDb.createAudit({
      homeownerName: formData.homeownerName,
      homeownerPhone: formData.homeownerPhone,
      industry: formData.industry,
      zip: formData.zip,
      permitIssuedDate: formData.permitIssuedDate,
      permittedValuation: val,
      marketMedian: median,
      deviationPercent: deviation,
      pricingSignal: signal,
      findings: findingsArray,
      recommendedActions: actions,
      whatThisMeans: meaning
    });

    const appOrigin = window.location.origin;
    const link = `${appOrigin}/audit/${id}`;
    const authLink = buildAuthorizationLink(id, val, median);
    
    setCreatedLink(link);
    setAuthorizationLink(authLink);
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyAuthorizationLink = () => {
    if (authorizationLink) {
      navigator.clipboard.writeText(authorizationLink);
      setAuthCopied(true);
      setTimeout(() => setAuthCopied(false), 2000);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-brand-secondary">Checking session...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full">
           <div className="flex justify-center mb-4">
             <div className="bg-brand-dark p-3 rounded-full text-white">
               <Lock className="w-6 h-6" />
             </div>
           </div>
           <h2 className="text-center text-xl font-bold text-brand-dark mb-6">Internal Access Only</h2>
           <form onSubmit={handleAuth} className="space-y-4">
             <input
               type="email"
               className="w-full p-3 border rounded-lg"
               placeholder="Analyst email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               autoComplete="email"
               required
             />
             <input 
               type="password" 
               className="w-full p-3 border rounded-lg" 
               placeholder="Password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               autoComplete="current-password"
               required
             />
             <Button fullWidth type="submit">Sign In</Button>
           </form>
           {authError && <div className="mt-3 text-sm text-red-600 text-center">{authError}</div>}
           <div className="text-center mt-4 text-xs text-slate-400">Use your Supabase Auth analyst account</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-brand-dark">Analyst Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
            AUTHORIZED SESSION
          </div>
          <Button size="sm" variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar: Lead Inbox */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-brand-border p-4 h-[600px] flex flex-col">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
              <Inbox className="w-5 h-5 text-brand-accent" />
              <h2 className="font-bold text-brand-dark">Incoming Requests ({leads.length})</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {leads.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <p>No pending requests.</p>
                </div>
              ) : (
                leads.map((lead, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-brand-accent hover:shadow-sm cursor-pointer transition-all group"
                    onClick={() => populateFromLead(lead)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-brand-dark text-sm">{lead.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(lead.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-brand-secondary mb-2">
                      <span className="px-1.5 py-0.5 bg-white border rounded text-[10px] uppercase font-bold tracking-wide">
                        {lead.projectType}
                      </span>
                      <span>{lead.zipCode}</span>
                    </div>
                    {lead.notes && (
                      <div className="text-xs text-slate-500 italic line-clamp-2 bg-white p-2 rounded border border-slate-100 mb-2">
                        "{lead.notes}"
                      </div>
                    )}
                    <div className="text-xs text-brand-accent font-semibold opacity-0 group-hover:opacity-100 flex items-center justify-end gap-1 transition-opacity">
                      Load Data <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Main: Audit Generator */}
        <div className="lg:col-span-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-border">
            <div className="mb-6 pb-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-brand-dark">Generate New Audit</h2>
              <p className="text-sm text-slate-500">Select a lead from the left to auto-populate details.</p>
            </div>

            <div className="mb-6 bg-indigo-50 border border-indigo-200 p-4 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-bold text-indigo-900">Fresh Phone-Call Link</h3>
                  <p className="text-xs text-indigo-800">
                    Create a brand-new lock-in link and auto-copy it for texting while you are on the call.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={generateFreshAuthorizationLink}
                  className="px-4 py-2 rounded-lg bg-indigo-700 text-white text-sm font-semibold hover:bg-indigo-800"
                >
                  Generate Fresh Link
                </button>
              </div>
              {freshAuthorizationLink && (
                <div className="mt-3 flex gap-2">
                  <input readOnly value={freshAuthorizationLink} className="flex-1 p-2.5 text-xs border rounded-lg bg-white text-slate-700" />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(freshAuthorizationLink);
                      setFreshAuthCopied(true);
                      setTimeout(() => setFreshAuthCopied(false), 2000);
                    }}
                    className="px-3 rounded-lg border bg-white text-slate-700 hover:bg-slate-50"
                    aria-label="Copy fresh authorization link"
                  >
                    {freshAuthCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Homeowner Name</label>
                   <input name="homeownerName" value={formData.homeownerName} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg" required />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Homeowner Phone</label>
                   <input name="homeownerPhone" value={formData.homeownerPhone} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg" placeholder="555-123-4567" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Industry</label>
                   <select name="industry" value={formData.industry} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                     <option>HVAC</option>
                     <option>Solar</option>
                     <option>Roofing</option>
                     <option>Pools</option>
                     <option>Electrical</option>
                     <option>Plumbing</option>
                     <option>Additions & Remodels</option>
                     <option>Concrete / Flatwork</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Zip Code</label>
                   <input name="zip" value={formData.zip} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg" required />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Permit Issued Date</label>
                   <input type="date" name="permitIssuedDate" value={formData.permitIssuedDate} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg" required />
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-brand-dark p-1 rounded text-white"><User className="w-4 h-4"/></div>
                  <h4 className="font-bold text-brand-dark text-sm uppercase">Valuation Analysis</h4>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Permitted Val ($)</label>
                     <input type="number" name="permittedValuation" value={formData.permittedValuation} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg bg-white" required />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Market Median ($)</label>
                     <input type="number" name="marketMedian" value={formData.marketMedian} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg bg-white" required />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Key Findings (One per line)</label>
                <textarea name="findings" value={formData.findings} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg h-32" placeholder="- Price exceeds median by 40%&#10;- Overhead margin appears inflated&#10;- Model SEER rating does not match price tier" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">What This Means (Optional - Will Auto-fill)</label>
                <textarea name="whatThisMeans" value={formData.whatThisMeans} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg h-24" placeholder="Leave empty to use default explanation based on signal." />
              </div>

              <Button type="submit" fullWidth disabled={loading}>{loading ? 'Generating Report...' : 'Generate Audit Link'}</Button>
            </form>

            {createdLink && (
              <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 pt-8 border-t border-slate-100">
                <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
                    <h3 className="font-bold text-green-800 mb-4 text-lg flex items-center gap-2">
                      <Check className="w-5 h-5" /> Audit Created
                    </h3>
                    <div className="flex gap-2">
                      <input readOnly value={createdLink} className="flex-1 p-3 text-sm border rounded-lg text-slate-600 bg-white" />
                      <button type="button" onClick={copyToClipboard} className="p-3 bg-white border rounded-lg hover:bg-slate-50 text-slate-600">
                        {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="mt-2 text-right">
                      <a href={createdLink} target="_blank" rel="noreferrer" className="text-sm text-green-700 hover:underline font-semibold flex items-center justify-end gap-1">
                        Open Report <ArrowRight className="w-3 h-3"/>
                      </a>
                    </div>
                </div>

                {authorizationLink && (
                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                    <h3 className="font-bold text-blue-800 mb-4 text-lg">Phone-Call Authorization Link</h3>
                    <div className="flex gap-2">
                      <input readOnly value={authorizationLink} className="flex-1 p-3 text-sm border rounded-lg text-slate-600 bg-white" />
                      <button type="button" onClick={copyAuthorizationLink} className="p-3 bg-white border rounded-lg hover:bg-slate-50 text-slate-600">
                        {authCopied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 mt-3">
                      Send this link while on the phone so the homeowner can authorize and sign immediately.
                    </p>
                  </div>
                )}

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-brand-dark mb-4 text-lg border-b pb-2">SMS Templates</h3>
                  
                  <div className="mb-6">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-2">Template 1 (Initial Delivery)</div>
                    <div className="bg-white p-4 rounded-lg border border-slate-300 text-sm text-slate-700 font-mono leading-relaxed relative group">
                      Hi — this is Atlas Construction Consulting. A residential permit was recently issued associated with your project area. We ran an independent pricing audit against current Maricopa County market data. Review your Atlas Audit Report here: {createdLink}
                      <button 
                          type="button"
                          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => navigator.clipboard.writeText(`Hi — this is Atlas Construction Consulting. A residential permit was recently issued associated with your project area. We ran an independent pricing audit against current Maricopa County market data. Review your Atlas Audit Report here: ${createdLink}`)}
                      >
                        <Copy className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase mb-2">Template 2 (Follow Up)</div>
                    <div className="bg-white p-4 rounded-lg border border-slate-300 text-sm text-slate-700 font-mono leading-relaxed relative group">
                      This report is informational only and not a sales offer. Many homeowners review it before finalizing contracts. {createdLink}
                      <button 
                          type="button"
                          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => navigator.clipboard.writeText(`This report is informational only and not a sales offer. Many homeowners review it before finalizing contracts. ${createdLink}`)}
                      >
                        <Copy className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalCreateAudit;
