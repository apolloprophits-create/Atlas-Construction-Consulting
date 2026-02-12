import { supabase } from './supabase';

export type ContractorRateSubmission = {
  legalEntityName: string;
  dba?: string;
  rocLicenseNumber: string;
  rocClassification: string;
  licenseExpirationDate: string;
  ownerPrincipalName: string;
  directCell: string;
  businessEmail: string;
  businessAddress: string;
  yearsInBusiness: number;
  commercialCrewCount: string;
  residentialCrewCount: number;
  averageWeeklyInstallCapacity: number;
  currentBacklogWeeks: number;
  w9Url: string;
  coiUrl: string;
  generalLiabilityCoverageAmount: string;
  workersCompPolicyNumber: string;
  bondingCapacity?: string;
  serviceCapabilities: Record<string, unknown>;
  executionRateCard: Record<string, unknown>;
  permitResponsibilityConfirmed: boolean;
  inspectionResponsibilityConfirmed: boolean;
  rateLockConfirmed: boolean;
};

export async function uploadContractorDoc(file: File, folder = 'submissions') {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const objectPath = `${folder}/${timestamp}-${safeName}`;
  const { error } = await supabase.storage.from('contractor-docs').upload(objectPath, file, {
    cacheControl: '3600',
    upsert: false
  });

  if (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from('contractor-docs').getPublicUrl(objectPath);
  return data.publicUrl;
}

export async function submitContractorRateCard(payload: ContractorRateSubmission) {
  const { data, error } = await supabase
    .from('contractors')
    .insert({
      legal_entity_name: payload.legalEntityName,
      dba: payload.dba ?? null,
      roc_license_number: payload.rocLicenseNumber,
      roc_classification: payload.rocClassification,
      license_expiration_date: payload.licenseExpirationDate,
      owner_principal_name: payload.ownerPrincipalName,
      direct_cell: payload.directCell,
      business_email: payload.businessEmail,
      business_address: payload.businessAddress,
      years_in_business: payload.yearsInBusiness,
      commercial_crew_count: payload.commercialCrewCount,
      residential_crew_count: payload.residentialCrewCount,
      average_weekly_install_capacity: payload.averageWeeklyInstallCapacity,
      current_backlog_weeks: payload.currentBacklogWeeks,
      w9_url: payload.w9Url,
      coi_url: payload.coiUrl,
      general_liability_coverage_amount: payload.generalLiabilityCoverageAmount,
      workers_comp_policy_number: payload.workersCompPolicyNumber,
      bonding_capacity: payload.bondingCapacity ?? null,
      service_capabilities: payload.serviceCapabilities,
      execution_rate_card: payload.executionRateCard,
      permit_responsibility_confirmed: payload.permitResponsibilityConfirmed,
      inspection_responsibility_confirmed: payload.inspectionResponsibilityConfirmed,
      rate_lock_confirmed: payload.rateLockConfirmed,
      status: 'pending_review'
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to submit rate card');
  }

  return data.id as string;
}

export async function getContractorsForReview() {
  const { data, error } = await supabase
    .from('contractors')
    .select(
      'id, created_at, status, legal_entity_name, roc_license_number, owner_principal_name, direct_cell, business_email, business_address'
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to load contractors: ${error.message}`);
  }

  return data ?? [];
}

export async function approveContractorAndSendAgreement(contractorId: string) {
  const { error: updateError } = await supabase
    .from('contractors')
    .update({
      status: 'approved',
      approved_at: new Date().toISOString()
    })
    .eq('id', contractorId);

  if (updateError) {
    throw new Error(`Failed to approve contractor: ${updateError.message}`);
  }

  const response = await fetch('/api/contractor-send-agreement', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contractorId })
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || 'Failed to send agreement');
  }
}

export async function rejectContractor(contractorId: string) {
  const { error } = await supabase
    .from('contractors')
    .update({ status: 'rejected' })
    .eq('id', contractorId);
  if (error) {
    throw new Error(`Failed to reject contractor: ${error.message}`);
  }
}

