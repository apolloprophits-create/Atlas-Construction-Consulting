import { AuditRecord, LeadFormState } from '../types';

// Keys for localStorage
const LEADS_KEY = 'atlas_leads';
const AUDITS_KEY = 'atlas_audits';

export const mockDb = {
  // Leads
  saveLead: (lead: LeadFormState): Promise<void> => {
    return new Promise((resolve) => {
      const existing = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
      const newLead = { ...lead, submittedAt: new Date().toISOString() };
      localStorage.setItem(LEADS_KEY, JSON.stringify([...existing, newLead]));
      
      // Simulate network delay
      setTimeout(resolve, 800);
    });
  },

  getLeads: (): any[] => {
    return JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
  },

  // Audits
  createAudit: (data: Omit<AuditRecord, 'id' | 'createdAt'>): Promise<string> => {
    return new Promise((resolve) => {
      const existing = JSON.parse(localStorage.getItem(AUDITS_KEY) || '{}');
      const id = crypto.randomUUID();
      const newAudit: AuditRecord = {
        ...data,
        id,
        createdAt: new Date().toISOString()
      };
      
      existing[id] = newAudit;
      localStorage.setItem(AUDITS_KEY, JSON.stringify(existing));
      
      setTimeout(() => resolve(id), 500);
    });
  },

  getAudit: (id: string): Promise<AuditRecord | null> => {
    return new Promise((resolve) => {
      const existing = JSON.parse(localStorage.getItem(AUDITS_KEY) || '{}');
      setTimeout(() => resolve(existing[id] || null), 300);
    });
  }
};