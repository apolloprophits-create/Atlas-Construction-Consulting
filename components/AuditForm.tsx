import React, { useState } from 'react';
import { FormStatus, LeadFormState } from '../types';
import Button from './ui/Button';
import { X, CheckCircle, Upload, AlertCircle } from 'lucide-react';
import { mockDb } from '../lib/mockDb';

interface AuditFormProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialIndustry?: string;
  embedded?: boolean; // New prop to allow inline rendering
}

const AuditForm: React.FC<AuditFormProps> = ({ 
  isOpen = true, 
  onClose, 
  initialIndustry = 'General',
  embedded = false
}) => {
  const [status, setStatus] = useState<FormStatus>(FormStatus.IDLE);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState<LeadFormState>({
    name: '',
    phone: '',
    email: '',
    zipCode: '',
    projectType: initialIndustry,
    contractorName: '',
    notes: ''
  });

  // If used as a modal and not open, return null
  if (!embedded && !isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(FormStatus.SUBMITTING);
    setSubmitError('');
    
    try {
      const leadId = await Promise.race<string>([
        mockDb.saveLead(formData),
        new Promise<string>((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  'Request timed out while saving to Supabase. Check Vercel env vars and Supabase table/policies.'
                )
              ),
            15000
          )
        )
      ]);

      // Fire-and-forget welcome email chain start (handled server-side).
      fetch('/api/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          name: formData.name,
          email: formData.email,
          projectType: formData.projectType
        })
      }).catch((error) => console.error('Welcome email trigger failed:', error));
      
      // Analytics Placeholder
      if (typeof window !== 'undefined') {
        // @ts-ignore
        window.dataLayer = window.dataLayer || [];
        // @ts-ignore
        window.dataLayer.push({ 
          event: "lead_submit", 
          industry: formData.projectType, 
          zip: formData.zipCode 
        });
      }

      setStatus(FormStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'We could not submit your request right now.';
      setSubmitError(message);
      setStatus(FormStatus.ERROR);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (!embedded && onClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (status === FormStatus.SUCCESS) {
    const SuccessContent = (
      <div className={`bg-white rounded-xl ${!embedded && 'shadow-2xl max-w-md'} w-full p-8 text-center animate-in fade-in zoom-in duration-300`}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-brand-dark mb-2">Thank You</h3>
        <p className="text-brand-secondary mb-8">
          Thank you for your submission. A partner will be in contact with you shortly regarding your {formData.projectType} request.
        </p>
        {onClose && <Button onClick={onClose} fullWidth>Return to Site</Button>}
      </div>
    );

    if (embedded) return SuccessContent;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/80 backdrop-blur-sm p-4" onClick={handleBackdropClick}>
        {SuccessContent}
      </div>
    );
  }

  const FormContent = (
    <div className={`bg-white rounded-xl ${!embedded ? 'shadow-2xl max-w-lg relative my-8' : 'border border-brand-border'} w-full animate-in fade-in slide-in-from-bottom-8 duration-300`}>
      {!embedded && onClose && (
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-secondary hover:text-brand-dark transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <div className="p-8 border-b border-brand-border bg-slate-50 rounded-t-xl">
        <h2 className="text-2xl font-bold text-brand-dark">Request a Price Audit</h2>
        <p className="text-sm text-brand-secondary mt-1">Independent analysis. No contractor commissions.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-secondary mb-1">Full Name *</label>
            <input
              required
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-brand-secondary mb-1">Phone *</label>
            <input
              required
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all"
              placeholder="(602) 555-0123"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-secondary mb-1">Email Address *</label>
          <input
            required
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all"
            placeholder="jane@example.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-brand-secondary mb-1">Zip Code *</label>
            <input
              required
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all"
              placeholder="85001"
            />
          </div>
          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-brand-secondary mb-1">Industry *</label>
            <select
              required
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all bg-white"
            >
              <option value="General">General / Not Listed</option>
              <option value="HVAC">HVAC</option>
              <option value="Solar">Solar</option>
              <option value="Pools">Pools</option>
              <option value="Roofing">Roofing</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Additions & Remodels">Additions & Remodels</option>
              <option value="Concrete / Flatwork">Concrete / Flatwork</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="contractorName" className="block text-sm font-medium text-brand-secondary mb-1">Contractor Name (Optional)</label>
          <input
            type="text"
            id="contractorName"
            name="contractorName"
            value={formData.contractorName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all"
            placeholder="Who provided the quote?"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-brand-secondary mb-1">Notes / Details (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none transition-all"
            placeholder="Any specific concerns about the price or scope?"
          />
        </div>
        
        <div className="p-4 border border-dashed border-brand-border rounded-lg bg-slate-50 text-center">
            <div className="flex flex-col items-center justify-center cursor-pointer">
              <Upload className="w-6 h-6 text-brand-secondary mb-2" />
              <span className="text-xs text-brand-secondary font-medium">Upload Quote or Photos (Optional)</span>
              <input type="file" className="hidden" />
              <span className="text-[10px] text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</span>
            </div>
        </div>

        <div className="pt-2">
          <Button 
            type="submit" 
            fullWidth 
            disabled={status === FormStatus.SUBMITTING}
            variant="secondary"
          >
            {status === FormStatus.SUBMITTING ? 'Processing...' : 'Request Price Audit'}
          </Button>
          {status === FormStatus.ERROR && (
            <p className="text-sm text-red-600 text-center mt-3">
              {submitError || 'We could not submit your request right now. Please try again in a moment.'}
            </p>
          )}
          <p className="text-xs text-center text-slate-400 mt-3 flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Your data is never sold to lead brokers.
          </p>
        </div>
      </form>
    </div>
  );

  if (embedded) return FormContent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/80 backdrop-blur-sm p-4 overflow-y-auto" onClick={handleBackdropClick}>
      {FormContent}
    </div>
  );
};

export default AuditForm;
