import { createClient } from '@supabase/supabase-js';

type WelcomeBody = {
  leadId: string;
  name: string;
  email: string;
  projectType: string;
};

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    throw new Error('Missing RESEND_API_KEY or RESEND_FROM_EMAIL');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: [to],
      subject,
      html
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend API failed: ${text}`);
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body as WelcomeBody;
    const { leadId, name, email, projectType } = body || {};

    if (!leadId || !name || !email || !projectType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await sendEmail(
      email,
      'Atlas: We received your audit request',
      `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:560px;margin:0 auto;">
        <h2 style="margin-bottom:8px;">Request Received</h2>
        <p>Hi ${name},</p>
        <p>We received your <strong>${projectType}</strong> audit request and our team is reviewing it now.</p>
        <p>We will follow up with your audit details shortly.</p>
        <p style="margin-top:24px;color:#64748b;font-size:13px;">Atlas Construction Consulting</p>
      </div>
      `
    );

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false }
      });

      await admin
        .from('leads')
        .update({ welcome_sent_at: new Date().toISOString() })
        .eq('id', leadId)
        .is('welcome_sent_at', null);
    }

    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error?.message || 'Failed to send welcome email' });
  }
}
