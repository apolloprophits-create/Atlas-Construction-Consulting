import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { mockDb } from '../lib/mockDb';
import { AuditRecord } from '../types';
import Button from '../components/ui/Button';

const AuditReport: React.FC = () => {
  const { secureId } = useParams<{ secureId: string }>();
  const [audit, setAudit] = useState<AuditRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set noindex
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    if (secureId) {
      mockDb.getAudit(secureId).then(data => {
        setAudit(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    return () => {
      document.head.removeChild(metaRobots);
    }
  }, [secureId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
           <p className="text-brand-secondary text-sm font-medium">Retrieving Secure Report...</p>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-brand-dark mb-2">Report Not Found</h1>
          <p className="text-brand-secondary mb-6">This audit link may have expired or is invalid.</p>
          <Link to="/" className="text-brand-accent hover:underline">Return to Atlas Home</Link>
        </div>
      </div>
    );
  }

  const signalColor = {
    green: 'bg-green-50 text-green-700 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    red: 'bg-red-50 text-red-700 border-red-200'
  };
  
  const signalIcon = {
    green: <CheckCircle className="w-6 h-6" />,
    yellow: <HelpCircle className="w-6 h-6" />,
    red: <AlertTriangle className="w-6 h-6" />
  };

  const signalText = {
    green: 'Within Market Range',
    yellow: 'Moderately Elevated',
    red: 'Significantly Above Market'
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-brand-dark pb-12">
      {/* Report Header - strictly no nav style */}
      <header className="bg-brand-dark text-white p-4 shadow-md sticky top-0 z-10 border-b border-slate-700">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-lg font-bold tracking-tight">ATLAS</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">Construction Consulting</div>
          </div>
          <div className="text-right">
             <div className="text-[10px] bg-white/10 px-2 py-1 rounded text-white/80">
               Secure Report
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-6">
        
        <div className="text-center py-4">
          <h1 className="text-xl font-bold text-brand-dark">Independent Price & Permit Intelligence Report</h1>
          <p className="text-sm text-slate-500 mt-1">Generated: {new Date(audit.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Project Snapshot */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
             <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider">Project Snapshot</h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-y-6 gap-x-4 text-sm">
             <div>
               <div className="text-slate-500 text-xs mb-1">Industry</div>
               <div className="font-semibold text-brand-dark">{audit.industry}</div>
             </div>
             <div>
               <div className="text-slate-500 text-xs mb-1">Zip Code</div>
               <div className="font-semibold text-brand-dark">{audit.zip}</div>
             </div>
             <div>
               <div className="text-slate-500 text-xs mb-1">Permit Issued</div>
               <div className="font-semibold text-brand-dark">{audit.permitIssuedDate || 'N/A'}</div>
             </div>
             <div>
               <div className="text-slate-500 text-xs mb-1">Permitted Valuation</div>
               <div className="font-semibold text-brand-dark text-lg">${audit.permittedValuation.toLocaleString()}</div>
             </div>
          </div>
        </div>

        {/* Market Benchmark */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
             <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider">Market Benchmark</h3>
          </div>
          <div className="p-4">
             <div className="flex justify-between items-end mb-2">
                <div>
                  <div className="text-xs text-slate-500">Maricopa County Median (90-day)</div>
                  <div className="text-lg font-semibold text-slate-700">${audit.marketMedian.toLocaleString()}</div>
                </div>
                <div className={`text-sm font-bold ${audit.deviationPercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {audit.deviationPercent > 0 ? '+' : ''}{audit.deviationPercent}% Deviation
                </div>
             </div>
             
             {/* Visual Bar */}
             <div className="mt-4 relative h-6 bg-slate-100 rounded-full w-full overflow-hidden">
                {/* Center Marker (Median) */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-800 z-10"></div>
                <div className="absolute left-1/2 -top-1 text-[9px] font-bold text-slate-600 -translate-x-1/2">MEDIAN</div>

                {/* Range logic visualization */}
                {/* This is a simplified visual to show where the valuation lands relative to median */}
                <div 
                   className={`absolute top-1 bottom-1 rounded-full ${audit.pricingSignal === 'red' ? 'bg-red-500' : audit.pricingSignal === 'yellow' ? 'bg-yellow-400' : 'bg-green-500'}`}
                   style={{
                     left: '50%',
                     width: `${Math.min(Math.abs(audit.deviationPercent), 50)}%`,
                     transform: audit.deviationPercent < 0 ? 'translateX(-100%)' : 'none'
                   }}
                ></div>
             </div>
             <div className="flex justify-between text-[10px] text-slate-400 mt-1">
               <span>-50%</span>
               <span>+50%</span>
             </div>
          </div>
        </div>

        {/* Pricing Signal */}
        <div className={`rounded-lg border p-6 shadow-sm flex items-center gap-4 ${signalColor[audit.pricingSignal]}`}>
           <div className="p-3 bg-white/60 rounded-full flex-shrink-0">
             {signalIcon[audit.pricingSignal]}
           </div>
           <div>
             <h2 className="text-xl font-bold">{signalText[audit.pricingSignal]}</h2>
             <p className="text-sm opacity-90 mt-1">
               {audit.pricingSignal === 'green' && "This quote aligns with recent permit filings for similar projects."}
               {audit.pricingSignal === 'yellow' && "This quote is higher than the typical market rate for this area."}
               {audit.pricingSignal === 'red' && "This quote exceeds the vast majority of permitted valuations."}
             </p>
           </div>
        </div>

        {/* Key Findings */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
             <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider">Key Findings</h3>
          </div>
          <ul className="p-4 space-y-3">
            {audit.findings.map((finding, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                <div className="w-1.5 h-1.5 bg-brand-dark rounded-full mt-2 flex-shrink-0"></div>
                {finding}
              </li>
            ))}
          </ul>
        </div>

        {/* What This Usually Means */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
           <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
             <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider">What This Usually Means</h3>
           </div>
           <div className="p-4 text-sm text-slate-700 leading-relaxed">
             {audit.whatThisMeans}
           </div>
        </div>

        {/* Your Options */}
        <div className="pt-2">
          <h3 className="font-bold text-brand-dark px-1 mb-3">Your Options</h3>
          <div className="space-y-3">
             <Button fullWidth variant="primary" onClick={() => window.alert("In a full app, this would confirm the choice.")}>
               Proceed with Confidence
             </Button>
             <Link to="/contact">
                <Button as="span" fullWidth variant="outline">
                  Request a Second Look
                </Button>
             </Link>
             <a href="sms:16025550123" className="block">
                <Button fullWidth variant="ghost" className="border border-slate-200 bg-white">
                   Ask a Question
                </Button>
             </a>
          </div>
        </div>

        {/* Disclaimer */}
        <footer className="text-[10px] text-slate-400 leading-tight pt-8 pb-8 text-center border-t border-slate-200 mt-8">
          <p className="mb-2 font-bold">Disclaimer</p>
          <p>Atlas Construction Consulting does not perform construction services and does not receive commissions. This report is informational only and does not constitute a guaranteed offer, legal advice, or a warranty of work.</p>
          <p className="mt-2">&copy; Atlas Construction Consulting</p>
        </footer>
      </main>
    </div>
  );
};

export default AuditReport;
