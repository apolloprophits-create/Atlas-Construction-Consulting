import React, { useState, useEffect } from 'react';
import { mockDb } from '../lib/mockDb';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Copy, Check, Lock, Inbox, User, ArrowRight } from 'lucide-react';

const InternalCreateAudit: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
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
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const dbLeads = mockDb.getLeads();
      // Sort by newest first
      const sortedLeads = dbLeads.sort((a: any, b: any) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      setLeads(sortedLeads);
    }
  }, [isAuthenticated]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'atlas2024') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid Password');
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

    const origin = window.location.origin + window.location.pathname; // Handling hash router base
    const link = `${origin}#/audit/${id}`;
    
    setCreatedLink(link);
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isAuthenticated) {
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
               type="password" 
               className="w-full p-3 border rounded-lg" 
               placeholder="Enter password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
             />
             <Button fullWidth type="submit">Unlock</Button>
           </form>
           <div className="text-center mt-4 text-xs text-slate-400">
             (Use 'atlas2024')
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-brand-dark">Analyst Dashboard</h1>
        <div className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
          AUTHORIZED SESSION
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
                      <button onClick={copyToClipboard} className="p-3 bg-white border rounded-lg hover:bg-slate-50 text-slate-600">
                        {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="mt-2 text-right">
                      <a href={createdLink} target="_blank" rel="noreferrer" className="text-sm text-green-700 hover:underline font-semibold flex items-center justify-end gap-1">
                        Open Report <ArrowRight className="w-3 h-3"/>
                      </a>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-brand-dark mb-4 text-lg border-b pb-2">SMS Templates</h3>
                  
                  <div className="mb-6">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-2">Template 1 (Initial Delivery)</div>
                    <div className="bg-white p-4 rounded-lg border border-slate-300 text-sm text-slate-700 font-mono leading-relaxed relative group">
                      Hi — this is Atlas Construction Consulting. A residential permit was recently issued associated with your project area. We ran an independent pricing audit against current Maricopa County market data. Review your Atlas Audit Report here: {createdLink}
                      <button 
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