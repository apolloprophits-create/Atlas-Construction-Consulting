import { createClient } from '@supabase/supabase-js';

type LeadRow = {
  id: string;
  name: string;
  email: string;
  project_type: string;
  submitted_at: string;
  welcome_sent_at: string | null;
  followup_1_sent_at: string | null;
  followup_2_sent_at: string | null;
};

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP_BASE_URL = process.env.APP_BASE_URL || 'https://atlasconsulting.phx';
const CRON_SECRET = process.env.CRON_SECRET;

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

const daysBetween = (fromIso: string, to: Date) => {
  const from = new Date(fromIso).getTime();
  return (to.getTime() - from) / (1000 * 60 * 60 * 24);
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (CRON_SECRET) {
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' });
  }

  try {
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data, error } = await admin
      .from('leads')
      .select('id,name,email,project_type,submitted_at,welcome_sent_at,followup_1_sent_at,followup_2_sent_at')
      .order('submitted_at', { ascending: true })
      .limit(500);

    if (error) {
      throw new Error(error.message);
    }

    const leads = (data || []) as LeadRow[];
    const now = new Date();

    let followup1Sent = 0;
    let followup2Sent = 0;

    for (const lead of leads) {
      if (!lead.email || !lead.welcome_sent_at) continue;

      const welcomeAgeDays = daysBetween(lead.welcome_sent_at, now);

      if (!lead.followup_1_sent_at && welcomeAgeDays >= 1) {
        await sendEmail(
          lead.email,
          'Atlas: Your next step before signing',
          `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:560px;margin:0 auto;">
            <h2 style="margin-bottom:8px;">Quick Follow-Up</h2>
            <p>Hi ${lead.name},</p>
            <p>Before signing, make sure your ${lead.project_type} quote includes clear line-item pricing and scope details.</p>
            <p>You can submit additional details anytime here: <a href="${APP_BASE_URL}/#/request-audit">Request Audit</a></p>
            <p style="margin-top:24px;color:#64748b;font-size:13px;">Atlas Construction Consulting</p>
          </div>
          `
        );

        await admin.from('leads').update({ followup_1_sent_at: now.toISOString() }).eq('id', lead.id);
        followup1Sent += 1;
        continue;
      }

      if (lead.followup_1_sent_at && !lead.followup_2_sent_at) {
        const followup1AgeDays = daysBetween(lead.followup_1_sent_at, now);
        if (followup1AgeDays >= 2) {
          await sendEmail(
            lead.email,
            'Atlas: Final reminder for your audit request',
            `
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:560px;margin:0 auto;">
              <h2 style="margin-bottom:8px;">Final Reminder</h2>
              <p>Hi ${lead.name},</p>
              <p>If you still want an independent pricing check, you can complete or update your request here:</p>
              <p><a href="${APP_BASE_URL}/#/request-audit">Open Request Form</a></p>
              <p style="margin-top:24px;color:#64748b;font-size:13px;">Atlas Construction Consulting</p>
            </div>
            `
          );

          await admin.from('leads').update({ followup_2_sent_at: now.toISOString() }).eq('id', lead.id);
          followup2Sent += 1;
        }
      }
    }

    return res.status(200).json({ ok: true, followup1Sent, followup2Sent });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error?.message || 'Failed to send followups' });
  }
}
