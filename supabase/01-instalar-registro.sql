-- GRCP project: tfueuppotcanagvgxpca. Execute ONCE in Supabase SQL Editor.
-- Does not create passwords or Auth users.
begin;
-- GRCP DEA registry. Apply only to the GRCP Supabase project selected by its owner.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

-- Only this confirmed Supabase Auth account may manage the registry.
create function private.dea_role() returns text language sql stable security definer set search_path = '' as $$
  select 'admin'::text from auth.users u
  where (select auth.uid()) is not null and u.id = (select auth.uid())
    and lower(u.email) = 'gruporcpsa@gmail.com' and u.email_confirmed_at is not null;
$$;
revoke all on function private.dea_role() from public, anon;
grant execute on function private.dea_role() to authenticated;
create function public.get_dea_role() returns text language sql stable security invoker set search_path = '' as $$ select private.dea_role(); $$;
revoke all on function public.get_dea_role() from public, anon;
grant execute on function public.get_dea_role() to authenticated;

create table public.dea_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 1 and 200),
  address text not null default '' check (length(address) <= 300),
  city text not null default '' check (length(city) <= 100),
  province text not null default '' check (length(province) <= 100),
  latitude double precision not null check (latitude between -56 and -21),
  longitude double precision not null check (longitude between -74 and -53),
  access text not null default 'unknown' check (access in ('unknown','public','restricted')),
  availability text not null default 'unknown' check (availability in ('unknown','available','unavailable')),
  hours text not null default '' check (length(hours) <= 300),
  notes text not null default '' check (length(notes) <= 3000),
  verification text not null default 'unverified' check (verification in ('unverified','verified')),
  verified_at date,
  published boolean not null default false,
  source text not null default '' check (length(source) <= 200),
  source_key text unique,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  constraint verified_date_required check (verification <> 'verified' or verified_at is not null),
  constraint verification_not_future check (verified_at is null or verified_at <= current_date)
);
create index dea_public_idx on public.dea_locations (province, city) where published and archived_at is null;
create index dea_updated_idx on public.dea_locations (updated_at desc);
alter table public.dea_locations enable row level security;
revoke all on public.dea_locations from anon, authenticated;
grant select (id,name,address,city,province,latitude,longitude,access,availability,hours,notes,verification,verified_at,published,source,source_key,archived_at,created_at,updated_at) on public.dea_locations to anon;
grant select on public.dea_locations to authenticated;
grant insert (name,address,city,province,latitude,longitude,access,availability,hours,notes,verification,verified_at,published,source,source_key),
update (name,address,city,province,latitude,longitude,access,availability,hours,notes,verification,verified_at,published,source,source_key,archived_at) on public.dea_locations to authenticated;
create policy dea_public_read on public.dea_locations for select to anon, authenticated using (published and archived_at is null);
create policy dea_team_read on public.dea_locations for select to authenticated using ((select private.dea_role()) = 'admin');
create policy dea_team_insert on public.dea_locations for insert to authenticated with check ((select private.dea_role()) = 'admin');
create policy dea_team_update on public.dea_locations for update to authenticated using ((select private.dea_role()) = 'admin') with check ((select private.dea_role()) = 'admin');
-- Logical deletion via archived_at keeps changes reversible. No client hard DELETE grant.

create table public.dea_audit_log (
  id bigint generated always as identity primary key,
  dea_id uuid not null,
  action text not null check (action in ('INSERT','UPDATE','DELETE')),
  actor_id uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now(),
  before_data jsonb,
  after_data jsonb
);
create index dea_audit_dea_idx on public.dea_audit_log(dea_id, changed_at desc);
create index dea_audit_actor_idx on public.dea_audit_log(actor_id);
alter table public.dea_audit_log enable row level security;
revoke all on public.dea_audit_log from anon, authenticated;
grant select on public.dea_audit_log to authenticated;
create policy audit_team_read on public.dea_audit_log for select to authenticated using ((select private.dea_role()) = 'admin');

create function private.dea_stamp() returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = clock_timestamp(); new.updated_by = auth.uid();
  if tg_op = 'INSERT' then new.created_at = new.updated_at; new.created_by = auth.uid(); end if;
  return new;
end;
$$;
revoke all on function private.dea_stamp() from public, anon, authenticated;
create trigger dea_stamp before insert or update on public.dea_locations for each row execute function private.dea_stamp();

create function private.dea_audit() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is not null and private.dea_role() is distinct from 'admin' then raise exception 'Acceso no autorizado' using errcode='42501'; end if;
  insert into public.dea_audit_log(dea_id, action, actor_id, before_data, after_data)
  values(coalesce(new.id, old.id), tg_op, auth.uid(), case when tg_op <> 'INSERT' then to_jsonb(old) end, case when tg_op <> 'DELETE' then to_jsonb(new) end);
  return coalesce(new, old);
end;
$$;
revoke all on function private.dea_audit() from public, anon, authenticated;
create trigger dea_audit after insert or update or delete on public.dea_locations for each row execute function private.dea_audit();

commit;
