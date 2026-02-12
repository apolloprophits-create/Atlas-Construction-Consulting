import { getAdminSupabase, sendEmail } from './_shared';

const APP_BASE_URL = process.env.APP_BASE_URL;
const AUTH_NOTIFY_EMAIL = process.env.AUTH_NOTIFY_EMAIL;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { contractorId } = req.body || {};
    if (!contractorId) {
      return res.status(400).json({ error: 'Missing contractorId' });
    }

    const supabase = getAdminSupabase();

    const { data: contractor, error: loadError } = await supabase
      .from('contractors')
      .select('id, legal_entity_name, roc_license_number, business_email, owner_principal_name, agreement_token, rate_submitted_at')
      .eq('id', contractorId)
      .single();

    if (loadError || !contractor) {
      return res.status(404).json({ error: 'Contractor not found' });
    }

    const token = contractor.agreement_token;
    const agreementLink = `${APP_BASE_URL || ''}/partner/master-subcontractor?token=${token}`;

    await sendEmail(
      contractor.business_email,
      'Atlas Master Subcontractor Agreement - Signature Required',
      `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:680px;margin:0 auto;">
        <h2 style="margin-bottom:12px;">Master Subcontractor Agreement</h2>
        <p>Hi ${contractor.owner_principal_name},</p>
        <p>Your HVAC Execution Rate Card has been approved by Atlas Construction Intelligence.</p>
        <p>Please complete the binding Master Subcontractor Agreement here:</p>
        <p><a href="${agreementLink}" style="display:inline-block;background:#0f172a;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;">Open Agreement</a></p>
        <p>If the button does not work, copy this link:</p>
        <p>${agreementLink}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:18px 0;" />
        <p><strong>Entity:</strong> ${contractor.legal_entity_name}</p>
        <p><strong>ROC License:</strong> ${contractor.roc_license_number}</p>
        <p><strong>Rate Submission Date:</strong> ${new Date(contractor.rate_submitted_at).toLocaleDateString()}</p>
      </div>
      `
    );

    if (AUTH_NOTIFY_EMAIL) {
      await sendEmail(
        AUTH_NOTIFY_EMAIL,
        'Partner Agreement Sent',
        `<p>Agreement sent to ${contractor.legal_entity_name} (${contractor.business_email}).</p>`
      );
    }

    const { error: updateError } = await supabase
      .from('contractors')
      .update({
        status: 'agreement_sent',
        agreement_sent_at: new Date().toISOString()
      })
      .eq('id', contractorId);

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({ ok: true, agreementLink });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to send agreement' });
  }
}

