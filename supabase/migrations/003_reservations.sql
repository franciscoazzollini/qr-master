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
