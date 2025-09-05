# All-in-Sport Bonusprogramm – Clean MVP

Minimal lauffähiges MVP (Next.js + Supabase) für Anmeldung, Punktevergabe, Dashboard & Leaderboard.
Design: modern/technisch/sportlich (Tailwind).

## Quickstart
1) **Supabase**: Neues Projekt → `SQL`-Editor → `supabase_migration.sql` ausführen.
2) **Env**: In Vercel und lokal `.env` setzen:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE`
   - `ADMIN_CODE` (z. B. `ALLIN2024ADMIN`)
   - `JWT_SECRET`
3) **Dev**:
   ```bash
   npm install
   npm run dev
   ```
4) **Seiten**:
   - `/signup` (Anrede, Vorname, Nachname, Gym, Telefon, E-Mail, Passwort, Pw-Wdh., Admin-Code optional)
   - `/login` (E-Mail, Passwort)
   - `/dashboard` (eigene Punkte)
   - `/admin` (Punkte vergeben, Leaderboard)

## API
- `POST /api/auth/signup` – erstellt Benutzer (bcrypt Hash, optional Admin via `ADMIN_CODE`)
- `POST /api/auth/login` – Login, setzt HTTP-only Session Cookie (JWT)
- `GET /api/me` – Profil + Punkte
- `POST /api/points/add` – Admin-only
- `GET /api/leaderboard?period=month|year` – Top 20

## Deploy auf Vercel
- Neues Projekt importieren → Env Vars setzen → Deploy.
