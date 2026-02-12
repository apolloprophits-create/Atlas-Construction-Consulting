import { getAdminSupabase, sendEmail } from './_shared';

const AUTH_NOTIFY_EMAIL = process.env.AUTH_NOTIFY_EMAIL;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, signerName, signerTitle, signedPdfUrl } = req.body || {};
    if (!token || !signerName || !signerTitle || !signedPdfUrl) {
      return res.status(400).json({ error: 'Missing token, signerName, signerTitle, or signedPdfUrl' });
    }

    const supabase = getAdminSupabase();
    const { data: contractor, error: loadError } = await supabase
      .from('contractors')
      .select('id, legal_entity_name, business_email')
      .eq('agreement_token', token)
      .single();

    if (loadError || !contractor) {
      return res.status(404).json({ error: 'Contractor not found for token' });
    }

    const { error: updateError } = await supabase
      .from('contractors')
      .update({
        status: 'active_partner',
        agreement_signer_name: signerName,
        agreement_signer_title: signerTitle,
        agreement_signed_pdf_url: signedPdfUrl,
        agreement_signed_at: new Date().toISOString()
      })
      .eq('id', contractor.id);

    if (updateError) {
      throw updateError;
    }

    const partnerHtml = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:680px;margin:0 auto;">
        <h2>Agreement Recorded - Active Partner</h2>
        <p>Entity: <strong>${contractor.legal_entity_name}</strong></p>
        <p>Signer: <strong>${signerName}</strong> (${signerTitle})</p>
        <p>Signed PDF: <a href="${signedPdfUrl}">${signedPdfUrl}</a></p>
      </div>
    `;

    await sendEmail(contractor.business_email, 'Atlas Partner Agreement Completed', partnerHtml);
    if (AUTH_NOTIFY_EMAIL) {
      await sendEmail(AUTH_NOTIFY_EMAIL, 'Atlas Partner Agreement Completed', partnerHtml);
    }

    return res.status(200).json({ ok: true });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to submit agreement' });
  }
}

