# Sejuk Sejuk Ops

Internal operations system for an aircond service company.
Order → Assignment → Service Completion → Manager Review.

- Live demo: TODO https://your-project.vercel.app
- Repo: TODO https://github.com/asyraff2025/sejuk-sejuk

## Demo logins

| Role       | ID        | Password     |
| ---------- | --------- | ------------ |
| Manager    | `manager` | `manager123` |
| Admin      | `admin`   | `admin123`   |
| Technician | `john`    | `john123`    |
| Technician | `hakim`   | `hakim123`   |
| Technician | `shime`   | `shime123`   |
| Technician | `damia`   | `damia123`   |

## What I built

- **Admin:** create orders (auto order number), assign a technician, WhatsApp link to the technician.
- **Technician (mobile-first):** see own jobs, start, postpone or complete with up to 6 photos, extra charges, auto final amount and optional payment. History tab for finished jobs. WhatsApp feedback link for the customer.
- **Manager:** review jobs with full details and history, KPI dashboard, add/edit/delete orders, add/delete users, Ask AI.
- **AI:** Ask AI answers operational questions. It also flags jobs with a final amount over 130% of the quote or with no photos, and spots overloaded technicians.
- Every key action is saved in an audit history.

## Tech stack

React + Vite, Tailwind CSS, Supabase (database and storage), Vercel (hosting and one serverless function).

## How AI works

Question → `/api/ask` picks one fixed read-only query → facts from the database → optional Claude rewrites the facts (template answer if no API key).
The AI never writes SQL and never sees the whole database.

**Supported questions:** jobs by a technician (today, this week, last week), who completed the most jobs, how many jobs today, overloaded technicians, flagged jobs.

**Limits:** keyword-based matching (odd phrasing gets a "can't answer" message), completed jobs only, no memory between questions.

## Run locally

1. In Supabase SQL Editor run `supabase/schema.sql`, then `supabase/auth.sql`.
2. Copy `.env.example` to `.env` and fill in the values.
3. `npm install` then `npm run dev`.
4. For the AI tab use `vercel dev`, or the deployed site.

## Limitations

- Role rules are enforced in the UI. Orders and files use open demo policies. Production would need proper auth with row-level security.
- WhatsApp uses deep links, not the Business API.
- Manager is notified in-app only, no email or push.
- No tests, search or pagination.

## Self-assessment

- Easiest: the admin order form. Hardest: the AI query layer.
- Production improvements: real auth with per-role security, WhatsApp Business API, tests, search, and AI tool-calling for more flexible questions.
- AI tools: I used Claude to build the project faster, then set up Supabase and Vercel and tested every role myself.
