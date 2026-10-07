-- Portal institucional GRCP. Proyecto: tfueuppotcanagvgxpca.
-- Instalación adicional: no modifica el registro público de DEA ni crea usuarios Auth.
begin;
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create function private.portal_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from auth.users where id = (select auth.uid())
    and lower(email) = 'gruporcpsa@gmail.com' and email_confirmed_at is not null);
$$;
create function private.portal_email() returns text language sql stable security definer set search_path = '' as $$
  select lower(email) from auth.users where id = (select auth.uid()) and email_confirmed_at is not null;
$$;

create table public.portal_institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 1 and 200),
  kind text not null default 'institution' check (kind in ('company','school','institution','other')),
  contact_name text not null default '' check (length(contact_name) <= 200),
  contact_email text not null default '' check (length(contact_email) <= 254),
  contact_phone text not null default '' check (length(contact_phone) <= 60),
  address text not null default '' check (length(address) <= 300),
  city text not null default '' check (length(city) <= 100),
  province text not null default '' check (length(province) <= 100),
  status text not null default 'active' check (status in ('active','paused')),
  notes text not null default '' check (length(notes) <= 5000),
  archived_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);
create table public.portal_memberships (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.portal_institutions(id),
  email text not null check (email = lower(btrim(email)) and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' and length(email) <= 254),
  role text not null default 'manager' check (role in ('manager','viewer')),
  active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  unique (institution_id,email)
);
create index portal_membership_email_idx on public.portal_memberships(email,institution_id) where active;

-- Email confirmado consultado en Auth, nunca metadata editable ni un filtro de interfaz.
create function private.portal_access(tenant uuid, write_access boolean default false) returns boolean
language sql stable security definer set search_path = '' as $$
  select (select private.portal_admin()) or exists (
    select 1 from public.portal_memberships m join public.portal_institutions i on i.id=m.institution_id
    where m.institution_id=tenant and m.email=(select private.portal_email()) and m.active
      and i.status='active' and i.archived_at is null and (not write_access or m.role='manager')
  );
$$;

create table public.portal_sites (
  id uuid primary key default gen_random_uuid(), institution_id uuid not null references public.portal_institutions(id),
  name text not null check (length(btrim(name)) between 1 and 200),
  address text not null default '' check (length(address)<=300), city text not null default '' check (length(city)<=100),
  notes text not null default '' check (length(notes)<=5000), archived_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null, unique(id,institution_id)
);
create table public.portal_assets (
  id uuid primary key default gen_random_uuid(), institution_id uuid not null references public.portal_institutions(id), site_id uuid,
  name text not null check (length(btrim(name)) between 1 and 200),
  kind text not null check (kind in ('dea','kit','exit','extinguisher','other')),
  location text not null default '' check (length(location)<=300),
  manufacturer text not null default '' check (length(manufacturer)<=100), model text not null default '' check (length(model)<=100),
  serial_number text not null default '' check (length(serial_number)<=100),
  status text not null default 'unknown' check (status in ('unknown','operational','attention','out_of_service')),
  next_review_on date, battery_expires_on date, pads_expires_on date, expires_on date,
  notes text not null default '' check (length(notes)<=5000), archived_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null, unique(id,institution_id),
  foreign key (site_id,institution_id) references public.portal_sites(id,institution_id)
);
create table public.portal_activities (
  id uuid primary key default gen_random_uuid(), institution_id uuid not null references public.portal_institutions(id), site_id uuid, asset_id uuid,
  title text not null check (length(btrim(title)) between 1 and 200),
  kind text not null check (kind in ('training','inspection','drill')),
  starts_at timestamptz not null, ends_at timestamptz check (ends_at is null or ends_at>starts_at),
  status text not null default 'planned' check (status in ('planned','confirmed','completed','cancelled')),
  responsible text not null default '' check (length(responsible)<=200), location text not null default '' check (length(location)<=300),
  notes text not null default '' check (length(notes)<=5000), report text not null default '' check (length(report)<=10000),
  repeat_months integer not null default 0 check (repeat_months between 0 and 60),
  recurrence_source_id uuid unique, completed_at timestamptz, archived_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null, unique(id,institution_id),
  foreign key(site_id,institution_id) references public.portal_sites(id,institution_id),
  foreign key(asset_id,institution_id) references public.portal_assets(id,institution_id),
  foreign key(recurrence_source_id,institution_id) references public.portal_activities(id,institution_id),
  check (status<>'completed' or kind='training' or length(btrim(report))>0)
);
create table public.portal_inspections (
  id uuid primary key default gen_random_uuid(), institution_id uuid not null references public.portal_institutions(id), asset_id uuid not null,
  checked_on date not null check (checked_on<=current_date), next_review_on date check (next_review_on is null or next_review_on>checked_on),
  result text not null check (result in ('pass','attention','fail')),
  checked_by text not null check (length(btrim(checked_by)) between 1 and 200),
  checklist jsonb not null default '[]' check (jsonb_typeof(checklist)='array' and jsonb_array_length(checklist)<=100),
  notes text not null default '' check (length(notes)<=10000),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null, unique(id,institution_id),
  foreign key(asset_id,institution_id) references public.portal_assets(id,institution_id)
);
create table public.portal_participants (
  id uuid primary key default gen_random_uuid(), institution_id uuid not null references public.portal_institutions(id), activity_id uuid not null,
  full_name text not null check (length(btrim(full_name)) between 1 and 200),
  email text not null default '' check (length(email)<=254),
  attendance text not null default 'pending' check (attendance in ('pending','attended','absent')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  unique(id,institution_id,activity_id), foreign key(activity_id,institution_id) references public.portal_activities(id,institution_id)
);
create table public.portal_documents (
  id uuid primary key default gen_random_uuid(), institution_id uuid not null references public.portal_institutions(id),
  activity_id uuid, participant_id uuid, inspection_id uuid,
  title text not null check (length(btrim(title)) between 1 and 200),
  kind text not null check (kind in ('certificate','protocol','report','other')),
  file_path text not null unique, file_name text not null check (length(file_name) between 1 and 255),
  mime_type text not null check (mime_type in ('application/pdf','image/jpeg','image/png')),
  file_size bigint not null check(file_size>0 and file_size<=10485760),
  issued_on date not null default current_date, expires_on date check (expires_on is null or expires_on>=issued_on),
  version integer not null default 1 check(version between 1 and 10000), archived_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  foreign key(activity_id,institution_id) references public.portal_activities(id,institution_id),
  foreign key(participant_id,institution_id,activity_id) references public.portal_participants(id,institution_id,activity_id),
  foreign key(inspection_id,institution_id) references public.portal_inspections(id,institution_id),
  check (file_path like institution_id::text || '/%'),
  check (participant_id is null or activity_id is not null),
  check (kind<>'certificate' or (participant_id is not null and activity_id is not null))
);
create table public.portal_requests (
  id uuid primary key default gen_random_uuid(), institution_id uuid not null references public.portal_institutions(id), asset_id uuid,
  title text not null check (length(btrim(title)) between 1 and 200),
  kind text not null check(kind in ('training','inspection','drill','question','problem')),
  body text not null check(length(btrim(body)) between 1 and 5000),
  status text not null default 'open' check(status in ('open','in_progress','resolved')),
  response text not null default '' check(length(response)<=5000),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  foreign key(asset_id,institution_id) references public.portal_assets(id,institution_id),
  check (status<>'resolved' or length(btrim(response))>0)
);
create table public.portal_audit (
  id bigint generated always as identity primary key,
  institution_id uuid not null references public.portal_institutions(id), entity text not null, record_id uuid not null,
  action text not null check(action in ('INSERT','UPDATE')), actor_id uuid references auth.users(id) on delete set null,
  happened_at timestamptz not null default now(), before_data jsonb, after_data jsonb
);

create function private.portal_stamp() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if tg_op='UPDATE' and (to_jsonb(new)->>'institution_id') is distinct from (to_jsonb(old)->>'institution_id') then
    raise exception 'La institución del registro no puede cambiar' using errcode='23514';
  end if;
  new.updated_at=clock_timestamp();
  if tg_op='INSERT' then new.created_at=new.updated_at; new.created_by=auth.uid(); end if;
  if tg_table_name='portal_activities' then
    if new.status='completed' then new.completed_at=coalesce(new.completed_at,clock_timestamp());
    else new.completed_at=null; end if;
  end if;
  return new;
end;
$$;
create function private.portal_log() returns trigger language plpgsql security definer set search_path='' as $$
declare tenant uuid;
begin
  tenant=coalesce(to_jsonb(new)->>'institution_id',to_jsonb(new)->>'id')::uuid;
  if auth.uid() is not null and not private.portal_access(tenant, true) then
    raise exception 'Acceso denegado' using errcode='42501';
  end if;
  insert into public.portal_audit(institution_id,entity,record_id,action,actor_id,before_data,after_data)
  values(tenant,tg_table_name,new.id,tg_op,auth.uid(),case when tg_op='UPDATE' then to_jsonb(old) end,to_jsonb(new));
  return new;
end;
$$;
create function private.portal_review_result() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  -- Revisiones antiguas quedan en el historial sin reemplazar el estado más reciente.
  if not exists(select 1 from public.portal_inspections where asset_id=new.asset_id and checked_on>new.checked_on) then
    update public.portal_assets set status=case new.result when 'pass' then 'operational' when 'fail' then 'out_of_service' else 'attention' end,
      next_review_on=new.next_review_on where id=new.asset_id;
  end if;
  return new;
end;
$$;
create trigger portal_review_result after insert on public.portal_inspections for each row execute function private.portal_review_result();
create function private.portal_repeat_activity() returns trigger language plpgsql security invoker set search_path='' as $$
declare next_start timestamptz;
begin
  if new.status='completed' and new.repeat_months>0 and (tg_op='INSERT' or old.status<>'completed') then
    -- Meses civiles en Argentina; fin de mes se ajusta por PostgreSQL.
    next_start=((new.starts_at at time zone 'America/Argentina/Buenos_Aires') + make_interval(months=>new.repeat_months)) at time zone 'America/Argentina/Buenos_Aires';
    insert into public.portal_activities(institution_id,site_id,asset_id,title,kind,starts_at,ends_at,responsible,location,notes,repeat_months,recurrence_source_id)
    values(new.institution_id,new.site_id,new.asset_id,new.title,new.kind,next_start,
      case when new.ends_at is not null then next_start+(new.ends_at-new.starts_at) end,
      new.responsible,new.location,new.notes,new.repeat_months,new.id)
    on conflict(recurrence_source_id) do nothing;
  end if;
  return new;
end;
$$;
create trigger portal_repeat_activity after insert or update on public.portal_activities for each row execute function private.portal_repeat_activity();
create function private.portal_certificate_check() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if not private.portal_admin() then raise exception 'Acceso denegado' using errcode='42501'; end if;
  if new.kind='certificate' and new.archived_at is null and not exists(select 1 from public.portal_participants p join public.portal_activities a on a.id=p.activity_id
    where p.id=new.participant_id and p.institution_id=new.institution_id and p.activity_id=new.activity_id
      and p.attendance='attended' and a.kind='training' and a.status='completed') then
    raise exception 'El certificado requiere una capacitación realizada y asistencia registrada' using errcode='23514';
  end if;
  return new;
end;
$$;
create trigger portal_certificate_check before insert or update on public.portal_documents for each row execute function private.portal_certificate_check();
create function private.portal_preserve_certificates() returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if tg_table_name='portal_participants' then
    if not exists(select 1 from public.portal_activities a where a.id=new.activity_id and a.institution_id=new.institution_id and a.kind='training') then
      raise exception 'Los participantes corresponden a una capacitación' using errcode='23514';
    end if;
    if tg_op='UPDATE' then
      if (new.attendance<>'attended' or new.full_name<>old.full_name) and exists(select 1 from public.portal_documents d where d.participant_id=new.id and d.kind='certificate' and d.archived_at is null) then
        raise exception 'Archivá el certificado antes de modificar nombre o asistencia' using errcode='23514';
      end if;
    end if;
  else
    if (new.status<>'completed' or new.kind<>'training') and exists(select 1 from public.portal_documents d where d.activity_id=new.id and d.kind='certificate' and d.archived_at is null) then
      raise exception 'La capacitación tiene certificados activos; archivarlos antes de cambiar su estado' using errcode='23514';
    end if;
  end if;
  return new;
end;
$$;
create trigger portal_preserve_participants before insert or update on public.portal_participants for each row execute function private.portal_preserve_certificates();
create trigger portal_preserve_training before update on public.portal_activities for each row execute function private.portal_preserve_certificates();

-- Permisos explícitos. Sin DELETE: se archivan instituciones, sedes, equipos, actividades y documentos.
do $$
declare tab text;
begin
  foreach tab in array array['portal_institutions','portal_memberships','portal_sites','portal_assets','portal_activities','portal_inspections','portal_participants','portal_documents','portal_requests'] loop
    execute format('alter table public.%I enable row level security',tab);
    execute format('revoke all on public.%I from anon, authenticated',tab);
    execute format('grant select on public.%I to authenticated',tab);
    execute format('create index %I on public.%I(created_by)',tab||'_creator_idx',tab);
    execute format('create trigger portal_stamp before insert or update on public.%I for each row execute function private.portal_stamp()',tab);
    execute format('create trigger portal_log after insert or update on public.%I for each row execute function private.portal_log()',tab);
    if tab='portal_institutions' then
      execute format('create policy portal_read on public.%I for select to authenticated using (private.portal_access(id))',tab);
    elsif tab='portal_memberships' then
      execute format('create policy portal_read on public.%I for select to authenticated using ((select private.portal_admin()) or (email=(select private.portal_email()) and private.portal_access(institution_id)))',tab);
    else
      execute format('create policy portal_read on public.%I for select to authenticated using (private.portal_access(institution_id))',tab);
      execute format('create index %I on public.%I(institution_id)',tab||'_institution_idx',tab);
    end if;
    execute format('create policy portal_admin_insert on public.%I for insert to authenticated with check ((select private.portal_admin()))',tab);
    if tab<>'portal_inspections' then
      execute format('create policy portal_admin_update on public.%I for update to authenticated using ((select private.portal_admin())) with check ((select private.portal_admin()))',tab);
    end if;
  end loop;
end;
$$;
grant insert(name,kind,contact_name,contact_email,contact_phone,address,city,province,status,notes),
  update(name,kind,contact_name,contact_email,contact_phone,address,city,province,status,notes,archived_at) on public.portal_institutions to authenticated;
grant insert(institution_id,email,role,active),update(email,role,active) on public.portal_memberships to authenticated;
grant insert(institution_id,name,address,city,notes),update(name,address,city,notes,archived_at) on public.portal_sites to authenticated;
grant insert(institution_id,site_id,name,kind,location,manufacturer,model,serial_number,status,next_review_on,battery_expires_on,pads_expires_on,expires_on,notes),
  update(site_id,name,kind,location,manufacturer,model,serial_number,status,next_review_on,battery_expires_on,pads_expires_on,expires_on,notes,archived_at) on public.portal_assets to authenticated;
grant insert(institution_id,site_id,asset_id,title,kind,starts_at,ends_at,status,responsible,location,notes,report,repeat_months,recurrence_source_id),
  update(site_id,asset_id,title,kind,starts_at,ends_at,status,responsible,location,notes,report,repeat_months,archived_at) on public.portal_activities to authenticated;
grant insert(institution_id,asset_id,checked_on,next_review_on,result,checked_by,checklist,notes) on public.portal_inspections to authenticated;
grant insert(institution_id,activity_id,full_name,email,attendance),update(full_name,email,attendance) on public.portal_participants to authenticated;
grant insert(institution_id,activity_id,participant_id,inspection_id,title,kind,file_path,file_name,mime_type,file_size,issued_on,expires_on,version),
  update(title,issued_on,expires_on,version,archived_at) on public.portal_documents to authenticated;
grant insert(institution_id,asset_id,title,kind,body,status,response),update(status,response) on public.portal_requests to authenticated;
create policy portal_manager_request on public.portal_requests for insert to authenticated
  with check (private.portal_access(institution_id,true) and status='open' and response='');
alter table public.portal_audit enable row level security;
revoke all on public.portal_audit from anon, authenticated;
grant select on public.portal_audit to authenticated;
create policy portal_audit_admin on public.portal_audit for select to authenticated using ((select private.portal_admin()));
create index portal_audit_institution_time_idx on public.portal_audit(institution_id,happened_at desc);
create index portal_audit_actor_idx on public.portal_audit(actor_id);
create index portal_activities_date_idx on public.portal_activities(institution_id,starts_at) where archived_at is null;
create index portal_inspections_asset_idx on public.portal_inspections(asset_id,checked_on desc);
create index portal_participants_activity_idx on public.portal_participants(activity_id);
create index portal_documents_participant_idx on public.portal_documents(participant_id);
create index portal_assets_site_idx on public.portal_assets(site_id);
create index portal_requests_asset_idx on public.portal_requests(asset_id);
create index portal_activities_asset_idx on public.portal_activities(asset_id);
create index portal_activities_site_idx on public.portal_activities(site_id);
create index portal_documents_activity_idx on public.portal_documents(activity_id);
create index portal_documents_inspection_idx on public.portal_documents(inspection_id);

create function public.get_portal_context() returns jsonb language sql stable security invoker set search_path='' as $$
  select jsonb_build_object('is_admin',private.portal_admin(),'email',private.portal_email());
$$;
revoke all on function public.get_portal_context() from public,anon;
grant execute on function public.get_portal_context() to authenticated;
revoke all on function private.portal_admin(),private.portal_email(),private.portal_access(uuid,boolean) from public,anon;
grant execute on function private.portal_admin(),private.portal_email(),private.portal_access(uuid,boolean) to authenticated;
revoke all on function private.portal_stamp(),private.portal_log(),private.portal_review_result(),private.portal_repeat_activity(),private.portal_certificate_check(),private.portal_preserve_certificates() from public,anon,authenticated;

-- Documentos privados. Subidas nuevas e inmutables; sin upsert de certificados emitidos.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('grcp-instituciones','grcp-instituciones',false,10485760,array['application/pdf','image/jpeg','image/png']);
create function private.portal_file_access(path text) returns boolean language sql stable security definer set search_path='' as $$
  select auth.uid() is not null and exists(select 1 from public.portal_documents d
    where d.file_path=path and d.archived_at is null and private.portal_access(d.institution_id));
$$;
revoke all on function private.portal_file_access(text) from public,anon;
grant execute on function private.portal_file_access(text) to authenticated;
create policy portal_files_read on storage.objects for select to authenticated
  using(bucket_id='grcp-instituciones' and ((select private.portal_admin()) or private.portal_file_access(name)));
create policy portal_files_insert on storage.objects for insert to authenticated
  with check(bucket_id='grcp-instituciones' and (select private.portal_admin()));
-- Solo limpia archivos huérfanos tras una carga fallida. Un documento registrado se conserva.
create policy portal_files_cleanup on storage.objects for delete to authenticated
  using(bucket_id='grcp-instituciones' and (select private.portal_admin())
    and not exists(select 1 from public.portal_documents d where d.file_path=name));
commit;
