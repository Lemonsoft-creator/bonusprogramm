# All in Sport Bonus — Next.js + Tailwind + Supabase

A deployable demo based on your mockup. Ships with:
- Next.js 14 (App Router)
- TailwindCSS
- Minimal UI components (shadcn-like API)
- Optional Supabase Auth/DB scaffold

## Quickstart (Local)

```bash
pnpm i   # or npm i / yarn
cp .env.example .env.local   # fill in Supabase URL + anon key (optional)
pnpm dev
```

## Deploy to Vercel

1. Push this repo or upload ZIP to a new Vercel project.
2. Add **Environment Variables**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional).
3. Deploy.

## Supabase (optional)

- Create a new Supabase project and paste the SQL in `supabase/schema.sql` to provision tables.
- The app will still work with in-memory demo data if no env vars are set.
- Auth buttons appear if env is configured.

## Tech Notes

- Components live under `components/ui` to match the mockup imports.
- The feature logic is client-side and stateful; DB wiring stubs are included in `lib/db.ts` for future expansion.
