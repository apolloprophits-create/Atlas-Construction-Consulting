import React from 'react';
import { Link } from 'react-router-dom';
import { INDUSTRIES, ICON_MAP } from '../constants';
import { ArrowRight } from 'lucide-react';

const IndustriesIndex: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
           <h1 className="text-4xl font-bold text-brand-dark mb-6">Construction Intelligence by Sector</h1>
           <p className="text-xl text-brand-secondary max-w-2xl mx-auto">
             Atlas provides specialized valuation models and permit auditing for the following residential trades in Maricopa County.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.values(INDUSTRIES).map((industry) => {
              const Icon = ICON_MAP[industry.iconName];
              return (
                <Link 
                  key={industry.slug} 
                  to={`/${industry.slug}`}
                  className="group bg-white p-8 rounded-xl shadow-sm border border-brand-border hover:shadow-lg hover:border-brand-accent transition-all duration-300 flex flex-col h-full"
                >
                  <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-brand-dark mb-6 group-hover:bg-brand-accent group-hover:text-white transition-colors">
                    {Icon && <Icon className="w-7 h-7" />}
                  </div>
                  <h3 className="font-bold text-2xl text-brand-dark mb-3">{industry.name}</h3>
                  <p className="text-brand-secondary mb-6 flex-grow leading-relaxed">
                    {industry.heroSubheadline}
                  </p>
                  <div className="flex items-center text-brand-accent font-bold group-hover:translate-x-2 transition-transform mt-auto">
                    View Audit Details <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default IndustriesIndex;