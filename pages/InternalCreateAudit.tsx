import React, { useState } from 'react';
import { mockDb } from '../lib/mockDb';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Copy, Check, Lock } from 'lucide-react';

const InternalCreateAudit: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
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

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'atlas2024') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid Password');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateSignal = (val: number, median: number): 'green' | 'yellow' | 'red' => {
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
    const deviation = Math.round(((val - median) / median) * 100);
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
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-brand-dark">Audit Generator</h1>
        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-bold">
          AUTHORIZED
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-border">
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

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-bold text-brand-dark mb-4 text-sm uppercase">Valuation Data</h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Permitted Val ($)</label>
                 <input type="number" name="permittedValuation" value={formData.permittedValuation} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg" required />
              </div>
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Market Median ($)</label>
                 <input type="number" name="marketMedian" value={formData.marketMedian} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg" required />
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
      </div>

      {createdLink && (
        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
           <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
              <h3 className="font-bold text-green-800 mb-4 text-lg">Audit Created Successfully</h3>
              <div className="flex gap-2">
                <input readOnly value={createdLink} className="flex-1 p-3 text-sm border rounded-lg text-slate-600 bg-white" />
                <button onClick={copyToClipboard} className="p-3 bg-white border rounded-lg hover:bg-slate-50 text-slate-600">
                  {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-2 text-right">
                <a href={createdLink} target="_blank" rel="noreferrer" className="text-sm text-green-700 hover:underline font-semibold">Open Report &rarr;</a>
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
  );
};

export default InternalCreateAudit;