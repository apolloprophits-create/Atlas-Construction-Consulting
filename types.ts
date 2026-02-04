export interface FAQItem {
  question: string;
  answer: string;
}

export interface IndustryData {
  slug: string;
  name: string;
  seoTitle: string;
  seoDescription: string;
  heroHeadline: string;
  heroSubheadline: string;
  overpricedAnalysis: string[];
  redFlags: string[];
  auditPoints: string[];
  processSteps: string[];
  ctaHeadline: string;
  ctaButtonText: string;
  iconName: string; // Mapping string to Lucide icon
  faqs: FAQItem[];
}

export enum FormStatus {
  IDLE = 'IDLE',
  SUBMITTING = 'SUBMITTING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface LeadFormState {
  name: string;
  phone: string;
  email: string;
  zipCode: string;
  projectType: string;
  contractorName?: string;
  notes?: string;
}

export interface NavItem {
  label: string;
  path: string;
  isButton?: boolean;
}

export interface AuditRecord {
  id: string;
  createdAt: string;
  homeownerName: string;
  homeownerPhone?: string;
  industry: string;
  zip: string;
  permitIssuedDate: string;
  permittedValuation: number;
  marketMedian: number;
  deviationPercent: number;
  pricingSignal: 'green' | 'yellow' | 'red';
  findings: string[];
  whatThisMeans: string;
  recommendedActions: string[];
}