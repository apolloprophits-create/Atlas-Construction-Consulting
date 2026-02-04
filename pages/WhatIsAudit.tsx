import React, { useEffect } from 'react';
import { ShieldCheck, Database, Search, FileText } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import FAQList from '../components/FAQList';
import { AUDIT_FAQS } from '../constants';

const WhatIsAudit: React.FC = () => {
  useEffect(() => {
    document.title = "What Is a Construction Price Audit? | Phoenix Homeowners Guide";
    const metaDescription = document.querySelector('meta[name="description"]');
    const descContent = "A construction price audit compares your project’s permitted valuation to Phoenix market data to help homeowners verify pricing before signing contracts.";
    if (metaDescription) {
      metaDescription.setAttribute('content', descContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = descContent;
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="bg-white">
      {/* Title Header */}
      <section className="bg-brand-surface border-b border-brand-border py-16">
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-sm font-bold text-brand-secondary uppercase tracking-widest mb-2">Education</div>
           <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">What Is a Construction Price Audit?</h1>
           <p className="text-xl text-brand-secondary leading-relaxed">
             A construction price audit is an independent review of a proposed construction project’s pricing using public permit data and current market benchmarks. Its purpose is to help homeowners determine whether a quoted price aligns with typical costs for similar projects in the same geographic area.
           </p>
           <p className="text-xl text-brand-secondary leading-relaxed mt-6">
             Unlike contractor estimates or bids, a construction price audit does not propose work, provide pricing, or attempt to sell services. It exists solely to provide clarity before financial commitments are made.
           </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 py-16">
        
        {/* Why Construction Pricing Is Difficult for Homeowners */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Why Construction Pricing Is Difficult for Homeowners</h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            Most homeowners make construction decisions under pressure. Projects such as HVAC replacements, roofing, plumbing failures, or solar installations often arise during emergencies or time-sensitive situations.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            Pricing is further complicated by:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 text-lg mb-6">
             <li>Sales-driven commission structures</li>
             <li>Financing that obscures true project cost</li>
             <li>Bundled services that hide margin</li>
             <li>Limited public pricing transparency</li>
          </ul>
          <p className="text-lg text-slate-700 leading-relaxed">
            Without reliable benchmarks, homeowners are forced to rely on trust rather than data.
          </p>
        </div>

        {/* What Data Is Used in a Construction Price Audit? */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-brand-dark mb-4">What Data Is Used in a Construction Price Audit?</h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            Construction price audits rely on publicly available and verifiable data sources, including:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 text-lg mb-6">
             <li>Residential permit valuations</li>
             <li>Project scope classifications</li>
             <li>Recent market activity within the same county</li>
             <li>Industry-specific cost normalization</li>
          </ul>
          <p className="text-lg text-slate-700 leading-relaxed">
            In Phoenix, most major residential construction projects require permits, making valuation data available for comparison across similar homes and project types.
          </p>
        </div>

        {/* What a Permit Valuation Represents (and What It Doesn’t) */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-brand-dark mb-4">What a Permit Valuation Represents (and What It Doesn’t)</h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            A permit valuation reflects the declared value of a project submitted to the county at the time of permitting. While it may not match a final invoice exactly, it provides a reliable benchmark when analyzed against similar projects.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
              <p className="font-bold text-brand-dark mb-2">Permit valuations:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700 text-lg">
                <li>Represent scope and scale</li>
                <li>Allow market-wide comparison</li>
                <li>Reveal pricing patterns over time</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-brand-dark mb-2">They do not:</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700 text-lg">
                <li>Guarantee quality</li>
                <li>Represent final negotiated cost</li>
                <li>Include optional future upgrades</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How Construction Price Audits Help Homeowners */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-brand-dark mb-4">How Construction Price Audits Help Homeowners</h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            A construction price audit helps homeowners:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 text-lg mb-6">
             <li>Identify pricing that significantly exceeds market medians</li>
             <li>Understand whether urgency is influencing cost</li>
             <li>Decide if a second opinion is warranted</li>
             <li>Proceed with greater confidence when pricing aligns</li>
          </ul>
          <p className="text-lg text-slate-700 leading-relaxed">
            The audit does not accuse contractors or challenge quality. It simply provides context.
          </p>
        </div>

        {/* When Should a Homeowner Request a Construction Price Audit? */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-brand-dark mb-4">When Should a Homeowner Request a Construction Price Audit?</h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            A construction price audit is most valuable:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 text-lg mb-6">
             <li>After a permit is issued</li>
             <li>Before a contract is finalized</li>
             <li>When pricing exceeds expectations</li>
             <li>When financing terms obscure total cost</li>
             <li>When urgency limits time for comparison</li>
          </ul>
          <p className="text-lg text-slate-700 leading-relaxed">
            Once construction begins, pricing leverage decreases significantly.
          </p>
        </div>

        {/* Is a Construction Price Audit a Sales Offer? */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Is a Construction Price Audit a Sales Offer?</h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            No. A construction price audit is informational only.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed">
            Atlas Construction Consulting does not perform construction services and does not receive commissions from contractors. The audit exists to help homeowners make informed decisions, not to sell services or redirect projects.
          </p>
        </div>

        {/* How Is a Construction Price Audit Different From Getting Another Quote? */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-brand-dark mb-4">How Is a Construction Price Audit Different From Getting Another Quote?</h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            Another quote is still a sales proposal.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            A construction price audit:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 text-lg">
             <li>Uses market-wide data</li>
             <li>Is independent of contractor incentives</li>
             <li>Provides pricing context rather than bids</li>
             <li>Focuses on verification, not replacement</li>
          </ul>
        </div>

        {/* Who Uses Construction Price Audits? */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-brand-dark mb-4">Who Uses Construction Price Audits?</h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            Construction price audits are commonly used by:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 text-lg">
             <li>Homeowners evaluating large projects</li>
             <li>Property owners protecting equity</li>
             <li>Buyers reviewing pre-purchase renovations</li>
             <li>Families facing emergency replacements</li>
          </ul>
        </div>

        {/* How to Request a Construction Price Audit */}
        <div className="mb-16 bg-slate-50 p-8 rounded-xl border border-slate-200">
          <h2 className="text-2xl font-bold text-brand-dark mb-4">How to Request a Construction Price Audit</h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            Homeowners can request an independent construction price audit by submitting basic project details. If sufficient data is available, an Atlas Audit Report is generated and delivered for review.
          </p>
          <Link to="/#request-audit-form">
            <Button size="lg">Request an Audit</Button>
          </Link>
        </div>

        <div className="border-t border-brand-border pt-8 text-center text-sm text-slate-500">
           <p className="font-bold mb-2">Disclaimer</p>
           <p>
             Atlas Construction Consulting does not perform construction services and does not receive commissions. All audits are informational only and intended to assist homeowners in understanding market pricing.
           </p>
        </div>

      </main>

      {/* Audit FAQs */}
      <FAQList 
        title="Construction Audit FAQs" 
        items={AUDIT_FAQS} 
        className="bg-slate-50 border-t border-brand-border" 
      />
    </div>
  );
};

export default WhatIsAudit;