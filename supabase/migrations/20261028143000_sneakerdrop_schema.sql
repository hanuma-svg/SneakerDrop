create extension if not exists pgcrypto;

do $$ begin
  create type public.product_availability as enum ('in_stock', 'low_stock', 'coming_soon', 'sold_out');
exception when duplicate_object then null;
end $$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null check (char_length(trim(description)) between 20 and 1000),
  price numeric(10, 2) not null check (price >= 0),
  image_url text not null check (image_url ~* '^https?://'),
  availability public.product_availability not null default 'coming_soon',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_availability_idx on public.products (availability);
create index if not exists products_created_at_idx on public.products (created_at desc);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  email text not null check (email = lower(trim(email)) and email ~* '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'),
  created_at timestamptz not null default now(),
  unique (product_id, email)
);

create index if not exists waitlist_product_id_idx on public.waitlist (product_id);
create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

create or replace function public.submit_waitlist(p_product_id uuid, p_email text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_email text := lower(trim(p_email));
  inserted_id uuid;
begin
  if not exists (select 1 from public.products where id = p_product_id) then
    raise exception 'Product not found.' using errcode = 'P0002';
  end if;
  if normalized_email !~* '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' then
    raise exception 'Enter a valid email address.' using errcode = '22023';
  end if;
  insert into public.waitlist (product_id, email)
  values (p_product_id, normalized_email)
  returning id into inserted_id;
  return inserted_id;
end;
$$;

alter table public.products enable row level security;
alter table public.admin_users enable row level security;
alter table public.waitlist enable row level security;

drop policy if exists "Public can read product catalogue" on public.products;
create policy "Public can read product catalogue" on public.products
for select to anon, authenticated using (true);

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products" on public.products
for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products" on public.products
for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products" on public.products
for delete to authenticated using (public.is_admin());

drop policy if exists "Users can read their own admin role" on public.admin_users;
create policy "Users can read their own admin role" on public.admin_users
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Admins can read waitlist" on public.waitlist;
create policy "Admins can read waitlist" on public.waitlist
for select to authenticated using (public.is_admin());

revoke all on table public.admin_users from anon, authenticated;
grant select on table public.admin_users to authenticated;
revoke all on table public.waitlist from anon, authenticated;
grant select on table public.waitlist to authenticated;
grant select on table public.products to anon, authenticated;
grant insert, update, delete on table public.products to authenticated;
revoke all on function public.submit_waitlist(uuid, text) from public;
grant execute on function public.submit_waitlist(uuid, text) to anon, authenticated;
