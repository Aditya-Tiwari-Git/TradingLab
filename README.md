# TradeLab Advanced Trading Journal

A professional, trader-first journaling system built with React (Vite), Supabase, and TailwindCSS. Designed for daily use with a modular, scalable architecture.

## Core Features Implemented
- Supabase Auth (email/password)
- Dashboard KPIs + charts (equity curve, monthly P/L, win/loss distribution, strategy performance)
- Full trade journal CRUD
- Tagging system + filters
- Trade detail page with notes, links, and screenshots
- Strategy tracker
- Trade calendar with daily profit/loss colors
- Learning notes journal
- Playbook setups + checklist templates
- Daily checklist
- Watchlist
- Analytics page (profit factor, expectancy, drawdown, etc.)
- CSV export/import

## Tech Stack
- Frontend: React + Vite + TypeScript
- Styling: TailwindCSS
- Backend: Supabase (Postgres, Auth, Storage)

## Project Structure
- `src/components` UI and domain components
- `src/pages` Route-based pages
- `src/services` Supabase queries and storage helpers
- `src/context` Auth provider
- `src/hooks` Shared hooks
- `src/utils` Metrics + date helpers
- `supabase/schema.sql` Database schema + RLS policies

## Setup Instructions
### 1. Create Supabase Project
1. Create a new Supabase project.
2. In the SQL Editor, run `supabase/schema.sql`.
3. Create a storage bucket named `trade-images` (private).
4. Add the following storage policies in Supabase:

```sql
create policy "Trade images read" on storage.objects
  for select using (auth.uid() = owner);

create policy "Trade images insert" on storage.objects
  for insert with check (auth.uid() = owner);

create policy "Trade images delete" on storage.objects
  for delete using (auth.uid() = owner);
```

### 1b. Enable Google Auth (Optional)
1. Go to Supabase Dashboard → Authentication → Providers → Google.
2. Enable Google and add your OAuth client ID/secret.
3. Add redirect URLs:
   - `http://localhost:5173` (Vite dev)
   - Your production URL
4. Save changes.

### 2. Configure Environment
Create a `.env` file using `.env.example`:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_SUPABASE_STORAGE_BUCKET=trade-images
```

### 3. Install & Run
```bash
npm install
npm run dev
```

### Optional: Local Supabase (CLI)
If you prefer a fully local stack:
1. Install Supabase CLI and run `supabase init` in this repo.
2. Start local services: `supabase start`.
3. Apply schema: `supabase db reset` (or run `supabase/schema.sql` in Studio).
4. Use the local URL + anon key from `supabase status` in your `.env`.

## SOP (Standard Operating Procedure)
### Daily Workflow
1. **Pre-market prep**
   - Open `Checklist` and complete pre-market tasks.
   - Review `Watchlist` and update notes.
   - Open `Playbook` to confirm setups you want to prioritize.
2. **During market**
   - Log each trade immediately in `Trades` using the quick entry form.
   - Add `Strategy`, `Tags`, `Timeframe`, and `R:R` while the context is fresh.
   - Record `Emotional State` and whether rules were followed.
3. **Post-market review**
   - Open each trade in `Trade Detail` and fill in reflections.
   - Attach screenshots and add external links (news, tweets, research).
   - Capture lessons learned in `Notes`.

### Weekly Review
1. Open `Analytics` to evaluate expectancy, drawdown, and streaks.
2. Use `Strategies` to identify the most profitable setups.
3. Update your `Playbook` rules and checklists based on results.

### Monthly Review
1. Use `Reports` to export a CSV backup.
2. Review `Dashboard` charts for equity curve and monthly P/L.
3. Adjust risk sizing and checklist items for the next month.

## Scripts
- `npm run dev` Start dev server
- `npm run build` Production build
- `npm run preview` Preview build

## Notes
- Supabase RLS ensures each user only sees their own data.
- All charts are local and derived from your trade data.
- No third-party APIs are required.
