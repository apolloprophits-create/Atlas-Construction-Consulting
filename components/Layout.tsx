import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ShieldCheck } from 'lucide-react';
import { INDUSTRIES } from '../constants';
import Button from './ui/Button';
import AuditForm from './AuditForm';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(false);
  }, [location]);

  // Organization Structured Data
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Atlas Construction Consulting",
    "url": "https://atlasconsulting.phx",
    "description": "Independent construction intelligence and price advocacy for Phoenix homeowners.",
    "areaServed": {
      "@type": "City",
      "name": "Phoenix"
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-dark">
      <script type="application/ld+json">
        {JSON.stringify(orgSchema)}
      </script>

      {/* Navigation */}
      <nav 
        className={`fixed w-full z-40 transition-all duration-300 border-b ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md border-brand-border py-3 shadow-sm' 
            : 'bg-white border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-brand-dark p-1.5 rounded-lg group-hover:bg-brand-accent transition-colors">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-none tracking-tight text-brand-dark">ATLAS</span>
                <span className="text-[10px] font-semibold tracking-widest text-brand-secondary uppercase">Construction Consulting</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown(true)}
                onMouseLeave={() => setActiveDropdown(false)}
              >
                <button className="flex items-center gap-1 font-medium text-sm text-brand-secondary hover:text-brand-dark py-2">
                  Industries <ChevronDown className="w-4 h-4" />
                </button>
                {/* Mega Menu / Dropdown */}
                {activeDropdown && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-xl shadow-xl border border-brand-border p-6 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                     {Object.values(INDUSTRIES).map((ind) => (
                       <Link 
                        key={ind.slug} 
                        to={`/industries/${ind.slug}`}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                       >
                         <div className="mt-1 text-brand-accent">
                            {/* Simple dot or icon could go here */}
                            <div className="w-2 h-2 rounded-full bg-brand-accent" />
                         </div>
                         <div>
                           <div className="font-semibold text-brand-dark text-sm">{ind.name}</div>
                           <div className="text-xs text-brand-secondary leading-tight mt-0.5 line-clamp-1">{ind.heroHeadline}</div>
                         </div>
                       </Link>
                     ))}
                  </div>
                )}
              </div>
              <Link to="/about" className="font-medium text-sm text-brand-secondary hover:text-brand-dark transition-colors">About</Link>
              <Link to="/how-it-works" className="font-medium text-sm text-brand-secondary hover:text-brand-dark transition-colors">How It Works</Link>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => setIsAuditModalOpen(true)}
              >
                Request Price Audit
              </Button>
            </div>

            {/* Mobile Toggle */}
            <button 
              className="md:hidden text-brand-dark"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-brand-border shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-5">
             <div className="font-semibold text-brand-secondary text-xs uppercase tracking-wider mb-2">Industries</div>
             <div className="grid grid-cols-2 gap-2 mb-4">
                {Object.values(INDUSTRIES).map((ind) => (
                  <Link 
                    key={ind.slug} 
                    to={`/industries/${ind.slug}`}
                    className="text-sm font-medium text-brand-dark py-2 px-3 bg-slate-50 rounded-md"
                  >
                    {ind.name}
                  </Link>
                ))}
             </div>
             <div className="border-t border-brand-border pt-4 flex flex-col gap-4">
                <Link to="/about" className="text-base font-medium text-brand-dark">About</Link>
                <Link to="/how-it-works" className="text-base font-medium text-brand-dark">How It Works</Link>
                <Button fullWidth onClick={() => setIsAuditModalOpen(true)}>Request Audit</Button>
             </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-[80px]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-white pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-8 h-8 text-brand-accent" />
                <span className="text-2xl font-bold tracking-tight">ATLAS</span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed">
                Construction Intelligence. Price Advocacy. Market Transparency.
                <br />
                We provide independent data analytics to protect Phoenix homeowners from overpaying on major renovations.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Industries</h4>
              <ul className="space-y-2 text-slate-400">
                {Object.values(INDUSTRIES).slice(0, 5).map(ind => (
                  <li key={ind.slug}><Link to={`/industries/${ind.slug}`} className="hover:text-white transition-colors">{ind.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About Atlas</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">Our Process</Link></li>
                <li><Link to="/what-is-a-construction-price-audit" className="hover:text-white transition-colors">What is a Price Audit?</Link></li>
                <li><button onClick={() => setIsAuditModalOpen(true)} className="hover:text-white transition-colors">Request Audit</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Atlas Construction Consulting. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Audit Modal */}
      <AuditForm 
        isOpen={isAuditModalOpen} 
        onClose={() => setIsAuditModalOpen(false)} 
      />
    </div>
  );
};

export default Layout;