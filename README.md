# Moxie Field Tracker

An internal job management dashboard built for Moxie Pest Control field operations teams.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Postgres + Auth + Row-Level Security)
- **Vercel** (deployment)

## Features

- Live job list with status badges (Scheduled, In Progress, Completed, Cancelled)
- KPI stats bar showing job counts by status
- Search across customer name, technician, address, and service type
- Filter by status
- Add new job via modal form
- Inline status update per job row
- Supabase-ready: swap mock data for real DB with `.env.local`

## Local Setup

```bash
npm install
npm run dev
```

App runs at http://localhost:3000

## Connect Supabase

1. Create a free project at supabase.com
2. Run this SQL to create the jobs table:

```sql
create table jobs (
  id uuid default gen_random_uuid() primary key,
  technician_name text not null,
  customer_name text not null,
  address text not null,
  service_type text not null,
  status text check (status in ('scheduled','in_progress','completed','cancelled')) default 'scheduled',
  scheduled_date date not null,
  notes text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table jobs enable row level security;

-- Allow authenticated users to read/write their org's jobs
create policy "Allow all for authenticated" on jobs
  for all using (auth.role() = 'authenticated');
```

3. Add your keys to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Replace mock data calls in `page.tsx` with real Supabase queries (commented stubs already in place)

## Deploy to Vercel

```bash
npx vercel
```

Add the two env vars in Vercel dashboard under Project Settings > Environment Variables.
