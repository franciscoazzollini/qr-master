alter table restaurants
  add column if not exists vertical text not null default 'restaurant';

create index if not exists restaurants_vertical_idx on restaurants (vertical);
