# Sejuk Sejuk Ops

Internal operations system for an aircond service company: Order → Assignment → Service Completion → Manager review.
Built for the Programmer Assessment (Operations System + AI Challenge).

**Stack:** React + Vite, Tailwind CSS, Supabase (Postgres + Storage), Vercel (static site + serverless `/api/ask`).

## What's built
- **Module 1, Admin:** order form with auto-generated Order No (Postgres sequence), order summary after saving, WhatsApp deep link to the technician, assign-later flow.
- **Module 2, Technician (mobile-first):** open jobs per technician, start / postpone / complete, up to 6 photo/video/PDF uploads to Supabase Storage, auto-calculated final amount, optional payment record.
- **Module 3, WhatsApp trigger:** when a job becomes Job Done, a pre-filled `wa.me` link with the exact sample message is offered for the customer.
- **KPI dashboard:** weekly jobs, total amount, postponements, leaderboard.
- **AI query window:** manager asks questions, answers come from fixed read-only queries.
- **Workflow supervisor (advanced):** flags final amount > 130% of quote and jobs with no photos, shown in Review and via the AI window.
- Audit trail in `order_events` (created, assigned, started, postponed, done, reviewed, closed).

## Setup
1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. `cp .env.example .env` and fill in the values. `npm install && npm run dev`.
3. Deploy on Vercel, add all env vars from `.env.example` in project settings.
4. For `/api/ask` locally use `vercel dev`.

## Architecture decisions
- **Role switch, not auth.** Roles are mocked in the UI as allowed. Rules (only Admin assigns, only the assigned technician completes) are reflected in which screens expose which actions, not enforced in the database.
- **Data model:** `orders` (one row per job, status check constraint matches the workflow), `completions` (one-to-one with orders), `order_events` (audit log), `technicians`.
- **AI design:** the browser never talks to the LLM or the database for AI. `/api/ask` maps the question to one of a fixed set of read-only queries (jobs per technician, most jobs, count, overload, flags), builds a facts string, and optionally asks Claude to phrase it using only those facts. Without `ANTHROPIC_API_KEY` it returns the template answer, so it still works.

## AI queries supported
Jobs by technician (last week / this week / today), technician with most jobs, number of jobs completed today or this week, who might be overloaded (3+ jobs and 1.5x team average), flagged jobs.

## Limitations
- Intent detection is keyword-based, so unusual phrasing gets a "can only answer from completed job records" message.
- The service key is used server-side only, but the demo RLS policies are fully open and need role-based policies plus real auth before production.
- WhatsApp uses deep links (a human taps Send), not the WhatsApp Business API.
- Manager/accounts notification is in-app (Review list) only; no email or push.
- No tests, no pagination, no image compression.

## Self-assessment
- Easiest: Admin form. Hardest: AI query layer, keeping answers grounded in retrieved data.
- Production improvements: Supabase Auth + RLS per role, DB trigger for status transitions, WhatsApp Business API, signed upload URLs, tests, LLM tool-calling over the same query functions.
- AI tools: Claude was used to scaffold the project and review the schema; I checked the logic and flows myself.
