alter table public.waitlist drop constraint if exists waitlist_email_check;
alter table public.waitlist add constraint waitlist_email_check check (email = lower(trim(email)) and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$');

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
  if normalized_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Enter a valid email address.' using errcode = '22023';
  end if;
  insert into public.waitlist (product_id, email)
  values (p_product_id, normalized_email)
  returning id into inserted_id;
  return inserted_id;
end;
$$;
