import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import FAQList from '../components/FAQList';
import { ArrowRight, Building2, ChartNoAxesColumn, DollarSign, ShieldCheck, TrendingUp } from 'lucide-react';

const HOME_FAQS = [
  {
    question: 'Is Atlas a licensed contractor?',
    answer:
      "No. Atlas Construction Intelligence is a project management and owner's representation platform. Construction labor is performed by licensed, bonded, and insured trade partners.",
  },
  {
    question: 'How does Atlas reduce project cost?',
    answer:
      'We use market intelligence, fixed partner rate cards, and direct-to-labor routing to remove sales layers and pricing buffers that commonly inflate retail bids.',
  },
  {
    question: 'Who signs the labor contract?',
    answer:
      'The property owner contracts directly with the licensed trade partner. Atlas manages scope, schedule, permit coordination, and quality control through completion.',
  },
];

const Home: React.FC = () => {
  useEffect(() => {
    document.title = 'Construction Execution at True Fair Market Value | Atlas Construction Intelligence';
    const metaDescription = document.querySelector('meta[name="description"]');
    const descContent =
      "Atlas Construction Intelligence manages execution at true fair market value through proprietary market data, direct-to-labor bidding, and vetted ROC-licensed partner networks across Arizona.";
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
    <>
      <section className="relative bg-brand-surface border-b border-brand-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Live Market Intelligence
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark tracking-tight leading-tight mb-6">
                The General Contractor Experience.
                <br />
                <span className="text-brand-accent">Without the General Contractor Markup.</span>
              </h1>
              <p className="text-lg md:text-xl text-brand-secondary mb-8 leading-relaxed max-w-2xl">
                Atlas Construction Intelligence is Arizona&apos;s premier Project Management and Owner&apos;s Representation platform.
                We utilize proprietary intelligence to vet, bid, and manage your project directly with top licensed trades,
                so your capital goes to execution instead of sales overhead.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/request-audit">
                  <Button as="span" size="lg">Get a Fair Market Proposal</Button>
                </Link>
                <Link to="/how-it-works">
                  <Button as="span" variant="outline" size="lg">How the Atlas Model Works</Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-brand-secondary">
                Commercial HVAC • High-Efficiency Upgrades • Investor CapEx
              </p>
            </div>

            <div className="md:justify-self-end w-full max-w-xl">
              <div className="relative rounded-2xl border border-brand-border bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] overflow-hidden">
                <img
                  src="/images/intelligence.png"
                  alt="Construction intelligence model"
                  className="w-full h-auto block"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-dark mb-4">The Atlas Efficiency Model</h2>
            <p className="text-brand-secondary max-w-3xl mx-auto text-lg">
              We replaced pricing guesswork with measurable execution intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-7 rounded-xl border border-slate-200">
              <ChartNoAxesColumn className="w-8 h-8 text-brand-accent mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-3">1. Market Intelligence</h3>
              <p className="text-brand-secondary leading-relaxed">
                We monitor live Arizona execution rates and permit-backed market signals. A 10-ton RTU, chiller scope,
                or roofing package is priced against current field reality, not sales scripts.
              </p>
            </div>
            <div className="bg-slate-50 p-7 rounded-xl border border-slate-200">
              <DollarSign className="w-8 h-8 text-brand-accent mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-3">2. Direct-to-Labor Route</h3>
              <p className="text-brand-secondary leading-relaxed">
                Traditional bids carry added sales commissions, advertising costs, and office overhead. Atlas routes projects
                to licensed partners at fixed execution rates so your budget funds labor and equipment.
              </p>
            </div>
            <div className="bg-slate-50 p-7 rounded-xl border border-slate-200">
              <ShieldCheck className="w-8 h-8 text-brand-accent mb-4" />
              <h3 className="text-xl font-bold text-brand-dark mb-3">3. Managed Execution</h3>
              <p className="text-brand-secondary leading-relaxed">
                You contract directly with the licensed trade. Atlas manages scope, schedule, permit coordination,
                inspections, and quality checkpoints before payout.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-dark text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">We Replaced the Salesman with an Algorithm.</h2>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto">
              Retail pricing often carries large non-execution costs. The Atlas model strips those layers so you keep more of your capital in the project itself.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-red-300">Retail Contractor ($18,500)</h3>
              <ul className="space-y-3 text-slate-200">
                <li className="flex justify-between"><span>Sales Commission</span><span className="font-mono">$3,700</span></li>
                <li className="flex justify-between"><span>Marketing & Ads</span><span className="font-mono">$2,775</span></li>
                <li className="flex justify-between"><span>Office Overhead</span><span className="font-mono">$2,775</span></li>
                <li className="flex justify-between text-green-300 font-semibold"><span>Labor & Equipment</span><span className="font-mono">$9,250</span></li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-blue-300">Atlas Intelligence Model ($14,500)</h3>
              <ul className="space-y-3 text-slate-200">
                <li className="flex justify-between"><span>Project Management Fee</span><span className="font-mono">$1,450</span></li>
                <li className="flex justify-between text-green-300 font-semibold"><span>Labor & Equipment</span><span className="font-mono">$13,050</span></li>
                <li className="mt-6 pt-4 border-t border-slate-700 flex justify-between text-white font-bold text-xl">
                  <span>Total Savings Kept by Owner</span><span className="font-mono text-brand-accent">$4,000</span>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-center text-sm text-slate-400 mt-8">
            You pay for steel, labor, and results. Not for billboards.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="rounded-2xl border border-slate-200 p-8 bg-slate-50">
              <h3 className="text-2xl font-bold text-brand-dark mb-4">For Homeowners: Protect Your Equity</h3>
              <p className="text-brand-secondary leading-relaxed">
                A major mechanical or structural upgrade is a high-dollar decision. Atlas keeps pricing tied to fair market
                execution so more of your spend becomes actual property value.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-8 bg-slate-50">
              <h3 className="text-2xl font-bold text-brand-dark mb-4">For Investors: Access Wholesale Execution</h3>
              <p className="text-brand-secondary leading-relaxed">
                We aggregate project demand and maintain fixed partner rate cards, giving portfolios a standardized,
                investor-grade deployment lane for CapEx across assets.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-dark mb-4">High-Value Project Execution</h2>
            <p className="text-brand-secondary max-w-3xl mx-auto text-lg">
              We manage licensed partner deployment across Arizona for complex residential and commercial scope.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Commercial HVAC',
                copy: '10-Ton to 25-Ton rooftop units, chillers, and controls integration with permit and inspection coordination.',
              },
              {
                title: 'Precision Heating',
                copy: 'High-efficiency boiler systems and geothermal-ready projects managed to detailed technical scope.',
              },
              {
                title: 'Structural Assets',
                copy: 'Commercial roofing and large concrete scopes routed through licensed partner teams and quality checkpoints.',
              },
              {
                title: 'Energy Infrastructure',
                copy: 'Electrical main upgrades and energy-adjacent infrastructure planning for high-value properties.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-6 h-6 text-brand-accent" />
                  <h3 className="font-bold text-xl text-brand-dark">{item.title}</h3>
                </div>
                <p className="text-brand-secondary leading-relaxed">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-dark text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp className="w-10 h-10 mx-auto mb-5 text-brand-accent" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Precision Pricing. No Buffer Required.</h2>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Most contractors pad bids because they do not track true execution rates in real time. Atlas uses a live market model,
            so your proposal is lean, defensible, and built for execution.
          </p>
        </div>
      </section>

      <FAQList title="Common Questions" items={HOME_FAQS} className="bg-white border-t border-brand-border" />

      <section className="py-20 bg-brand-accent text-white text-center" id="request-audit-form">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Stop Negotiating. Start Executing.</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            See what your project should actually cost based on live market intelligence.
          </p>
          <Link to="/request-audit">
            <Button as="span" size="lg" variant="outline" className="!bg-white !text-brand-accent !border-white hover:!bg-slate-100">
              Get Your Bid <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
