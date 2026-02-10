import { AuditRecord, LeadFormState } from '../types';
import { supabase } from './supabase';

type LeadRow = {
  name: string;
  phone: string;
  email: string;
  zip_code: string;
  project_type: string;
  contractor_name: string | null;
  notes: string | null;
  submitted_at: string;
};

type AuditRow = {
  id: string;
  created_at: string;
  homeowner_name: string;
  homeowner_phone: string | null;
  industry: string;
  zip: string;
  permit_issued_date: string;
  permitted_valuation: number;
  market_median: number;
  deviation_percent: number;
  pricing_signal: 'green' | 'yellow' | 'red';
  findings: string[] | null;
  what_this_means: string;
  recommended_actions: string[] | null;
};

type PublicAuditRow = {
  id: string;
  created_at: string;
  homeowner_name: string;
  industry: string;
  zip: string;
  permit_issued_date: string;
  permitted_valuation: number;
  market_median: number;
  deviation_percent: number;
  pricing_signal: 'green' | 'yellow' | 'red';
  findings: string[] | null;
  what_this_means: string;
  recommended_actions: string[] | null;
};

const mapLeadRow = (row: LeadRow) => ({
  name: row.name,
  phone: row.phone,
  email: row.email,
  zipCode: row.zip_code,
  projectType: row.project_type,
  contractorName: row.contractor_name ?? '',
  notes: row.notes ?? '',
  submittedAt: row.submitted_at
});

const mapAuditRow = (row: AuditRow): AuditRecord => ({
  id: row.id,
  createdAt: row.created_at,
  homeownerName: row.homeowner_name,
  homeownerPhone: row.homeowner_phone ?? '',
  industry: row.industry,
  zip: row.zip,
  permitIssuedDate: row.permit_issued_date,
  permittedValuation: row.permitted_valuation,
  marketMedian: row.market_median,
  deviationPercent: row.deviation_percent,
  pricingSignal: row.pricing_signal,
  findings: row.findings ?? [],
  whatThisMeans: row.what_this_means,
  recommendedActions: row.recommended_actions ?? []
});

const mapPublicAuditRow = (row: PublicAuditRow): AuditRecord => ({
  id: row.id,
  createdAt: row.created_at,
  homeownerName: row.homeowner_name,
  homeownerPhone: '',
  industry: row.industry,
  zip: row.zip,
  permitIssuedDate: row.permit_issued_date,
  permittedValuation: Number(row.permitted_valuation),
  marketMedian: Number(row.market_median),
  deviationPercent: row.deviation_percent,
  pricingSignal: row.pricing_signal,
  findings: row.findings ?? [],
  whatThisMeans: row.what_this_means,
  recommendedActions: row.recommended_actions ?? []
});

const buildLeadInsertErrorMessage = (error: { code?: string; message?: string } | null): string => {
  const raw = error?.message ?? '';
  const lower = raw.toLowerCase();

  if (lower.includes('relation') && lower.includes('leads') && lower.includes('does not exist')) {
    return 'Supabase table "leads" was not found. Run supabase/schema.sql in your Supabase SQL Editor, then redeploy Vercel.';
  }

  if (lower.includes('row-level security') || lower.includes('policy')) {
    return 'Supabase blocked the insert due to RLS policy. Run supabase/schema.sql so anon insert policy for "leads" is created.';
  }

  if (lower.includes('invalid api key') || lower.includes('jwt') || lower.includes('permission denied')) {
    return 'Supabase credentials are invalid for this project. Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.';
  }

  if (error?.code) {
    return `Lead submit failed (${error.code}): ${raw || 'Unknown Supabase error.'}`;
  }

  if (raw) {
    return `Lead submit failed: ${raw}`;
  }

  return 'Lead submit failed: no row returned from Supabase. Verify table, RLS policy, and Vercel Supabase env vars.';
};

export const mockDb = {
  // Leads
  saveLead: async (lead: LeadFormState): Promise<string> => {
    const { data, error } = await supabase
      .from('leads')
      .insert({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      zip_code: lead.zipCode,
      project_type: lead.projectType,
      contractor_name: lead.contractorName ?? null,
      notes: lead.notes ?? null
      })
      .select('id')
      .single();

    if (error || !data?.id) {
      throw new Error(buildLeadInsertErrorMessage(error));
    }

    return data.id as string;
  },

  getLeads: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('leads')
      .select('name, phone, email, zip_code, project_type, contractor_name, notes, submitted_at')
      .order('submitted_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to load leads: ${error.message}`);
    }

    return (data as LeadRow[] | null)?.map(mapLeadRow) ?? [];
  },

  // Audits
  createAudit: async (data: Omit<AuditRecord, 'id' | 'createdAt'>): Promise<string> => {
    const payload = {
      homeowner_name: data.homeownerName,
      homeowner_phone: data.homeownerPhone ?? null,
      industry: data.industry,
      zip: data.zip,
      permit_issued_date: data.permitIssuedDate,
      permitted_valuation: data.permittedValuation,
      market_median: data.marketMedian,
      deviation_percent: data.deviationPercent,
      pricing_signal: data.pricingSignal,
      findings: data.findings,
      what_this_means: data.whatThisMeans,
      recommended_actions: data.recommendedActions
    };

    const { data: inserted, error } = await supabase
      .from('audits')
      .insert(payload)
      .select('id')
      .single();

    if (error || !inserted?.id) {
      throw new Error(`Failed to create audit: ${error?.message ?? 'Unknown insert error'}`);
    }

    return inserted.id as string;
  },

  getAudit: async (id: string): Promise<AuditRecord | null> => {
    const { data, error } = await supabase.rpc('get_public_audit', { audit_id: id });

    if (error) {
      throw new Error(`Failed to load audit: ${error.message}`);
    }

    const row = ((data as PublicAuditRow[] | null) ?? [])[0];
    if (!row) {
      return null;
    }

    return mapPublicAuditRow(row);
  }
};
