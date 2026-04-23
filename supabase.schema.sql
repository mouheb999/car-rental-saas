-- ============================================================
-- ALIA GO — Supabase schema
-- Run this in the Supabase SQL Editor once.
-- ============================================================

-- Enable UUID generator
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------
-- CARS
-- ----------------------------------------------------------------
create table if not exists public.cars (
  id           uuid primary key default gen_random_uuid(),
  name         text        not null,
  brand        text,
  image        text,
  price        int         not null default 100,
  available    boolean     not null default true,
  fuel         text,
  transmission text,
  seats        int,
  horsepower   int,
  year         int,
  category     text,
  description  text,
  gallery      text[]      default '{}',
  created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- RESERVATIONS
-- ----------------------------------------------------------------
create table if not exists public.reservations (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  phone           text not null,
  car_id          uuid references public.cars(id) on delete set null,
  start_date      date not null,
  end_date        date not null,
  pickup_location text,
  status          text not null default 'pending'
                  check (status in ('pending','confirmed','cancelled')),
  created_at      timestamptz not null default now(),

  constraint reservation_dates_chk check (end_date >= start_date)
);

create index if not exists reservations_car_id_idx   on public.reservations(car_id);
create index if not exists reservations_status_idx   on public.reservations(status);
create index if not exists reservations_dates_idx    on public.reservations(start_date, end_date);

-- ----------------------------------------------------------------
-- REALTIME — make sure the tables broadcast changes
-- Wrapped in DO blocks so re-running the script doesn't fail with
-- "relation is already member of publication".
-- ----------------------------------------------------------------
do $$
begin
  alter publication supabase_realtime add table public.reservations;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.cars;
exception
  when duplicate_object then null;
end $$;

-- ----------------------------------------------------------------
-- RLS — SECURE POLICIES
-- anon (public, browser) can:
--   • SELECT available cars only
--   • INSERT new reservations (pending status only)
-- anon CANNOT:
--   • write to cars (no competitor sabotage)
--   • read reservations (no customer PII leak)
--   • update reservations (no confirm/cancel hijacking)
-- Admin writes must go through server-side API routes using service_role.
-- ----------------------------------------------------------------
alter table public.cars         enable row level security;
alter table public.reservations enable row level security;

-- Drop every previously-existing permissive policy
drop policy if exists "cars read"            on public.cars;
drop policy if exists "cars write"           on public.cars;
drop policy if exists "cars public read"     on public.cars;
drop policy if exists "reservations read"    on public.reservations;
drop policy if exists "reservations insert"  on public.reservations;
drop policy if exists "reservations update"  on public.reservations;
drop policy if exists "reservations public insert" on public.reservations;

-- CARS: public can read only available cars. No insert/update/delete for anon.
create policy "cars public read"
  on public.cars
  for select
  to anon, authenticated
  using (available = true);

-- RESERVATIONS: public can only INSERT a pending booking. No read/update/delete.
create policy "reservations public insert"
  on public.reservations
  for insert
  to anon, authenticated
  with check (status = 'pending');

-- ----------------------------------------------------------------
-- AVAILABILITY CHECK — safe public helper
-- Booking flow needs to know if a car is free on given dates WITHOUT
-- exposing the list of reservations (which contain client phone numbers).
-- SECURITY DEFINER runs with the function owner's rights, bypassing RLS,
-- but only returns a single boolean — no customer data leaks out.
-- ----------------------------------------------------------------
create or replace function public.is_car_available(
  p_car_id uuid,
  p_start  date,
  p_end    date
) returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select not exists (
    select 1
    from public.reservations
    where car_id = p_car_id
      and status in ('pending', 'confirmed')
      and start_date <= p_end
      and end_date   >= p_start
  );
$$;

-- Lock the function down to just anon + authenticated (revoke from PUBLIC first
-- because CREATE FUNCTION grants EXECUTE to PUBLIC by default).
revoke all on function public.is_car_available(uuid, date, date) from public;
grant execute on function public.is_car_available(uuid, date, date) to anon, authenticated;

-- ----------------------------------------------------------------
-- SEED — starter cars (matches your existing demo data).
-- Comment out if you'd rather add cars via the admin UI.
-- ----------------------------------------------------------------
insert into public.cars (name, brand, image, price, fuel, transmission, seats, horsepower, year, category, description, gallery)
values
  ('Seat Ibiza','Seat','https://catalogue.automobile.tn/big/2025/02/47324.webp?t=1',140,'Essence','Manuelle',5,110,2024,'Citadine',
   'Design affirmé et conduite agile. La Seat Ibiza est la compagne idéale pour la ville comme pour l''autoroute.',
   array['https://catalogue.automobile.tn/big/2025/02/47324.webp?t=1']),
  ('Renault Clio 5','Renault','https://catalogue.automobile.tn/big/2026/01/47555.webp?t=1',130,'Diesel','Manuelle',5,100,2024,'Citadine',
   'Raffinée, économique et confortable. La Clio 5 allie le style français à une consommation maîtrisée.',
   array['https://catalogue.automobile.tn/big/2026/01/47555.webp?t=1']),
  ('Suzuki Swift','Suzuki','https://catalogue.automobile.tn/big/2025/02/47300.webp?t=1',120,'Essence','Manuelle',5,83,2024,'Citadine',
   'Maniable et économique. La Swift concentre du caractère dans un format idéal pour la ville.',
   array['https://catalogue.automobile.tn/big/2025/02/47300.webp?t=1']),
  ('Skoda Fabia','Skoda','https://catalogue.automobile.tn/big/2024/02/47102.webp?t=1',135,'Essence','Automatique',5,95,2024,'Compacte',
   'Spacieuse, bien finie et surprenante. La Fabia offre un habitacle généreux et un comportement très sûr.',
   array['https://catalogue.automobile.tn/big/2024/02/47102.webp?t=1']),
  ('Hyundai i20','Hyundai','https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/i20/11092/1755774177956/front-left-side-47.jpg',125,'Essence','Manuelle',5,100,2024,'Citadine',
   'Technologique et facile à vivre. La i20 offre confort, sécurité et un look moderne dans un format compact.',
   array['https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/i20/11092/1755774177956/front-left-side-47.jpg']),
  ('Volkswagen Polo','Volkswagen','https://catalogue.automobile.tn/big/2023/03/46892.webp?t=1',150,'Essence','Automatique',5,110,2024,'Compacte',
   'Le savoir-faire allemand en format compact. La Polo propose une conduite sereine et une finition soignée.',
   array['https://catalogue.automobile.tn/big/2023/03/46892.webp?t=1'])
on conflict do nothing;
