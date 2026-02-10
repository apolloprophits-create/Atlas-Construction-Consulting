import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { INDUSTRIES } from '../constants';
import Button from './ui/Button';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  }, [location]);

  // Organization Structured Data
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Atlas Construction Intelligence",
    "url": "https://atlasconstructionintelligence.com",
    "description": "Independent construction intelligence and price advocacy for Phoenix-area homeowners.",
    "areaServed": [
      { "@type": "City", "name": "Phoenix" },
      { "@type": "City", "name": "Scottsdale" },
      { "@type": "City", "name": "Mesa" }
    ]
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
            ? 'bg-white/95 backdrop-blur-md border-brand-border py-2 md:py-3 shadow-sm' 
            : 'bg-white border-transparent py-3 md:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/images/atlas-logo.png"
                alt="Atlas Construction Intelligence logo"
                className="h-24 sm:h-28 md:h-32 lg:h-40 w-auto object-contain"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center gap-4">
                {Object.values(INDUSTRIES).map((ind) => (
                  <Link
                    key={ind.slug}
                    to={`/${ind.slug}`}
                    className="font-medium text-xs text-brand-secondary hover:text-brand-dark transition-colors whitespace-nowrap"
                  >
                    {ind.name}
                  </Link>
                ))}
              </div>
              <Link to="/about" className="font-medium text-sm text-brand-secondary hover:text-brand-dark transition-colors">About</Link>
              <Link to="/how-it-works" className="font-medium text-sm text-brand-secondary hover:text-brand-dark transition-colors">How It Works</Link>
              <Link to="/request-audit">
                <Button as="span" variant="primary" size="sm">
                  Request Price Audit
                </Button>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button 
              type="button"
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
                    to={`/${ind.slug}`}
                    className="text-sm font-medium text-brand-dark py-2 px-3 bg-slate-50 rounded-md"
                  >
                    {ind.name}
                  </Link>
                ))}
             </div>
             <div className="border-t border-brand-border pt-4 flex flex-col gap-4">
                <Link to="/about" className="text-base font-medium text-brand-dark">About</Link>
                <Link to="/how-it-works" className="text-base font-medium text-brand-dark">How It Works</Link>
                <Link to="/request-audit" className="block">
                  <Button as="span" fullWidth>Request Audit</Button>
                </Link>
             </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-[130px] sm:pt-[150px] md:pt-[180px] lg:pt-[210px]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-white pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold tracking-tight mb-4">ATLAS</div>
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
                  <li key={ind.slug}><Link to={`/${ind.slug}`} className="hover:text-white transition-colors">{ind.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About Atlas</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">Our Process</Link></li>
                <li><Link to="/what-is-a-construction-price-audit" className="hover:text-white transition-colors">What is a Price Audit?</Link></li>
                <li><Link to="/request-audit" className="hover:text-white transition-colors">Request Audit</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Atlas Construction Intelligence. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
