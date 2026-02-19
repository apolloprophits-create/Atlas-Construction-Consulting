import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, ShieldCheck, Ship, Truck } from 'lucide-react';

const GlobalProcurement: React.FC = () => {
  useEffect(() => {
    document.title = 'Global Procurement | NASPEC | Atlas Construction Intelligence';

    const description =
      'North American Strategic Procurement & Export Consolidation (NASPEC): Tier-1 industrial aggregation, export logistics, and federal trade compliance infrastructure.';
    const keywords = 'International Construction Sourcing, B2B Procurement Intelligence, NASPEC, U.S. Export Consolidation';

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
    <div className="bg-[#f8fafc] text-slate-900">
      <section className="relative isolate overflow-hidden bg-[#0f172a] text-white border-b border-slate-700">
        <div className="absolute inset-0 -z-10 opacity-20 bg-[linear-gradient(120deg,rgba(251,146,60,0.18),transparent_45%),linear-gradient(320deg,rgba(56,189,248,0.15),transparent_42%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-12 md:col-span-8">
              <p className="text-xs uppercase tracking-[0.22em] text-orange-400 font-semibold mb-4">
                North American Procurement Operations
              </p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-5xl">
                North American Strategic Procurement &amp; Export Consolidation (NASPEC)
              </h1>
              <p className="mt-6 text-xl text-slate-200 max-w-4xl leading-relaxed">
                Tier-1 Industrial Aggregation and Regulatory Compliance for Global Infrastructure Partners.
              </p>
              <p className="mt-4 text-base md:text-lg text-slate-300 max-w-5xl leading-relaxed">
                Atlas provides the primary logistical bridge for Sub-Saharan infrastructure development, managing the
                procurement cycle from U.S. factory floor to the Port of Departure. We leverage nationwide market
                intelligence to secure bulk inventory under EAR/BIS federal guidelines.
              </p>
            </div>

            <div className="col-span-12 md:col-span-4 md:justify-self-end">
              <Link
                to="/global-procurement/sourcing-status-tracking"
                className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-orange-400 transition-colors"
              >
                <Lock className="h-4 w-4" />
                Restricted Access: Client Login
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#f8fafc] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">National Consolidation Nodes</h2>
          <div className="grid grid-cols-12 gap-6">
            <article className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-xl p-7 shadow-sm">
              <h3 className="text-xl font-bold mb-3">Gulf Node - Houston, TX</h3>
              <p className="text-slate-700 leading-relaxed">
                Primary hub for heavy mechanical, petrochemical hardware, and HVAC thermal management systems.
              </p>
            </article>
            <article className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-xl p-7 shadow-sm">
              <h3 className="text-xl font-bold mb-3">Pacific Node - Long Beach, CA</h3>
              <p className="text-slate-700 leading-relaxed">
                Consolidation of photovoltaic (PV) arrays, semiconductor components, and smart-grid controllers.
              </p>
            </article>
            <article className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-xl p-7 shadow-sm">
              <h3 className="text-xl font-bold mb-3">Atlantic Node - Newark, NJ/Savannah, GA</h3>
              <p className="text-slate-700 leading-relaxed">
                Strategic sourcing of structural steel (ASTM A36) and mid-to-high voltage power distribution hardware.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#0f172a] text-white border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">North American Export Corridors</h2>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 rounded-xl border border-slate-700 bg-slate-950 p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_16%_40%,rgba(251,146,60,0.32),transparent_40%),radial-gradient(circle_at_68%_36%,rgba(56,189,248,0.22),transparent_42%),radial-gradient(circle_at_84%_76%,rgba(34,197,94,0.2),transparent_36%)]" />
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-400 mb-4">Trade Routes: Interior U.S. to Coastal Ports to Africa</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                    <p className="text-white font-semibold mb-1">Inland Sourcing Belt</p>
                    <p className="text-slate-300 text-sm">Midwest, Gulf manufacturing corridors and factory clusters.</p>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                    <p className="text-white font-semibold mb-1">Port Consolidation Layer</p>
                    <p className="text-slate-300 text-sm">Houston, Long Beach, Newark/Savannah staging and cross-docking.</p>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                    <p className="text-white font-semibold mb-1">Maritime Fulfillment</p>
                    <p className="text-slate-300 text-sm">Bulk vessel release to designated Sub-Saharan destinations.</p>
                  </div>
                </div>
                <div className="mt-5 h-1 rounded-full bg-gradient-to-r from-orange-500 via-sky-400 to-emerald-400" />
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 border border-slate-700">
                    <Truck className="h-3.5 w-3.5 text-orange-400" /> Land-to-Port Movement
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 border border-slate-700">
                    <Ship className="h-3.5 w-3.5 text-sky-400" /> Ocean Export Routing
                  </span>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 rounded-xl border border-slate-700 bg-slate-950 p-6">
              <h3 className="font-bold text-xl mb-4">Regional Sourcing Index</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-700">
                    <th className="text-left py-2 font-semibold">Hub</th>
                    <th className="text-left py-2 font-semibold">Function</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-800">
                    <td className="py-2 text-white">Pacific Hub</td>
                    <td className="py-2 text-slate-300">West Coast export assembly</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-2 text-white">Gulf Coast Hub</td>
                    <td className="py-2 text-slate-300">Heavy cargo consolidation</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-white">Atlantic Corridor</td>
                    <td className="py-2 text-slate-300">Trans-Atlantic release lanes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Industrial Inventory Index</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm md:text-base bg-white">
              <thead className="bg-slate-100">
                <tr className="text-slate-700">
                  <th className="text-left p-4 font-semibold">Category</th>
                  <th className="text-left p-4 font-semibold">Schedule B Code</th>
                  <th className="text-left p-4 font-semibold">Standard Compliance</th>
                  <th className="text-left p-4 font-semibold">Sourcing Origin</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-200">
                  <td className="p-4 font-medium">Industrial HVAC</td>
                  <td className="p-4">8421.39.0115</td>
                  <td className="p-4">ASHRAE 90.1 / AHRI</td>
                  <td className="p-4">Midwest Corridor</td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="p-4 font-medium">Solar PV Arrays</td>
                  <td className="p-4">8541.43.0000</td>
                  <td className="p-4">UL 1703 / IEC 61215</td>
                  <td className="p-4">Southwest / Pacific</td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="p-4 font-medium">Power Distribution</td>
                  <td className="p-4">8504.23.0000</td>
                  <td className="p-4">IEEE C57.12.00</td>
                  <td className="p-4">Southeast / Atlantic</td>
                </tr>
                <tr className="border-t border-slate-200">
                  <td className="p-4 font-medium">Structural Materials</td>
                  <td className="p-4">7308.90.9590</td>
                  <td className="p-4">ASTM A36 / AISC</td>
                  <td className="p-4">Ohio River Valley</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-slate-100 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Institutional Governance &amp; TBML Protocols</h2>
          <div className="space-y-5 text-slate-700 text-lg leading-relaxed">
            <p>
              Transactions are settled under CIP (Carriage and Insurance Paid To) or DAP (Delivered at Place) terms.
              All capital inflows are categorized as Advanced Procurement Deposits to mitigate currency volatility and
              secure factory-line priority.
            </p>
            <p>
              All exports are screened against the Consolidated Screening List (CSL) per 15 CFR Supplement No. 4. EEI
              filings are managed via the Automated Export System (AES). B2B wires are reported under BOP Code 101
              (General Merchandise).
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Logistics Workflow</h2>
          <div className="grid grid-cols-12 gap-6">
            {[
              {
                title: 'Capital Allocation',
                desc: 'Procurement deposit via SWIFT MT103.',
              },
              {
                title: 'Inventory Locking',
                desc: 'Automated acquisition via NASPEC vendor network.',
              },
              {
                title: 'Logistics Staging',
                desc: 'Cross-docking at designated U.S. Maritime Nodes.',
              },
              {
                title: 'Customs Clearance',
                desc: 'Generation of Bill of Lading (BOL) and AES Internal Transaction Number (ITN).',
              },
            ].map((item, index) => (
              <article key={item.title} className="col-span-12 md:col-span-6 lg:col-span-3 border border-slate-200 rounded-xl bg-slate-50 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold mb-3">Stage {index + 1}</p>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-700 leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#0f172a] text-white border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 text-orange-400 font-semibold uppercase tracking-[0.18em] text-xs mb-4">
            <ShieldCheck className="h-4 w-4" />
            NASPEC Reference
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">NASPEC-REF: US-EXP-B2B-2026-0402</h2>
          <p className="text-slate-300 max-w-4xl leading-relaxed">
            This framework defines standard procurement, consolidation, compliance, and settlement controls for Atlas
            international infrastructure sourcing engagements.
          </p>
        </div>
      </section>

      <section className="py-10 bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
          <div className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-orange-400" />
            Compliance Documentation
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Master Supply Agreement (Draft)
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Schedule B Search
            </a>
            <a href="#" className="hover:text-white transition-colors">
              BIS Regulatory Disclosure
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Marine Cargo Insurance (Institute Cargo Clauses A)
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GlobalProcurement;
