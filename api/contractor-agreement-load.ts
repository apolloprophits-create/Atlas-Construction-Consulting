import { getAdminSupabase } from './_shared';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = String(req.query?.token || '').trim();
    if (!token) {
      return res.status(400).json({ error: 'Missing token' });
    }

    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from('contractors')
      .select('id, legal_entity_name, roc_license_number, owner_principal_name, direct_cell, business_email, business_address, rate_submitted_at, status')
      .eq('agreement_token', token)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Agreement record not found' });
    }

    return res.status(200).json({
      ok: true,
      contractor: data
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to load agreement' });
  }
}

