# Noxaur — handover and launch checklist

Bilingual (EN/AR) studio website with a private admin panel. Stack: Next.js 16 (App Router), React 19, Tailwind 4, next-intl, Motion, Supabase (Postgres + Auth + Storage), Vercel.

## 1. What exists

| Area | Where | Notes |
|---|---|---|
| Public site | `src/app/[locale]/(site)` | Home, Work, Project detail, Pricing (+ calculator), Services, About, Contact |
| Concept demos | `src/app/[locale]/demo/*`, `src/demos/*` | 4 fictional brands, each with its own theme; `noindex` |
| Admin panel | `src/app/admin` | Login → authenticator-app MFA → dashboard; CRUD for every content table; inquiries inbox; audit log |
| Database | `supabase/migrations`, `supabase/seed.sql`, `supabase/seed_concepts.sql` | Applied to project `cazeequbqyandclyctzv` (Frankfurt) |
| Security | `src/proxy.ts`, `src/lib/security/*`, `src/lib/auth/admin.ts` | Per-request CSP nonce, HSTS etc., RLS, MFA, rate limiting, Turnstile, honeypot, audit log |
| Tests | `tests/unit`, `tests/db`, `tests/e2e/smoke.sh` | `pnpm test:unit`, `tests/db/reset-local.sh && tests/db/rls-check.sh`, `pnpm build && tests/e2e/smoke.sh` |

## 2. Environment variables

Copy `.env.example` → `.env.local` (local) and add the same keys in Vercel → Project → Settings → Environment Variables.

| Variable | Where to get it | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://noxaur.com` (or the Vercel URL until the domain is live) | yes |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://cazeequbqyandclyctzv.supabase.co` | yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API Keys → Publishable key | yes |
| `SUPABASE_SECRET_KEY` | Supabase → Project Settings → API Keys → Secret key (**never** expose; server only) | yes (inquiries, uploads) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Cloudflare dashboard → Turnstile → Add site (Managed, domain `noxaur.com`) | recommended; without them the contact form is skipped in dev and **rejected in production** |
| `RESEND_API_KEY`, `NOTIFY_EMAIL_FROM`, `NOTIFY_EMAIL_TO` | resend.com → API key; verify your sending domain; `NOTIFY_EMAIL_TO` = your inbox | for email alerts |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Vercel Marketplace → Upstash Redis (free) | recommended in production (shared rate limits) |
| `WHATSAPP_CLOUD_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_OWNER_NUMBER` | Meta for Developers → WhatsApp Cloud API; create a template named `new_inquiry` with 3 body params | optional; see §6 |
| `IP_HASH_SALT` | any long random string | recommended |

## 3. Create the admin account (one time)

1. Supabase dashboard → Authentication → Users → **Add user** → email + a strong password (≥ 12 characters). Confirm the email if asked.
2. Supabase → SQL Editor, run (replace the email):
   ```sql
   insert into public.admin_users (user_id, email)
   select id, email from auth.users where email = 'you@example.com';
   ```
3. Supabase → Authentication → Providers → Email: **disable "Allow new users to sign up"**.
4. Supabase → Authentication → MFA: TOTP enabled (default). Optionally enable "Leaked password protection".
5. Visit `/admin/login`, sign in, scan the QR code with Google Authenticator / 1Password, enter the code. You are in.

Only rows in `admin_users` **and** sessions that passed MFA can write anything. Everything an admin changes is recorded in the audit log.

## 4. Deploy on Vercel

1. Vercel → Add New Project → import `a2hb11/webcreation` (branch `feat/studio-site`, or merge to `main` first).
2. Framework: Next.js (auto). Add the environment variables from §2.
3. Settings → Functions → Region: **Frankfurt (fra1)** to sit next to the database.
4. Settings → Security: enable the Web Application Firewall and, if you ever get attacked, "Attack Challenge Mode".
5. Deploy. Then Supabase → Authentication → URL Configuration → Site URL = your production URL, and add it to Redirect URLs.
6. Hobby plan is for non-commercial use; move to Pro before taking paying clients.

## 5. Domain

Chosen name: **Noxaur**. `noxaur.com` was available at research time (~$11/yr). Buy it through Vercel (Domains) or any registrar, then add it to the Vercel project; SSL is automatic. `noxaur.kw` can be registered through a CITRA-accredited registrar with your civil ID.

## 6. Notifications

Every inquiry is stored in the database (admin → Inquiries) **before** any notification is attempted, so nothing is lost if a channel fails.

- **Email**: works as soon as Resend variables are set.
- **WhatsApp to you**: the Meta Cloud API needs an approved message template because the message is business-initiated. Template `new_inquiry`, language `en`, body: `New inquiry from {{1}} ({{2}}) — {{3}}`. Until that is approved, use email + the admin inbox; the inbox has one-tap WhatsApp/mail/call links for replying to the client.
- **Visitors → you**: every WhatsApp button on the site opens a chat with `+965 6064 3311` and a prefilled message (change the number in admin → Settings).

## 7. Editing content

Everything the visitor sees is editable in `/admin`: categories, projects (with cover/gallery upload), packages per category, price factors (used by the calculator), maintenance plans, currencies (fixed rates + rounding), FAQs, testimonials, settings (WhatsApp, Instagram, email, hours, payment terms). Changes appear on the site immediately.

Concept demos are code (`src/demos/*`); to add a real client project, create it in admin with `Live URL` and a cover image, and untick "Concept".

## 8. Local development

```bash
pnpm install
cp .env.example .env.local   # fill values
pnpm dev                     # http://localhost:3000/en
pnpm lint && pnpm typecheck && pnpm test:unit
pnpm build && tests/e2e/smoke.sh
node scripts/capture-demos.mjs   # regenerate demo covers after editing a demo
```

## 9. Honest limits

- No website is "100% secure". What is in place: strict CSP with nonces, HSTS and the other headers, row-level security enforced in Postgres, MFA-only admin, server-side validation, rate limiting, bot check, audit log, secrets only on the server. Keep dependencies updated (Dependabot is configured) and rotate the Supabase secret key if it ever leaks.
- Prices are ranges; every quote is still yours to issue.
- Testimonials render only when you publish real ones.
