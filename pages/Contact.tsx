import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
  return (
    <div className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-brand-dark mb-8 text-center">Contact Atlas</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-brand-surface p-12 rounded-2xl border border-brand-border">
           <div className="space-y-8">
             <div>
               <h3 className="text-lg font-bold text-brand-dark mb-4">Get in Touch</h3>
               <p className="text-brand-secondary mb-6">
                 We are an analytics firm, not a call center. For the fastest response, please use the audit request form or email us.
               </p>
             </div>

             <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
                     <Mail className="w-5 h-5 text-brand-accent" />
                   </div>
                   <div>
                     <div className="text-xs text-slate-500 uppercase font-bold">Email</div>
                     <div className="text-brand-dark font-medium">analysis@atlasconsulting.phx</div>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
                     <MapPin className="w-5 h-5 text-brand-accent" />
                   </div>
                   <div>
                     <div className="text-xs text-slate-500 uppercase font-bold">Office</div>
                     <div className="text-brand-dark font-medium">Scottsdale, AZ (By Appointment)</div>
                   </div>
                </div>
             </div>
           </div>

           <div className="bg-white p-6 rounded-xl border border-brand-border shadow-sm">
              <h3 className="font-bold text-brand-dark mb-4">Need an urgent audit?</h3>
              <p className="text-sm text-brand-secondary mb-6">
                If you have a contractor waiting for a signature, use our priority request form.
              </p>
              <Link to="/request-audit" className="block">
                <Button as="span" fullWidth>Request Priority Audit</Button>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
