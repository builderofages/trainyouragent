# Supabase setup (v42)

The lead-store now persists to Supabase. Until env vars are wired the site
falls back to the in-memory store gracefully — no build break.

## 4-step setup

### 1. Create a project at supabase.com

Pick the free tier. Pick the region closest to your Vercel primary
(`iad1` -> US East). Save the database password somewhere safe.

### 2. Run the migration

In the Supabase dashboard:

  - SQL Editor → New query
  - Paste the contents of `supabase/migrations/0001_init.sql`
  - Run

You should now have `public.leads` and `public.events` tables plus the
`public.events_recent` view.

### 3. Get the URL + service-role key

Project Settings → API:

  - `Project URL`  → copy → this is `SUPABASE_URL`
  - `service_role` key (under "Project API keys") → copy → this is
    `SUPABASE_SERVICE_KEY`. **Service-role bypasses RLS — never expose it
    to the browser. The website never reads it; only `/api/*` does.**

### 4. Add to Vercel env

```bash
vercel env add SUPABASE_URL production
# paste the URL when prompted

vercel env add SUPABASE_SERVICE_KEY production
# paste the service-role key when prompted

# Optional: do the same for preview + development to keep parity
vercel env add SUPABASE_URL preview
vercel env add SUPABASE_SERVICE_KEY preview
```

Then redeploy:

```bash
curl -X POST 'https://api.vercel.com/v1/integrations/deploy/prj_bxA7MPcFmHyKRJ69XSIYdjNbSxy4/0D9pWDtZqR'
```

`/api/admin/metrics` will start reporting `backend: "supabase+memory"`
once the keys take effect.

## Verifying it works

After the next lead submission you should see a row in `public.leads` with
the masked email. After a Cal.com `BOOKING_CREATED` webhook fires you should
see an `event_type = 'booking_created'` row in `public.events`.

The in-memory mirror is still kept so admin dashboards stay fast for the
24-48h window where Supabase results would dominate. Long-term queries
should be done against Supabase directly via SQL.

## Schema

See `supabase/migrations/0001_init.sql`. Two tables:

  - `leads(id, email, source, payload jsonb, path, ip, created_at)`
  - `events(id, event_type, source, meta jsonb, amount_cents, created_at)`

Indexes are on `created_at` and `source`/`event_type` to keep the admin
funnel queries snappy as we cross 10k+ rows.
