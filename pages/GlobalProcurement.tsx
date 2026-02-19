import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, ClipboardCheck, Database, Factory, ShieldCheck } from 'lucide-react';

const GlobalProcurement: React.FC = () => {
  useEffect(() => {
    document.title = 'Global Procurement | Atlas Construction Intelligence';

    const description =
      'Institutional procurement and strategic sourcing for international construction projects, backed by B2B procurement intelligence and compliance protocols.';
    const keywords = 'International Construction Sourcing, B2B Procurement Intelligence';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = keywords;
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="bg-slate-100 text-slate-900">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=2200&q=80')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-800/85" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <p className="text-sm uppercase tracking-[0.22em] text-orange-400 font-semibold mb-5">
            Atlas Global Procurement Division
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl">
            Institutional Procurement &amp; Strategic Sourcing Hub.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-200 max-w-3xl leading-relaxed">
            Leveraging proprietary US-market intelligence to optimize supply chain efficiencies for international
            infrastructure projects.
          </p>
          <div className="mt-10">
            <Link
              to="/global-procurement/sourcing-status-tracking"
              className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-orange-400 transition-colors"
            >
              Client Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">Core Service Verticals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <article className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-slate-900 text-orange-400 flex items-center justify-center mb-5">
                <Factory className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Strategic Asset Sourcing</h3>
              <p className="text-slate-700 leading-relaxed">
                Atlas analyzes Arizona and Dallas permit intelligence to identify inventory surpluses, enabling the
                acquisition of tier-1 HVAC and solar materials at wholesale rates.
              </p>
            </article>

            <article className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-slate-900 text-orange-400 flex items-center justify-center mb-5">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Procurement Consolidation</h3>
              <p className="text-slate-700 leading-relaxed">
                As a US consolidation hub, Atlas vets sub-vendors, coordinates staged deposits, and secures inventory
                blocks for global partner projects requiring synchronized delivery windows.
              </p>
            </article>

            <article className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-slate-900 text-orange-400 flex items-center justify-center mb-5">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Supply Chain Intelligence</h3>
              <p className="text-slate-700 leading-relaxed">
                We deliver data-driven feasibility studies and vendor due diligence reports that quantify sourcing
                viability, lead-time risk, and transaction readiness.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">Trade-Flow Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                step: 'Step 1',
                title: 'Capital Allocation',
                desc: 'Client initiates a Procurement Deposit based on Atlas Intelligence reports.',
              },
              {
                step: 'Step 2',
                title: 'Inventory Locking',
                desc: 'Atlas utilizes funds to secure physical stock from US-based manufacturers.',
              },
              {
                step: 'Step 3',
                title: 'Material Consolidation',
                desc: 'Materials are staged at regional consolidation centers for logistics optimization.',
              },
              {
                step: 'Step 4',
                title: 'Fulfillment & Settlement',
                desc: 'Final export documentation is generated, and the procurement cycle is completed.',
              },
            ].map((item) => (
              <article key={item.step} className="relative border border-slate-200 rounded-xl bg-slate-50 p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500 mb-3">{item.step}</p>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-700 leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 text-orange-400 font-semibold uppercase tracking-[0.18em] text-xs mb-5">
            <ShieldCheck className="h-4 w-4" />
            Compliance Shield
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Compliance, Governance &amp; TBAML Protocol.</h2>
          <p className="text-slate-200 text-lg leading-relaxed">
            Atlas Construction Intelligence adheres to strict Trade-Based Anti-Money Laundering (TBAML) standards. All
            international transactions are supported by Master Supply Agreements, Staged Invoicing, and verifiable BOP
            (Balance of Payments) codes. We maintain a full digital audit trail for cross-border B2B transactions to
            ensure transparency for all domestic and international banking institutions.
          </p>
        </div>
      </section>

      <section className="py-10 bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
          <div className="inline-flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-orange-400" />
            Compliance Documentation
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <a href="#" className="hover:text-white transition-colors">
              International Sourcing Terms &amp; Conditions (PDF)
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Regulatory Disclosure
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GlobalProcurement;
