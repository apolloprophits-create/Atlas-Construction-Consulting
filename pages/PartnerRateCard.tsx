import React, { useMemo, useState } from 'react';
import Button from '../components/ui/Button';
import { submitContractorRateCard, uploadContractorDoc } from '../lib/contractorsDb';

const commercialCrewOptions = ['1', '2', '3-5', '6-10', '10+'];

type FormState = {
  legalEntityName: string;
  dba: string;
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
  generalLiabilityCoverageAmount: string;
  workersCompPolicyNumber: string;
  bondingCapacity: string;
  excludesResidential: string;
  excludesCommercial: string;
  split22: string;
  split3: string;
  split4: string;
  split5: string;
  heatPump25: string;
  rtu5: string;
  rtu7: string;
  rtu10: string;
  rtu25: string;
  adderCrane: string;
  adderCurbAdapter: string;
  adderElectrical: string;
  adderDuctTransition: string;
  adderAfterHoursPercent: string;
  adderInspectionRevisit: string;
  permitResponsibilityConfirmed: boolean;
  inspectionResponsibilityConfirmed: boolean;
  rateLockConfirmed: boolean;
};

const currencyFields: (keyof FormState)[] = [
  'split22',
  'split3',
  'split4',
  'split5',
  'heatPump25',
  'rtu5',
  'rtu7',
  'rtu10',
  'rtu25',
  'adderCrane',
  'adderCurbAdapter',
  'adderElectrical',
  'adderDuctTransition',
  'adderInspectionRevisit'
];

const toCurrency = (raw: string) => {
  const num = Number(String(raw).replace(/[^0-9.]/g, ''));
  if (Number.isNaN(num) || num <= 0) return '';
  return `$${num.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
};

const normalizeMoney = (raw: string) => String(raw || '').replace(/[$,\s]/g, '');

const formatPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const SectionTitle: React.FC<{ step: number; title: string }> = ({ step, title }) => (
  <h2 className="font-bold text-lg mb-4 text-brand-dark">
    Step {step}: {title}
  </h2>
);

const FieldLabel: React.FC<{ label: string; required?: boolean; help?: string }> = ({ label, required, help }) => (
  <label className="block text-sm font-semibold text-slate-700 mb-1">
    {label} {required && <span className="text-red-600">*</span>}
    {help && <span className="block text-xs font-normal text-slate-500 mt-1">{help}</span>}
  </label>
);

const PartnerRateCard: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    legalEntityName: '',
    dba: '',
    rocLicenseNumber: '',
    rocClassification: 'C-39',
    licenseExpirationDate: '',
    ownerPrincipalName: '',
    directCell: '',
    businessEmail: '',
    businessAddress: '',
    yearsInBusiness: 1,
    commercialCrewCount: '1',
    residentialCrewCount: 1,
    averageWeeklyInstallCapacity: 1,
    currentBacklogWeeks: 0,
    generalLiabilityCoverageAmount: '',
    workersCompPolicyNumber: '',
    bondingCapacity: '',
    excludesResidential: '',
    excludesCommercial: '',
    split22: '',
    split3: '',
    split4: '',
    split5: '',
    heatPump25: '',
    rtu5: '',
    rtu7: '',
    rtu10: '',
    rtu25: '',
    adderCrane: '',
    adderCurbAdapter: '',
    adderElectrical: '',
    adderDuctTransition: '',
    adderAfterHoursPercent: '',
    adderInspectionRevisit: '',
    permitResponsibilityConfirmed: false,
    inspectionResponsibilityConfirmed: false,
    rateLockConfirmed: false
  });

  const [serviceCapabilities, setServiceCapabilities] = useState<Record<string, boolean>>({
    residential_split_changeout: false,
    residential_heat_pump: false,
    residential_gas_furnace: false,
    commercial_rtu_5: false,
    commercial_rtu_6_10: false,
    commercial_rtu_10_25: false,
    commercial_duct_mods: false,
    commercial_electrical_disconnect: false,
    emergency_24_hour: false,
    emergency_standard_hours: false,
    procurement_partner_supplies: false,
    procurement_atlas_supplies: false,
    procurement_cost_passthrough: false,
    includes_remove_existing_condenser: false,
    includes_remove_existing_air_handler: false,
    includes_install_new_condenser: false,
    includes_install_new_air_handler: false,
    includes_reconnect_existing_duct: false,
    includes_replace_pad: false,
    includes_standard_electrical_whip: false,
    includes_startup_test: false,
    heat_pump_includes_thermostat: false,
    heat_pump_includes_low_voltage: false,
    commercial_includes_set_existing_curb: false,
    commercial_includes_gas_reconnect: false,
    commercial_includes_electrical_reconnect: false,
    commercial_includes_startup: false
  });

  const [w9File, setW9File] = useState<File | null>(null);
  const [coiFile, setCoiFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const requiredChecks = useMemo(
    () => ({
      legalEntity: !!form.legalEntityName,
      roc: !!form.rocLicenseNumber,
      licenseDate: !!form.licenseExpirationDate,
      principal: !!form.ownerPrincipalName,
      cell: !!form.directCell,
      email: !!form.businessEmail,
      address: !!form.businessAddress,
      w9: !!w9File,
      coi: !!coiFile,
      gl: !!form.generalLiabilityCoverageAmount,
      wc: !!form.workersCompPolicyNumber,
      excludesResidential: !!form.excludesResidential,
      excludesCommercial: !!form.excludesCommercial,
      permitConfirm: !!form.permitResponsibilityConfirmed,
      inspectionConfirm: !!form.inspectionResponsibilityConfirmed,
      rateLock: !!form.rateLockConfirmed
    }),
    [form, w9File, coiFile]
  );

  const missingRequiredCount = useMemo(
    () => Object.values(requiredChecks).filter((v) => !v).length,
    [requiredChecks]
  );

  const missingRequiredLabels = useMemo(() => {
    const labels: string[] = [];
    if (!requiredChecks.legalEntity) labels.push('Legal Entity Name');
    if (!requiredChecks.roc) labels.push('AZ ROC License Number');
    if (!requiredChecks.licenseDate) labels.push('License Expiration Date');
    if (!requiredChecks.principal) labels.push('Owner / Principal Name');
    if (!requiredChecks.cell) labels.push('Direct Cell');
    if (!requiredChecks.email) labels.push('Business Email');
    if (!requiredChecks.address) labels.push('Business Address');
    if (!requiredChecks.w9) labels.push('W-9 Upload');
    if (!requiredChecks.coi) labels.push('Certificate of Insurance Upload');
    if (!requiredChecks.gl) labels.push('General Liability Coverage Amount');
    if (!requiredChecks.wc) labels.push('Workers Comp Policy Number');
    if (!requiredChecks.excludesResidential) labels.push('Residential Excludes');
    if (!requiredChecks.excludesCommercial) labels.push('Commercial Excludes');
    if (!requiredChecks.permitConfirm) labels.push('Permit Responsibility Confirmation');
    if (!requiredChecks.inspectionConfirm) labels.push('Inspection Responsibility Confirmation');
    if (!requiredChecks.rateLock) labels.push('Rate Lock Confirmation');
    return labels;
  }, [requiredChecks]);

  const sectionCompletion = useMemo(
    () => ({
      step1:
        requiredChecks.legalEntity &&
        requiredChecks.roc &&
        requiredChecks.licenseDate &&
        requiredChecks.principal &&
        requiredChecks.cell &&
        requiredChecks.email &&
        requiredChecks.address,
      step2: requiredChecks.w9 && requiredChecks.coi && requiredChecks.gl && requiredChecks.wc,
      step3: Object.values(serviceCapabilities).some(Boolean),
      step4: requiredChecks.excludesResidential && requiredChecks.excludesCommercial,
      step5: requiredChecks.permitConfirm && requiredChecks.inspectionConfirm,
      step6: requiredChecks.rateLock
    }),
    [requiredChecks, serviceCapabilities]
  );

  const currentStep = useMemo(() => {
    if (!sectionCompletion.step1) return 1;
    if (!sectionCompletion.step2) return 2;
    if (!sectionCompletion.step3) return 3;
    if (!sectionCompletion.step4) return 4;
    if (!sectionCompletion.step5) return 5;
    if (!sectionCompletion.step6) return 6;
    return 6;
  }, [sectionCompletion]);

  const canSubmit = missingRequiredCount === 0;

  const setFormValue = (name: keyof FormState, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const key = name as keyof FormState;

    if (key === 'directCell') {
      setFormValue(key, formatPhone(value));
      return;
    }

    if (type === 'checkbox') {
      setFormValue(key, checked);
      return;
    }

    setFormValue(key, value);
  };

  const onCurrencyBlur = (field: keyof FormState) => {
    setForm((prev) => ({ ...prev, [field]: toCurrency(String(prev[field])) }));
  };

  const onCapabilityToggle = (key: string) => {
    setServiceCapabilities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (!w9File || !coiFile) {
        throw new Error('W-9 and Certificate of Insurance uploads are required.');
      }

      let w9Url = '';
      let coiUrl = '';
      let uploadWarning = '';
      try {
        w9Url = await uploadContractorDoc(w9File, 'w9');
        coiUrl = await uploadContractorDoc(coiFile, 'coi');
      } catch (_uploadError: any) {
        // Do not block partner onboarding if storage RLS is still being configured.
        w9Url = `pending-upload:${w9File.name}`;
        coiUrl = `pending-upload:${coiFile.name}`;
        uploadWarning = 'Document upload is pending. Atlas admin must collect W-9 and COI manually before activation.';
      }

      const submission = await submitContractorRateCard({
        legalEntityName: form.legalEntityName,
        dba: form.dba,
        rocLicenseNumber: form.rocLicenseNumber,
        rocClassification: form.rocClassification,
        licenseExpirationDate: form.licenseExpirationDate,
        ownerPrincipalName: form.ownerPrincipalName,
        directCell: form.directCell,
        businessEmail: form.businessEmail,
        businessAddress: form.businessAddress,
        yearsInBusiness: Number(form.yearsInBusiness),
        commercialCrewCount: form.commercialCrewCount,
        residentialCrewCount: Number(form.residentialCrewCount),
        averageWeeklyInstallCapacity: Number(form.averageWeeklyInstallCapacity),
        currentBacklogWeeks: Number(form.currentBacklogWeeks),
        w9Url,
        coiUrl,
        generalLiabilityCoverageAmount: normalizeMoney(form.generalLiabilityCoverageAmount),
        workersCompPolicyNumber: form.workersCompPolicyNumber,
        bondingCapacity: form.bondingCapacity,
        serviceCapabilities,
        executionRateCard: {
          residential_split_changeout: {
            ton_2_2_5: normalizeMoney(form.split22),
            ton_3: normalizeMoney(form.split3),
            ton_4: normalizeMoney(form.split4),
            ton_5: normalizeMoney(form.split5),
            excludes: form.excludesResidential,
            includes: {
              remove_existing_condenser: serviceCapabilities.includes_remove_existing_condenser,
              remove_existing_air_handler: serviceCapabilities.includes_remove_existing_air_handler,
              install_new_condenser: serviceCapabilities.includes_install_new_condenser,
              install_new_air_handler: serviceCapabilities.includes_install_new_air_handler,
              reconnect_existing_duct: serviceCapabilities.includes_reconnect_existing_duct,
              replace_pad: serviceCapabilities.includes_replace_pad,
              standard_electrical_whip: serviceCapabilities.includes_standard_electrical_whip,
              startup_test: serviceCapabilities.includes_startup_test
            }
          },
          heat_pump_changeout: {
            ton_2_5: normalizeMoney(form.heatPump25),
            includes: {
              thermostat: serviceCapabilities.heat_pump_includes_thermostat,
              low_voltage_wiring: serviceCapabilities.heat_pump_includes_low_voltage
            }
          },
          commercial_rtu_labor_only: {
            ton_5: normalizeMoney(form.rtu5),
            ton_6_7_5: normalizeMoney(form.rtu7),
            ton_10: normalizeMoney(form.rtu10),
            ton_15_25: normalizeMoney(form.rtu25),
            excludes: form.excludesCommercial,
            includes: {
              set_existing_curb: serviceCapabilities.commercial_includes_set_existing_curb,
              gas_reconnect: serviceCapabilities.commercial_includes_gas_reconnect,
              electrical_reconnect: serviceCapabilities.commercial_includes_electrical_reconnect,
              startup: serviceCapabilities.commercial_includes_startup
            }
          },
          adders: {
            crane: normalizeMoney(form.adderCrane),
            curb_adapter: normalizeMoney(form.adderCurbAdapter),
            electrical_upgrade: normalizeMoney(form.adderElectrical),
            duct_transition: normalizeMoney(form.adderDuctTransition),
            after_hours_percent: normalizeMoney(form.adderAfterHoursPercent),
            inspection_revisit: normalizeMoney(form.adderInspectionRevisit)
          }
        },
        permitResponsibilityConfirmed: form.permitResponsibilityConfirmed,
        inspectionResponsibilityConfirmed: form.inspectionResponsibilityConfirmed,
        rateLockConfirmed: form.rateLockConfirmed
      });

      setMessage(
        uploadWarning
          ? `${uploadWarning} Redirecting to Section 2 agreement and signature...`
          : 'Section 1 complete. Redirecting to Section 2 agreement and signature...'
      );
      if (submission.agreementToken) {
        window.location.href = `/partner/master-subcontractor?token=${encodeURIComponent(submission.agreementToken)}`;
      }
    } catch (err: any) {
      setError(err?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const Checkbox = ({ field, label }: { field: string; label: string }) => (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={serviceCapabilities[field]} onChange={() => onCapabilityToggle(field)} />
      <span>{label}</span>
    </label>
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 pb-28">
      <h1 className="text-2xl font-bold text-brand-dark mb-2">Atlas Construction Intelligence - HVAC Execution Rate Submission</h1>
      <p className="text-sm text-brand-secondary mb-4">Pricing &amp; Operational Alignment Only - No Signature</p>
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-900">
        <strong>Step {currentStep} of 6</strong> · Complete required fields to continue to Section 2 agreement/signature.
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white border rounded-xl p-6">
          <SectionTitle step={1} title="Legal Entity Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Legal Entity Name" required />
              <input name="legalEntityName" value={form.legalEntityName} onChange={onChange} className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <FieldLabel label="DBA" />
              <input name="dba" value={form.dba} onChange={onChange} className="w-full p-3 border rounded-lg" />
            </div>
            <div>
              <FieldLabel label="AZ ROC License Number" required help="Format example: CR-39-123456" />
              <input name="rocLicenseNumber" value={form.rocLicenseNumber} onChange={onChange} className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <FieldLabel label="ROC Classification" required />
              <select name="rocClassification" value={form.rocClassification} onChange={onChange} className="w-full p-3 border rounded-lg">
                <option>C-39</option>
                <option>CR-39</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <FieldLabel label="License Expiration Date" required />
              <input type="date" name="licenseExpirationDate" value={form.licenseExpirationDate} onChange={onChange} className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <FieldLabel label="Owner / Principal Name" required />
              <input name="ownerPrincipalName" value={form.ownerPrincipalName} onChange={onChange} className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <FieldLabel label="Direct Cell" required />
              <input name="directCell" value={form.directCell} onChange={onChange} placeholder="(602) 555-1212" className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <FieldLabel label="Business Email" required />
              <input type="email" name="businessEmail" value={form.businessEmail} onChange={onChange} className="w-full p-3 border rounded-lg" required />
            </div>
            <div className="md:col-span-2">
              <FieldLabel label="Business Address" required help="Google Autocomplete can be added next." />
              <input name="businessAddress" value={form.businessAddress} onChange={onChange} className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <FieldLabel label="Years in Business" required />
              <input type="number" name="yearsInBusiness" value={form.yearsInBusiness} onChange={onChange} className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <FieldLabel label="Commercial Crew Count" required />
              <select name="commercialCrewCount" value={form.commercialCrewCount} onChange={onChange} className="w-full p-3 border rounded-lg">
                {commercialCrewOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel label="Residential Crew Count" required />
              <input type="number" name="residentialCrewCount" value={form.residentialCrewCount} onChange={onChange} className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <FieldLabel label="Average Weekly Install Capacity" required />
              <input type="number" name="averageWeeklyInstallCapacity" value={form.averageWeeklyInstallCapacity} onChange={onChange} className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <FieldLabel label="Current Backlog (Weeks Out)" required />
              <input type="number" step="0.5" name="currentBacklogWeeks" value={form.currentBacklogWeeks} onChange={onChange} className="w-full p-3 border rounded-lg" required />
            </div>
          </div>
        </section>

        <section className="bg-white border rounded-xl p-6">
          <SectionTitle step={2} title="Licensing & Insurance Uploads" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel label="W-9" required />
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setW9File(e.target.files?.[0] || null)} className="w-full p-2 border rounded-lg" required />
            </div>
            <div>
              <FieldLabel label="Certificate of Insurance" required help="Must list Atlas Construction Intelligence as Certificate Holder." />
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setCoiFile(e.target.files?.[0] || null)} className="w-full p-2 border rounded-lg" required />
            </div>
            <div>
              <FieldLabel label="General Liability Coverage Amount" required />
              <input
                name="generalLiabilityCoverageAmount"
                value={form.generalLiabilityCoverageAmount}
                onChange={onChange}
                onBlur={() => onCurrencyBlur('generalLiabilityCoverageAmount')}
                placeholder="$1,000,000"
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <FieldLabel label="Workers Comp Policy Number" required />
              <input name="workersCompPolicyNumber" value={form.workersCompPolicyNumber} onChange={onChange} className="w-full p-3 border rounded-lg" required />
            </div>
            <div className="md:col-span-2">
              <FieldLabel label="Bonding Capacity (if applicable)" />
              <input name="bondingCapacity" value={form.bondingCapacity} onChange={onChange} className="w-full p-3 border rounded-lg" />
            </div>
          </div>
        </section>

        <section className="bg-white border rounded-xl p-6">
          <SectionTitle step={3} title="Service Capabilities" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Residential</h3>
              <div className="space-y-2">
                <Checkbox field="residential_split_changeout" label="Split System Change-Out" />
                <Checkbox field="residential_heat_pump" label="Heat Pump" />
                <Checkbox field="residential_gas_furnace" label="Gas Furnace" />
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Commercial</h3>
              <div className="space-y-2">
                <Checkbox field="commercial_rtu_5" label="RTU <= 5 Ton" />
                <Checkbox field="commercial_rtu_6_10" label="RTU 6-10 Ton" />
                <Checkbox field="commercial_rtu_10_25" label="RTU 10-25 Ton" />
                <Checkbox field="commercial_duct_mods" label="Duct Modifications" />
                <Checkbox field="commercial_electrical_disconnect" label="Electrical Disconnect" />
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Emergency Availability</h3>
              <div className="space-y-2">
                <Checkbox field="emergency_24_hour" label="24-Hour Support" />
                <Checkbox field="emergency_standard_hours" label="Standard Hours Only" />
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Equipment Procurement</h3>
              <div className="space-y-2">
                <Checkbox field="procurement_partner_supplies" label="Partner Supplies Equipment" />
                <Checkbox field="procurement_atlas_supplies" label="Atlas Supplies Equipment" />
                <Checkbox field="procurement_cost_passthrough" label="At Cost Pass-Through" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border rounded-xl p-6">
          <SectionTitle step={4} title="Execution Rate Card (Labor Basis)" />
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Residential Split Change-Out</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="split22" value={form.split22} onChange={onChange} onBlur={() => onCurrencyBlur('split22')} placeholder="2-2.5 Ton - $" className="p-3 border rounded-lg" />
                <input name="split3" value={form.split3} onChange={onChange} onBlur={() => onCurrencyBlur('split3')} placeholder="3 Ton - $" className="p-3 border rounded-lg" />
                <input name="split4" value={form.split4} onChange={onChange} onBlur={() => onCurrencyBlur('split4')} placeholder="4 Ton - $" className="p-3 border rounded-lg" />
                <input name="split5" value={form.split5} onChange={onChange} onBlur={() => onCurrencyBlur('split5')} placeholder="5 Ton - $" className="p-3 border rounded-lg" />
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <Checkbox field="includes_remove_existing_condenser" label="Remove existing condenser" />
                <Checkbox field="includes_remove_existing_air_handler" label="Remove existing air handler/furnace" />
                <Checkbox field="includes_install_new_condenser" label="Install new condenser" />
                <Checkbox field="includes_install_new_air_handler" label="Install new air handler" />
                <Checkbox field="includes_reconnect_existing_duct" label="Reconnect existing duct" />
                <Checkbox field="includes_replace_pad" label="Replace pad" />
                <Checkbox field="includes_standard_electrical_whip" label="Standard electrical whip" />
                <Checkbox field="includes_startup_test" label="Startup & test" />
              </div>
              <textarea name="excludesResidential" value={form.excludesResidential} onChange={onChange} placeholder="Excludes (Required)" className="mt-4 w-full p-3 border rounded-lg h-24" required />
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Heat Pump Change-Out</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="heatPump25" value={form.heatPump25} onChange={onChange} onBlur={() => onCurrencyBlur('heatPump25')} placeholder="2-5 Ton - $" className="p-3 border rounded-lg" />
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <Checkbox field="heat_pump_includes_thermostat" label="Thermostat" />
                <Checkbox field="heat_pump_includes_low_voltage" label="Low voltage wiring" />
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Commercial RTU Replacement (Labor Only)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="rtu5" value={form.rtu5} onChange={onChange} onBlur={() => onCurrencyBlur('rtu5')} placeholder="<= 5 Ton - $" className="p-3 border rounded-lg" />
                <input name="rtu7" value={form.rtu7} onChange={onChange} onBlur={() => onCurrencyBlur('rtu7')} placeholder="6-7.5 Ton - $" className="p-3 border rounded-lg" />
                <input name="rtu10" value={form.rtu10} onChange={onChange} onBlur={() => onCurrencyBlur('rtu10')} placeholder="10 Ton - $" className="p-3 border rounded-lg" />
                <input name="rtu25" value={form.rtu25} onChange={onChange} onBlur={() => onCurrencyBlur('rtu25')} placeholder="15-25 Ton - $" className="p-3 border rounded-lg" />
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <Checkbox field="commercial_includes_set_existing_curb" label="Set on existing curb" />
                <Checkbox field="commercial_includes_gas_reconnect" label="Gas reconnect" />
                <Checkbox field="commercial_includes_electrical_reconnect" label="Electrical reconnect" />
                <Checkbox field="commercial_includes_startup" label="Startup" />
              </div>
              <textarea name="excludesCommercial" value={form.excludesCommercial} onChange={onChange} placeholder="Excludes (Required)" className="mt-4 w-full p-3 border rounded-lg h-24" required />
            </div>

            <details className="border rounded-lg p-4">
              <summary className="font-semibold cursor-pointer">Adders (Advanced)</summary>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <input name="adderCrane" value={form.adderCrane} onChange={onChange} onBlur={() => onCurrencyBlur('adderCrane')} placeholder="Crane - $" className="p-3 border rounded-lg" />
                <input name="adderCurbAdapter" value={form.adderCurbAdapter} onChange={onChange} onBlur={() => onCurrencyBlur('adderCurbAdapter')} placeholder="Curb Adapter - $" className="p-3 border rounded-lg" />
                <input name="adderElectrical" value={form.adderElectrical} onChange={onChange} onBlur={() => onCurrencyBlur('adderElectrical')} placeholder="Electrical Upgrade - $" className="p-3 border rounded-lg" />
                <input name="adderDuctTransition" value={form.adderDuctTransition} onChange={onChange} onBlur={() => onCurrencyBlur('adderDuctTransition')} placeholder="Duct Transition - $" className="p-3 border rounded-lg" />
                <input name="adderAfterHoursPercent" value={form.adderAfterHoursPercent} onChange={onChange} placeholder="After-Hours Premium - %" className="p-3 border rounded-lg" />
                <input name="adderInspectionRevisit" value={form.adderInspectionRevisit} onChange={onChange} onBlur={() => onCurrencyBlur('adderInspectionRevisit')} placeholder="Inspection Revisit - $" className="p-3 border rounded-lg" />
              </div>
            </details>
          </div>
        </section>

        <section className="bg-white border rounded-xl p-6 space-y-3 text-sm">
          <SectionTitle step={5} title="Permit Responsibility" />
          <label className="flex items-start gap-2">
            <input type="checkbox" name="permitResponsibilityConfirmed" checked={form.permitResponsibilityConfirmed} onChange={onChange} className="mt-1" />
            <span>Subcontractor agrees to pull and manage all required permits under their ROC license unless otherwise directed in writing by Atlas.</span>
          </label>
          <label className="flex items-start gap-2">
            <input type="checkbox" name="inspectionResponsibilityConfirmed" checked={form.inspectionResponsibilityConfirmed} onChange={onChange} className="mt-1" />
            <span>Subcontractor is responsible for scheduling and passing all inspections.</span>
          </label>
        </section>

        <section className="bg-white border rounded-xl p-6 space-y-3 text-sm">
          <SectionTitle step={6} title="Rate Lock" />
          <label className="flex items-start gap-2">
            <input type="checkbox" name="rateLockConfirmed" checked={form.rateLockConfirmed} onChange={onChange} className="mt-1" />
            <span>I confirm these rates represent fixed execution pricing for 90 days.</span>
          </label>
        </section>

        {error && <div className="text-sm text-red-600">{error}</div>}
        {message && <div className="text-sm text-green-700">{message}</div>}
        {missingRequiredCount > 0 && (
          <div className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="font-semibold mb-1">Still required before submit:</div>
            <div>{missingRequiredLabels.join(' • ')}</div>
          </div>
        )}

        <div className="hidden md:flex items-center justify-between bg-slate-50 border rounded-xl p-4">
          <div className="text-sm text-slate-700">
            {missingRequiredCount > 0 ? `${missingRequiredCount} required field(s) remaining` : 'All required fields complete'}
          </div>
          <Button type="submit" disabled={!canSubmit || loading}>
            {loading ? 'Submitting...' : 'Submit Rate Card'}
          </Button>
        </div>
      </form>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-3 z-50">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="text-xs text-slate-600 flex-1">
            {missingRequiredCount > 0
              ? `${missingRequiredCount} required: ${missingRequiredLabels.slice(0, 2).join(', ')}${missingRequiredLabels.length > 2 ? '...' : ''}`
              : 'Ready to submit'}
          </div>
          <Button type="button" onClick={() => document.querySelector('form')?.requestSubmit()} disabled={!canSubmit || loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PartnerRateCard;
