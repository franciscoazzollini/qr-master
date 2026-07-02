create table if not exists page_views (
  id bigserial primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  path text not null,
  created_at timestamptz default now()
);

create index if not exists page_views_restaurant_created_idx
  on page_views(restaurant_id, created_at desc);
