-- Cuentas operativas de GRCP, perfil personal y métricas institucionales.
begin;

create table public.portal_operators (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (
    email = lower(btrim(email)) and
    email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' and
    length(email) <= 254 and email <> 'gruporcpsa@gmail.com'
  ),
  full_name text not null default '' check (length(btrim(full_name)) <= 200),
  role text not null default 'operator' check (role = 'operator'),
  active boolean not null default true,
  last_invited_at timestamptz,
  invite_failed_at timestamptz,
  invite_count integer not null default 0 check (invite_count between 0 and 100000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

create function private.portal_operator() returns boolean
language sql stable security definer set search_path='' as $$
  select exists (
    select 1 from auth.users u
    join public.portal_operators o on o.email=lower(u.email)
    where u.id=(select auth.uid()) and u.email_confirmed_at is not null and o.active
  );
$$;
create function private.portal_staff() returns boolean
language sql stable security definer set search_path='' as $$
  select private.portal_admin() or private.portal_operator();
$$;
revoke all on function private.portal_operator(),private.portal_staff() from public,anon;
grant execute on function private.portal_operator(),private.portal_staff() to authenticated;

alter table public.portal_operators enable row level security;
revoke all on public.portal_operators from anon,authenticated;
grant select,insert(email,full_name,active),update(email,full_name,active) on public.portal_operators to authenticated;
create policy portal_operators_owner_read on public.portal_operators for select to authenticated
  using ((select private.portal_admin()));
create policy portal_operators_owner_insert on public.portal_operators for insert to authenticated
  with check ((select private.portal_admin()));
create policy portal_operators_owner_update on public.portal_operators for update to authenticated
  using ((select private.portal_admin())) with check ((select private.portal_admin()));

create function private.portal_operator_stamp() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
  new.updated_at=clock_timestamp();
  new.updated_by=auth.uid();
  if tg_op='INSERT' then
    new.created_at=new.updated_at;
    new.created_by=auth.uid();
  elsif new.email<>old.email then
    new.last_invited_at=null;
    new.invite_failed_at=null;
    new.invite_count=0;
  end if;
  return new;
end;
$$;
create trigger portal_operator_stamp before insert or update on public.portal_operators
  for each row execute function private.portal_operator_stamp();
revoke all on function private.portal_operator_stamp() from public,anon,authenticated;

create table public.portal_operator_audit (
  id bigint generated always as identity primary key,
  operator_id uuid not null references public.portal_operators(id),
  action text not null check (action in ('INSERT','UPDATE')),
  actor_id uuid references auth.users(id) on delete set null,
  happened_at timestamptz not null default now(),
  before_data jsonb,
  after_data jsonb not null
);
alter table public.portal_operator_audit enable row level security;
revoke all on public.portal_operator_audit from anon,authenticated;
grant select on public.portal_operator_audit to authenticated;
create policy portal_operator_audit_owner_read on public.portal_operator_audit for select to authenticated
  using ((select private.portal_admin()));
create function private.portal_operator_log() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  insert into public.portal_operator_audit(operator_id,action,actor_id,before_data,after_data)
  values(new.id,tg_op,auth.uid(),case when tg_op='UPDATE' then to_jsonb(old) end,to_jsonb(new));
  return new;
end;
$$;
create trigger portal_operator_log after insert or update on public.portal_operators
  for each row execute function private.portal_operator_log();
revoke all on function private.portal_operator_log() from public,anon,authenticated;

create table public.portal_user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (length(btrim(display_name)) <= 200),
  phone text not null default '' check (length(btrim(phone)) <= 60),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.portal_user_profiles enable row level security;
revoke all on public.portal_user_profiles from anon,authenticated;
grant select,insert(user_id,display_name,phone),update(display_name,phone) on public.portal_user_profiles to authenticated;
create policy portal_profile_self_read on public.portal_user_profiles for select to authenticated
  using ((select auth.uid())=user_id);
create policy portal_profile_self_insert on public.portal_user_profiles for insert to authenticated
  with check ((select auth.uid())=user_id);
create policy portal_profile_self_update on public.portal_user_profiles for update to authenticated
  using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create function private.portal_profile_stamp() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
  new.updated_at=clock_timestamp();
  if tg_op='INSERT' then new.created_at=new.updated_at; end if;
  return new;
end;
$$;
create trigger portal_profile_stamp before insert or update on public.portal_user_profiles
  for each row execute function private.portal_profile_stamp();
revoke all on function private.portal_profile_stamp() from public,anon,authenticated;

create or replace function private.portal_access(tenant uuid, write_access boolean default false) returns boolean
language sql stable security definer set search_path='' as $$
  select (select private.portal_staff()) or exists (
    select 1 from public.portal_memberships m join public.portal_institutions i on i.id=m.institution_id
    where m.institution_id=tenant and m.email=(select private.portal_email()) and m.active
      and i.status='active' and i.archived_at is null and (not write_access or m.role='manager')
  );
$$;
drop policy portal_read on public.portal_memberships;
create policy portal_read on public.portal_memberships for select to authenticated
  using ((select private.portal_staff()) or
    (email=(select private.portal_email()) and private.portal_access(institution_id)));

-- El operador gestiona registros institucionales. Las membresías, Tesorería y DEA quedan bajo la cuenta principal.
do $$
declare tab text;
begin
  foreach tab in array array[
    'portal_institutions','portal_sites','portal_assets','portal_activities',
    'portal_inspections','portal_participants','portal_documents','portal_requests'
  ] loop
    execute format('create policy portal_operator_insert on public.%I for insert to authenticated with check ((select private.portal_operator()))',tab);
    if tab<>'portal_inspections' then
      execute format('create policy portal_operator_update on public.%I for update to authenticated using ((select private.portal_operator())) with check ((select private.portal_operator()))',tab);
    end if;
  end loop;
end;
$$;
create policy portal_operator_audit_read on public.portal_audit for select to authenticated
  using ((select private.portal_operator()));
create policy portal_operator_files_insert on storage.objects for insert to authenticated
  with check(bucket_id='grcp-instituciones' and (select private.portal_operator()));
create policy portal_operator_files_cleanup on storage.objects for delete to authenticated
  using(bucket_id='grcp-instituciones' and (select private.portal_operator()) and
    not exists(select 1 from public.portal_documents d where d.file_path=name));

-- El control de certificados también se aplica al equipo operativo.
create or replace function private.portal_certificate_check() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
  if not private.portal_staff() then raise exception 'Acceso denegado' using errcode='42501'; end if;
  if new.kind='certificate' and new.archived_at is null and not exists(select 1 from public.portal_participants p join public.portal_activities a on a.id=p.activity_id
    where p.id=new.participant_id and p.institution_id=new.institution_id and p.activity_id=new.activity_id
      and p.attendance='attended' and a.kind='training' and a.status='completed') then
    raise exception 'El certificado requiere una capacitación realizada y asistencia registrada' using errcode='23514';
  end if;
  return new;
end;
$$;

create or replace function public.get_portal_context() returns jsonb
language sql stable security invoker set search_path='' as $$
  select jsonb_build_object(
    'is_admin',private.portal_admin(),
    'is_operator',private.portal_operator(),
    'email',private.portal_email()
  );
$$;

-- Una apertura de módulo por usuario y día; evita inflar el indicador al recargar.
create table public.portal_usage_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  institution_id uuid not null references public.portal_institutions(id),
  module_key text not null check (module_key in (
    'resumen','calendario','sedes','equipamiento','revisiones',
    'capacitaciones','documentos','solicitudes'
  )),
  usage_date date not null,
  last_visited_at timestamptz not null default now(),
  primary key (user_id,institution_id,module_key,usage_date)
);
create index portal_usage_daily_institution_date_idx on public.portal_usage_daily(institution_id,usage_date desc);
alter table public.portal_usage_daily enable row level security;
revoke all on public.portal_usage_daily from anon,authenticated;
create function public.portal_record_module_visit(tenant_id uuid, visited_module text) returns void
language plpgsql security definer set search_path='' as $$
begin
  if auth.uid() is null or private.portal_staff() or not private.portal_access(tenant_id)
     or visited_module not in ('resumen','calendario','sedes','equipamiento','revisiones','capacitaciones','documentos','solicitudes') then
    raise exception 'Acceso denegado' using errcode='42501';
  end if;
  insert into public.portal_usage_daily(user_id,institution_id,module_key,usage_date,last_visited_at)
    values(auth.uid(),tenant_id,visited_module,(now() at time zone 'America/Argentina/Buenos_Aires')::date,now())
    on conflict (user_id,institution_id,module_key,usage_date) do update
      set last_visited_at=excluded.last_visited_at;
end;
$$;
revoke all on function public.portal_record_module_visit(uuid,text) from public,anon;
grant execute on function public.portal_record_module_visit(uuid,text) to authenticated;

create function private.portal_usage_rows()
returns table (
  institution_id uuid,
  active_members bigint,
  last_sign_in_at timestamptz,
  active_users_30d bigint,
  module_uses_30d bigint,
  last_portal_visit_at timestamptz,
  assets bigint,
  inspections bigint,
  activities bigint,
  documents bigint,
  stored_bytes bigint,
  open_requests bigint
)
language plpgsql stable security definer set search_path='' as $$
begin
  if not private.portal_staff() then
    raise exception 'Acceso denegado' using errcode='42501';
  end if;
  return query
    select i.id,
      (select count(*) from public.portal_memberships m where m.institution_id=i.id and m.active),
      (select max(u.last_sign_in_at) from public.portal_memberships m
        join auth.users u on lower(u.email)=m.email
        where m.institution_id=i.id and m.active and u.email_confirmed_at is not null),
      (select count(distinct d.user_id) from public.portal_usage_daily d where d.institution_id=i.id and d.usage_date>=(now() at time zone 'America/Argentina/Buenos_Aires')::date-29),
      (select count(*) from public.portal_usage_daily d where d.institution_id=i.id and d.usage_date>=(now() at time zone 'America/Argentina/Buenos_Aires')::date-29),
      (select max(d.last_visited_at) from public.portal_usage_daily d where d.institution_id=i.id),
      (select count(*) from public.portal_assets a where a.institution_id=i.id and a.archived_at is null),
      (select count(*) from public.portal_inspections x where x.institution_id=i.id),
      (select count(*) from public.portal_activities a where a.institution_id=i.id and a.archived_at is null),
      (select count(*) from public.portal_documents d where d.institution_id=i.id and d.archived_at is null),
      (select coalesce(sum(d.file_size),0)::bigint from public.portal_documents d where d.institution_id=i.id),
      (select count(*) from public.portal_requests r where r.institution_id=i.id and r.status<>'resolved')
    from public.portal_institutions i;
end;
$$;
revoke all on function private.portal_usage_rows() from public,anon;
grant execute on function private.portal_usage_rows() to authenticated;
create function public.portal_usage_by_institution()
returns table (
  institution_id uuid,
  active_members bigint,
  last_sign_in_at timestamptz,
  active_users_30d bigint,
  module_uses_30d bigint,
  last_portal_visit_at timestamptz,
  assets bigint,
  inspections bigint,
  activities bigint,
  documents bigint,
  stored_bytes bigint,
  open_requests bigint
)
language sql stable security invoker set search_path='' as $$
  select * from private.portal_usage_rows();
$$;
revoke all on function public.portal_usage_by_institution() from public,anon;
grant execute on function public.portal_usage_by_institution() to authenticated;

create function private.portal_operator_activity_rows()
returns table (operator_id uuid, confirmed_at timestamptz, last_sign_in_at timestamptz)
language plpgsql stable security definer set search_path='' as $$
begin
  if not private.portal_admin() then
    raise exception 'Acceso denegado' using errcode='42501';
  end if;
  return query select o.id,u.email_confirmed_at,u.last_sign_in_at
    from public.portal_operators o left join auth.users u on lower(u.email)=o.email;
end;
$$;
revoke all on function private.portal_operator_activity_rows() from public,anon;
grant execute on function private.portal_operator_activity_rows() to authenticated;
create function public.portal_operator_activity()
returns table (operator_id uuid, confirmed_at timestamptz, last_sign_in_at timestamptz)
language sql stable security invoker set search_path='' as $$
  select * from private.portal_operator_activity_rows();
$$;
revoke all on function public.portal_operator_activity() from public,anon;
grant execute on function public.portal_operator_activity() to authenticated;

commit;
