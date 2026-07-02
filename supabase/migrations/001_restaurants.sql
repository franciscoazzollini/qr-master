create table if not exists restaurants (
  id text primary key,
  name text not null,
  logo_url text,
  primary_color text default '#2563eb',
  locale text not null default 'en',
  links jsonb not null default '{}',
  edit_token text not null,
  tier text not null default 'free',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists restaurants_id_idx on restaurants(id);
