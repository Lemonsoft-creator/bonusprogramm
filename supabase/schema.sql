-- Minimal schema to back the app (optional)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text unique not null,
  total_points int not null default 0
);

create table if not exists points_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  date date not null default now(),
  points int not null,
  rule text not null,
  note text
);

create table if not exists vouchers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  label text not null,
  status text not null,
  code text unique not null,
  issued_at date not null default now(),
  expires_at date
);

create table if not exists challenges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  points int not null,
  from_date date,
  to_date date
);

-- Suggested policies (adjust to your needs)
alter table users enable row level security;
alter table points_ledger enable row level security;
alter table vouchers enable row level security;
alter table challenges enable row level security;

-- Simple read-only for authenticated
create policy "read: all tables" on users for select using (auth.role() = 'authenticated');
create policy "read: ledger" on points_ledger for select using (auth.role() = 'authenticated');
create policy "read: vouchers" on vouchers for select using (auth.role() = 'authenticated');
create policy "read: challenges" on challenges for select using (auth.role() = 'authenticated');
