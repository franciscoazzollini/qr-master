-- Run in Supabase SQL Editor if you prefer the dashboard over `npm run db:migrate`.
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT where possible.

-- 002_restaurant_settings.sql
alter table restaurants
  add column if not exists settings jsonb not null default '{}';

-- 003_reservations.sql
create table if not exists reservations (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  guest_name text not null,
  guest_phone text not null,
  reservation_date date not null,
  reservation_time time not null,
  party_size int not null check (party_size > 0 and party_size <= 50),
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz default now()
);

create index if not exists reservations_restaurant_id_idx on reservations(restaurant_id);
create index if not exists reservations_date_idx on reservations(restaurant_id, reservation_date);

-- 004_page_views.sql
create table if not exists page_views (
  id bigserial primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  path text not null,
  created_at timestamptz default now()
);

create index if not exists page_views_restaurant_created_idx
  on page_views(restaurant_id, created_at desc);

-- 005_owner_auth.sql
alter table restaurants
  add column if not exists owner_id uuid references auth.users (id) on delete set null,
  add column if not exists slug text;

create unique index if not exists restaurants_slug_unique_idx
  on restaurants (slug)
  where slug is not null;

create index if not exists restaurants_owner_id_idx
  on restaurants (owner_id);

alter table restaurants enable row level security;

drop policy if exists restaurants_public_select on restaurants;
create policy restaurants_public_select
  on restaurants for select using (true);

drop policy if exists restaurants_owner_insert on restaurants;
create policy restaurants_owner_insert
  on restaurants for insert to authenticated
  with check (owner_id = auth.uid());

drop policy if exists restaurants_owner_update on restaurants;
create policy restaurants_owner_update
  on restaurants for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- 007_vertical_bab.sql
alter table restaurants
  add column if not exists vertical text not null default 'restaurant';

create index if not exists restaurants_vertical_idx on restaurants (vertical);
