type AuthorizationPayload = {
  permitId?: string;
  propertyAddress?: string;
  projectType?: string;
  homeownerName?: string;
  homeownerEmail?: string;
  currentValuation?: number;
  authorizedRate?: number;
  savings?: number;
  signedPdfUrl?: string;
};

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const AUTH_NOTIFY_EMAIL = process.env.AUTH_NOTIFY_EMAIL;

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
    if (!AUTH_NOTIFY_EMAIL) {
      return res.status(500).json({ error: 'Missing AUTH_NOTIFY_EMAIL' });
    }

    const body = (req.body || {}) as AuthorizationPayload;
    const {
      permitId = 'N/A',
      propertyAddress = 'N/A',
      projectType = 'HVAC Replacement',
      homeownerName = 'N/A',
      homeownerEmail = 'N/A',
      currentValuation = 0,
      authorizedRate = 0,
      savings = 0,
      signedPdfUrl = ''
    } = body;

    await sendEmail(
      AUTH_NOTIFY_EMAIL,
      'Atlas Authorization Signed - New Recovery File',
      `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:640px;margin:0 auto;">
        <h2 style="margin-bottom:12px;">New Authorization Submission</h2>
        <p><strong>Homeowner:</strong> ${homeownerName}</p>
        <p><strong>Email:</strong> ${homeownerEmail}</p>
        <p><strong>Permit ID:</strong> ${permitId}</p>
        <p><strong>Property Address:</strong> ${propertyAddress}</p>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Current Permit Valuation:</strong> $${Number(currentValuation).toLocaleString()}</p>
        <p><strong>Atlas Authorized Rate:</strong> $${Number(authorizedRate).toLocaleString()}</p>
        <p><strong>Total Savings:</strong> $${Number(savings).toLocaleString()}</p>
        ${signedPdfUrl ? `<p><strong>Signed PDF:</strong> <a href="${signedPdfUrl}" target="_blank" rel="noreferrer">${signedPdfUrl}</a></p>` : '<p><strong>Signed PDF:</strong> Not provided in form.</p>'}
      </div>
      `
    );

    return res.status(200).json({ ok: true });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to send authorization notification' });
  }
}
