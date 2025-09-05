-- Enable extensions (for uuid)
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  salutation text,
  first_name text not null,
  last_name text not null,
  gym text not null,
  phone text,
  email text unique not null,
  password_hash text not null,
  is_admin boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists points (
  id bigserial primary key,
  user_id uuid not null references users(id) on delete cascade,
  amount int not null,
  reason text,
  created_at timestamptz default now()
);

create or replace view v_user_points as
select user_id, coalesce(sum(amount),0)::int as total
from points group by user_id;

-- helper function for leaderboard in a period
create or replace function leaderboard_from(from_ts timestamptz)
returns table (
  user_id uuid,
  first_name text,
  last_name text,
  total int
) language sql stable as $$
  select u.id, u.first_name, u.last_name, coalesce(sum(p.amount),0)::int as total
  from users u
  left join points p on p.user_id = u.id and p.created_at >= from_ts
  group by u.id, u.first_name, u.last_name
  order by total desc, u.last_name asc
  limit 20;
$$;
