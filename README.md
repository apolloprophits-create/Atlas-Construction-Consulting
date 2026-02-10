<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Atlas Construction Consulting

## Local Setup

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your local environment file:
   ```bash
   cp .env.example .env.local
   ```
3. Open `.env.local` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `APP_BASE_URL`
   - `CRON_SECRET`
4. In Supabase, open **SQL Editor** and run:
   - `supabase/schema.sql`
5. In Supabase, create an internal analyst user:
   - Open **Authentication > Users**
   - Click **Add user**
   - Enter the email/password you will use for the internal dashboard
6. Start the app:
   ```bash
   npm run dev
   ```
7. Internal dashboard login:
   - Go to `/#/internal/create-audit`
   - Sign in with the Supabase user from step 5

## Build Check

Run this before deploying:

```bash
npm run build
```

## Notes

- Styling is compiled locally with Tailwind (no CDN runtime dependency).
- Public users can submit leads.
- Only authenticated users can read leads and create audits.
- Public audit reports are loaded through a restricted RPC (`get_public_audit`).
- Email chain is server-side via Vercel API functions and Resend.

## Email Chain (Resend)

This project sends:
1. Welcome email immediately after form submit
2. Follow-up #1 after 1 day
3. Follow-up #2 after 2 more days

Files:
- `api/send-welcome.ts`
- `api/send-followups.ts`
- `vercel.json` (daily cron at 15:00 UTC)

One-time setup:
1. In Resend, verify your sending domain/address.
2. Set `RESEND_FROM_EMAIL` to a verified sender.
3. Ensure Vercel environment variables include all values from `.env.example`.
4. Ensure `supabase/schema.sql` has been run (includes lead email tracking columns).
