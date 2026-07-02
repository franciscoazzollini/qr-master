# QR Hub

A simple SaaS web app for restaurants that consolidates menu, reviews, social links, payments, and reservations into one mobile-first landing page — accessible via a single QR code.

## Features

- **Restaurant setup** — Create a profile in minutes (no login required)
- **Public landing page** — Clean, mobile-first page with large touch buttons
- **QR code generator** — Unique URL per restaurant with downloadable QR
- **Admin dashboard** — Edit links anytime via a secret token URL
- **10 languages** — English (default), Spanish, Thai, Chinese, Japanese, Indonesian, Malay, Hindi, Arabic, Korean

## Tech Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres)
- next-intl for internationalization
- Netlify for deployment

## Quick Start (Local)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/001_restaurants.sql` via the SQL Editor
3. Copy your project URL and API keys from **Settings → API**

### 3. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | App URL (`http://localhost:3000` locally) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Netlify

1. Push this repo to GitHub
2. Import the site in [Netlify](https://app.netlify.com)
3. Build settings are configured in `netlify.toml`
4. Add the same environment variables in **Site settings → Environment variables**
5. Set `NEXT_PUBLIC_APP_URL` to your Netlify URL (e.g. `https://your-site.netlify.app`)

## Usage Flow

1. Go to `/en/new` and fill in restaurant details + links (up to 6)
2. After creation, you're redirected to `/dashboard/{id}?token=...` — **bookmark this URL**
3. Download the QR code from the dashboard
4. Customers scan the QR → `/r/{id}` landing page with all your links

## Project Structure

```
app/
  [locale]/           # i18n routes (home, new, r/[id], dashboard/[id])
  api/restaurants/    # REST API (create, read, update)
components/           # UI components
lib/                  # Supabase, validators, QR, tiers
messages/             # Translation files (10 locales)
supabase/migrations/  # Database schema
```

## Future Tiers (not implemented)

The codebase is structured for future Free/Pro tiers via `lib/tiers.ts`:

| Feature | Free (MVP) | Pro (future) |
|---------|------------|--------------|
| Links | Up to 6 | Unlimited |
| Analytics | No | Yes |
| Custom domain | No | Yes |
| Multiple QR codes | No | Yes |

No payment or subscription logic is included in the MVP.

## License

Private
