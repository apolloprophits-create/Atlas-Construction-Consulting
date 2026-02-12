import React, { useMemo, useState } from 'react';
import Button from '../components/ui/Button';
import { submitContractorRateCard, uploadContractorDoc } from '../lib/contractorsDb';

const commercialCrewOptions = ['1', '2', '3-5', '6-10', '10+'];

const PartnerRateCard: React.FC = () => {
  const [form, setForm] = useState({
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

  const canSubmit = useMemo(
    () =>
      !!(
        form.legalEntityName &&
        form.rocLicenseNumber &&
        form.licenseExpirationDate &&
        form.ownerPrincipalName &&
        form.directCell &&
        form.businessEmail &&
        form.businessAddress &&
        form.generalLiabilityCoverageAmount &&
        form.workersCompPolicyNumber &&
        form.excludesResidential &&
        form.excludesCommercial &&
        w9File &&
        coiFile &&
        form.permitResponsibilityConfirmed &&
        form.inspectionResponsibilityConfirmed &&
        form.rateLockConfirmed
      ),
    [form, w9File, coiFile]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

      const w9Url = await uploadContractorDoc(w9File, 'w9');
      const coiUrl = await uploadContractorDoc(coiFile, 'coi');

      await submitContractorRateCard({
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
        generalLiabilityCoverageAmount: form.generalLiabilityCoverageAmount,
        workersCompPolicyNumber: form.workersCompPolicyNumber,
        bondingCapacity: form.bondingCapacity,
        serviceCapabilities,
        executionRateCard: {
          residential_split_changeout: {
            ton_2_2_5: form.split22,
            ton_3: form.split3,
            ton_4: form.split4,
            ton_5: form.split5,
            excludes: form.excludesResidential
          },
          heat_pump_changeout: {
            ton_2_5: form.heatPump25
          },
          commercial_rtu_labor_only: {
            ton_5: form.rtu5,
            ton_6_7_5: form.rtu7,
            ton_10: form.rtu10,
            ton_15_25: form.rtu25,
            excludes: form.excludesCommercial
          },
          adders: {
            crane: form.adderCrane,
            curb_adapter: form.adderCurbAdapter,
            electrical_upgrade: form.adderElectrical,
            duct_transition: form.adderDuctTransition,
            after_hours_percent: form.adderAfterHoursPercent,
            inspection_revisit: form.adderInspectionRevisit
          }
        },
        permitResponsibilityConfirmed: form.permitResponsibilityConfirmed,
        inspectionResponsibilityConfirmed: form.inspectionResponsibilityConfirmed,
        rateLockConfirmed: form.rateLockConfirmed
      });

      setMessage('Submission received. Status set to Pending Review. Atlas will follow up after review.');
    } catch (err: any) {
      setError(err?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-brand-dark mb-2">Atlas Construction Intelligence - HVAC Execution Rate Submission</h1>
      <p className="text-sm text-brand-secondary mb-8">Pricing &amp; Operational Alignment Only - No Signature</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white border rounded-xl p-6">
          <h2 className="font-bold text-lg mb-4">Section 1 - Legal Entity Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="legalEntityName" value={form.legalEntityName} onChange={onChange} placeholder="Legal Entity Name" className="p-3 border rounded-lg" required />
            <input name="dba" value={form.dba} onChange={onChange} placeholder="DBA (Optional)" className="p-3 border rounded-lg" />
            <input name="rocLicenseNumber" value={form.rocLicenseNumber} onChange={onChange} placeholder="AZ ROC License Number" className="p-3 border rounded-lg" required />
            <select name="rocClassification" value={form.rocClassification} onChange={onChange} className="p-3 border rounded-lg">
              <option>C-39</option>
              <option>CR-39</option>
              <option>Other</option>
            </select>
            <input type="date" name="licenseExpirationDate" value={form.licenseExpirationDate} onChange={onChange} className="p-3 border rounded-lg" required />
            <input name="ownerPrincipalName" value={form.ownerPrincipalName} onChange={onChange} placeholder="Owner / Principal Name" className="p-3 border rounded-lg" required />
            <input name="directCell" value={form.directCell} onChange={onChange} placeholder="Direct Cell" className="p-3 border rounded-lg" required />
            <input type="email" name="businessEmail" value={form.businessEmail} onChange={onChange} placeholder="Business Email" className="p-3 border rounded-lg" required />
            <input name="businessAddress" value={form.businessAddress} onChange={onChange} placeholder="Business Address (Google Autocomplete)" className="p-3 border rounded-lg md:col-span-2" required />
            <input type="number" name="yearsInBusiness" value={form.yearsInBusiness} onChange={onChange} placeholder="Years in Business" className="p-3 border rounded-lg" required />
            <select name="commercialCrewCount" value={form.commercialCrewCount} onChange={onChange} className="p-3 border rounded-lg">
              {commercialCrewOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <input type="number" name="residentialCrewCount" value={form.residentialCrewCount} onChange={onChange} placeholder="Residential Crew Count" className="p-3 border rounded-lg" required />
            <input type="number" name="averageWeeklyInstallCapacity" value={form.averageWeeklyInstallCapacity} onChange={onChange} placeholder="Average Weekly Install Capacity" className="p-3 border rounded-lg" required />
            <input type="number" step="0.5" name="currentBacklogWeeks" value={form.currentBacklogWeeks} onChange={onChange} placeholder="Current Backlog (Weeks Out)" className="p-3 border rounded-lg" required />
          </div>
        </section>

        <section className="bg-white border rounded-xl p-6">
          <h2 className="font-bold text-lg mb-4">Section 2 - Licensing &amp; Insurance Uploads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">W-9 (Required)</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setW9File(e.target.files?.[0] || null)} className="w-full p-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm mb-1">Certificate of Insurance (Required)</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setCoiFile(e.target.files?.[0] || null)} className="w-full p-2 border rounded-lg" required />
              <p className="text-xs text-slate-500 mt-1">Must list Atlas Construction Intelligence as Certificate Holder.</p>
            </div>
            <input name="generalLiabilityCoverageAmount" value={form.generalLiabilityCoverageAmount} onChange={onChange} placeholder="General Liability Coverage Amount" className="p-3 border rounded-lg" required />
            <input name="workersCompPolicyNumber" value={form.workersCompPolicyNumber} onChange={onChange} placeholder="Workers Comp Policy Number" className="p-3 border rounded-lg" required />
            <input name="bondingCapacity" value={form.bondingCapacity} onChange={onChange} placeholder="Bonding Capacity (if applicable)" className="p-3 border rounded-lg md:col-span-2" />
          </div>
        </section>

        <section className="bg-white border rounded-xl p-6">
          <h2 className="font-bold text-lg mb-4">Section 3 - Service Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            {Object.keys(serviceCapabilities).map((key) => (
              <label key={key} className="flex items-center gap-2">
                <input type="checkbox" checked={serviceCapabilities[key]} onChange={() => onCapabilityToggle(key)} />
                <span className="capitalize">{key.replaceAll('_', ' ')}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="bg-white border rounded-xl p-6">
          <h2 className="font-bold text-lg mb-4">Section 4 - Execution Rate Card (Labor Basis)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="split22" value={form.split22} onChange={onChange} placeholder="Residential 2-2.5 Ton" className="p-3 border rounded-lg" />
            <input name="split3" value={form.split3} onChange={onChange} placeholder="Residential 3 Ton" className="p-3 border rounded-lg" />
            <input name="split4" value={form.split4} onChange={onChange} placeholder="Residential 4 Ton" className="p-3 border rounded-lg" />
            <input name="split5" value={form.split5} onChange={onChange} placeholder="Residential 5 Ton" className="p-3 border rounded-lg" />
            <input name="heatPump25" value={form.heatPump25} onChange={onChange} placeholder="Heat Pump Change-Out 2-5 Ton" className="p-3 border rounded-lg" />
            <input name="rtu5" value={form.rtu5} onChange={onChange} placeholder="Commercial RTU ≤ 5 Ton" className="p-3 border rounded-lg" />
            <input name="rtu7" value={form.rtu7} onChange={onChange} placeholder="Commercial RTU 6-7.5 Ton" className="p-3 border rounded-lg" />
            <input name="rtu10" value={form.rtu10} onChange={onChange} placeholder="Commercial RTU 10 Ton" className="p-3 border rounded-lg" />
            <input name="rtu25" value={form.rtu25} onChange={onChange} placeholder="Commercial RTU 15-25 Ton" className="p-3 border rounded-lg" />
            <input name="adderCrane" value={form.adderCrane} onChange={onChange} placeholder="Adder Crane" className="p-3 border rounded-lg" />
            <input name="adderCurbAdapter" value={form.adderCurbAdapter} onChange={onChange} placeholder="Adder Curb Adapter" className="p-3 border rounded-lg" />
            <input name="adderElectrical" value={form.adderElectrical} onChange={onChange} placeholder="Adder Electrical Upgrade" className="p-3 border rounded-lg" />
            <input name="adderDuctTransition" value={form.adderDuctTransition} onChange={onChange} placeholder="Adder Duct Transition" className="p-3 border rounded-lg" />
            <input name="adderAfterHoursPercent" value={form.adderAfterHoursPercent} onChange={onChange} placeholder="After-Hours Premium (%)" className="p-3 border rounded-lg" />
            <input name="adderInspectionRevisit" value={form.adderInspectionRevisit} onChange={onChange} placeholder="Inspection Revisit" className="p-3 border rounded-lg" />
            <textarea name="excludesResidential" value={form.excludesResidential} onChange={onChange} placeholder="Residential Excludes (Required)" className="p-3 border rounded-lg md:col-span-2 h-24" required />
            <textarea name="excludesCommercial" value={form.excludesCommercial} onChange={onChange} placeholder="Commercial Excludes (Required)" className="p-3 border rounded-lg md:col-span-2 h-24" required />
          </div>
        </section>

        <section className="bg-white border rounded-xl p-6 space-y-3 text-sm">
          <h2 className="font-bold text-lg mb-2">Section 5 &amp; 6 - Permit Responsibility &amp; Rate Lock</h2>
          <label className="flex items-start gap-2">
            <input type="checkbox" name="permitResponsibilityConfirmed" checked={form.permitResponsibilityConfirmed} onChange={onChange} className="mt-1" />
            <span>Subcontractor agrees to pull and manage all required permits under their ROC license unless otherwise directed in writing by Atlas.</span>
          </label>
          <label className="flex items-start gap-2">
            <input type="checkbox" name="inspectionResponsibilityConfirmed" checked={form.inspectionResponsibilityConfirmed} onChange={onChange} className="mt-1" />
            <span>Subcontractor is responsible for scheduling and passing all inspections.</span>
          </label>
          <label className="flex items-start gap-2">
            <input type="checkbox" name="rateLockConfirmed" checked={form.rateLockConfirmed} onChange={onChange} className="mt-1" />
            <span>I confirm these rates represent fixed execution pricing for 90 days.</span>
          </label>
        </section>

        {error && <div className="text-sm text-red-600">{error}</div>}
        {message && <div className="text-sm text-green-700">{message}</div>}

        <Button type="submit" disabled={!canSubmit || loading}>
          {loading ? 'Submitting...' : 'Submit Rate Card'}
        </Button>
      </form>
    </div>
  );
};

export default PartnerRateCard;

