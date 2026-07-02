alter table restaurants
  add column if not exists settings jsonb not null default '{}';
