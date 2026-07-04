-- Owner accounts and public slugs
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
  on restaurants
  for select
  using (true);

drop policy if exists restaurants_owner_insert on restaurants;
create policy restaurants_owner_insert
  on restaurants
  for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists restaurants_owner_update on restaurants;
create policy restaurants_owner_update
  on restaurants
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());
